import OpenAI from 'openai';
import { fertilizerProducts } from '../data/fertilizerProducts.js';
import { matchApplicationMethod } from '../data/applicationMethods.js';

// Initialize OpenAI (you'll need to add your API key to environment variables)
let openai = null;
try {
  openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Only for development - use backend in production
  });
} catch (error) {
  console.warn('OpenAI not initialized - API key may be missing');
}

// Safe nutrient whitelist - AI can only suggest from this list
const ALLOWED_NUTRIENTS = [
  'N', 'P', 'K', 'Ca', 'Mg', 'S', 'Fe', 'Zn', 'Mn', 'Cu', 'B', 'Mo', 'Co', 'Si', 'Se',
  'Fulvic acid', 'Humic acid', 'Amino acids', 'Kelp', 'Seaweed', 'Vitamin B12',
  'Potassium humate', 'Pyroligneous Acid', 'Triacontanol', 'Saponins'
];

const NUTRIENT_SYNONYMS = {
  'Kelp': ['Kelp', 'Seaweed'],
  'Seaweed': ['Kelp', 'Seaweed'],
};

const getNutrientGroups = (nutrients) => {
  const groups = [];
  const processed = new Set();

  nutrients.forEach(nutrient => {
    if (processed.has(nutrient)) return;

    const synonyms = NUTRIENT_SYNONYMS[nutrient];
    if (synonyms) {
      groups.push(synonyms);
      synonyms.forEach(s => processed.add(s));
    } else {
      groups.push([nutrient]);
      processed.add(nutrient);
    }
  });

  return groups;
};

// Extract nutrients from AI response
const extractNutrients = (aiResponse) => {
  const suggestedNutrients = [];
  
  ALLOWED_NUTRIENTS.forEach(nutrient => {
    if (aiResponse.toLowerCase().includes(nutrient.toLowerCase())) {
      suggestedNutrients.push(nutrient);
    }
  });
  
  return suggestedNutrients;
};

// Helper function to check if a product contains a nutrient using whole-word matching
const productContainsNutrient = (product, nutrient) => {
  // Create a regex to match the nutrient as a whole word, case-insensitive
  const searchTerm = nutrient.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // Escape special regex chars
  const regex = new RegExp(`\\b${searchTerm}\\b`, 'i');

  // 1. Check nutrients array
  if (product.nutrients && product.nutrients.some(n => regex.test(n))) {
    return true;
  }
  
  // 2. Check product name
  if (product.product_name && regex.test(product.product_name)) {
    return true;
  }
  
  // 3. Check description
  if (product.description && regex.test(product.description)) {
    return true;
  }
  
  // 4. Check benefits array
  if (product.benefits && product.benefits.some(b => regex.test(b))) {
    return true;
  }
  
  // 5. Check analysis object (as string)
  if (product.analysis) {
    const analysisText = JSON.stringify(product.analysis);
    if (regex.test(analysisText)) {
      return true;
    }
  }
  
  return false;
};

// Enhanced AI recommendation function with application method filtering
export const getAIRecommendations = async (userQuery, applicationPreference = null) => {
  try {
    // Check if OpenAI is available
    if (!openai) {
      console.log('OpenAI not available, using fallback');
      return getFallbackRecommendations(userQuery, applicationPreference);
    }

    // Step 1: AI analyzes the query and identifies nutrients
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `You are an agricultural expert helping users find NTS products based on their nutrient requirements.

IMPORTANT: You can ONLY suggest nutrients from this exact list:
- N (Nitrogen), P (Phosphorus), K (Potassium), Ca (Calcium), Mg (Magnesium), S (Sulfur)
- Fe (Iron), Zn (Zinc), Mn (Manganese), Cu (Copper), B (Boron), Mo (Molybdenum), Co (Cobalt), Si (Silicon), Se (Selenium)
- Fulvic acid, Humic acid, Amino acids, Kelp, Seaweed, Vitamin B12, Potassium humate, Pyroligneous Acid, Triacontanol, Saponins

RULES:
1. DO NOT invent new ingredients or product names
2. DO NOT recommend specific brands
3. Only suggest from the above list
4. IGNORE product form keywords like "powder", "liquid", "granular", "solid" - these are not nutrients
5. If the user asks for a SPECIFIC nutrient, ONLY suggest that nutrient (e.g., "Pyroligneous Acid" → only Pyroligneous Acid)
6. If they mention a crop (like "tomatoes"), suggest relevant nutrients for that crop
7. If they mention general terms like "soil health", suggest Fulvic acid, Humic acid, or Kelp
8. Be specific about which nutrients are most relevant to their request
9. DO NOT add extra nutrients unless the user specifically asks for combinations
10. If the user says "or" (e.g., "kelp or calcium"), suggest nutrients for both. The user wants to see products for EITHER option.
11. When multiple nutrients are requested with "and" or just listed (e.g., "calcium and boron"), only suggest those specific nutrients - products must contain ALL requested nutrients.

Common nutrient requests:
- "kelp or calcium" → Kelp, Seaweed, Ca
- "Pyroligneous Acid" → Pyroligneous Acid (only)
- "Fulvic acid" → Fulvic acid (only)
- "Calcium and Boron" → Ca, B (products must contain BOTH)
- "NPK" → N, P, K (products must contain ALL three)
- "Iron and Zinc" → Fe, Zn (products must contain BOTH)
- "Soil health" → Fulvic acid, Humic acid, Kelp
- "Tomatoes" → Ca, K, B
- "Citrus" → Fe, Zn, Mg
- "Organic" → Fulvic acid, Humic acid, Kelp, Amino acids
- "Calcium powder" → Ca (ignore "powder")
- "Liquid nitrogen" → N (ignore "liquid")

Respond with a brief explanation of what nutrients you found and why they're relevant.`
      }, {
        role: "user",
        content: userQuery
      }],
      temperature: 0.2, // Lower temperature for more consistent responses
      max_tokens: 300
    });

    const aiAnalysis = response.choices[0].message.content;
    
    // Step 2: Extract nutrients from AI response
    const suggestedNutrients = extractNutrients(aiAnalysis);
    
    // Debug logging
    console.log('AI search for:', userQuery);
    console.log('AI analysis:', aiAnalysis);
    console.log('Extracted nutrients:', suggestedNutrients);
    
    const nutrientGroups = getNutrientGroups(suggestedNutrients);
    const useOrLogic = userQuery.toLowerCase().includes(' or ');

    const recommendations = fertilizerProducts.filter(product => {
      const nutrientMatch = useOrLogic
        ? nutrientGroups.some(group => group.some(n => productContainsNutrient(product, n)))
        : nutrientGroups.every(group => group.some(n => productContainsNutrient(product, n)));

      if (!nutrientMatch) return false;
      
      // Then filter by application method if specified
      if (applicationPreference) {
        return matchApplicationMethod(applicationPreference, product.application);
      }
      
      return true;
    });
    
    console.log('AI products found:', recommendations.length);
    if (recommendations.length > 0) {
      console.log('First few AI products:', recommendations.slice(0, 3).map(p => p.product_name));
    }
    
    // Step 4: Return results with explanation
    return {
      products: recommendations,
      explanation: aiAnalysis,
      suggestedNutrients: suggestedNutrients,
      success: true,
      applicationPreference: applicationPreference
    };
    
  } catch (error) {
    console.error('AI recommendation error:', error);
    // Fallback to keyword matching
    return getFallbackRecommendations(userQuery, applicationPreference);
  }
};

// Enhanced fallback function with application method filtering
export const getFallbackRecommendations = (userQuery, applicationPreference = null) => {
  const keywords = userQuery.toLowerCase();
  const nutrientGroups = [];
  
  // Filter out product form keywords that shouldn't be treated as nutrients
  const productFormKeywords = ['powder', 'liquid', 'granular', 'solid', 'granules', 'micronised', 'fine'];
  const cleanKeywords = keywords.split(/[,\s]+/).filter(keyword => 
    !productFormKeywords.includes(keyword.trim())
  ).join(' ');
  
  // Compound matches
  if (cleanKeywords.includes('pyroligneous acid') || cleanKeywords.includes('pyroligneous')) nutrientGroups.push(['Pyroligneous Acid']);
  if (cleanKeywords.includes('fulvic acid') || cleanKeywords.includes('fulvic')) nutrientGroups.push(['Fulvic acid']);
  if (cleanKeywords.includes('humic acid') || cleanKeywords.includes('humic')) nutrientGroups.push(['Humic acid']);
  if (cleanKeywords.includes('amino acids') || cleanKeywords.includes('amino')) nutrientGroups.push(['Amino acids']);
  if (cleanKeywords.includes('potassium humate')) nutrientGroups.push(['Potassium humate']);
  if (cleanKeywords.includes('vitamin b12') || cleanKeywords.includes('b12')) nutrientGroups.push(['Vitamin B12']);
  if (cleanKeywords.includes('triacontanol')) nutrientGroups.push(['Triacontanol']);
  if (cleanKeywords.includes('saponins')) nutrientGroups.push(['Saponins']);
  if (cleanKeywords.includes('kelp') || cleanKeywords.includes('seaweed')) nutrientGroups.push(['Kelp', 'Seaweed']);
  
  // NPK combinations
  if (cleanKeywords.includes('npk')) { nutrientGroups.push(['N'], ['P'], ['K']); }
  if (cleanKeywords.includes('calmag') || cleanKeywords.includes('cal mag')) { nutrientGroups.push(['Ca'], ['Mg']); }
  
  const addedNutrients = new Set(nutrientGroups.flat());

  // Individual nutrients
  const checkAndAdd = (keys, nutrient) => {
    if (addedNutrients.has(nutrient)) return;
    
    const found = keys.some(key => {
      // Use regex for whole-word matching
      const regex = new RegExp(`\\b${key}\\b`, 'i');
      return regex.test(cleanKeywords);
    });

    if (found) {
      nutrientGroups.push([nutrient]);
      addedNutrients.add(nutrient); // Ensure we don't add it again
    }
  };

  checkAndAdd(['nitrogen', 'nitrate', 'n'], 'N');
  checkAndAdd(['phosphorus', 'p'], 'P');
  checkAndAdd(['potassium', 'k'], 'K');
  checkAndAdd(['calcium', 'ca'], 'Ca');
  checkAndAdd(['magnesium', 'mg'], 'Mg');
  checkAndAdd(['sulfur', 's'], 'S');
  checkAndAdd(['iron', 'fe'], 'Fe');
  checkAndAdd(['zinc', 'zn'], 'Zn');
  checkAndAdd(['manganese', 'mn'], 'Mn');
  checkAndAdd(['copper', 'cu'], 'Cu');
  checkAndAdd(['boron', 'b'], 'B');
  checkAndAdd(['molybdenum', 'mo'], 'Mo');
  checkAndAdd(['cobalt', 'co'], 'Co');
  checkAndAdd(['silicon', 'si'], 'Si');
  checkAndAdd(['selenium', 'se'], 'Se');
  
  // Crop-specific suggestions (only if no specific nutrients were found)
  if (nutrientGroups.length === 0) {
    if (cleanKeywords.includes('tomato') || cleanKeywords.includes('tomatoes')) {
      nutrientGroups.push(['Ca', 'K', 'B']);
    }
    if (cleanKeywords.includes('citrus') || cleanKeywords.includes('orange') || cleanKeywords.includes('lemon')) {
      nutrientGroups.push(['Fe', 'Zn', 'Mg']);
    }
    if (cleanKeywords.includes('corn') || cleanKeywords.includes('maize')) {
      nutrientGroups.push(['N', 'P', 'Zn']);
    }
  }
  
  // General terms (only if no specific nutrients were found)
  if (nutrientGroups.length === 0) {
    if (cleanKeywords.includes('soil health') || cleanKeywords.includes('soil')) {
      nutrientGroups.push(['Fulvic acid', 'Humic acid', 'Kelp']);
    }
    if (cleanKeywords.includes('fertilizer') || cleanKeywords.includes('fertiliser')) {
      nutrientGroups.push(['N', 'P', 'K']);
    }
    if (cleanKeywords.includes('organic')) {
      nutrientGroups.push(['Fulvic acid', 'Humic acid', 'Kelp', 'Amino acids']);
    }
  }
  
  // If still no specific nutrients identified, suggest general soil health
  if (nutrientGroups.length === 0) {
    nutrientGroups.push(['Fulvic acid', 'Humic acid', 'Kelp']);
  }
  
  const flattenedNutrients = nutrientGroups.flat();
  const useOrLogicFallback = userQuery.toLowerCase().includes(' or ');

  const recommendations = fertilizerProducts.filter(product => {
    const nutrientMatch = useOrLogicFallback
      ? nutrientGroups.some(group => group.some(n => productContainsNutrient(product, n)))
      : nutrientGroups.every(group => group.some(n => productContainsNutrient(product, n)));

    if (!nutrientMatch) return false;
    
    // Then filter by application method if specified
    if (applicationPreference) {
      return matchApplicationMethod(applicationPreference, product.application);
    }
    
    return true;
  });
  
  // Debug logging
  console.log('Fallback search for:', userQuery);
  console.log('Detected nutrients:', flattenedNutrients);
  console.log('Products found:', recommendations.length);
  if (recommendations.length > 0) {
    console.log('First few products:', recommendations.slice(0, 3).map(p => p.product_name));
  }
  
  return {
    products: recommendations,
    explanation: `Based on your search for "${userQuery}", we found ${recommendations.length} products containing the requested nutrients.`,
    suggestedNutrients: flattenedNutrients,
    success: true,
    isFallback: true,
    applicationPreference: applicationPreference
  };
}; 