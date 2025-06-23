const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('public/nts_products_database.json', 'utf8'));
  console.log('✅ JSON is valid');
  console.log('Number of products:', data.length);
  console.log('\nAll product names:');
  data.forEach((p, i) => console.log(`${i+1}. ${p.product_name}`));
} catch(e) {
  console.log('❌ JSON error:', e.message);
} 