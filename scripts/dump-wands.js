/**
 * Console script to dump wand data from D35E compendium
 * 
 * Usage in Foundry console:
 * 1. Open browser console (F12)
 * 2. Copy/paste this entire script
 * 3. Results will be logged to console
 * 4. Copy the JSON output
 */

(async function dumpWands() {
  console.log("=== DUMPING WANDS FROM D35E.items ===\n");
  
  const itemsPack = game.packs.get('D35E.items');
  if (!itemsPack) {
    console.error("D35E.items compendium not found!");
    return;
  }
  
  // Load the index
  await itemsPack.getIndex();
  
  const wands = [];
  
  // Iterate through all items
  for (const entry of itemsPack.index) {
    const item = await itemsPack.getDocument(entry._id);
    const itemData = item.toObject();
    
    // Check if it's a wand
    if (itemData.type === 'consumable' && 
        itemData.system?.consumableType === 'wand') {
      
      wands.push({
        id: itemData._id,
        name: itemData.name,
        price: itemData.system?.price || 0,
        charges: itemData.system?.uses?.max || 50,
        casterLevel: itemData.system?.cl || 1,
        spellLevel: itemData.system?.level || 1,
        description: itemData.system?.description?.value || ''
      });
    }
  }
  
  // Sort by price
  wands.sort((a, b) => a.price - b.price);
  
  console.log(`Found ${wands.length} wands\n`);
  console.log("=== WANDS BY PRICE ===");
  
  // Group by price ranges
  const budget = {
    cheap: wands.filter(w => w.price <= 1000),      // 750-1000 gp (1st level spells)
    moderate: wands.filter(w => w.price > 1000 && w.price <= 5000),  // 2nd level spells
    expensive: wands.filter(w => w.price > 5000 && w.price <= 15000), // 3rd level spells
    veryExpensive: wands.filter(w => w.price > 15000) // 4th level spells
  };
  
  console.log(`\nCheap (≤1000 gp): ${budget.cheap.length} wands`);
  budget.cheap.forEach(w => console.log(`  ${w.name} - ${w.price} gp (CL ${w.casterLevel}, SL ${w.spellLevel})`));
  
  console.log(`\nModerate (1001-5000 gp): ${budget.moderate.length} wands`);
  budget.moderate.forEach(w => console.log(`  ${w.name} - ${w.price} gp (CL ${w.casterLevel}, SL ${w.spellLevel})`));
  
  console.log(`\nExpensive (5001-15000 gp): ${budget.expensive.length} wands`);
  budget.expensive.forEach(w => console.log(`  ${w.name} - ${w.price} gp (CL ${w.casterLevel}, SL ${w.spellLevel})`));
  
  console.log(`\nVery Expensive (>15000 gp): ${budget.veryExpensive.length} wands`);
  budget.veryExpensive.forEach(w => console.log(`  ${w.name} - ${w.price} gp (CL ${w.casterLevel}, SL ${w.spellLevel})`));
  
  console.log("\n=== FULL JSON DATA ===");
  console.log(JSON.stringify(wands, null, 2));
  
  return wands;
})();
