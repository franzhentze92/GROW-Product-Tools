// Product database loader for NTS products
// This file loads and parses the products from nts_products_database.txt

let cachedProducts = null;

export const clearCache = () => {
  cachedProducts = null;
  console.log('Product cache cleared');
};

export const loadProducts = async () => {
  // Clear cache to ensure fresh data
  clearCache();
  
  console.log('Loading products from database...');
  
  try {
    // First try to load from JSON file if it exists
    try {
      // Add cache-busting timestamp to force fresh load
      const timestamp = new Date().getTime();
      console.log('Attempting to load from JSON file...');
      const jsonResponse = await fetch(`/nts_products_database.json?t=${timestamp}`);
      console.log('JSON response status:', jsonResponse.status);
      if (jsonResponse.ok) {
        const products = await jsonResponse.json();
        console.log(`✅ Successfully loaded ${products.length} products from JSON file`);
        console.log('First few products:', products.slice(0, 3).map(p => p.product_name));
        cachedProducts = products;
        return products;
      } else {
        console.log('❌ JSON file not found or error:', jsonResponse.status, jsonResponse.statusText);
      }
    } catch (jsonError) {
      console.log('❌ JSON file error:', jsonError.message);
    }

    // Fall back to text file
    const response = await fetch('/nts_products_database.txt');
    if (!response.ok) {
      throw new Error('Failed to load products database');
    }
    
    const text = await response.text();
    
    // Parse the JSON objects from the text file
    // The file contains multiple JSON objects separated by commas
    let products = [];
    
    try {
      // First, try to parse as a proper JSON array
      const jsonString = '[' + text.replace(/}\s*,\s*{/g, '},{') + ']';
      products = JSON.parse(jsonString);
      console.log('Successfully parsed as JSON array');
    } catch (parseError) {
      console.log('Failed to parse as array, trying individual objects...', parseError.message);
      
      // If that fails, try parsing individual JSON objects
      const lines = text.split('\n');
      let currentObject = '';
      let braceCount = 0;
      let inString = false;
      let escapeNext = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        if (trimmedLine === '') continue;
        
        currentObject += line + '\n';
        
        // Parse the line character by character to handle nested braces properly
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          
          if (escapeNext) {
            escapeNext = false;
            continue;
          }
          
          if (char === '\\') {
            escapeNext = true;
            continue;
          }
          
          if (char === '"' && !escapeNext) {
            inString = !inString;
            continue;
          }
          
          if (!inString) {
            if (char === '{') {
              braceCount++;
            } else if (char === '}') {
              braceCount--;
            }
          }
        }
        
        // If we've completed an object
        if (braceCount === 0 && currentObject.trim()) {
          try {
            const product = JSON.parse(currentObject.trim());
            if (product.product_name) {
              products.push(product);
            }
          } catch (e) {
            console.warn('Failed to parse product object:', e.message);
            console.warn('Object content:', currentObject.substring(0, 200) + '...');
          }
          currentObject = '';
        }
      }
      
      console.log('Parsed individual objects');
    }
    
    console.log(`Loaded ${products.length} products from database`);
    
    // Cache the products
    cachedProducts = products;
    return products;
  } catch (error) {
    console.error('Error loading products database:', error);
    
    // Return sample data if loading fails
    return [
      {
        product_name: "NTS Liquid Humus™",
        nutrients: ["Potassium humate"],
        application: ["Foliar", "Fertigation", "Soil Ameliorant"],
        product_form: "Liquid",
        organic_certified: true,
        description: "A rich, dark‑brown liquid humic acid derived from potassium humates.",
        analysis: {
          "Potassium humate": "12.6%",
          "pH": "10.5–11.5"
        },
        benefits: [
          "Detoxifies heavy metals and chemical residues",
          "Stabilises urea and enhances nitrogen longevity"
        ],
        link: "https://nutri-tech.com.au/products/liquid-humus",
        image: "/assets/liquid-humus.webp"
      },
      {
        product_name: "NTS Fast Fulvic™",
        nutrients: ["Fulvic acid"],
        application: ["Foliar", "Fertigation", "Broadacre crops"],
        product_form: "Liquid",
        organic_certified: true,
        description: "A concentrated, 8% fulvic acid liquid extract from humates.",
        analysis: {
          "Fulvic Acid": "8%",
          "pH": "3.5–4.5"
        },
        benefits: [
          "Natural chelator that enhances nutrient uptake",
          "Stimulates beneficial soil microbes"
        ],
        link: "https://nutri-tech.com.au/products/fast-fulvic",
        image: "/assets/fast-fulvic.webp"
      }
    ];
  }
};

export const getProducts = () => {
  return cachedProducts || [];
};

export const searchProducts = (searchTerm) => {
  if (!cachedProducts) return [];
  
  return cachedProducts.filter(product =>
    product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.nutrients?.some(nutrient => 
      nutrient.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
};

export const getProductByName = (productName) => {
  if (!cachedProducts) return null;
  
  return cachedProducts.find(product => 
    product.product_name === productName
  );
}; 