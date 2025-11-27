/**
 * Wizard Spell Selection
 * 
 * Wizards are prepared arcane casters with unlimited spells known.
 * - Spellbook can contain many more spells than daily slots (2-4x multiplier)
 * - Must prepare spells each day
 * - INT-based casting
 * - All arcane spells available (except opposition schools if specialist)
 * 
 * Starting spells: All cantrips + 3 + INT modifier 1st level spells
 * Progression: +2 spells per level
 */

import {
  SpellSelection,
  SpellItem,
  SpellbookConfiguration,
  WIZARD_SPELL_SLOTS,
  buildSpellSlots,
  getAbilityModifier
} from './spell-selection';

/**
 * Priority-ranked wizard spells by level
 * Focus on versatile combat + utility balance
 */
const WIZARD_SPELL_PRIORITIES: Record<number, Array<{ id: string; name: string; school: string; priority: number }>> = {
  // Level 0 - Cantrips (all of them, unlimited use)
  0: [
    { id: 'acid-splash', name: 'Acid Splash', school: 'con', priority: 10 },
    { id: 'ray-of-frost', name: 'Ray of Frost', school: 'evo', priority: 10 },
    { id: 'detect-magic', name: 'Detect Magic', school: 'div', priority: 10 },
    { id: 'read-magic', name: 'Read Magic', school: 'div', priority: 10 },
    { id: 'mage-hand', name: 'Mage Hand', school: 'trs', priority: 9 },
    { id: 'prestidigitation', name: 'Prestidigitation', school: 'trs', priority: 9 },
    { id: 'light', name: 'Light', school: 'evo', priority: 8 },
    { id: 'mending', name: 'Mending', school: 'trs', priority: 7 },
    { id: 'message', name: 'Message', school: 'trs', priority: 7 }
  ],
  
  // Level 1 - Essential combat + utility
  1: [
    { id: 'mage-armor', name: 'Mage Armor', school: 'con', priority: 10 },
    { id: 'shield', name: 'Shield', school: 'abj', priority: 10 },
    { id: 'magic-missile', name: 'Magic Missile', school: 'evo', priority: 10 },
    { id: 'grease', name: 'Grease', school: 'con', priority: 9 },
    { id: 'enlarge-person', name: 'Enlarge Person', school: 'trs', priority: 9 },
    { id: 'feather-fall', name: 'Feather Fall', school: 'trs', priority: 8 },
    { id: 'identify', name: 'Identify', school: 'div', priority: 8 },
    { id: 'sleep', name: 'Sleep', school: 'enc', priority: 7 },
    { id: 'color-spray', name: 'Color Spray', school: 'ill', priority: 7 },
    { id: 'burning-hands', name: 'Burning Hands', school: 'evo', priority: 6 }
  ],
  
  // Level 2 - Core battlefield control + buffs
  2: [
    { id: 'invisibility', name: 'Invisibility', school: 'ill', priority: 10 },
    { id: 'web', name: 'Web', school: 'con', priority: 10 },
    { id: 'glitterdust', name: 'Glitterdust', school: 'con', priority: 9 },
    { id: 'scorching-ray', name: 'Scorching Ray', school: 'evo', priority: 9 },
    { id: 'mirror-image', name: 'Mirror Image', school: 'ill', priority: 9 },
    { id: 'resist-energy', name: 'Resist Energy', school: 'abj', priority: 8 },
    { id: 'see-invisibility', name: 'See Invisibility', school: 'div', priority: 7 },
    { id: 'levitate', name: 'Levitate', school: 'trs', priority: 7 },
    { id: 'knock', name: 'Knock', school: 'trs', priority: 6 }
  ],
  
  // Level 3 - Major combat + utility expansion
  3: [
    { id: 'fireball', name: 'Fireball', school: 'evo', priority: 10 },
    { id: 'haste', name: 'Haste', school: 'trs', priority: 10 },
    { id: 'lightning-bolt', name: 'Lightning Bolt', school: 'evo', priority: 9 },
    { id: 'dispel-magic', name: 'Dispel Magic', school: 'abj', priority: 9 },
    { id: 'fly', name: 'Fly', school: 'trs', priority: 9 },
    { id: 'slow', name: 'Slow', school: 'trs', priority: 8 },
    { id: 'stinking-cloud', name: 'Stinking Cloud', school: 'con', priority: 8 },
    { id: 'suggestion', name: 'Suggestion', school: 'enc', priority: 7 },
    { id: 'tongues', name: 'Tongues', school: 'div', priority: 6 }
  ],
  
  // Level 4 - Advanced battlefield control
  4: [
    { id: 'dimension-door', name: 'Dimension Door', school: 'con', priority: 10 },
    { id: 'invisibility-greater', name: 'Invisibility, Greater', school: 'ill', priority: 10 },
    { id: 'stoneskin', name: 'Stoneskin', school: 'abj', priority: 10 },
    { id: 'wall-of-fire', name: 'Wall of Fire', school: 'evo', priority: 9 },
    { id: 'black-tentacles', name: 'Black Tentacles', school: 'con', priority: 9 },
    { id: 'confusion', name: 'Confusion', school: 'enc', priority: 8 },
    { id: 'polymorph', name: 'Polymorph', school: 'trs', priority: 8 },
    { id: 'ice-storm', name: 'Ice Storm', school: 'evo', priority: 7 }
  ],
  
  // Level 5 - High-level combat + strategic options
  5: [
    { id: 'teleport', name: 'Teleport', school: 'con', priority: 10 },
    { id: 'wall-of-force', name: 'Wall of Force', school: 'evo', priority: 10 },
    { id: 'cone-of-cold', name: 'Cone of Cold', school: 'evo', priority: 9 },
    { id: 'cloudkill', name: 'Cloudkill', school: 'con', priority: 9 },
    { id: 'feeblemind', name: 'Feeblemind', school: 'enc', priority: 8 },
    { id: 'hold-monster', name: 'Hold Monster', school: 'enc', priority: 8 },
    { id: 'overland-flight', name: 'Overland Flight', school: 'trs', priority: 7 }
  ],
  
  // Level 6 - Powerful combat + utility
  6: [
    { id: 'chain-lightning', name: 'Chain Lightning', school: 'evo', priority: 10 },
    { id: 'disintegrate', name: 'Disintegrate', school: 'trs', priority: 10 },
    { id: 'greater-dispel-magic', name: 'Greater Dispel Magic', school: 'abj', priority: 9 },
    { id: 'mass-suggestion', name: 'Mass Suggestion', school: 'enc', priority: 8 },
    { id: 'true-seeing', name: 'True Seeing', school: 'div', priority: 8 },
    { id: 'globe-of-invulnerability', name: 'Globe of Invulnerability', school: 'abj', priority: 7 }
  ],
  
  // Level 7 - Epic battlefield dominance
  7: [
    { id: 'greater-teleport', name: 'Greater Teleport', school: 'con', priority: 10 },
    { id: 'prismatic-spray', name: 'Prismatic Spray', school: 'evo', priority: 9 },
    { id: 'finger-of-death', name: 'Finger of Death', school: 'nec', priority: 9 },
    { id: 'spell-turning', name: 'Spell Turning', school: 'abj', priority: 8 },
    { id: 'reverse-gravity', name: 'Reverse Gravity', school: 'trs', priority: 7 }
  ],
  
  // Level 8 - Near-deity power
  8: [
    { id: 'polar-ray', name: 'Polar Ray', school: 'evo', priority: 10 },
    { id: 'horrid-wilting', name: 'Horrid Wilting', school: 'nec', priority: 9 },
    { id: 'maze', name: 'Maze', school: 'con', priority: 8 },
    { id: 'mind-blank', name: 'Mind Blank', school: 'abj', priority: 8 },
    { id: 'irresistible-dance', name: 'Irresistible Dance', school: 'enc', priority: 7 }
  ],
  
  // Level 9 - God-tier magic
  9: [
    { id: 'wish', name: 'Wish', school: 'trs', priority: 10 },
    { id: 'time-stop', name: 'Time Stop', school: 'trs', priority: 10 },
    { id: 'meteor-swarm', name: 'Meteor Swarm', school: 'evo', priority: 9 },
    { id: 'gate', name: 'Gate', school: 'con', priority: 8 },
    { id: 'shapechange', name: 'Shapechange', school: 'trs', priority: 8 }
  ]
};

/**
 * Select spells for a wizard character
 * Wizards get many spells in spellbook (2-4x daily slots)
 */
export function selectWizardSpells(level: number, intelligenceScore: number): SpellSelection {
  const abilityMod = getAbilityModifier(intelligenceScore);
  const baseSlots = WIZARD_SPELL_SLOTS[level] || WIZARD_SPELL_SLOTS[1];
  
  // Calculate how many spells wizard should have in spellbook
  // Starting: all cantrips + 3 + INT mod
  // Per level: +2 spells
  const spellsPerLevel: number[] = [9999]; // All cantrips (represented as large number)
  
  for (let spellLevel = 1; spellLevel <= 9; spellLevel++) {
    if (baseSlots[spellLevel] === 0) {
      spellsPerLevel[spellLevel] = 0; // Can't cast this level yet
    } else {
      // Calculate total spells for this level
      let totalSpells = 0;
      
      if (spellLevel === 1) {
        // Level 1 spells: start with 3 + INT mod
        totalSpells = 3 + Math.max(0, abilityMod);
      }
      
      // Add 2 spells per character level where we could learn this spell level
      // Wizards can cast spell level X at character level (2*X - 1)
      const minCharLevelForSpell = (spellLevel * 2) - 1;
      if (level >= minCharLevelForSpell) {
        const levelsAvailable = level - minCharLevelForSpell + 1;
        totalSpells += levelsAvailable * 2;
      }
      
      // Cap at available spells in our list, but aim for 2-3x daily slots
      const targetSpells = Math.min(
        (baseSlots[spellLevel] + getBonusSpellSlots(abilityMod, spellLevel)) * 3,
        WIZARD_SPELL_PRIORITIES[spellLevel]?.length || 0
      );
      
      spellsPerLevel[spellLevel] = Math.max(totalSpells, targetSpells);
    }
  }
  
  // Select spells based on priorities
  const selectedSpells: SpellItem[] = [];
  
  for (let spellLevel = 0; spellLevel <= 9; spellLevel++) {
    const availableSpells = WIZARD_SPELL_PRIORITIES[spellLevel] || [];
    const targetCount = Math.min(spellsPerLevel[spellLevel] || 0, availableSpells.length);
    
    // Sort by priority and take top N
    const sortedSpells = [...availableSpells].sort((a, b) => b.priority - a.priority);
    const selected = sortedSpells.slice(0, targetCount);
    
    for (const spell of selected) {
      selectedSpells.push({
        compendiumId: spell.id,
        name: spell.name,
        level: spellLevel,
        school: spell.school,
        preparationMode: 'prepared',
        priority: spell.priority
      });
    }
  }
  
  // Build spellbook configuration
  const spellbookConfig: SpellbookConfiguration = {
    name: 'Primary',
    class: 'wizard',
    casterLevel: level,
    spellcastingType: 'arcane',
    ability: 'int',
    spontaneous: false,
    hasSpecialSlot: false, // TODO: Handle specialist wizards later
    arcaneSpellFailure: true,
    spellSlots: buildSpellSlots(baseSlots, abilityMod)
  };
  
  console.log(`Selected ${selectedSpells.length} wizard spells for level ${level} wizard (INT ${intelligenceScore}, +${abilityMod}):`);
  for (let lvl = 0; lvl <= 9; lvl++) {
    const spellsAtLevel = selectedSpells.filter(s => s.level === lvl);
    const slots = spellbookConfig.spellSlots[`spell${lvl}` as keyof typeof spellbookConfig.spellSlots].max;
    if (spellsAtLevel.length > 0) {
      console.log(`  Level ${lvl}: ${spellsAtLevel.length} spells (${slots} daily slots)`);
    }
  }
  
  return {
    spells: selectedSpells,
    spellbookConfig
  };
}

/**
 * Helper: Calculate bonus spell slots from ability modifier
 */
function getBonusSpellSlots(abilityModifier: number, spellLevel: number): number {
  if (spellLevel === 0) return 0;
  if (abilityModifier < spellLevel) return 0;
  return Math.floor((abilityModifier - spellLevel + 1) / 4) + 1;
}
