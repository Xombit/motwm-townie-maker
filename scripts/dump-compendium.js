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
// DUMP RODS AND STAVES
// =============================================================================
async function dumpRodsAndStaves() {
  console.log('Searching for rods and staves in D35E.magicitems compendium...');
  
  const pack = game.packs.get('D35E.magicitems');
  if (!pack) {
    console.error('D35E.magicitems compendium not found!');
    return;
  }

  const documents = await pack.getDocuments();
  
  // Find all rods
  const rods = documents.filter(doc => {
    const name = doc.name?.toLowerCase() || '';
    return name.includes('rod of') || name.includes('rod,') || 
           (name.includes('metamagic') && name.includes('rod'));
  });
  
  // Find all staves
  const staves = documents.filter(doc => {
    const name = doc.name?.toLowerCase() || '';
    return name.includes('staff of') || name.includes('staff,');
  });

  // Build output string
  let output = '\n// ========== RODS (' + rods.length + ') ==========\n';
  
  // Sort by price
  rods.sort((a, b) => (a.system?.price || 0) - (b.system?.price || 0));
  
  for (const item of rods) {
    output += `{ id: '${item._id}', name: '${item.name}', price: ${item.system?.price || 0} },\n`;
  }

  output += '\n// ========== STAVES (' + staves.length + ') ==========\n';
  
  // Sort by price
  staves.sort((a, b) => (a.system?.price || 0) - (b.system?.price || 0));
  
  for (const item of staves) {
    output += `{ id: '${item._id}', name: '${item.name}', price: ${item.system?.price || 0} },\n`;
  }

  // Just log the output - user can select and copy from console
  console.log('\n\n====== COPY EVERYTHING BELOW THIS LINE ======\n');
  console.log(output);
  console.log('\n====== COPY EVERYTHING ABOVE THIS LINE ======\n');
  console.log('TIP: Right-click on the output above and select "Copy string contents"');
  console.log('Or select the text and press Ctrl+C');
  
  return output;
}

// =============================================================================
// DUMP RACES (only the ones we have artwork for)
// =============================================================================
async function dumpRaces() {
  console.log('Fetching races from D35E.racialfeatures compendium...');
  
  const pack = game.packs.get('D35E.racialfeatures');
  if (!pack) {
    console.error('D35E.racialfeatures compendium not found!');
    return;
  }

  const documents = await pack.getDocuments();
  console.log('Found ' + documents.length + ' racial features');
  
  // Only the races we have artwork for
  const targetRaces = [
    'Human',
    'Dwarf', 'Dwarf, Mountain', 'Dwarf, Hill',
    'Gnome', 'Gnome, Rock',
    'Halfling', 'Halfling, Lightfoot', 'Halfling, Strongheart',
    'Elf', 'Elf, High', 'Elf, Wood', 'Elf, Drow', 'Drow',
    'Half-Elf',
    'Half-Orc',
    'Aasimar',
    'Tiefling'
  ];

  let output = '// RACES from D35E.racialfeatures\n';
  output += '// Only races we have artwork for\n';
  output += 'export const RACE_IDS: Record<string, string> = {\n';
  
  const foundRaces = [];
  for (const doc of documents) {
    // Check if this race matches any of our targets
    const isTarget = targetRaces.some(target => 
      doc.name === target || 
      doc.name.toLowerCase() === target.toLowerCase()
    );
    
    if (isTarget) {
      foundRaces.push(doc);
      const safeName = doc.name.replace(/'/g, "\\'");
      output += `  '${safeName}': '${doc._id}',\n`;
    }
  }
  
  output += '};\n';

  console.log('Found ' + foundRaces.length + ' matching races');
  console.log('\n\n====== COPY EVERYTHING BELOW THIS LINE ======\n');
  console.log(output);
  console.log('\n====== COPY EVERYTHING ABOVE THIS LINE ======\n');
  
  // Also show what we're missing
  const foundNames = foundRaces.map(r => r.name);
  const missing = targetRaces.filter(t => !foundNames.some(f => f === t || f.toLowerCase() === t.toLowerCase()));
  if (missing.length > 0) {
    console.log('MISSING RACES (not found in compendium):');
    missing.forEach(m => console.log('  - ' + m));
  }
  
  return foundRaces;
}

// =============================================================================
// DUMP CLASSES (only the ones we have artwork for)
// =============================================================================
async function dumpClasses() {
  console.log('Fetching classes from D35E.classes compendium...');
  
  const pack = game.packs.get('D35E.classes');
  if (!pack) {
    console.error('D35E.classes compendium not found!');
    return;
  }

  const documents = await pack.getDocuments();
  console.log('Found ' + documents.length + ' classes');

  // Only the classes we have artwork for
  const targetClasses = [
    'Fighter', 'Barbarian', 'Monk', 'Paladin', 'Ranger', 'Rogue',
    'Wizard', 'Sorcerer',
    'Cleric', 'Druid', 'Bard',
    'Aristocrat (NPC)', 'Commoner (NPC)', 'Expert (NPC)', 'Adept (NPC)', 'Warrior (NPC)'
  ];

  let output = '// CLASSES from D35E.classes\n';
  output += '// Only classes we have artwork for\n';
  output += 'export const CLASS_IDS: Record<string, string> = {\n';
  
  const foundClasses = [];
  for (const doc of documents) {
    const isTarget = targetClasses.some(target => 
      doc.name === target || 
      doc.name.toLowerCase() === target.toLowerCase()
    );
    
    if (isTarget) {
      foundClasses.push(doc);
      const safeName = doc.name.replace(/'/g, "\\'");
      output += `  '${safeName}': '${doc._id}',\n`;
    }
  }
  
  output += '};\n';

  console.log('Found ' + foundClasses.length + ' matching classes');
  console.log('\n\n====== COPY EVERYTHING BELOW THIS LINE ======\n');
  console.log(output);
  console.log('\n====== COPY EVERYTHING ABOVE THIS LINE ======\n');
  
  // Show what we're missing
  const foundNames = foundClasses.map(c => c.name);
  const missing = targetClasses.filter(t => !foundNames.some(f => f === t || f.toLowerCase() === t.toLowerCase()));
  if (missing.length > 0) {
    console.log('MISSING CLASSES (not found in compendium):');
    missing.forEach(m => console.log('  - ' + m));
  }
  
  return foundClasses;
}

// =============================================================================
// DUMP MUNDANE ITEMS (weapons, armor, gear used in templates)
// =============================================================================
async function dumpMundaneItems() {
  console.log('Fetching mundane items from compendiums...');
  
  // Items we actually use in templates (from grep of templates.ts)
  const targetItems = {
    weapons: [
      'Longsword', 'Shortsword', 'Spear', 'Quarterstaff', 'Light Crossbow',
      'Heavy Mace', 'Rapier', 'Shortbow', 'Longbow', 'Dagger', 'Greatsword',
      'Scimitar', 'Morningstar', 'Sickle', 'Club', 'Greataxe', 'Flail',
      'Javelin', 'Sling', 'Shuriken'
    ],
    armor: [
      'Scale Mail', 'Full Plate', 'Studded Leather', 'Leather Armor', 'Chain Shirt',
      'Chainmail', 'Breastplate', 'Half-Plate', 'Hide Armor', 'Padded Armor'
    ],
    shields: [
      'Heavy Steel Shield', 'Heavy Wooden Shield', 'Light Steel Shield',
      'Light Wooden Shield', 'Buckler', 'Tower Shield'
    ],
    ammo: [
      'Crossbow Bolt', 'Arrow', 'Sling Bullet'
    ],
    gear: [
      'Backpack, Common', 'Bedroll', 'Waterskin', 'Rations, Trail',
      'Rope, hempen, 1m.', 'Rope, Silk (50 ft.)', 'Flint and Steel',
      'Ink', 'Inkpen', 'Grappling Hook', 'Caltrops', 'Torch',
      'Lantern, Hooded', 'Oil', 'Belt Pouch',
      "Entertainer's Outfit", "Traveler's Outfit", "Monk's Outfit"
    ],
    tools: [
      'Spellbook', 'Spell Component Pouch', 'Wooden Holy Symbol',
      'Silver Holy Symbol', "Thieves' Tools", "Healer's Kit",
      "Masterwork Thieves' Tools", "Climber's Kit",
      'Holly and Mistletoe', 'Musical Instrument, Common'
    ]
  };
  
  const allTargets = [
    ...targetItems.weapons,
    ...targetItems.armor,
    ...targetItems.shields,
    ...targetItems.ammo,
    ...targetItems.gear,
    ...targetItems.tools
  ];

  const packs = [
    { name: 'D35E.weapons-and-ammo', label: 'WEAPONS' },
    { name: 'D35E.armors-and-shields', label: 'ARMOR' },
    { name: 'D35E.items', label: 'ITEMS' }
  ];

  let output = '';
  const foundItems = {};
  const allFound = [];
  
  for (const packInfo of packs) {
    const pack = game.packs.get(packInfo.name);
    if (!pack) {
      console.error(packInfo.name + ' compendium not found!');
      continue;
    }

    const documents = await pack.getDocuments();
    console.log('Searching ' + documents.length + ' items in ' + packInfo.name);

    for (const doc of documents) {
      const isTarget = allTargets.some(target => 
        doc.name === target || 
        doc.name.toLowerCase() === target.toLowerCase()
      );
      
      if (isTarget && !foundItems[doc.name]) {
        foundItems[doc.name] = { id: doc._id, pack: packInfo.name };
        allFound.push(doc);
      }
    }
  }
  
  // Output in a single combined format
  output += '// MUNDANE ITEMS from D35E compendiums\n';
  output += '// Weapons, armor, shields, ammo, gear, tools\n';
  output += 'export const MUNDANE_ITEM_IDS: Record<string, string> = {\n';
  
  allFound.sort((a, b) => a.name.localeCompare(b.name));
  
  for (const item of allFound) {
    const safeName = item.name.replace(/'/g, "\\'");
    output += `  '${safeName}': '${item._id}',\n`;
  }
  output += '};\n';

  console.log('Found ' + allFound.length + ' of ' + allTargets.length + ' target items');
  console.log('\n\n====== COPY EVERYTHING BELOW THIS LINE ======\n');
  console.log(output);
  console.log('\n====== COPY EVERYTHING ABOVE THIS LINE ======\n');
  
  // Show what we're missing
  const foundNames = allFound.map(i => i.name);
  const missing = allTargets.filter(t => !foundNames.some(f => f === t || f.toLowerCase() === t.toLowerCase()));
  if (missing.length > 0) {
    console.log('MISSING ITEMS (not found in compendiums):');
    missing.forEach(m => console.log('  - ' + m));
  }
  
  return { foundItems, allFound };
}

// =============================================================================
// DUMP SPELLS (this will be large!)
// =============================================================================
async function dumpSpells() {
  console.log('Fetching spells from D35E.spells compendium...');
  console.log('WARNING: This may take a moment - there are many spells!');
  
  const pack = game.packs.get('D35E.spells');
  if (!pack) {
    console.error('D35E.spells compendium not found!');
    return;
  }

  const documents = await pack.getDocuments();
  console.log('Found ' + documents.length + ' spells');

  let output = '// SPELLS from D35E.spells\n';
  output += '// Format: { name: id }\n';
  output += 'export const SPELL_IDS: Record<string, string> = {\n';
  
  documents.sort((a, b) => a.name.localeCompare(b.name));
  
  for (const spell of documents) {
    // Escape single quotes in spell names
    const safeName = spell.name.replace(/'/g, "\\'");
    output += `  '${safeName}': '${spell._id}',\n`;
  }
  output += '};\n';

  console.log('\n\n====== COPY EVERYTHING BELOW THIS LINE ======\n');
  console.log(output);
  console.log('\n====== COPY EVERYTHING ABOVE THIS LINE ======\n');
  
  return documents;
}

// =============================================================================
// DUMP ALL FOR SPEED OPTIMIZATION (races, classes, mundane items)
// =============================================================================
async function dumpAllForSpeed() {
  console.log('========================================');
  console.log('DUMPING ALL COMPENDIUM IDS FOR SPEED');
  console.log('========================================\n');
  
  let fullOutput = '';
  
  // Get races
  console.log('\n--- RACES ---');
  const races = await dumpRaces();
  
  // Get classes  
  console.log('\n--- CLASSES ---');
  const classes = await dumpClasses();
  
  // Get mundane items
  console.log('\n--- MUNDANE ITEMS ---');
  const items = await dumpMundaneItems();
  
  console.log('\n========================================');
  console.log('DONE! Copy each section from the output above.');
  console.log('========================================');
  
  return { races, classes, items };
}

// =============================================================================
// USAGE INSTRUCTIONS
// =============================================================================
console.log('========================================');
console.log('COMPENDIUM DUMP UTILITIES LOADED');
console.log('========================================');
console.log('');
console.log('=== SPEED OPTIMIZATION (run this!) ===');
console.log('');
console.log('>>> dumpAllForSpeed()');
console.log('    Gets races, classes, and mundane items in one go');
console.log('');
console.log('=== Individual functions ===');
console.log('');
console.log('dumpRaces() - Races we have artwork for');
console.log('dumpClasses() - Classes we have artwork for');
console.log('dumpMundaneItems() - Equipment from templates');
console.log('dumpRodsAndStaves() - Magic rods and staves');
console.log('');
console.log('=== NOT RECOMMENDED (keep lookups) ===');
console.log('');
console.log('dumpSpells() - Too many, keep dynamic lookup');
console.log('');
console.log('========================================');
console.log('QUICK START: Run this command:');
console.log('  dumpAllForSpeed()');
console.log('========================================');;
console.log('========================================');

