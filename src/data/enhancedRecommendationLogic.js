// Enhanced recommendation logic for microbe products
// This replaces the complex microbe lookup logic with direct control_targets matching

export const enhancedMicrobeRecommendationLogic = {
  // Filter products by pathogen types
  filterByPathogens: (products, pathogenTypes, applicationMethod = null) => {
    if (!pathogenTypes || pathogenTypes.length === 0) {
      return products;
    }

    return products.filter(product => {
      // Check if product controls any of the selected pathogen types
      const controlsPathogens = pathogenTypes.some(pathogenType => 
        product.control_targets.pathogens.includes(pathogenType)
      );

      // Filter by application method if specified
      if (applicationMethod) {
        const appMethodMap = {
          'Soil application': 'Soil',
          'Foliar spray': 'Foliar',
          'Seed treatment': ['Seed treatment', 'Seed'],
          'Compost inoculant': 'Compost',
          'Hydroponic system': 'Hydroponic',
        };
        const mappedAppMethod = appMethodMap[applicationMethod];
        
        const matchesApp = Array.isArray(mappedAppMethod)
          ? mappedAppMethod.some(m => product.application.includes(m))
          : product.application.includes(mappedAppMethod);
        
        return controlsPathogens && matchesApp;
      }

      return controlsPathogens;
    });
  },

  // Filter products by insect types
  filterByInsects: (products, insectTypes, applicationMethod = null) => {
    if (!insectTypes || insectTypes.length === 0) {
      return products;
    }

    return products.filter(product => {
      // Check if product controls any of the selected insect types
      const controlsInsects = insectTypes.some(insectType => 
        product.control_targets.insects.includes(insectType)
      );

      // Filter by application method if specified
      if (applicationMethod) {
        const appMethodMap = {
          'Soil application': 'Soil',
          'Foliar spray': 'Foliar',
          'Seed treatment': ['Seed treatment', 'Seed'],
          'Compost inoculant': 'Compost',
          'Hydroponic system': 'Hydroponic',
        };
        const mappedAppMethod = appMethodMap[applicationMethod];
        
        const matchesApp = Array.isArray(mappedAppMethod)
          ? mappedAppMethod.some(m => product.application.includes(m))
          : product.application.includes(mappedAppMethod);
        
        return controlsInsects && matchesApp;
      }

      return controlsInsects;
    });
  },

  // Filter products by organic certification preference
  filterByOrganicCertified: (products, organicCertifiedPreference) => {
    if (!organicCertifiedPreference || organicCertifiedPreference === 'no-preference') {
      return products;
    }

    return products.filter(product => {
      if (organicCertifiedPreference === 'organic') {
        return product.organic_certified === true;
      } else if (organicCertifiedPreference === 'non-organic') {
        return product.organic_certified === false;
      }
      return true;
    });
  },

  // Filter products by product form preference
  filterByProductForm: (products, productFormPreference) => {
    if (!productFormPreference || productFormPreference === 'No preference') {
      return products;
    }

    return products.filter(product => {
      const productForm = product.product_form.toLowerCase();
      if (productFormPreference === 'Liquid') {
        return productForm.includes('liquid');
      } else if (productFormPreference === 'Solid') {
        return productForm.includes('solid') || productForm.includes('talc') || productForm.includes('powder') || productForm.includes('granular');
      }
      return true;
    });
  },

  // Filter products by benefits
  filterByBenefits: (products, selectedBenefits, applicationMethod = null) => {
    if (!selectedBenefits || selectedBenefits.length === 0) {
      return products;
    }

    return products.filter(product => {
      const matchesBenefit = product.benefits.some(benefit => 
        selectedBenefits.includes(benefit)
      );

      if (applicationMethod) {
        const appMethodMap = {
          'Soil application': 'Soil',
          'Foliar spray': 'Foliar',
          'Seed treatment': ['Seed treatment', 'Seed'],
          'Compost inoculant': 'Compost',
          'Hydroponic system': 'Hydroponic',
        };
        const mappedAppMethod = appMethodMap[applicationMethod];
        
        const matchesApp = Array.isArray(mappedAppMethod)
          ? mappedAppMethod.some(m => product.application.includes(m))
          : product.application.includes(mappedAppMethod);
        
        return matchesBenefit && matchesApp;
      }

      return matchesBenefit;
    });
  },

  // Get comprehensive recommendations
  getRecommendations: (products, filters) => {
    let filteredProducts = [...products];

    // Apply product form filtering
    if (filters.productFormPreference) {
      filteredProducts = enhancedMicrobeRecommendationLogic.filterByProductForm(
        filteredProducts, 
        filters.productFormPreference
      );
    }

    // Apply organic certification filtering
    if (filters.organicCertifiedPreference) {
      filteredProducts = enhancedMicrobeRecommendationLogic.filterByOrganicCertified(
        filteredProducts, 
        filters.organicCertifiedPreference
      );
    }

    // Apply pathogen filtering
    if (filters.pathogenTypes && filters.pathogenTypes.length > 0) {
      filteredProducts = enhancedMicrobeRecommendationLogic.filterByPathogens(
        filteredProducts, 
        filters.pathogenTypes, 
        filters.applicationMethod
      );
    }

    // Apply insect filtering
    if (filters.insectTypes && filters.insectTypes.length > 0) {
      filteredProducts = enhancedMicrobeRecommendationLogic.filterByInsects(
        filteredProducts, 
        filters.insectTypes, 
        filters.applicationMethod
      );
    }

    // Apply benefit filtering (if no specific pathogen/insect filters)
    if ((!filters.pathogenTypes || filters.pathogenTypes.length === 0) && 
        (!filters.insectTypes || filters.insectTypes.length === 0)) {
      filteredProducts = enhancedMicrobeRecommendationLogic.filterByBenefits(
        filteredProducts, 
        filters.selectedBenefits, 
        filters.applicationMethod
      );
    }

    return filteredProducts;
  },

  // Get explanation for why a product was recommended
  getRecommendationExplanation: (product, filters) => {
    const explanations = [];

    // Pathogen explanation
    if (filters.pathogenTypes && filters.pathogenTypes.length > 0) {
      const matchingPathogens = filters.pathogenTypes.filter(pathogenType => 
        product.control_targets.pathogens.includes(pathogenType)
      );
      if (matchingPathogens.length > 0) {
        explanations.push(`Controls pathogens: ${matchingPathogens.join(', ')}`);
      }
    }

    // Insect explanation
    if (filters.insectTypes && filters.insectTypes.length > 0) {
      const matchingInsects = filters.insectTypes.filter(insectType => 
        product.control_targets.insects.includes(insectType)
      );
      if (matchingInsects.length > 0) {
        explanations.push(`Controls insects: ${matchingInsects.join(', ')}`);
      }
    }

    // Benefit explanation
    if (filters.selectedBenefits && filters.selectedBenefits.length > 0) {
      const matchingBenefits = filters.selectedBenefits.filter(benefit => 
        product.benefits.includes(benefit)
      );
      if (matchingBenefits.length > 0) {
        explanations.push(`Provides: ${matchingBenefits.join(', ')}`);
      }
    }

    return explanations.join(' | ');
  }
}; 