// AI-powered chemical compatibility analysis service
// This service can be integrated with OpenAI, Claude, or other AI providers

export class CompatibilityService {
  constructor(apiKey = null, provider = 'openai') {
    this.apiKey = apiKey;
    this.provider = provider;
    this.baseUrl = this.getBaseUrl();
  }

  getBaseUrl() {
    switch (this.provider) {
      case 'openai':
        return 'https://api.openai.com/v1/chat/completions';
      case 'anthropic':
        return 'https://api.anthropic.com/v1/messages';
      default:
        return 'https://api.openai.com/v1/chat/completions';
    }
  }

  async analyzeCompatibility(products) {
    try {
      if (!this.apiKey) {
        // Fallback to local analysis if no API key
        return this.performLocalAnalysis(products);
      }

      const prompt = this.createAnalysisPrompt(products);
      const response = await this.callAI(prompt);
      return this.parseAIResponse(response, products);
    } catch (error) {
      console.error('AI analysis failed, falling back to local analysis:', error);
      return this.performLocalAnalysis(products);
    }
  }

  createAnalysisPrompt(products) {
    let prompt = `You are a chemical compatibility expert specializing in agricultural fertilizers and soil amendments. Analyze the compatibility of the following NTS products for tank mixing:

PRODUCTS TO ANALYZE:
`;

    products.forEach((product, index) => {
      prompt += `\n${index + 1}. ${product.product_name}
- Nutrients: ${product.nutrients.join(', ')}
- Form: ${product.product_form}
- pH: ${product.analysis?.pH || 'Not specified'}
- Analysis: ${JSON.stringify(product.analysis, null, 2)}
- Description: ${product.description || 'No description available'}`;
    });

    prompt += `

ANALYSIS REQUIREMENTS:
1. Assess overall compatibility (compatible/incompatible/caution)
2. Determine risk level (low/medium/high)
3. Explain specific chemical interactions and potential issues
4. Provide detailed recommendations for safe mixing
5. Suggest alternative application strategies if needed
6. Consider pH compatibility, nutrient interactions, precipitation risks, and salt buildup

RESPONSE FORMAT (JSON):
{
  "compatible": boolean,
  "risk": "low|medium|high",
  "explanation": "detailed chemical analysis",
  "recommendations": ["recommendation1", "recommendation2", ...],
  "alternative_strategies": ["strategy1", "strategy2", ...],
  "chemical_interactions": ["interaction1", "interaction2", ...],
  "warnings": ["warning1", "warning2", ...]
}

Provide only the JSON response, no additional text.`;

    return prompt;
  }

  async callAI(prompt) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };

    const body = {
      model: this.provider === 'openai' ? 'gpt-4' : 'claude-3-sonnet-20240229',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000
    };

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || data.content?.[0]?.text || '';
  }

  parseAIResponse(response, products) {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const aiResult = JSON.parse(jsonMatch[0]);
      
      return {
        compatible: aiResult.compatible || false,
        risk: aiResult.risk || 'medium',
        explanation: aiResult.explanation || 'Analysis completed',
        recommendations: aiResult.recommendations || [],
        alternativeStrategies: aiResult.alternative_strategies || [],
        chemicalInteractions: aiResult.chemical_interactions || [],
        warnings: aiResult.warnings || [],
        products: products.map(p => p.product_name),
        aiGenerated: true
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return this.performLocalAnalysis(products);
    }
  }

  performLocalAnalysis(products) {
    // Advanced local chemical compatibility analysis
    const analysis = {
      compatible: true,
      risk: 'low',
      explanation: '',
      recommendations: [],
      alternativeStrategies: [],
      chemicalInteractions: [],
      warnings: [],
      products: products.map(p => p.product_name),
      aiGenerated: false
    };

    // pH compatibility analysis
    const pHValues = products.map(p => {
      const pH = p.analysis?.pH;
      if (!pH) return null;
      const match = pH.match(/(\d+(?:\.\d+)?)/);
      return match ? parseFloat(match[1]) : null;
    }).filter(pH => pH !== null);

    if (pHValues.length > 1) {
      const maxpH = Math.max(...pHValues);
      const minpH = Math.min(...pHValues);
      const pHDiff = maxpH - minpH;

      if (pHDiff > 4) {
        analysis.compatible = false;
        analysis.risk = 'high';
        analysis.explanation += 'Significant pH incompatibility detected. ';
        analysis.chemicalInteractions.push('pH incompatibility between products');
        analysis.warnings.push('pH extremes can cause precipitation and reduced efficacy');
        analysis.recommendations.push('Separate applications by at least 24 hours');
        analysis.recommendations.push('Test pH of final mix before application');
      } else if (pHDiff > 2) {
        analysis.risk = 'medium';
        analysis.explanation += 'Moderate pH differences detected. ';
        analysis.chemicalInteractions.push('pH differences may affect nutrient availability');
        analysis.recommendations.push('Monitor pH of final mix');
      }
    }

    // Nutrient interaction analysis
    const allNutrients = products.flatMap(p => p.nutrients);
    const nutrientCounts = {};
    allNutrients.forEach(nutrient => {
      const key = nutrient.toLowerCase();
      nutrientCounts[key] = (nutrientCounts[key] || 0) + 1;
    });

    // Check for calcium-phosphate interactions
    const hasCalcium = allNutrients.some(n => 
      n.toLowerCase().includes('calcium') || n.toLowerCase().includes('ca')
    );
    const hasPhosphate = allNutrients.some(n => 
      n.toLowerCase().includes('phosphate') || n.toLowerCase().includes('phosphorus') || n.toLowerCase().includes('p')
    );

    if (hasCalcium && hasPhosphate) {
      analysis.compatible = false;
      analysis.risk = analysis.risk === 'high' ? 'high' : 'medium';
      analysis.explanation += 'Calcium-phosphate precipitation risk detected. ';
      analysis.chemicalInteractions.push('Calcium and phosphate can form insoluble precipitates');
      analysis.warnings.push('Precipitation will reduce nutrient availability');
      analysis.recommendations.push('Apply calcium and phosphate products separately');
      analysis.recommendations.push('Consider using chelated forms to prevent precipitation');
      analysis.alternativeStrategies.push('Sequential application with 24-hour intervals');
    }

    // Check for sulfate buildup
    const sulfateCount = allNutrients.filter(n => 
      n.toLowerCase().includes('sulfate') || n.toLowerCase().includes('sulfur') || n.toLowerCase().includes('s')
    ).length;

    if (sulfateCount > 2) {
      analysis.risk = analysis.risk === 'high' ? 'high' : 'medium';
      analysis.explanation += 'Multiple sulfate sources detected. ';
      analysis.chemicalInteractions.push('Multiple sulfate sources may cause salt buildup');
      analysis.recommendations.push('Monitor electrical conductivity of final mix');
      analysis.recommendations.push('Consider reducing application rates');
    }

    // Check for micronutrient interactions
    const micronutrients = ['iron', 'zinc', 'manganese', 'copper', 'boron', 'molybdenum'];
    const micronutrientCount = allNutrients.filter(n => 
      micronutrients.some(micronutrient => n.toLowerCase().includes(micronutrient))
    ).length;

    if (micronutrientCount > 3) {
      analysis.risk = analysis.risk === 'high' ? 'high' : 'medium';
      analysis.explanation += 'Multiple micronutrients detected. ';
      analysis.chemicalInteractions.push('High micronutrient concentrations may cause antagonism');
      analysis.recommendations.push('Monitor for micronutrient antagonism');
      analysis.recommendations.push('Consider splitting micronutrient applications');
    }

    // Form compatibility
    const forms = [...new Set(products.map(p => p.product_form))];
    if (forms.length > 1) {
      analysis.explanation += 'Mixed product forms detected. ';
      analysis.recommendations.push('Ensure proper mixing order (powders first, then liquids)');
      analysis.recommendations.push('Maintain agitation throughout mixing process');
    }

    // General recommendations
    if (analysis.compatible && analysis.risk === 'low') {
      analysis.explanation = 'Products appear chemically compatible for tank mixing. All products have similar pH ranges and no conflicting nutrient interactions detected.';
      analysis.recommendations.push('Perform jar test before large-scale mixing');
      analysis.recommendations.push('Monitor for any visual changes during mixing');
      analysis.recommendations.push('Apply within 24 hours of mixing');
    }

    // Always add these general recommendations
    analysis.recommendations.push('Always perform a jar test before mixing');
    analysis.recommendations.push('Follow label instructions for mixing order');
    analysis.recommendations.push('Monitor for precipitation or color changes');
    analysis.recommendations.push('Test on a small area before full application');

    return analysis;
  }

  // Method to set API key for real AI integration
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  // Method to change AI provider
  setProvider(provider) {
    this.provider = provider;
    this.baseUrl = this.getBaseUrl();
  }
}

// Export a singleton instance
export const compatibilityService = new CompatibilityService(); 