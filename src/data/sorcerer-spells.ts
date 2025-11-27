/**
 * Sorcerer Spell Selection
 * 
 * Sorcerers are spontaneous arcane casters with limited spells known.
 * - Spells known are strictly limited by level (no spellbook)
 * - Cast spontaneously from known spells
 * - CHA-based casting
 * - Must choose versatile, reusable spells (avoid situational)
 * 
 * Key difference from Wizard: EXACT spell count from SORCERER_SPELLS_KNOWN table
 */

import {
  SpellSelection,
  SpellItem,
  SpellbookConfiguration,
  SORCERER_SPELL_SLOTS,
  SORCERER_SPELLS_KNOWN,
  buildSpellSlots,
  getAbilityModifier
} from './spell-selection';

/**
 * Priority-ranked sorcerer spells by level
 * Focus on VERSATILE, REUSABLE spells (no situational picks)
 * Sorcerers can't afford niche spells - every spell must earn its slot
 */
const SORCERER_SPELL_PRIORITIES: Record<number, Array<{ id: string; name: string; school: string; priority: number; reasoning: string }>> = {
  // Level 0 - Cantrips (all useful ones)
  0: [
    { id: 'ray-of-frost', name: 'Ray of Frost', school: 'evo', priority: 10, reasoning: 'Unlimited damage cantrip' },
    { id: 'acid-splash', name: 'Acid Splash', school: 'con', priority: 10, reasoning: 'Alternative damage type' },
    { id: 'detect-magic', name: 'Detect Magic', school: 'div', priority: 10, reasoning: 'Always useful detection' },
    { id: 'read-magic', name: 'Read Magic', school: 'div', priority: 9, reasoning: 'Read scrolls/spellbooks' },
    { id: 'mage-hand', name: 'Mage Hand', school: 'trs', priority: 9, reasoning: 'Unlimited utility' },
    { id: 'prestidigitation', name: 'Prestidigitation', school: 'trs', priority: 8, reasoning: 'Social/utility tricks' },
    { id: 'light', name: 'Light', school: 'evo', priority: 7, reasoning: 'Unlimited light source' },
    { id: 'mending', name: 'Mending', school: 'trs', priority: 6, reasoning: 'Repair utility' },
    { id: 'message', name: 'Message', school: 'trs', priority: 6, reasoning: 'Silent communication' }
  ],
  
  // Level 1 - Core combat + essential defense
  1: [
    { id: 'mage-armor', name: 'Mage Armor', school: 'con', priority: 10, reasoning: 'All-day AC boost' },
    { id: 'shield', name: 'Shield', school: 'abj', priority: 10, reasoning: 'Emergency AC/missile defense' },
    { id: 'magic-missile', name: 'Magic Missile', school: 'evo', priority: 10, reasoning: 'Auto-hit damage, scales well' },
    { id: 'grease', name: 'Grease', school: 'con', priority: 9, reasoning: 'Battlefield control, no SR' },
    { id: 'enlarge-person', name: 'Enlarge Person', school: 'trs', priority: 8, reasoning: 'Buff allies, debuff enemies' },
    { id: 'color-spray', name: 'Color Spray', school: 'ill', priority: 7, reasoning: 'Low-level crowd control' }
  ],
  
  // Level 2 - Must-have battlefield spells
  2: [
    { id: 'invisibility', name: 'Invisibility', school: 'ill', priority: 10, reasoning: 'Escape, stealth, combat advantage' },
    { id: 'scorching-ray', name: 'Scorching Ray', school: 'evo', priority: 10, reasoning: 'Reliable ranged damage' },
    { id: 'mirror-image', name: 'Mirror Image', school: 'ill', priority: 10, reasoning: 'Best defensive spell at this level' },
    { id: 'web', name: 'Web', school: 'con', priority: 9, reasoning: 'Crowd control, terrain denial' },
    { id: 'glitterdust', name: 'Glitterdust', school: 'con', priority: 8, reasoning: 'Reveals invisibility, blinds' }
  ],
  
  // Level 3 - Core high-level combat
  3: [
    { id: 'fireball', name: 'Fireball', school: 'evo', priority: 10, reasoning: 'Iconic AoE damage' },
    { id: 'haste', name: 'Haste', school: 'trs', priority: 10, reasoning: 'Best party buff' },
    { id: 'dispel-magic', name: 'Dispel Magic', school: 'abj', priority: 10, reasoning: 'Counter magic, essential utility' },
    { id: 'lightning-bolt', name: 'Lightning Bolt', school: 'evo', priority: 9, reasoning: 'Alternative damage type to fireball' },
    { id: 'fly', name: 'Fly', school: 'trs', priority: 8, reasoning: 'Mobility, positioning' }
  ],
  
  // Level 4 - Advanced versatility
  4: [
    { id: 'invisibility-greater', name: 'Invisibility, Greater', school: 'ill', priority: 10, reasoning: 'Combat invisibility' },
    { id: 'dimension-door', name: 'Dimension Door', school: 'con', priority: 10, reasoning: 'Emergency escape, positioning' },
    { id: 'stoneskin', name: 'Stoneskin', school: 'abj', priority: 9, reasoning: 'DR 10/adamantine' },
    { id: 'black-tentacles', name: 'Black Tentacles', school: 'con', priority: 8, reasoning: 'Powerful crowd control' }
  ],
  
  // Level 5 - High-level power
  5: [
    { id: 'teleport', name: 'Teleport', school: 'con', priority: 10, reasoning: 'Travel anywhere' },
    { id: 'cone-of-cold', name: 'Cone of Cold', school: 'evo', priority: 10, reasoning: 'High damage AoE' },
    { id: 'wall-of-force', name: 'Wall of Force', school: 'evo', priority: 9, reasoning: 'Impenetrable barrier' },
    { id: 'hold-monster', name: 'Hold Monster', school: 'enc', priority: 8, reasoning: 'Save-or-lose on any creature' }
  ],
  
  // Level 6 - Mastery spells
  6: [
    { id: 'chain-lightning', name: 'Chain Lightning', school: 'evo', priority: 10, reasoning: 'Multi-target damage' },
    { id: 'disintegrate', name: 'Disintegrate', school: 'trs', priority: 10, reasoning: 'Single-target destruction' },
    { id: 'greater-dispel-magic', name: 'Greater Dispel Magic', school: 'abj', priority: 9, reasoning: 'Superior dispel' }
  ],
  
  // Level 7 - Epic power
  7: [
    { id: 'greater-teleport', name: 'Greater Teleport', school: 'con', priority: 10, reasoning: 'Perfect teleport' },
    { id: 'prismatic-spray', name: 'Prismatic Spray', school: 'evo', priority: 9, reasoning: 'Chaos and damage' }
  ],
  
  // Level 8 - Near-godlike
  8: [
    { id: 'polar-ray', name: 'Polar Ray', school: 'evo', priority: 10, reasoning: 'Massive single-target damage' },
    { id: 'horrid-wilting', name: 'Horrid Wilting', school: 'nec', priority: 9, reasoning: 'AoE death' }
  ],
  
  // Level 9 - Ultimate magic
  9: [
    { id: 'time-stop', name: 'Time Stop', school: 'trs', priority: 10, reasoning: 'Free rounds of setup' },
    { id: 'meteor-swarm', name: 'Meteor Swarm', school: 'evo', priority: 9, reasoning: 'Maximum AoE damage' }
  ]
};

/**
 * Select spells for a sorcerer character
 * Sorcerers get EXACT count from SORCERER_SPELLS_KNOWN table
 */
export function selectSorcererSpells(level: number, charismaScore: number): SpellSelection {
  const abilityMod = getAbilityModifier(charismaScore);
  const baseSlots = SORCERER_SPELL_SLOTS[level] || SORCERER_SPELL_SLOTS[1];
  const spellsKnown = SORCERER_SPELLS_KNOWN[level] || SORCERER_SPELLS_KNOWN[1];
  
  // Select spells based on priorities
  const selectedSpells: SpellItem[] = [];
  
  for (let spellLevel = 0; spellLevel <= 9; spellLevel++) {
    const availableSpells = SORCERER_SPELL_PRIORITIES[spellLevel] || [];
    const targetCount = Math.min(spellsKnown[spellLevel] || 0, availableSpells.length);
    
    if (targetCount === 0) continue;
    
    // Sort by priority and take EXACT count (no more, no less)
    const sortedSpells = [...availableSpells].sort((a, b) => b.priority - a.priority);
    const selected = sortedSpells.slice(0, targetCount);
    
    for (const spell of selected) {
      selectedSpells.push({
        compendiumId: spell.id,
        name: spell.name,
        level: spellLevel,
        school: spell.school,
        preparationMode: 'spontaneous',
        priority: spell.priority
      });
    }
  }
  
  // Build spellbook configuration
  const spellbookConfig: SpellbookConfiguration = {
    name: 'Primary',
    class: 'sorcerer',
    casterLevel: level,
    spellcastingType: 'arcane',
    ability: 'cha',
    spontaneous: true, // KEY DIFFERENCE: spontaneous casting
    hasSpecialSlot: false,
    arcaneSpellFailure: true,
    spellSlots: buildSpellSlots(baseSlots, abilityMod)
  };
  
  console.log(`Selected ${selectedSpells.length} sorcerer spells for level ${level} sorcerer (CHA ${charismaScore}, +${abilityMod}):`);
  for (let lvl = 0; lvl <= 9; lvl++) {
    const spellsAtLevel = selectedSpells.filter(s => s.level === lvl);
    const slots = spellbookConfig.spellSlots[`spell${lvl}` as keyof typeof spellbookConfig.spellSlots].max;
    const known = spellsKnown[lvl] || 0;
    if (spellsAtLevel.length > 0) {
      console.log(`  Level ${lvl}: ${spellsAtLevel.length}/${known} spells known (${slots} daily slots)`);
    }
  }
  
  return {
    spells: selectedSpells,
    spellbookConfig
  };
}
