export const nutrients = [
  { 
    name: "Nitrogen (N)", 
    description: "Essential for leaf growth, chlorophyll production, and overall plant vigor",
    symbol: "N"
  },
  { 
    name: "Phosphorus (P)", 
    description: "Critical for root development, flowering, fruiting, and energy transfer",
    symbol: "P"
  },
  { 
    name: "Potassium (K)", 
    description: "Important for disease resistance, water regulation, and fruit quality",
    symbol: "K"
  },
  { 
    name: "Calcium (Ca)", 
    description: "Essential for cell wall structure, root development, and fruit quality",
    symbol: "Ca"
  },
  { 
    name: "Magnesium (Mg)", 
    description: "Central component of chlorophyll and enzyme activation",
    symbol: "Mg"
  },
  { 
    name: "Sulfur (S)", 
    description: "Important for protein synthesis and enzyme function",
    symbol: "S"
  },
  { 
    name: "Iron (Fe)", 
    description: "Essential for chlorophyll synthesis and energy transfer",
    symbol: "Fe"
  },
  { 
    name: "Zinc (Zn)", 
    description: "Important for enzyme function and hormone production",
    symbol: "Zn"
  },
  { 
    name: "Manganese (Mn)", 
    description: "Essential for photosynthesis and enzyme activation",
    symbol: "Mn"
  },
  { 
    name: "Copper (Cu)", 
    description: "Important for enzyme function and lignin synthesis",
    symbol: "Cu"
  },
  { 
    name: "Boron (B)", 
    description: "Essential for cell division and sugar transport",
    symbol: "B"
  },
  { 
    name: "Molybdenum (Mo)", 
    description: "Important for nitrogen fixation and enzyme function",
    symbol: "Mo"
  }
];

export const nutrientCombinations = [
  {
    name: "NPK (Nitrogen, Phosphorus, Potassium)",
    description: "Complete primary nutrient blend for balanced plant growth",
    nutrients: ["N", "P", "K"]
  },
  {
    name: "NP (Nitrogen, Phosphorus)",
    description: "Focus on vegetative growth and root development",
    nutrients: ["N", "P"]
  },
  {
    name: "NK (Nitrogen, Potassium)",
    description: "Focus on leaf growth and stress resistance",
    nutrients: ["N", "K"]
  },
  {
    name: "PK (Phosphorus, Potassium)",
    description: "Focus on flowering, fruiting, and quality",
    nutrients: ["P", "K"]
  },
  {
    name: "Micronutrients",
    description: "Essential trace elements for optimal plant function",
    nutrients: ["Fe", "Zn", "Mn", "Cu", "B", "Mo"]
  },
  {
    name: "Calcium & Magnesium",
    description: "Secondary nutrients for cell structure and chlorophyll",
    nutrients: ["Ca", "Mg"]
  }
]; 