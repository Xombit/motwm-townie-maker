/**
 * Cleric Spell Selection for D&D 3.5e
 * 
 * Clerics are prepared divine casters with access to all cleric spells.
 * They prepare a selection each day, focusing on healing, buffing, and divine power.
 * 
 * Special: Clerics get domain spells (one per spell level) from their chosen domains.
 * For now, we'll select general-purpose spells and skip domain implementation.
 */

import { 
  SpellSelection, 
  SpellItem, 
  SpellbookConfiguration,
  getAbilityModifier,
  getBonusSpellSlots,
  buildSpellSlots,
  CLERIC_SPELL_SLOTS
} from './spell-selection';

/**
 * Cleric spell priorities by level
 * Focus: Healing, buffs, divine power, some combat utility
 */
const CLERIC_SPELL_PRIORITIES: Record<number, Array<{ id: string; name: string; school: string; priority: number }>> = {
  // Level 0 - Orisons (at-will)
  0: [
    { id: 'cure-minor-wounds', name: 'Cure Minor Wounds', school: 'con', priority: 10 },
    { id: 'guidance', name: 'Guidance', school: 'div', priority: 10 },
    { id: 'resistance', name: 'Resistance', school: 'abj', priority: 9 },
    { id: 'light', name: 'Light', school: 'evo', priority: 9 },
    { id: 'detect-magic', name: 'Detect Magic', school: 'div', priority: 8 },
    { id: 'read-magic', name: 'Read Magic', school: 'div', priority: 8 },
    { id: 'virtue', name: 'Virtue', school: 'trs', priority: 7 }, // Alternative to Stabilize
    { id: 'detect-poison', name: 'Detect Poison', school: 'div', priority: 6 },
    { id: 'mending', name: 'Mending', school: 'trs', priority: 5 }
  ],
  
  // Level 1 - Essential healing and buffs
  1: [
    { id: 'cure-light-wounds', name: 'Cure Light Wounds', school: 'con', priority: 10 },
    { id: 'bless', name: 'Bless', school: 'enc', priority: 10 },
    { id: 'shield-of-faith', name: 'Shield of Faith', school: 'abj', priority: 9 },
    { id: 'divine-favor', name: 'Divine Favor', school: 'evo', priority: 9 },
    { id: 'entropic-shield', name: 'Entropic Shield', school: 'abj', priority: 8 },
    { id: 'protection-from-evil', name: 'Protection from Evil', school: 'abj', priority: 8 },
    { id: 'remove-fear', name: 'Remove Fear', school: 'abj', priority: 7 },
    { id: 'sanctuary', name: 'Sanctuary', school: 'abj', priority: 7 },
    { id: 'magic-weapon', name: 'Magic Weapon', school: 'trs', priority: 6 },
    { id: 'command', name: 'Command', school: 'enc', priority: 6 }
  ],
  
  // Level 2 - Healing and tactical buffs
  2: [
    { id: 'cure-moderate-wounds', name: 'Cure Moderate Wounds', school: 'con', priority: 10 },
    { id: 'spiritual-weapon', name: 'Spiritual Weapon', school: 'evo', priority: 10 },
    { id: 'aid', name: 'Aid', school: 'enc', priority: 9 },
    { id: 'bulls-strength', name: "Bull's Strength", school: 'trs', priority: 9 },
    { id: 'hold-person', name: 'Hold Person', school: 'enc', priority: 8 },
    { id: 'silence', name: 'Silence', school: 'ill', priority: 8 },
    { id: 'delay-poison', name: 'Delay Poison', school: 'con', priority: 7 },
    { id: 'remove-paralysis', name: 'Remove Paralysis', school: 'con', priority: 7 },
    { id: 'restoration-lesser', name: 'Restoration, Lesser', school: 'con', priority: 6 }
  ],
  
  // Level 3 - More powerful healing and utility
  3: [
    { id: 'cure-serious-wounds', name: 'Cure Serious Wounds', school: 'con', priority: 10 },
    { id: 'prayer', name: 'Prayer', school: 'enc', priority: 10 },
    { id: 'dispel-magic', name: 'Dispel Magic', school: 'abj', priority: 10 },
    { id: 'remove-curse', name: 'Remove Curse', school: 'abj', priority: 9 },
    { id: 'remove-disease', name: 'Remove Disease', school: 'con', priority: 9 },
    { id: 'magic-circle-against-evil', name: 'Magic Circle against Evil', school: 'abj', priority: 8 },
    { id: 'searing-light', name: 'Searing Light', school: 'evo', priority: 8 },
    { id: 'water-walk', name: 'Water Walk', school: 'trs', priority: 6 },
    { id: 'create-food-and-water', name: 'Create Food and Water', school: 'con', priority: 5 }
  ],
  
  // Level 4 - Powerful divine magic
  4: [
    { id: 'cure-critical-wounds', name: 'Cure Critical Wounds', school: 'con', priority: 10 },
    { id: 'divine-power', name: 'Divine Power', school: 'evo', priority: 10 },
    { id: 'freedom-of-movement', name: 'Freedom of Movement', school: 'abj', priority: 9 },
    { id: 'death-ward', name: 'Death Ward', school: 'nec', priority: 9 },
    { id: 'restoration', name: 'Restoration', school: 'con', priority: 8 },
    { id: 'spell-immunity', name: 'Spell Immunity', school: 'abj', priority: 8 },
    { id: 'neutralize-poison', name: 'Neutralize Poison', school: 'con', priority: 7 },
    { id: 'sending', name: 'Sending', school: 'evo', priority: 6 }
  ],
  
  // Level 5 - High-level divine intervention
  5: [
    { id: 'cure-light-wounds-mass', name: 'Cure Light Wounds, Mass', school: 'con', priority: 10 },
    { id: 'flame-strike', name: 'Flame Strike', school: 'evo', priority: 10 },
    { id: 'raise-dead', name: 'Raise Dead', school: 'con', priority: 10 },
    { id: 'righteous-might', name: 'Righteous Might', school: 'trs', priority: 9 }, // Alternative to Breath of Life
    { id: 'dispel-evil', name: 'Dispel Evil', school: 'abj', priority: 8 },
    { id: 'break-enchantment', name: 'Break Enchantment', school: 'abj', priority: 8 },
    { id: 'true-seeing', name: 'True Seeing', school: 'div', priority: 7 },
    { id: 'wall-of-stone', name: 'Wall of Stone', school: 'con', priority: 6 }
  ],
  
  // Level 6 - Mastery of divine power
  6: [
    { id: 'heal', name: 'Heal', school: 'con', priority: 10 },
    { id: 'blade-barrier', name: 'Blade Barrier', school: 'evo', priority: 10 },
    { id: 'heroes-feast', name: "Heroes' Feast", school: 'con', priority: 9 },
    { id: 'dispel-magic-greater', name: 'Dispel Magic, Greater', school: 'abj', priority: 9 },
    { id: 'word-of-recall', name: 'Word of Recall', school: 'con', priority: 8 },
    { id: 'find-the-path', name: 'Find the Path', school: 'div', priority: 7 }
  ],
  
  // Level 7 - Near-godly power
  7: [
    { id: 'regenerate', name: 'Regenerate', school: 'con', priority: 10 },
    { id: 'resurrection', name: 'Resurrection', school: 'con', priority: 10 },
    { id: 'restoration-greater', name: 'Restoration, Greater', school: 'con', priority: 9 },
    { id: 'holy-word', name: 'Holy Word', school: 'evo', priority: 9 },
    { id: 'refuge', name: 'Refuge', school: 'con', priority: 8 },
    { id: 'ethereal-jaunt', name: 'Ethereal Jaunt', school: 'trs', priority: 7 }
  ],
  
  // Level 8 - Divine intervention
  8: [
    { id: 'cure-critical-wounds-mass', name: 'Cure Critical Wounds, Mass', school: 'con', priority: 10 },
    { id: 'fire-storm', name: 'Fire Storm', school: 'evo', priority: 9 },
    { id: 'holy-aura', name: 'Holy Aura', school: 'abj', priority: 9 },
    { id: 'antimagic-field', name: 'Antimagic Field', school: 'abj', priority: 8 },
    { id: 'dimensional-lock', name: 'Dimensional Lock', school: 'abj', priority: 7 }
  ],
  
  // Level 9 - Miracles
  9: [
    { id: 'heal-mass', name: 'Heal, Mass', school: 'con', priority: 10 },
    { id: 'gate', name: 'Gate', school: 'con', priority: 10 },
    { id: 'miracle', name: 'Miracle', school: 'evo', priority: 10 },
    { id: 'true-resurrection', name: 'True Resurrection', school: 'con', priority: 9 },
    { id: 'storm-of-vengeance', name: 'Storm of Vengeance', school: 'con', priority: 8 }
  ]
};

/**
 * Select spells for a cleric character
 * Clerics prepare spells daily, similar to wizards but with divine focus
 */
export function selectClericSpells(level: number, wisdomScore: number): SpellSelection {
  const abilityMod = getAbilityModifier(wisdomScore);
  const baseSlots = CLERIC_SPELL_SLOTS[level] || CLERIC_SPELL_SLOTS[1];
  
  // Calculate how many spells cleric should prepare
  // Similar to wizard: aim for 2-3x daily slots worth of spells to choose from
  const spellsPerLevel: number[] = [9999]; // All orisons
  
  for (let spellLevel = 1; spellLevel <= 9; spellLevel++) {
    if (baseSlots[spellLevel] === 0) {
      spellsPerLevel[spellLevel] = 0; // Can't cast this level yet
    } else {
      // Clerics have access to all cleric spells, prepare subset each day
      // Aim for 2-3x daily slots worth of prepared spells
      const totalSlots = baseSlots[spellLevel] + getBonusSpellSlots(abilityMod, spellLevel);
      const targetSpells = Math.min(
        totalSlots * 3,
        CLERIC_SPELL_PRIORITIES[spellLevel]?.length || 0
      );
      
      spellsPerLevel[spellLevel] = Math.max(totalSlots, targetSpells);
    }
  }
  
  // Select spells based on priorities
  const selectedSpells: SpellItem[] = [];
  
  for (let spellLevel = 0; spellLevel <= 9; spellLevel++) {
    const availableSpells = CLERIC_SPELL_PRIORITIES[spellLevel] || [];
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
    class: 'cleric',
    casterLevel: level,
    spellcastingType: 'divine',
    ability: 'wis',
    spontaneous: false,
    hasSpecialSlot: true, // Clerics get domain spell slots
    arcaneSpellFailure: false, // Divine casters don't have ASF
    spellSlots: buildSpellSlots(baseSlots, abilityMod)
  };
  
  console.log(`Selected ${selectedSpells.length} cleric spells for level ${level} cleric (WIS ${wisdomScore}, +${abilityMod}):`);
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
