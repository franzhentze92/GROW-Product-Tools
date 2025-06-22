// Script to display the NTS Fertilizer Database
import { fertilizerProducts } from './src/data/fertilizerProducts.js';
import { nutrients, nutrientCombinations } from './src/data/nutrients.js';
import { applicationMethods } from './src/data/applicationMethods.js';

console.log('🌾 NTS FERTILIZER PRODUCT DATABASE 🌾\n');
console.log('=' .repeat(60));

// Display all products
console.log('\n📦 ALL FERTILIZER PRODUCTS:\n');
fertilizerProducts.forEach((product, index) => {
  console.log(`${index + 1}. ${product.product_name}`);
  console.log(`   Nutrients: ${product.nutrients.join(', ')}`);
  console.log(`   Form: ${product.product_form}`);
  console.log(`   Application: ${product.application.join(', ')}`);
  console.log(`   Organic: ${product.organic_certified ? 'Yes' : 'No'}`);
  console.log(`   Description: ${product.description}`);
  console.log(`   Benefits: ${product.benefits.join(', ')}`);
  console.log(`   Image: ${product.image}`);
  console.log(`   Link: ${product.link}`);
  console.log('');
});

// Display products by form
console.log('\n🥤 LIQUID PRODUCTS:\n');
const liquidProducts = fertilizerProducts.filter(p => p.product_form === 'Liquid');
liquidProducts.forEach(product => {
  console.log(`• ${product.product_name} - ${product.nutrients.join(', ')}`);
});

console.log('\n🧂 POWDER PRODUCTS:\n');
const powderProducts = fertilizerProducts.filter(p => p.product_form === 'Powder');
powderProducts.forEach(product => {
  console.log(`• ${product.product_name} - ${product.nutrients.join(', ')}`);
});

// Display products by nutrient
console.log('\n🔬 PRODUCTS BY NUTRIENT:\n');
const allNutrients = nutrients.map(n => n.symbol);
allNutrients.forEach(nutrient => {
  const productsWithNutrient = fertilizerProducts.filter(p => p.nutrients.includes(nutrient));
  if (productsWithNutrient.length > 0) {
    console.log(`${nutrient}: ${productsWithNutrient.map(p => p.product_name).join(', ')}`);
  }
});

// Display nutrient combinations
console.log('\n🔗 NUTRIENT COMBINATIONS:\n');
nutrientCombinations.forEach(combo => {
  console.log(`• ${combo.name}`);
  console.log(`  Description: ${combo.description}`);
  console.log(`  Nutrients: ${combo.nutrients.join(', ')}`);
  console.log('');
});

// Display application methods
console.log('\n🌱 APPLICATION METHODS:\n');
applicationMethods.forEach(method => {
  console.log(`• ${method.name}: ${method.description}`);
  console.log(`  Methods: ${method.methods.join(', ')}`);
  console.log('');
});

// Statistics
console.log('\n📊 DATABASE STATISTICS:\n');
console.log(`Total Products: ${fertilizerProducts.length}`);
console.log(`Liquid Products: ${liquidProducts.length}`);
console.log(`Powder Products: ${powderProducts.length}`);
console.log(`Organic Products: ${fertilizerProducts.filter(p => p.organic_certified).length}`);
console.log(`Non-Organic Products: ${fertilizerProducts.filter(p => !p.organic_certified).length}`);

// Available nutrients
const availableNutrients = [...new Set(fertilizerProducts.flatMap(p => p.nutrients))];
console.log(`Available Nutrients: ${availableNutrients.join(', ')}`);

// Missing nutrients
const missingNutrients = allNutrients.filter(n => !availableNutrients.includes(n));
if (missingNutrients.length > 0) {
  console.log(`Missing Nutrients: ${missingNutrients.join(', ')}`);
}

console.log('\n' + '=' .repeat(60));
console.log('✅ Database display complete!'); 