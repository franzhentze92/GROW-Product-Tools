// NOTE: For product images, use /assets/filename.webp and ensure all images are in the public/assets directory for production builds.
// Local chemical compatibility analysis service

// Helper to normalize product image paths to /assets/...
function normalizeImagePath(imagePath) {
  if (!imagePath) return imagePath;
  // Remove any src/assets prefixes and ensure /assets/ prefix
  return imagePath
    .replace(/^\/src\/assets\//, '/assets/')
    .replace(/^src\/assets\//, '/assets/')
    .replace(/^\.\/src\/assets\//, '/assets/')
    .replace(/^\/assets\//, '/assets/') // Already correct
    .replace(/^assets\//, '/assets/'); // Missing leading slash
}

// Comprehensive nutrient compatibility matrix
const NUTRIENT_COMPATIBILITY = {
  "N": {
    "Ca": { status: "compatible" },
    "P": { status: "compatible" },
    "K": { status: "compatible" },
    "Mg": { status: "compatible" },
    "S": { status: "compatible" },
    "Fe": { status: "caution", reason: "Ammonium can reduce iron uptake." },
    "Zn": { status: "compatible" },
    "Mn": { status: "compatible" },
    "Cu": { status: "compatible" },
    "B": { status: "compatible" },
    "Mo": { status: "compatible" }
  },
  "Ca": {
    "N": { status: "compatible" },
    "P": { status: "incompatible", reason: "Calcium and phosphate can form insoluble precipitates." },
    "K": { status: "caution", reason: "High potassium can antagonize calcium uptake." },
    "Mg": { status: "caution", reason: "High magnesium can antagonize calcium uptake." },
    "S": { status: "caution", reason: "High sulfate can reduce calcium uptake." },
    "Fe": { status: "caution", reason: "Iron and calcium can form insoluble compounds." },
    "Zn": { status: "compatible" },
    "Mn": { status: "compatible" },
    "Cu": { status: "compatible" },
    "B": { status: "compatible" },
    "Mo": { status: "compatible" }
  },
  "P": {
    "N": { status: "compatible" },
    "Ca": { status: "incompatible", reason: "Calcium and phosphate can form insoluble precipitates." },
    "K": { status: "compatible" },
    "Mg": { status: "compatible" },
    "S": { status: "compatible" },
    "Fe": { status: "caution", reason: "Iron and phosphate can form insoluble precipitates." },
    "Zn": { status: "caution", reason: "Zinc and phosphate can form insoluble precipitates." },
    "Mn": { status: "caution", reason: "Manganese and phosphate can form insoluble precipitates." },
    "Cu": { status: "caution", reason: "Copper and phosphate can form insoluble precipitates." },
    "B": { status: "compatible" },
    "Mo": { status: "compatible" }
  },
  "K": {
    "N": { status: "compatible" },
    "Ca": { status: "caution", reason: "High potassium can antagonize calcium uptake." },
    "P": { status: "compatible" },
    "Mg": { status: "caution", reason: "High potassium can antagonize magnesium uptake." },
    "S": { status: "compatible" },
    "Fe": { status: "compatible" },
    "Zn": { status: "compatible" },
    "Mn": { status: "compatible" },
    "Cu": { status: "compatible" },
    "B": { status: "compatible" },
    "Mo": { status: "compatible" }
  },
  "Mg": {
    "N": { status: "compatible" },
    "Ca": { status: "caution", reason: "High magnesium can antagonize calcium uptake." },
    "P": { status: "compatible" },
    "K": { status: "caution", reason: "High potassium can antagonize magnesium uptake." },
    "S": { status: "compatible" },
    "Fe": { status: "compatible" },
    "Zn": { status: "compatible" },
    "Mn": { status: "compatible" },
    "Cu": { status: "compatible" },
    "B": { status: "compatible" },
    "Mo": { status: "compatible" }
  },
  "S": {
    "N": { status: "compatible" },
    "Ca": { status: "caution", reason: "High sulfate can reduce calcium uptake." },
    "P": { status: "compatible" },
    "K": { status: "compatible" },
    "Mg": { status: "compatible" },
    "Fe": { status: "compatible" },
    "Zn": { status: "compatible" },
    "Mn": { status: "compatible" },
    "Cu": { status: "compatible" },
    "B": { status: "compatible" },
    "Mo": { status: "compatible" }
  },
  "Fe": {
    "N": { status: "caution", reason: "Ammonium can reduce iron uptake." },
    "Ca": { status: "caution", reason: "Iron and calcium can form insoluble compounds." },
    "P": { status: "caution", reason: "Iron and phosphate can form insoluble precipitates." },
    "K": { status: "compatible" },
    "Mg": { status: "compatible" },
    "S": { status: "compatible" },
    "Zn": { status: "caution", reason: "High iron can antagonize zinc uptake." },
    "Mn": { status: "caution", reason: "High iron can antagonize manganese uptake." },
    "Cu": { status: "caution", reason: "High iron can antagonize copper uptake." },
    "B": { status: "compatible" },
    "Mo": { status: "compatible" }
  },
  "Zn": {
    "N": { status: "compatible" },
    "Ca": { status: "compatible" },
    "P": { status: "caution", reason: "Zinc and phosphate can form insoluble precipitates." },
    "K": { status: "compatible" },
    "Mg": { status: "compatible" },
    "S": { status: "compatible" },
    "Fe": { status: "caution", reason: "High iron can antagonize zinc uptake." },
    "Mn": { status: "caution", reason: "High zinc can antagonize manganese uptake." },
    "Cu": { status: "caution", reason: "High zinc can antagonize copper uptake." },
    "B": { status: "compatible" },
    "Mo": { status: "compatible" }
  },
  "Mn": {
    "N": { status: "compatible" },
    "Ca": { status: "compatible" },
    "P": { status: "caution", reason: "Manganese and phosphate can form insoluble precipitates." },
    "K": { status: "compatible" },
    "Mg": { status: "compatible" },
    "S": { status: "compatible" },
    "Fe": { status: "caution", reason: "High iron can antagonize manganese uptake." },
    "Zn": { status: "caution", reason: "High zinc can antagonize manganese uptake." },
    "Cu": { status: "caution", reason: "High manganese can antagonize copper uptake." },
    "B": { status: "compatible" },
    "Mo": { status: "compatible" }
  },
  "Cu": {
    "N": { status: "compatible" },
    "Ca": { status: "compatible" },
    "P": { status: "caution", reason: "Copper and phosphate can form insoluble precipitates." },
    "K": { status: "compatible" },
    "Mg": { status: "compatible" },
    "S": { status: "compatible" },
    "Fe": { status: "caution", reason: "High iron can antagonize copper uptake." },
    "Zn": { status: "caution", reason: "High zinc can antagonize copper uptake." },
    "Mn": { status: "caution", reason: "High manganese can antagonize copper uptake." },
    "B": { status: "compatible" },
    "Mo": { status: "compatible" }
  },
  "B": {
    "N": { status: "compatible" },
    "Ca": { status: "compatible" },
    "P": { status: "compatible" },
    "K": { status: "compatible" },
    "Mg": { status: "compatible" },
    "S": { status: "compatible" },
    "Fe": { status: "compatible" },
    "Zn": { status: "compatible" },
    "Mn": { status: "compatible" },
    "Cu": { status: "compatible" },
    "Mo": { status: "compatible" }
  },
  "Mo": {
    "N": { status: "compatible" },
    "Ca": { status: "compatible" },
    "P": { status: "compatible" },
    "K": { status: "compatible" },
    "Mg": { status: "compatible" },
    "S": { status: "compatible" },
    "Fe": { status: "compatible" },
    "Zn": { status: "compatible" },
    "Mn": { status: "compatible" },
    "Cu": { status: "compatible" },
    "B": { status: "compatible" }
  }
};

export class CompatibilityService {
  constructor() {
    // Local analysis only - no API keys needed
  }

  async analyzeCompatibility(products) {
    try {
      // Always use local analysis
      return this.performLocalAnalysis(products);
    } catch (error) {
      console.error('Local analysis failed:', error);
      return {
        compatible: false,
        risk: 'high',
        explanation: 'Analysis failed. Please try again.',
        recommendations: ['Check your product selections and try again.'],
        alternativeStrategies: [],
        chemicalInteractions: [],
        warnings: ['Analysis error occurred'],
        products: products.map(p => p.product_name),
        aiGenerated: false
      };
    }
  }

  // Local compatibility analysis using the matrix
  performLocalAnalysis(products) {
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
        if (analysis.risk !== 'high') analysis.risk = 'medium';
        analysis.explanation += 'Moderate pH differences detected. ';
        analysis.chemicalInteractions.push('pH differences may affect nutrient availability');
        analysis.recommendations.push('Monitor pH of final mix');
      }
    }

    // Deduplicate cross-product nutrient pair warnings/interactions
    const reportedPairs = new Set();

    // Check all cross-product nutrient pairs
    for (let i = 0; i < products.length; i++) {
      for (let j = 0; j < products.length; j++) {
        if (i === j) continue;
        const prodA = products[i];
        const prodB = products[j];
        if (!prodA.nutrients || !prodB.nutrients) continue;
        prodA.nutrients.forEach(nutrientA => {
          prodB.nutrients.forEach(nutrientB => {
            const rule = NUTRIENT_COMPATIBILITY[nutrientA]?.[nutrientB];
            if (rule) {
              // Sort the pair for deduplication (e.g., Ca|Zn == Zn|Ca)
              const pairKey = [nutrientA, nutrientB].sort().join('|');
              if (reportedPairs.has(pairKey)) return;
              reportedPairs.add(pairKey);
              if (rule.status === 'incompatible') {
                analysis.compatible = false;
                analysis.risk = 'high';
                analysis.chemicalInteractions.push(`${nutrientA} (from ${prodA.product_name}) + ${nutrientB} (from ${prodB.product_name}): ${rule.reason}`);
                analysis.warnings.push(`${nutrientA} + ${nutrientB}: ${rule.reason}`);
                analysis.recommendations.push(`Do not mix ${nutrientA} and ${nutrientB} products together.`);
              } else if (rule.status === 'caution') {
                if (analysis.risk !== 'high') analysis.risk = 'medium';
                analysis.chemicalInteractions.push(`${nutrientA} (from ${prodA.product_name}) + ${nutrientB} (from ${prodB.product_name}): ${rule.reason}`);
                analysis.warnings.push(`${nutrientA} + ${nutrientB}: ${rule.reason}`);
                analysis.recommendations.push(`Use caution when mixing ${nutrientA} and ${nutrientB} products.`);
              }
            }
          });
        });
      }
    }

    if (analysis.chemicalInteractions.length === 0 && analysis.explanation === '') {
      analysis.explanation = 'No known incompatibilities or cautions detected based on nutrient matrix and pH.';
    } else if (analysis.chemicalInteractions.length > 0 && analysis.explanation === '') {
      analysis.explanation = 'Compatibility issues or cautions detected based on nutrient matrix.';
    }

    return analysis;
  }
}

// Export a singleton instance
export const compatibilityService = new CompatibilityService(); 