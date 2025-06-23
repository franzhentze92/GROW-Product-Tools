const fs = require('fs');
const path = require('path');

// Read the original database file
const inputPath = path.join(__dirname, 'nts_products_database.txt');
const outputPath = path.join(__dirname, 'public', 'nts_products_database.json');

try {
  console.log('Reading database file...');
  const content = fs.readFileSync(inputPath, 'utf8');
  
  console.log('Converting to JSON array format...');
  // Convert to proper JSON array format
  const jsonArray = '[' + content.replace(/}\s*,\s*{/g, '},{') + ']';
  
  console.log('Parsing JSON...');
  // Parse to validate and then stringify with proper formatting
  const products = JSON.parse(jsonArray);
  
  console.log(`✅ Successfully parsed ${products.length} products`);
  
  // Write the properly formatted JSON file
  console.log('Writing JSON file...');
  fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
  
  console.log(`✅ Converted database saved to: ${outputPath}`);
  console.log(`📊 Total products: ${products.length}`);
  
  // Show all product names
  console.log('\n📋 All products:');
  products.forEach((product, index) => {
    console.log(`${index + 1}. ${product.product_name}`);
  });
  
  // Show some statistics
  const liquidProducts = products.filter(p => p.product_form?.toLowerCase().includes('liquid')).length;
  const solidProducts = products.filter(p => p.product_form?.toLowerCase().includes('solid')).length;
  const organicProducts = products.filter(p => p.organic_certified).length;
  
  console.log('\n📈 Statistics:');
  console.log(`- Liquid products: ${liquidProducts}`);
  console.log(`- Solid products: ${solidProducts}`);
  console.log(`- Organic certified: ${organicProducts}`);
  
} catch (error) {
  console.error('❌ Error converting database:', error.message);
  
  if (error.message.includes('Unexpected token')) {
    console.log('\n🔧 Trying alternative parsing method...');
    
    try {
      const content = fs.readFileSync(inputPath, 'utf8');
      const lines = content.split('\n');
      let products = [];
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
            console.warn(`⚠️ Failed to parse product object ${products.length + 1}:`, e.message);
          }
          currentObject = '';
        }
      }
      
      console.log(`✅ Successfully parsed ${products.length} products using alternative method`);
      
      // Write the properly formatted JSON file
      fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
      
      console.log(`✅ Converted database saved to: ${outputPath}`);
      console.log(`📊 Total products: ${products.length}`);
      
      // Show all product names
      console.log('\n📋 All products:');
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.product_name}`);
      });
      
    } catch (altError) {
      console.error('❌ Alternative parsing also failed:', altError.message);
    }
  }
} 