/**
 * Console script to find specific spell IDs by name
 * 
 * Usage in Foundry console:
 * 1. Open browser console (F12)
 * 2. Copy/paste this entire script
 * 3. Results will show spell IDs for the spells we need
 */

(async function findSpellIds() {
  console.log("=== FINDING SPELL IDs FOR WAND SYSTEM ===\n");
  
  const spellsPack = game.packs.get('D35E.spells');
  if (!spellsPack) {
    console.error("D35E.spells compendium not found!");
    return;
  }
  
  // Spells we need to find
  const neededSpells = [
    // Arcane Level 0
    'Detect Magic', 'Read Magic', 'Light',
    // Arcane Level 1
    'Mage Armor', 'Shield', 'Magic Missile', 'Identify', 'Grease',
    'Expeditious Retreat', 'Protection from Evil', 'Enlarge Person',
    // Arcane Level 2
    'Invisibility', 'Mirror Image', 'Scorching Ray', 'Glitterdust',
    'Web', 'Resist Energy',
    // Arcane Level 3
    'Fireball', 'Lightning Bolt', 'Haste', 'Fly', 'Dispel Magic', 'Displacement',
    // Divine Level 1
    'Cure Light Wounds', 'Bless', 'Divine Favor', 'Shield of Faith', 'Remove Fear',
    // Divine Level 2
    'Cure Moderate Wounds', 'Lesser Restoration', "Bull's Strength",
    // Divine Level 3
    'Cure Serious Wounds', 'Remove Disease', 'Prayer'
  ];
  
  await spellsPack.getIndex();
  
  const foundSpells = {};
  const notFound = [];
  
  for (const spellName of neededSpells) {
    const entry = spellsPack.index.find(e => 
      e.name.toLowerCase() === spellName.toLowerCase()
    );
    
    if (entry) {
      const spell = await spellsPack.getDocument(entry._id);
      const spellData = spell.toObject();
      
      foundSpells[spellName] = {
        id: spellData._id,
        name: spellData.name,
        level: spellData.system?.level || 0,
        school: spellData.system?.school || 'unknown'
      };
    } else {
      notFound.push(spellName);
    }
  }
  
  console.log("=== FOUND SPELLS ===\n");
  console.log("Copy this object into spells.ts:\n");
  console.log(JSON.stringify(foundSpells, null, 2));
  
  if (notFound.length > 0) {
    console.log("\n=== NOT FOUND ===");
    console.log("These spells were not found (check spelling):");
    notFound.forEach(name => console.log(`  - ${name}`));
  }
  
  console.log("\n=== TYPESCRIPT FORMAT ===\n");
  
  // Group by approximate category
  for (const [spellName, data] of Object.entries(foundSpells)) {
    const constName = spellName.toUpperCase()
      .replace(/['\s]/g, '_')
      .replace(/__+/g, '_');
    
    console.log(`  ${constName}: {`);
    console.log(`    id: '${data.id}',`);
    console.log(`    name: '${data.name}',`);
    console.log(`    level: ${data.level},`);
    console.log(`    minCasterLevel: ${Math.max(1, data.level * 2 - 1)},`);
    console.log(`    school: '${data.school}',`);
    console.log(`    description: 'TODO',`);
    console.log(`    tags: ['TODO']`);
    console.log(`  },`);
  }
  
  window.foundSpellIds = foundSpells;
  
  return foundSpells;
})();
