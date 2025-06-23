const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'public', 'nts_products_database.json');
const assetsDir = path.join(__dirname, 'public', 'assets');

// 1. Read all image paths from JSON
function getExpectedImages() {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  return data
    .map(p => p.image)
    .filter(Boolean)
    .map(img => img.replace(/^\/?assets\//, ''));
}

// 2. List all files in public/assets/
function getActualImages() {
  return fs.readdirSync(assetsDir).filter(f => !fs.statSync(path.join(assetsDir, f)).isDirectory());
}

const expected = getExpectedImages();
const actual = getActualImages();

// 3. Compare
function main() {
  const missing = expected.filter(e => !actual.includes(e));
  const extra = actual.filter(a => !expected.includes(a));

  console.log('--- Expected images (from JSON):', expected.length);
  console.log('--- Actual images (in assets/):', actual.length);
  console.log('\nMissing images (referenced in JSON but not found in assets/):');
  if (missing.length === 0) console.log('  None!');
  else missing.forEach(m => console.log('  ' + m));

  console.log('\nExtra images (in assets/ but not referenced in JSON):');
  if (extra.length === 0) console.log('  None!');
  else extra.forEach(e => console.log('  ' + e));

  // 5. Suggest rename/move commands for mismatches
  if (missing.length > 0 && extra.length > 0) {
    console.log('\n--- Suggested rename/move commands (if you spot a match):');
    missing.forEach(miss => {
      // Try to find a close match by ignoring case and extension
      const missBase = miss.replace(/\.[^.]+$/, '').toLowerCase();
      const match = extra.find(e => e.replace(/\.[^.]+$/, '').toLowerCase() === missBase);
      if (match) {
        console.log(`  move \"public/assets/${match}\" \"public/assets/${miss}\"`);
      }
    });
  }
}

main(); 