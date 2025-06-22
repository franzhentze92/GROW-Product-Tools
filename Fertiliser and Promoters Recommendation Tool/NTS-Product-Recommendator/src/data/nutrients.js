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
  },
  { 
    name: "Cobalt (Co)", 
    description: "Essential for nitrogen fixation and vitamin B12 synthesis",
    symbol: "Co"
  },
  { 
    name: "Silicon (Si)", 
    description: "Improves plant structure, disease resistance, and stress tolerance",
    symbol: "Si"
  },
  { 
    name: "Selenium (Se)", 
    description: "Antioxidant properties and stress resistance",
    symbol: "Se"
  },
  { 
    name: "Fulvic Acid", 
    description: "Organic compound that enhances nutrient uptake and soil health",
    symbol: "Fulvic acid"
  },
  { 
    name: "Humic Acid", 
    description: "Organic compound that improves soil structure and nutrient retention",
    symbol: "Humic acid"
  },
  { 
    name: "Amino Acids", 
    description: "Building blocks of proteins that support plant growth and stress recovery",
    symbol: "Amino acids"
  },
  { 
    name: "Kelp/Seaweed", 
    description: "Natural biostimulant rich in growth hormones and trace elements",
    symbol: "Kelp"
  },
  { 
    name: "Vitamin B12", 
    description: "Essential vitamin that supports plant metabolism and growth",
    symbol: "Vitamin B12"
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
  },
  {
    name: "Organic Biostimulants",
    description: "Natural compounds that enhance plant growth and stress tolerance",
    nutrients: ["Fulvic acid", "Humic acid", "Amino acids", "Kelp"]
  },
  {
    name: "Complete Nutrition",
    description: "Comprehensive blend of macro, micro, and organic nutrients",
    nutrients: ["N", "P", "K", "Ca", "Mg", "S", "Fe", "Zn", "Mn", "Cu", "B", "Mo"]
  }
]; 