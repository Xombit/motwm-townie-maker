/**
 * FOUNDRY VTT CONSOLE SCRIPT
 * Dump all magic items from D35E compendiums
 * 
 * Usage:
 * 1. Open Foundry VTT Developer Console (F12)
 * 2. Copy and paste this entire script
 * 3. Press Enter
 * 4. Copy the output and provide to AI
 * 
 * This script extracts:
 * - Wondrous Items (headbands, belts, cloaks, rings, amulets, etc.)
 * - Rings
 * - Wands
 * - Rods
 * - Staffs
 * - Potions
 * - Scrolls
 */

(async function() {
  console.log('\n=== D35E MAGIC ITEM COMPENDIUM DUMP ===\n');
  
  // Target compendiums
  const compendiumNames = [
    'D35E.magicitems',      // Magic items (main compendium)
    // Backup options if magicitems doesn't have everything:
    'D35E.items',           // Main items compendium
    'D35E.rings',           // Rings specifically
    'D35E.wands',           // Wands
    'D35E.rods',            // Rods
    'D35E.staves'           // Staves/Staffs
  ];
  
  const results = {
    wondrousItems: [],
    rings: [],
    wands: [],
    rods: [],
    staffs: [],
    potions: [],
    scrolls: [],
    other: []
  };
  
  // Process each compendium
  for (const packName of compendiumNames) {
    const pack = game.packs.get(packName);
    if (!pack) {
      console.log(`⚠️  Compendium not found: ${packName}`);
      continue;
    }
    
    console.log(`\n📦 Processing: ${packName}`);
    const documents = await pack.getDocuments();
    console.log(`   Found ${documents.length} items`);
    
    for (const doc of documents) {
      const data = doc.toObject();
      const itemType = data.type;
      const subType = data.system?.subType;
      const slot = data.system?.slot;
      const price = data.system?.price || 0;
      
      // Create basic info object
      const itemInfo = {
        id: data._id,
        name: data.name,
        type: itemType,
        subType: subType,
        slot: slot,
        price: price,
        compendium: packName,
        description: data.system?.description?.value?.substring(0, 200) // First 200 chars
      };
      
      // Categorize by type
      if (itemType === 'loot' && subType === 'wondrous') {
        results.wondrousItems.push(itemInfo);
      } else if (itemType === 'loot' && subType === 'ring') {
        results.rings.push(itemInfo);
      } else if (itemType === 'loot' && subType === 'wand') {
        results.wands.push(itemInfo);
      } else if (itemType === 'loot' && subType === 'rod') {
        results.rods.push(itemInfo);
      } else if (itemType === 'loot' && subType === 'staff') {
        results.staffs.push(itemInfo);
      } else if (itemType === 'consumable' && subType === 'potion') {
        results.potions.push(itemInfo);
      } else if (itemType === 'consumable' && subType === 'scroll') {
        results.scrolls.push(itemInfo);
      } else if (price > 0) {
        // Other magic items with prices
        results.other.push(itemInfo);
      }
    }
  }
  
  // Sort by slot and price for wondrous items
  results.wondrousItems.sort((a, b) => {
    if (a.slot !== b.slot) return (a.slot || 'none').localeCompare(b.slot || 'none');
    return a.price - b.price;
  });
  
  // Sort others by price
  results.rings.sort((a, b) => a.price - b.price);
  results.wands.sort((a, b) => a.price - b.price);
  results.rods.sort((a, b) => a.price - b.price);
  results.staffs.sort((a, b) => a.price - b.price);
  
  // Print results
  console.log('\n\n=== RESULTS ===\n');
  
  console.log(`\n📿 WONDROUS ITEMS: ${results.wondrousItems.length}`);
  const itemsBySlot = {};
  results.wondrousItems.forEach(item => {
    const slot = item.slot || 'slotless';
    if (!itemsBySlot[slot]) itemsBySlot[slot] = [];
    itemsBySlot[slot].push(item);
  });
  
  for (const [slot, items] of Object.entries(itemsBySlot).sort()) {
    console.log(`\n  ${slot.toUpperCase()} (${items.length} items):`);
    items.slice(0, 10).forEach(item => {
      console.log(`    - ${item.name} (${item.price} gp) [${item.id}]`);
    });
    if (items.length > 10) {
      console.log(`    ... and ${items.length - 10} more`);
    }
  }
  
  console.log(`\n\n💍 RINGS: ${results.rings.length}`);
  results.rings.slice(0, 20).forEach(item => {
    console.log(`  - ${item.name} (${item.price} gp) [${item.id}]`);
  });
  if (results.rings.length > 20) {
    console.log(`  ... and ${results.rings.length - 20} more`);
  }
  
  console.log(`\n\n🪄 WANDS: ${results.wands.length}`);
  console.log(`  (Showing first 10, most are spell wands)`);
  results.wands.slice(0, 10).forEach(item => {
    console.log(`  - ${item.name} (${item.price} gp) [${item.id}]`);
  });
  
  console.log(`\n\n📜 RODS: ${results.rods.length}`);
  results.rods.slice(0, 15).forEach(item => {
    console.log(`  - ${item.name} (${item.price} gp) [${item.id}]`);
  });
  if (results.rods.length > 15) {
    console.log(`  ... and ${results.rods.length - 15} more`);
  }
  
  console.log(`\n\n🌿 STAFFS: ${results.staffs.length}`);
  results.staffs.forEach(item => {
    console.log(`  - ${item.name} (${item.price} gp) [${item.id}]`);
  });
  
  console.log(`\n\n🧪 POTIONS: ${results.potions.length}`);
  console.log(`  (Typically temporary buffs, showing first 10)`);
  results.potions.slice(0, 10).forEach(item => {
    console.log(`  - ${item.name} (${item.price} gp) [${item.id}]`);
  });
  
  console.log(`\n\n📋 OTHER MAGIC ITEMS: ${results.other.length}`);
  console.log(`  (Items with prices that don't fit other categories)`);
  results.other.slice(0, 10).forEach(item => {
    console.log(`  - ${item.name} (${item.price} gp) [${item.id}] - ${item.type}/${item.subType}`);
  });
  
  console.log('\n\n=== JSON DATA (for AI processing) ===\n');
  console.log(JSON.stringify(results, null, 2));
  
  console.log('\n\n=== SUMMARY ===');
  console.log(`Total Wondrous Items: ${results.wondrousItems.length}`);
  console.log(`Total Rings: ${results.rings.length}`);
  console.log(`Total Wands: ${results.wands.length}`);
  console.log(`Total Rods: ${results.rods.length}`);
  console.log(`Total Staffs: ${results.staffs.length}`);
  console.log(`Total Potions: ${results.potions.length}`);
  console.log(`Total Other: ${results.other.length}`);
  console.log(`GRAND TOTAL: ${
    results.wondrousItems.length + 
    results.rings.length + 
    results.wands.length + 
    results.rods.length + 
    results.staffs.length + 
    results.potions.length + 
    results.other.length
  }`);
  
  console.log('\n=== DUMP COMPLETE ===\n');
  console.log('Copy the JSON data above and provide it to the AI.');
  console.log('Focus on the "Big Six" items for initial implementation:');
  console.log('  1. Headband (Int/Wis/Cha boost) - slot: headband');
  console.log('  2. Belt (Str/Dex/Con boost) - slot: belt');
  console.log('  3. Cloak of Resistance (+1 to +5 saves) - slot: shoulders');
  console.log('  4. Ring of Protection (+1 to +5 AC) - slot: ring');
  console.log('  5. Amulet of Natural Armor (+1 to +5) - slot: neck');
  console.log('  6. Weapon/Armor enhancements - DONE ✓');
  
  return results;
})();
