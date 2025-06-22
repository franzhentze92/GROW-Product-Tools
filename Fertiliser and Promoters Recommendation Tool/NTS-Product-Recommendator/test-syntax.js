// Test script to validate fertilizer products database
const fs = require('fs');
const path = require('path');

try {
  // Read the file content
  const filePath = path.join(__dirname, 'src', 'data', 'fertilizerProducts.js');
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Try to evaluate the content as JavaScript
  const moduleExports = {};
  const module = { exports: moduleExports };
  
  // Create a safe evaluation environment
  const evalCode = `
    (function(module, exports) {
      ${content}
      return module.exports;
    })
  `;
  
  const result = eval(evalCode)(module, moduleExports);
  
  if (result && result.fertilizerProducts) {
    const products = result.fertilizerProducts;
    console.log('✅ Syntax validation successful!');
    console.log(`📊 Total products: ${products.length}`);
    console.log('📋 Product names:');
    products.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.product_name}`);
    });
    
    // Check image paths
    const validImagePaths = products.every(product => 
      product.image && product.image.startsWith('/Fertiliser Images/')
    );
    
    if (validImagePaths) {
      console.log('✅ All image paths are correct!');
    } else {
      console.log('❌ Some image paths are incorrect!');
    }
    
  } else {
    console.log('❌ No fertilizerProducts found in the file');
  }
  
} catch (error) {
  console.log('❌ Syntax error:', error.message);
} 