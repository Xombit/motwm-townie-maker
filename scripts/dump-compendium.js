/**
 * FOUNDRY CONSOLE SCRIPT
 * Run this in the Foundry VTT console (F12) to dump compendium contents
 * 
 * Instructions:
 * 1. Open Foundry VTT
 * 2. Press F12 to open browser console
 * 3. Copy and paste the desired function below
 * 4. Results will be logged to console and copied to clipboard
 */

// =============================================================================
// DUMP MAGIC ITEMS COMPENDIUM
// =============================================================================
async function dumpMagicItems() {
  console.log('Fetching magic items from D35E.magicitems compendium...');
  
  const pack = game.packs.get('D35E.magicitems');
  if (!pack) {
    console.error('D35E.magicitems compendium not found!');
    return;
  }

  const documents = await pack.getDocuments();
  console.log('Found ' + documents.length + ' items in compendium');

  // Group by type
  const itemsByType = {};
  
  for (const doc of documents) {
    const type = doc.type || 'unknown';
    if (!itemsByType[type]) {
      itemsByType[type] = [];
    }
    
    itemsByType[type].push({
      name: doc.name,
      id: doc._id,
      type: doc.type,
      subType: doc.system?.subType || doc.system?.equipmentType || '',
      slot: doc.system?.slot || '',
      price: doc.system?.price || 0
    });
  }

  // Sort and display
  console.log('\n========== MAGIC ITEMS BY TYPE ==========\n');
  
  let output = '';
  for (const [type, items] of Object.entries(itemsByType)) {
    console.log('\n=== ' + type.toUpperCase() + ' (' + items.length + ') ===');
    output += '\n=== ' + type.toUpperCase() + ' (' + items.length + ') ===\n';
    
    items.sort((a, b) => a.name.localeCompare(b.name));
    
    for (const item of items) {
      const line = '  ' + item.name + ' | ID: ' + item.id + ' | Slot: ' + (item.slot || 'none') + ' | Price: ' + item.price + ' gp';
      console.log(line);
      output += line + '\n';
    }
  }

  // Copy to clipboard
  navigator.clipboard.writeText(output);
  console.log('\n>>> Output copied to clipboard!');
  
  return itemsByType;
}

// =============================================================================
// SEARCH MAGIC ITEMS BY NAME
// =============================================================================
async function searchMagicItems(searchTerm) {
  console.log('Searching for: "' + searchTerm + '"');
  
  const pack = game.packs.get('D35E.magicitems');
  if (!pack) {
    console.error('D35E.magicitems compendium not found!');
    return;
  }

  const documents = await pack.getDocuments();
  const regex = new RegExp(searchTerm, 'i');
  
  const matches = documents.filter(doc => regex.test(doc.name));
  
  console.log('\nFound ' + matches.length + ' matches:');
  for (const doc of matches) {
    console.log('  ' + doc.name + ' (' + doc._id + ')');
    console.log('    Type: ' + doc.type + ', Slot: ' + (doc.system?.slot || 'none') + ', Price: ' + (doc.system?.price || 0) + ' gp');
  }
  
  return matches;
}

// =============================================================================
// DUMP WONDROUS ITEMS ONLY
// =============================================================================
async function dumpWondrousItems() {
  console.log('Fetching wondrous items from D35E.magicitems compendium...');
  
  const pack = game.packs.get('D35E.magicitems');
  if (!pack) {
    console.error('D35E.magicitems compendium not found!');
    return;
  }

  const documents = await pack.getDocuments();
  const wondrousItems = documents.filter(doc => 
    doc.type === 'loot' && 
    doc.system?.subType === 'wondrous'
  );

  console.log('\nFound ' + wondrousItems.length + ' wondrous items:');
  
  let output = 'WONDROUS ITEMS:\n\n';
  
  // Sort by price
  wondrousItems.sort((a, b) => (a.system?.price || 0) - (b.system?.price || 0));
  
  for (const item of wondrousItems) {
    const line = item.name.padEnd(50) + ' | ' + item._id + ' | Slot: ' + (item.system?.slot || 'none').padEnd(10) + ' | ' + (item.system?.price || 0) + ' gp';
    console.log(line);
    output += line + '\n';
  }

  navigator.clipboard.writeText(output);
  console.log('\n>>> Output copied to clipboard!');
  
  return wondrousItems;
}

// =============================================================================
// DUMP SPECIFIC UTILITY ITEMS WE'RE LOOKING FOR
// =============================================================================
async function findUtilityItems() {
  console.log('Searching for specific utility items...');
  
  const pack = game.packs.get('D35E.magicitems');
  if (!pack) {
    console.error('D35E.magicitems compendium not found!');
    return;
  }

  const documents = await pack.getDocuments();
  
  const searchTerms = [
    'handy haversack',
    'bag of holding',
    'boots of speed',
    'boots of striding',
    'slippers of spider',
    'eyes of the eagle',
    'goggles of night',
    'bracers of armor',
    'gloves of dexterity',
    'boots of teleportation',
    'pearl of power',
    'scarab of protection',
    'cloak of resistance',
    'ring of protection',
    'amulet of natural',
    'belt of',
    'headband of',
    'gauntlets of ogre'
  ];

  console.log('\n========== UTILITY ITEMS SEARCH ==========\n');
  let output = '';
  
  for (const term of searchTerms) {
    const regex = new RegExp(term, 'i');
    const matches = documents.filter(doc => regex.test(doc.name));
    
    if (matches.length > 0) {
      console.log('\n--- "' + term + '" (' + matches.length + ' matches) ---');
      output += '\n--- "' + term + '" (' + matches.length + ' matches) ---\n';
      
      for (const item of matches) {
        const line = '  ' + item.name + ' | ' + item._id + ' | ' + (item.system?.price || 0) + ' gp';
        console.log(line);
        output += line + '\n';
      }
    }
  }

  navigator.clipboard.writeText(output);
  console.log('\n>>> Output copied to clipboard!');
  
  return output;
}

// =============================================================================
// USAGE INSTRUCTIONS
// =============================================================================
console.log('========================================');
console.log('COMPENDIUM DUMP UTILITIES LOADED');
console.log('========================================');
console.log('');
console.log('Available functions:');
console.log('');
console.log('1. dumpMagicItems()');
console.log('   - Dumps ALL magic items grouped by type');
console.log('   - Copies output to clipboard');
console.log('');
console.log('2. dumpWondrousItems()');
console.log('   - Dumps only wondrous items');
console.log('   - Sorted by price');
console.log('   - Copies output to clipboard');
console.log('');
console.log('3. searchMagicItems("search term")');
console.log('   - Search for items by name');
console.log('   - Example: searchMagicItems("boots")');
console.log('');
console.log('4. findUtilityItems()');
console.log('   - Searches for specific utility items we need');
console.log('   - Copies output to clipboard');
console.log('   - RECOMMENDED: Run this first!');
console.log('');
console.log('========================================');
console.log('QUICK START: Run this command now:');
console.log('  findUtilityItems()');
console.log('========================================');

