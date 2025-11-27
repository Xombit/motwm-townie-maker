/**
 * FOUNDRY VTT CONSOLE SCRIPT - SIMPLIFIED VERSION
 * Dump magic items from D35E.magicitems compendium
 * 
 * Usage:
 * 1. Open Foundry VTT Developer Console (F12)
 * 2. Copy and paste this entire script
 * 3. Press Enter
 * 4. Copy the JSON output and provide to AI
 */

(async function() {
  console.log('\n=== D35E MAGIC ITEMS DUMP (Simple Version) ===\n');
  
  const packName = 'D35E.magicitems';
  const pack = game.packs.get(packName);
  
  if (!pack) {
    console.error(`❌ Compendium not found: ${packName}`);
    console.log('\nAvailable compendiums:');
    game.packs.forEach(p => console.log(`  - ${p.collection}`));
    return;
  }
  
  console.log(`📦 Loading items from ${packName}...`);
  const documents = await pack.getDocuments();
  console.log(`✓ Found ${documents.length} items\n`);
  
  const results = {
    bySlot: {},
    byType: {},
    bigSix: {
      headbands: [],
      belts: [],
      cloaks: [],
      rings: [],
      amulets: [],
      other: []
    },
    allItems: []
  };
  
  // Process each item
  for (const doc of documents) {
    const data = doc.toObject();
    const itemInfo = {
      id: data._id,
      name: data.name,
      type: data.type,
      subType: data.system?.subType || 'none',
      slot: data.system?.slot || 'slotless',
      price: data.system?.price || 0,
      enhancement: data.system?.enh || 0
    };
    
    results.allItems.push(itemInfo);
    
    // Group by slot
    if (!results.bySlot[itemInfo.slot]) {
      results.bySlot[itemInfo.slot] = [];
    }
    results.bySlot[itemInfo.slot].push(itemInfo);
    
    // Group by type
    const typeKey = `${itemInfo.type}/${itemInfo.subType}`;
    if (!results.byType[typeKey]) {
      results.byType[typeKey] = [];
    }
    results.byType[typeKey].push(itemInfo);
    
    // Identify "Big Six" items
    const nameLower = data.name.toLowerCase();
    
    if (nameLower.includes('headband')) {
      results.bigSix.headbands.push(itemInfo);
    } else if (nameLower.includes('belt')) {
      results.bigSix.belts.push(itemInfo);
    } else if (nameLower.includes('cloak of resistance')) {
      results.bigSix.cloaks.push(itemInfo);
    } else if (nameLower.includes('ring of protection')) {
      results.bigSix.rings.push(itemInfo);
    } else if (nameLower.includes('amulet of natural armor')) {
      results.bigSix.amulets.push(itemInfo);
    } else if (itemInfo.price > 1000 && itemInfo.slot !== 'slotless') {
      results.bigSix.other.push(itemInfo);
    }
  }
  
  // Sort by price
  Object.values(results.bySlot).forEach(arr => arr.sort((a, b) => a.price - b.price));
  Object.values(results.bigSix).forEach(arr => arr.sort((a, b) => a.price - b.price));
  
  // Print summary
  console.log('=== SUMMARY BY SLOT ===\n');
  const sortedSlots = Object.keys(results.bySlot).sort();
  for (const slot of sortedSlots) {
    const items = results.bySlot[slot];
    console.log(`${slot} (${items.length} items):`);
    items.slice(0, 5).forEach(item => {
      console.log(`  - ${item.name} (${item.price} gp) [${item.id}]`);
    });
    if (items.length > 5) {
      console.log(`  ... and ${items.length - 5} more`);
    }
    console.log('');
  }
  
  console.log('\n=== BIG SIX ITEMS ===\n');
  
  console.log(`Headbands (${results.bigSix.headbands.length}):`);
  results.bigSix.headbands.forEach(item => {
    console.log(`  - ${item.name} (${item.price} gp) [${item.id}]`);
  });
  
  console.log(`\nBelts (${results.bigSix.belts.length}):`);
  results.bigSix.belts.forEach(item => {
    console.log(`  - ${item.name} (${item.price} gp) [${item.id}]`);
  });
  
  console.log(`\nCloaks of Resistance (${results.bigSix.cloaks.length}):`);
  results.bigSix.cloaks.forEach(item => {
    console.log(`  - ${item.name} (${item.price} gp) [${item.id}]`);
  });
  
  console.log(`\nRings of Protection (${results.bigSix.rings.length}):`);
  results.bigSix.rings.forEach(item => {
    console.log(`  - ${item.name} (${item.price} gp) [${item.id}]`);
  });
  
  console.log(`\nAmulets of Natural Armor (${results.bigSix.amulets.length}):`);
  results.bigSix.amulets.forEach(item => {
    console.log(`  - ${item.name} (${item.price} gp) [${item.id}]`);
  });
  
  console.log('\n\n=== JSON OUTPUT (COPY THIS) ===\n');
  console.log(JSON.stringify(results, null, 2));
  
  console.log('\n\n=== COMPLETE ===');
  console.log(`Total items processed: ${documents.length}`);
  console.log(`\nCopy the JSON data above and paste it in your conversation.`);
  
  return results;
})();
