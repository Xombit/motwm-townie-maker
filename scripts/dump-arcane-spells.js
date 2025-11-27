/**
 * Console script to dump arcane spells (Wizard/Sorcerer) from D35E.spells compendium
 * 
 * Usage in Foundry console:
 * 1. Open browser console (F12)
 * 2. Copy/paste this entire script
 * 3. Results will be logged to console
 * 4. Copy the JSON output
 */

(async function dumpArcaneSpells() {
  console.log("=== DUMPING ARCANE SPELLS FROM D35E.spells ===\n");
  
  const spellsPack = game.packs.get('D35E.spells');
  if (!spellsPack) {
    console.error("D35E.spells compendium not found!");
    return;
  }
  
  // Load the index
  await spellsPack.getIndex();
  
  const arcaneSpells = [];
  
  // Iterate through all spells
  for (const entry of spellsPack.index) {
    const spell = await spellsPack.getDocument(entry._id);
    const spellData = spell.toObject();
    
    // Check if it's a wizard or sorcerer spell
    const learnedAt = spellData.system?.learnedAt || {};
    
    let wizardLevel = null;
    let sorcererLevel = null;
    
    // learnedAt.class is an array of [ClassName, Level] tuples
    if (learnedAt.class && Array.isArray(learnedAt.class)) {
      for (const classEntry of learnedAt.class) {
        if (Array.isArray(classEntry) && classEntry.length >= 2) {
          const className = classEntry[0];
          const level = classEntry[1];
          const lowerClass = className.toLowerCase();
          
          if (lowerClass.includes('wizard') || lowerClass === 'wiz') {
            wizardLevel = level;
          }
          if (lowerClass.includes('sorcerer') || lowerClass === 'sor') {
            sorcererLevel = level;
          }
        }
      }
    }
    
    // If it's available to wizard or sorcerer, add it
    if (wizardLevel !== null || sorcererLevel !== null) {
      arcaneSpells.push({
        id: spellData._id,
        name: spellData.name,
        wizardLevel: wizardLevel,
        sorcererLevel: sorcererLevel,
        level: spellData.system?.level || 0,  // Overall spell level
        school: spellData.system?.school || 'unknown',
        subschool: spellData.system?.subschool || '',
        types: spellData.system?.types || '',
        components: spellData.system?.components || {},
        castTime: spellData.system?.activation?.type || '',
        range: spellData.system?.range?.units || '',
        target: spellData.system?.target?.value || '',
        duration: spellData.system?.spellDuration || '',
        savingThrow: spellData.system?.save?.description || '',
        sr: spellData.system?.sr || false,
        description: spellData.system?.description?.value || '',
        shortDescription: spellData.system?.shortDescription || '',
        snip: spellData.system?.snip || ''
      });
    }
  }
  
  console.log(`Found ${arcaneSpells.length} arcane spells\n`);
  
  // Group by spell level
  const byLevel = {
    0: arcaneSpells.filter(s => (s.wizardLevel === 0 || s.sorcererLevel === 0)),
    1: arcaneSpells.filter(s => (s.wizardLevel === 1 || s.sorcererLevel === 1)),
    2: arcaneSpells.filter(s => (s.wizardLevel === 2 || s.sorcererLevel === 2)),
    3: arcaneSpells.filter(s => (s.wizardLevel === 3 || s.sorcererLevel === 3)),
    4: arcaneSpells.filter(s => (s.wizardLevel === 4 || s.sorcererLevel === 4)),
    5: arcaneSpells.filter(s => (s.wizardLevel === 5 || s.sorcererLevel === 5)),
    6: arcaneSpells.filter(s => (s.wizardLevel === 6 || s.sorcererLevel === 6)),
    7: arcaneSpells.filter(s => (s.wizardLevel === 7 || s.sorcererLevel === 7)),
    8: arcaneSpells.filter(s => (s.wizardLevel === 8 || s.sorcererLevel === 8)),
    9: arcaneSpells.filter(s => (s.wizardLevel === 9 || s.sorcererLevel === 9))
  };
  
  console.log("=== SPELLS BY LEVEL ===");
  for (let level = 0; level <= 9; level++) {
    const spells = byLevel[level];
    console.log(`\nLevel ${level}: ${spells.length} spells`);
    
    // Show first 10 of each level as examples
    spells.slice(0, 10).forEach(s => {
      const wizInfo = s.wizardLevel !== null ? `Wiz ${s.wizardLevel}` : '';
      const sorInfo = s.sorcererLevel !== null ? `Sor ${s.sorcererLevel}` : '';
      const classInfo = [wizInfo, sorInfo].filter(x => x).join(', ');
      console.log(`  ${s.name} (${classInfo}) - ${s.school}`);
    });
    
    if (spells.length > 10) {
      console.log(`  ... and ${spells.length - 10} more`);
    }
  }
  
  // Show some key utility spells
  console.log("\n=== KEY UTILITY SPELLS ===");
  const utilitySpells = [
    'Mage Armor', 'Shield', 'Magic Missile', 'Identify', 
    'Detect Magic', 'Read Magic', 'Prestidigitation',
    'Mirror Image', 'Invisibility', 'Fly', 'Haste',
    'Fireball', 'Lightning Bolt', 'Dispel Magic',
    'Dimension Door', 'Greater Invisibility', 'Stoneskin',
    'Teleport', 'Wall of Force', 'Cone of Cold'
  ];
  
  utilitySpells.forEach(spellName => {
    const spell = arcaneSpells.find(s => s.name.toLowerCase() === spellName.toLowerCase());
    if (spell) {
      const wizInfo = spell.wizardLevel !== null ? `Wiz ${spell.wizardLevel}` : '';
      const sorInfo = spell.sorcererLevel !== null ? `Sor ${spell.sorcererLevel}` : '';
      const classInfo = [wizInfo, sorInfo].filter(x => x).join(', ');
      console.log(`  ${spell.name} (${classInfo}) - ${spell.school}`);
    }
  });
  
  console.log("\n=== FULL JSON DATA (First 50 spells as sample) ===");
  console.log(JSON.stringify(arcaneSpells.slice(0, 50), null, 2));
  
  console.log("\n=== To get full data, run: ===");
  console.log("copy(JSON.stringify(window.arcaneSpellsData, null, 2))");
  
  // Make available globally for copying
  window.arcaneSpellsData = arcaneSpells;
  
  console.log("\n=== Data saved to window.arcaneSpellsData ===");
  console.log(`Use: copy(JSON.stringify(window.arcaneSpellsData, null, 2))`);
  console.log("Then paste the result into a file");
  
  return arcaneSpells;
})();
