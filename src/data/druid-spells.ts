/**
 * Druid Spell Selection for D&D 3.5e
 * 
 * Druids are prepared divine casters with a unique nature-focused spell list.
 * They excel at summoning, battlefield control, self-buffing (wild shape synergy),
 * healing, and environmental manipulation.
 * 
 * Key strengths:
 * - Summoning (Call Lightning, Summon Nature's Ally)
 * - Battlefield control (Entangle, Spike Growth, Wall of Thorns)
 * - Self-buffing for wild shape combat (Barkskin, Natural Armor)
 * - Healing (Cure Wounds line)
 * - Weather and terrain manipulation
 */

import { 
  SpellSelection, 
  SpellItem, 
  SpellbookConfiguration,
  getAbilityModifier,
  getBonusSpellSlots,
  buildSpellSlots,
  CLERIC_SPELL_SLOTS // Druids use same progression as clerics
} from './spell-selection';

/**
 * Druid spell priorities by level
 * Focus: Summoning, control, wild shape synergy, healing, utility
 */
const DRUID_SPELL_PRIORITIES: Record<number, Array<{ id: string; name: string; school: string; priority: number; notes?: string }>> = {
  // Level 0 - Orisons (at-will utility)
  0: [
    { id: 'cure-minor-wounds', name: 'Cure Minor Wounds', school: 'con', priority: 10, notes: 'Essential healing' },
    { id: 'guidance', name: 'Guidance', school: 'div', priority: 10, notes: '+1 to any roll' },
    { id: 'detect-magic', name: 'Detect Magic', school: 'div', priority: 9, notes: 'Detect magic auras' },
    { id: 'read-magic', name: 'Read Magic', school: 'div', priority: 9, notes: 'Read scrolls' },
    { id: 'light', name: 'Light', school: 'evo', priority: 8, notes: 'Illumination' },
    { id: 'resistance', name: 'Resistance', school: 'abj', priority: 8, notes: '+1 saves' },
    { id: 'know-direction', name: 'Know Direction', school: 'div', priority: 7, notes: 'Navigation' },
    { id: 'detect-poison', name: 'Detect Poison', school: 'div', priority: 6, notes: 'Safety check' },
    { id: 'mending', name: 'Mending', school: 'trs', priority: 5, notes: 'Repair items' }
  ],
  
  // Level 1 - Early control and utility
  1: [
    { id: 'cure-light-wounds', name: 'Cure Light Wounds', school: 'con', priority: 10, notes: 'Core healing' },
    { id: 'entangle', name: 'Entangle', school: 'trs', priority: 10, notes: 'Best level 1 control spell' },
    { id: 'shillelagh', name: 'Shillelagh', school: 'trs', priority: 9, notes: 'Melee combat buff' },
    { id: 'produce-flame', name: 'Produce Flame', school: 'evo', priority: 9, notes: 'Ranged damage' },
    { id: 'faerie-fire', name: 'Faerie Fire', school: 'evo', priority: 8, notes: 'Outline invisible, +2 to hit' },
    { id: 'obscuring-mist', name: 'Obscuring Mist', school: 'con', priority: 8, notes: 'Concealment' },
    { id: 'magic-fang', name: 'Magic Fang', school: 'trs', priority: 7, notes: 'Wild shape weapon buff' },
    { id: 'goodberry', name: 'Goodberry', school: 'trs', priority: 7, notes: 'Out-of-combat healing' },
    { id: 'speak-with-animals', name: 'Speak with Animals', school: 'div', priority: 6, notes: 'Information gathering' },
    { id: 'endure-elements', name: 'Endure Elements', school: 'abj', priority: 5, notes: 'Environmental protection' }
  ],
  
  // Level 2 - Buffing and battlefield control
  2: [
    { id: 'cure-moderate-wounds', name: 'Cure Moderate Wounds', school: 'con', priority: 10, notes: 'Healing upgrade' },
    { id: 'barkskin', name: 'Barkskin', school: 'trs', priority: 10, notes: 'Best AC buff for wild shape' },
    { id: 'flame-blade', name: 'Flame Blade', school: 'evo', priority: 9, notes: '1d8+CL/2 melee damage' },
    { id: 'heat-metal', name: 'Heat Metal', school: 'trs', priority: 9, notes: 'Anti-armor spell' },
    { id: 'bulls-strength', name: "Bull's Strength", school: 'trs', priority: 8, notes: '+4 STR for wild shape' },
    { id: 'fog-cloud', name: 'Fog Cloud', school: 'con', priority: 8, notes: 'Area concealment' },
    { id: 'summon-swarm', name: 'Summon Swarm', school: 'con', priority: 7, notes: 'Distraction/area denial' },
    { id: 'warp-wood', name: 'Warp Wood', school: 'trs', priority: 7, notes: 'Destroy weapons/doors' },
    { id: 'resist-energy', name: 'Resist Energy', school: 'abj', priority: 6, notes: 'Energy protection' }
  ],
  
  // Level 3 - Major utility and combat power
  3: [
    { id: 'cure-serious-wounds', name: 'Cure Serious Wounds', school: 'con', priority: 10, notes: 'Significant healing' },
    { id: 'call-lightning', name: 'Call Lightning', school: 'evo', priority: 10, notes: 'Repeating 3d6 damage' },
    { id: 'dominate-animal', name: 'Dominate Animal', school: 'enc', priority: 9, notes: 'Control animals' },
    { id: 'greater-magic-fang', name: 'Greater Magic Fang', school: 'trs', priority: 9, notes: '+1/3 levels to natural weapons' },
    { id: 'spike-growth', name: 'Spike Growth', school: 'trs', priority: 8, notes: 'Area damage/control' },
    { id: 'wind-wall', name: 'Wind Wall', school: 'evo', priority: 8, notes: 'Block ranged attacks' },
    { id: 'water-breathing', name: 'Water Breathing', school: 'trs', priority: 7, notes: 'Underwater utility' },
    { id: 'neutralize-poison', name: 'Neutralize Poison', school: 'con', priority: 7, notes: 'Remove poison' },
    { id: 'plant-growth', name: 'Plant Growth', school: 'trs', priority: 6, notes: 'Terrain manipulation' }
  ],
  
  // Level 4 - Powerful battlefield control
  4: [
    { id: 'cure-critical-wounds', name: 'Cure Critical Wounds', school: 'con', priority: 10, notes: 'Major healing' },
    { id: 'ice-storm', name: 'Ice Storm', school: 'evo', priority: 10, notes: '5d6 damage + difficult terrain' },
    { id: 'dispel-magic', name: 'Dispel Magic', school: 'abj', priority: 9, notes: 'Counter magic' },
    { id: 'flame-strike', name: 'Flame Strike', school: 'evo', priority: 9, notes: '1d6/level half divine' },
    { id: 'freedom-of-movement', name: 'Freedom of Movement', school: 'abj', priority: 8, notes: 'Ignore grapple/paralyze' },
    { id: 'spike-stones', name: 'Spike Stones', school: 'trs', priority: 8, notes: 'Area damage' },
    { id: 'rusting-grasp', name: 'Rusting Grasp', school: 'trs', priority: 7, notes: 'Destroy metal items' },
    { id: 'control-water', name: 'Control Water', school: 'trs', priority: 6, notes: 'Manipulate water' }
  ],
  
  // Level 5 - High-level nature magic
  5: [
    { id: 'cure-light-wounds-mass', name: 'Cure Light Wounds, Mass', school: 'con', priority: 10, notes: 'Party healing' },
    { id: 'wall-of-thorns', name: 'Wall of Thorns', school: 'con', priority: 10, notes: 'Barrier + 25 damage' },
    { id: 'call-lightning-storm', name: 'Call Lightning Storm', school: 'evo', priority: 9, notes: 'Upgraded call lightning' },
    { id: 'tree-stride', name: 'Tree Stride', school: 'con', priority: 9, notes: 'Teleport via trees' },
    { id: 'awaken', name: 'Awaken', school: 'trs', priority: 8, notes: 'Create intelligent ally' },
    { id: 'stoneskin', name: 'Stoneskin', school: 'abj', priority: 8, notes: 'DR 10/adamantine' },
    { id: 'control-winds', name: 'Control Winds', school: 'trs', priority: 7, notes: 'Weather control' },
    { id: 'animal-growth', name: 'Animal Growth', school: 'trs', priority: 7, notes: 'Buff animal companions' }
  ],
  
  // Level 6 - Mastery of nature
  6: [
    { id: 'cure-moderate-wounds-mass', name: 'Cure Moderate Wounds, Mass', school: 'con', priority: 10, notes: 'Strong party healing' },
    { id: 'greater-dispel-magic', name: 'Dispel Magic, Greater', school: 'abj', priority: 10, notes: 'Superior dispel' },
    { id: 'fire-seeds', name: 'Fire Seeds', school: 'con', priority: 9, notes: '1d8/level ranged attacks' },
    { id: 'transport-via-plants', name: 'Transport via Plants', school: 'con', priority: 9, notes: 'Long-distance teleport' },
    { id: 'wall-of-stone', name: 'Wall of Stone', school: 'con', priority: 8, notes: 'Permanent barrier' },
    { id: 'antilife-shell', name: 'Antilife Shell', school: 'abj', priority: 8, notes: 'Block living creatures' },
    { id: 'repel-wood', name: 'Repel Wood', school: 'trs', priority: 7, notes: 'Push wood away' }
  ],
  
  // Level 7 - Near-godly nature power
  7: [
    { id: 'cure-serious-wounds-mass', name: 'Cure Serious Wounds, Mass', school: 'con', priority: 10, notes: 'Massive party healing' },
    { id: 'creeping-doom', name: 'Creeping Doom', school: 'con', priority: 10, notes: 'Swarms of insects' },
    { id: 'sunbeam', name: 'Sunbeam', school: 'evo', priority: 9, notes: '4d6 + blind undead' },
    { id: 'changestaff', name: 'Changestaff', school: 'trs', priority: 9, notes: 'Staff becomes treant' },
    { id: 'fire-storm', name: 'Fire Storm', school: 'evo', priority: 8, notes: '1d6/level selective AoE' },
    { id: 'wind-walk', name: 'Wind Walk', school: 'trs', priority: 8, notes: 'Party flight/travel' }
  ],
  
  // Level 8 - Environmental mastery
  8: [
    { id: 'cure-critical-wounds-mass', name: 'Cure Critical Wounds, Mass', school: 'con', priority: 10, notes: 'Ultimate party healing' },
    { id: 'earthquake', name: 'Earthquake', school: 'evo', priority: 10, notes: 'Devastate area' },
    { id: 'whirlwind', name: 'Whirlwind', school: 'evo', priority: 9, notes: 'Create tornado' },
    { id: 'sunburst', name: 'Sunburst', school: 'evo', priority: 9, notes: '6d6 + blind' },
    { id: 'finger-of-death', name: 'Finger of Death', school: 'nec', priority: 8, notes: 'Death attack' }
  ],
  
  // Level 9 - Primal forces
  9: [
    { id: 'heal-mass', name: 'Heal, Mass', school: 'con', priority: 10, notes: '250 hp to all allies' },
    { id: 'storm-of-vengeance', name: 'Storm of Vengeance', school: 'con', priority: 10, notes: 'Ultimate weather spell' },
    { id: 'elemental-swarm', name: 'Elemental Swarm', school: 'con', priority: 9, notes: 'Summon elementals' },
    { id: 'shambler', name: 'Shambler', school: 'con', priority: 9, notes: 'Summon shambling mounds' },
    { id: 'shapechange', name: 'Shapechange', school: 'trs', priority: 8, notes: 'Ultimate polymorph' }
  ]
};

/**
 * Select spells for a druid character
 * Druids prepare spells daily like clerics, with nature focus
 */
export function selectDruidSpells(level: number, wisdomScore: number): SpellSelection {
  const abilityMod = getAbilityModifier(wisdomScore);
  const baseSlots = CLERIC_SPELL_SLOTS[level] || CLERIC_SPELL_SLOTS[1];
  
  // Calculate how many spells druid should prepare
  // Similar to cleric: aim for 2-3x daily slots worth of spells
  const spellsPerLevel: number[] = [9999]; // All orisons
  
  for (let spellLevel = 1; spellLevel <= 9; spellLevel++) {
    if (baseSlots[spellLevel] === 0) {
      spellsPerLevel[spellLevel] = 0; // Can't cast this level yet
    } else {
      // Druids have access to all druid spells, prepare subset each day
      // Aim for 2-3x daily slots worth of prepared spells
      const totalSlots = baseSlots[spellLevel] + getBonusSpellSlots(abilityMod, spellLevel);
      const targetSpells = Math.min(
        totalSlots * 3,
        DRUID_SPELL_PRIORITIES[spellLevel]?.length || 0
      );
      
      spellsPerLevel[spellLevel] = Math.max(totalSlots, targetSpells);
    }
  }
  
  // Select spells based on priorities
  const selectedSpells: SpellItem[] = [];
  
  for (let spellLevel = 0; spellLevel <= 9; spellLevel++) {
    const availableSpells = DRUID_SPELL_PRIORITIES[spellLevel] || [];
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
    class: 'druid',
    casterLevel: level,
    spellcastingType: 'divine',
    ability: 'wis',
    spontaneous: false,
    hasSpecialSlot: false, // Druids don't have domain spells like clerics
    arcaneSpellFailure: false, // Divine casters don't have ASF
    spellSlots: buildSpellSlots(baseSlots, abilityMod)
  };
  
  console.log(`Selected ${selectedSpells.length} druid spells for level ${level} druid (WIS ${wisdomScore}, +${abilityMod}):`);
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
