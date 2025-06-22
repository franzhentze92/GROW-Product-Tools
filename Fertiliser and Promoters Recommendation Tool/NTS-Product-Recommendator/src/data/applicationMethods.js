export const applicationMethods = [
  {
    name: "Soil Application",
    description: "Applied directly to the soil around plant roots",
    methods: ["Broadcast", "Band", "Side-dress", "Fertigation"],
    keywords: ["soil", "ground", "root", "drench", "fertigation", "home garden", "vegetables", "orchards", "vineyards", "broadacre", "spot spray"]
  },
  {
    name: "Foliar Spray",
    description: "Applied directly to plant leaves for quick absorption",
    methods: ["Spray", "Mist", "Drip"],
    keywords: ["foliar", "spray", "mist", "leaf", "drip"]
  },
  {
    name: "Drench",
    description: "Liquid application poured around the base of plants",
    methods: ["Root drench", "Soil drench"],
    keywords: ["drench", "root drench", "soil drench"]
  },
  {
    name: "Seed Treatment",
    description: "Applied to seeds before planting",
    methods: ["Coating", "Soaking", "Dusting"],
    keywords: ["seed", "seed treatment", "seedling", "seedling treatment", "cuttings", "cuttings treatment"]
  },
  {
    name: "Compost",
    description: "Added to compost piles to enhance decomposition",
    methods: ["Mixing", "Layering"],
    keywords: ["compost", "composting"]
  },
  {
    name: "Hydroponic",
    description: "Added to nutrient solutions in hydroponic systems",
    methods: ["Solution addition", "Reservoir treatment"],
    keywords: ["hydroponic", "hydroponics", "nutrient tank", "solution"]
  }
];

// Helper function to match application methods with product application arrays
export const matchApplicationMethod = (userPreference, productApplications) => {
  if (!userPreference || !productApplications || productApplications.length === 0) {
    return true; // If no preference specified, show all products
  }

  const userPref = userPreference.toLowerCase();
  
  // Find the matching application method category
  const methodCategory = applicationMethods.find(method => 
    method.name.toLowerCase() === userPref ||
    method.keywords.some(keyword => userPref.includes(keyword))
  );

  if (!methodCategory) {
    return true; // If we can't match the preference, show all products
  }

  // Check if any of the product's applications match the category
  return productApplications.some(app => {
    const appLower = app.toLowerCase();
    
    // Direct match with category name
    if (methodCategory.name.toLowerCase() === appLower) {
      return true;
    }
    
    // Match with category keywords
    if (methodCategory.keywords.some(keyword => appLower.includes(keyword))) {
      return true;
    }
    
    // Match with category methods
    if (methodCategory.methods.some(method => appLower.includes(method.toLowerCase()))) {
      return true;
    }
    
    return false;
  });
};

// Get all unique application terms from the database for reference
export const getAllApplicationTerms = () => {
  const terms = new Set();
  
  // Add all category names and keywords
  applicationMethods.forEach(method => {
    terms.add(method.name);
    method.keywords.forEach(keyword => terms.add(keyword));
    method.methods.forEach(method => terms.add(method));
  });
  
  return Array.from(terms).sort();
}; 