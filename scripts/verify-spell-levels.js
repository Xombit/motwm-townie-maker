/**
 * Script to verify spell levels match our definitions
 * Run in Foundry console to check actual spell levels
 */

(async function verifySpellLevels() {
  const spellsPack = game.packs.get('D35E.spells');
  if (!spellsPack) {
    console.error("D35E.spells compendium not found!");
    return;
  }
  
  // Spells we defined and their expected levels
  const spellsToVerify = {
    // Arcane Level 0
    'VQ0QrFKM2yYHt9lm': { name: 'Detect Magic', expectedLevel: 0 },
    'TPjZCWxk1iXsJpqj': { name: 'Read Magic', expectedLevel: 0 },
    '6vRdB7yfgB8WjzKF': { name: 'Light', expectedLevel: 0 },
    
    // Arcane Level 1
    'efxfgetTchHAaRew': { name: 'Mage Armor', expectedLevel: 1 },
    'TqoDccTS9rBw6vXj': { name: 'Shield', expectedLevel: 1 },
    'POLwho3lpuKuCo6q': { name: 'Magic Missile', expectedLevel: 1 },
    'Iq6AMFhnc8sT5WF8': { name: 'Identify', expectedLevel: 1 },
    'RoNN3vErCW37IJYO': { name: 'Grease', expectedLevel: 1 },
    'UhltFHfH9Bvl5vL8': { name: 'Expeditious Retreat', expectedLevel: 1 },
    'HAPP1TTL9tu40LyF': { name: 'Protection from Evil', expectedLevel: 1 },
    'kRfTmmH5sBfYEd8Y': { name: 'Enlarge Person', expectedLevel: 1 },
    
    // Arcane Level 2
    'mI78cxrch38mNAcr': { name: 'Invisibility', expectedLevel: 2 },
    'ySYznGgMZ8R9BvQc': { name: 'Mirror Image', expectedLevel: 2 },
    'vazHxxE1Lk5QndgQ': { name: 'Scorching Ray', expectedLevel: 2 },
    'IHDtX1q1IKwpsWWV': { name: 'Glitterdust', expectedLevel: 2 },
    '0X7OpnVunSsGsXi5': { name: 'Web', expectedLevel: 2 },
    'cwOdOxFDzabOOxnW': { name: 'Resist Energy', expectedLevel: 2 },
    
    // Arcane Level 3
    'D1KgQc1fRyoNPNwY': { name: 'Fireball', expectedLevel: 3 },
    '2Z9C0SLa5VZYvWph': { name: 'Lightning Bolt', expectedLevel: 3 },
    'p8hKPtpj8yYC1Lg5': { name: 'Haste', expectedLevel: 3 },
    '7V1PIzImnnFj5ApS': { name: 'Fly', expectedLevel: 3 },
    'Q3ZxRzrxld8P0t1v': { name: 'Dispel Magic', expectedLevel: 3 },
    'C7Yi8lOzceDvLivl': { name: 'Displacement', expectedLevel: 3 },
    
    // Divine spells
    'lx681rDErdOKErnV': { name: 'Cure Light Wounds', expectedLevel: 1 },
    '7lIiKvIuEVVbr9dn': { name: 'Bless', expectedLevel: 1 },
    'qIdVROi2KGyeF8Ta': { name: 'Divine Favor', expectedLevel: 1 },
    'd6WN7BnDUWpLaDef': { name: 'Shield of Faith', expectedLevel: 1 },
    'tEIMJCfMkZ9Cyw4S': { name: 'Remove Fear', expectedLevel: 1 },
    'XDUOxKSwjF8BOpY4': { name: 'Cure Moderate Wounds', expectedLevel: 2 },
    'JCW98LiIRWEoHHex': { name: "Bull's Strength", expectedLevel: 2 },
    '7wBkhLIOLd0Y6OSu': { name: 'Cure Serious Wounds', expectedLevel: 3 },
    '6YQpRbuNWic0VR1b': { name: 'Remove Disease', expectedLevel: 3 },
    'yWRcQhWD5xxkjs9N': { name: 'Prayer', expectedLevel: 3 }
  };
  
  console.log("=== SPELL LEVEL VERIFICATION ===\n");
  
  let errors = [];
  let correct = 0;
  
  for (const [id, expected] of Object.entries(spellsToVerify)) {
    const spell = await spellsPack.getDocument(id);
    if (!spell) {
      errors.push(`${expected.name}: NOT FOUND (ID: ${id})`);
      continue;
    }
    
    const spellData = spell.toObject();
    
    // Check learnedAt for wizard/sorcerer or cleric levels
    const learnedAt = spellData.system?.learnedAt?.class || [];
    let actualLevel = null;
    
    for (const [className, level] of learnedAt) {
      const lower = className.toLowerCase();
      if (lower.includes('wizard') || lower.includes('sorcerer') || 
          lower.includes('cleric') || lower.includes('druid') ||
          lower.includes('bard') || lower.includes('paladin')) {
        actualLevel = level;
        break;
      }
    }
    
    if (actualLevel === expected.expectedLevel) {
      console.log(`✓ ${expected.name}: Level ${actualLevel} (correct)`);
      correct++;
    } else {
      const msg = `✗ ${expected.name}: Expected ${expected.expectedLevel}, got ${actualLevel}`;
      console.error(msg);
      errors.push(msg);
    }
  }
  
  console.log(`\n=== RESULTS ===`);
  console.log(`Correct: ${correct}/${Object.keys(spellsToVerify).length}`);
  
  if (errors.length > 0) {
    console.log(`\nERRORS:`);
    errors.forEach(e => console.log(`  ${e}`));
  } else {
    console.log(`\n✓ All spell levels verified!`);
  }
  
  return { correct, total: Object.keys(spellsToVerify).length, errors };
})();
