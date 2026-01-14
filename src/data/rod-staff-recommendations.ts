/**
 * ROD AND STAFF RECOMMENDATIONS FOR CASTERS
 * 
 * This module handles selection of metamagic rods and staffs for spellcasters.
 * These items replace weapon enhancements for pure casters (wizard, sorcerer).
 * 
 * PHILOSOPHY:
 * - Metamagic rods allow applying metamagic feats WITHOUT increasing spell slot
 * - Staffs provide flexible spell libraries at YOUR caster level and save DC
 * - Rods are better for efficiency (boost existing spells)
 * - Staffs are better for versatility (cast spells you didn't prepare)
 * 
 * BUDGET TIERS (based on caster analysis):
 * - Levels 5-8: Lesser rods only (3,000-9,000 gp)
 * - Levels 9-12: Lesser rods, maybe one cheap staff (9,000-30,000 gp)
 * - Levels 13-16: Normal rods + cheaper staffs (32,500-65,000 gp)
 * - Levels 17-20: Greater rods + Staff of Power (73,000-211,000 gp)
 */

// =============================================================================
// ROD DEFINITIONS
// =============================================================================

/**
 * Metamagic rod tier - determines what spell levels it can affect
 */
export type RodTier = 'lesser' | 'normal' | 'greater';

/**
 * Metamagic rod definition
 */
export interface MetamagicRodDefinition {
  id: string;           // D35E compendium ID (if available)
  name: string;         // Full rod name
  metamagicFeat: string; // Which metamagic feat it applies
  tier: RodTier;        // lesser/normal/greater
  maxSpellLevel: number; // Max spell level it can affect (3/6/9)
  price: number;        // Cost in gold pieces
  usesPerDay: number;   // How many times per day (usually 3)
  description: string;  // What the rod does
}

/**
 * Metamagic Rod Pricing (from D&D 3.5e SRD)
 * 
 * Lesser (≤3rd level spells): Base price for +1 equivalent
 * Normal (≤6th level spells): Base price for +2 equivalent  
 * Greater (≤9th level spells): Base price for +3 equivalent
 * 
 * Metamagic feat cost determines base price:
 * - +1 level (Enlarge, Extend, Silent): 3,000 / 11,000 / 24,500 gp
 * - +2 level (Empower): 9,000 / 32,500 / 73,000 gp
 * - +3 level (Maximize): 14,000 / 54,000 / 121,500 gp
 * - +4 level (Quicken): 35,000 / 75,500 / 170,000 gp
 */
export const METAMAGIC_RODS: Record<string, MetamagicRodDefinition> = {
  // === EXTEND (Double Duration) ===
  'extend-lesser': {
    id: 'PR40O5awfBo8y8Pu',
    name: 'Rod of Metamagic, Extend, Lesser',
    metamagicFeat: 'Extend Spell',
    tier: 'lesser',
    maxSpellLevel: 3,
    price: 3000,
    usesPerDay: 3,
    description: 'Double the duration of spells up to 3rd level, 3/day'
  },
  'extend-normal': {
    id: 'ZtN9FezDmIW9PmAT',
    name: 'Rod of Metamagic, Extend, Normal',
    metamagicFeat: 'Extend Spell',
    tier: 'normal',
    maxSpellLevel: 6,
    price: 11000,
    usesPerDay: 3,
    description: 'Double the duration of spells up to 6th level, 3/day'
  },
  'extend-greater': {
    id: 'ZJxTpuoC5yNXnauN',
    name: 'Rod of Metamagic, Extend, Greater',
    metamagicFeat: 'Extend Spell',
    tier: 'greater',
    maxSpellLevel: 9,
    price: 24500,
    usesPerDay: 3,
    description: 'Double the duration of spells up to 9th level, 3/day'
  },

  // === ENLARGE (Double Range) ===
  'enlarge-lesser': {
    id: 'j0OJN22xKcHkxNYW',
    name: 'Rod of Metamagic, Enlarge, Lesser',
    metamagicFeat: 'Enlarge Spell',
    tier: 'lesser',
    maxSpellLevel: 3,
    price: 3000,
    usesPerDay: 3,
    description: 'Double the range of spells up to 3rd level, 3/day'
  },
  'enlarge-normal': {
    id: 'oRQ6RwUXShCOByPB',
    name: 'Rod of Metamagic, Enlarge, Normal',
    metamagicFeat: 'Enlarge Spell',
    tier: 'normal',
    maxSpellLevel: 6,
    price: 11000,
    usesPerDay: 3,
    description: 'Double the range of spells up to 6th level, 3/day'
  },
  'enlarge-greater': {
    id: 'nzyUfCBXmLqwiiAW',
    name: 'Rod of Metamagic, Enlarge, Greater',
    metamagicFeat: 'Enlarge Spell',
    tier: 'greater',
    maxSpellLevel: 9,
    price: 24500,
    usesPerDay: 3,
    description: 'Double the range of spells up to 9th level, 3/day'
  },

  // === SILENT (No Verbal Components) ===
  'silent-lesser': {
    id: 'U3boIj5wtJ0tz4gU',
    name: 'Rod of Metamagic, Silent, Lesser',
    metamagicFeat: 'Silent Spell',
    tier: 'lesser',
    maxSpellLevel: 3,
    price: 3000,
    usesPerDay: 3,
    description: 'Cast spells up to 3rd level without verbal components, 3/day'
  },
  'silent-normal': {
    id: '2HfFDoYPbXbaUEFM',
    name: 'Rod of Metamagic, Silent, Normal',
    metamagicFeat: 'Silent Spell',
    tier: 'normal',
    maxSpellLevel: 6,
    price: 11000,
    usesPerDay: 3,
    description: 'Cast spells up to 6th level without verbal components, 3/day'
  },
  'silent-greater': {
    id: 'P2ztHcfEStDdXdO4',
    name: 'Rod of Metamagic, Silent, Greater',
    metamagicFeat: 'Silent Spell',
    tier: 'greater',
    maxSpellLevel: 9,
    price: 24500,
    usesPerDay: 3,
    description: 'Cast spells up to 9th level without verbal components, 3/day'
  },

  // === EMPOWER (+50% Variable Effects) ===
  'empower-lesser': {
    id: 'Y15597aP2xwtbEjC',
    name: 'Rod of Metamagic, Empower, Lesser',
    metamagicFeat: 'Empower Spell',
    tier: 'lesser',
    maxSpellLevel: 3,
    price: 9000,
    usesPerDay: 3,
    description: '+50% to variable numeric effects (damage, healing) for spells up to 3rd level, 3/day'
  },
  'empower-normal': {
    id: 'e6Xldz6oDN4unTYF',
    name: 'Rod of Metamagic, Empower, Normal',
    metamagicFeat: 'Empower Spell',
    tier: 'normal',
    maxSpellLevel: 6,
    price: 32500,
    usesPerDay: 3,
    description: '+50% to variable numeric effects for spells up to 6th level, 3/day'
  },
  'empower-greater': {
    id: '0cMkNGXRejP6nMMC',
    name: 'Rod of Metamagic, Empower, Greater',
    metamagicFeat: 'Empower Spell',
    tier: 'greater',
    maxSpellLevel: 9,
    price: 73000,
    usesPerDay: 3,
    description: '+50% to variable numeric effects for spells up to 9th level, 3/day'
  },

  // === MAXIMIZE (Maximum Variable Effects) ===
  'maximize-lesser': {
    id: 'eFIsaqjFlUXc0871',
    name: 'Rod of Metamagic, Maximize, Lesser',
    metamagicFeat: 'Maximize Spell',
    tier: 'lesser',
    maxSpellLevel: 3,
    price: 14000,
    usesPerDay: 3,
    description: 'Maximize all variable numeric effects for spells up to 3rd level, 3/day'
  },
  'maximize-normal': {
    id: 'q424MQQDkS5jgpiQ',
    name: 'Rod of Metamagic, Maximize, Normal',
    metamagicFeat: 'Maximize Spell',
    tier: 'normal',
    maxSpellLevel: 6,
    price: 54000,
    usesPerDay: 3,
    description: 'Maximize all variable numeric effects for spells up to 6th level, 3/day'
  },
  'maximize-greater': {
    id: 'sP1xcC0jTe7qNDXa',
    name: 'Rod of Metamagic, Maximize, Greater',
    metamagicFeat: 'Maximize Spell',
    tier: 'greater',
    maxSpellLevel: 9,
    price: 121500,
    usesPerDay: 3,
    description: 'Maximize all variable numeric effects for spells up to 9th level, 3/day'
  },

  // === QUICKEN (Swift Action Cast) ===
  'quicken-lesser': {
    id: 'zmS083JKDbGVhAzL',
    name: 'Rod of Metamagic, Quicken, Lesser',
    metamagicFeat: 'Quicken Spell',
    tier: 'lesser',
    maxSpellLevel: 3,
    price: 35000,
    usesPerDay: 3,
    description: 'Cast spells up to 3rd level as swift actions, 3/day'
  },
  'quicken-normal': {
    id: 'rs5sOS8WdA8ZWYv7',
    name: 'Rod of Metamagic, Quicken, Normal',
    metamagicFeat: 'Quicken Spell',
    tier: 'normal',
    maxSpellLevel: 6,
    price: 75500,
    usesPerDay: 3,
    description: 'Cast spells up to 6th level as swift actions, 3/day'
  },
  'quicken-greater': {
    id: 'j74GqOjGQxlLg5Hy',
    name: 'Rod of Metamagic, Quicken, Greater',
    metamagicFeat: 'Quicken Spell',
    tier: 'greater',
    maxSpellLevel: 9,
    price: 170000,
    usesPerDay: 3,
    description: 'Cast spells up to 9th level as swift actions, 3/day'
  }
} as const;

// =============================================================================
// UTILITY ROD DEFINITIONS
// =============================================================================

export interface UtilityRodDefinition {
  id: string;
  name: string;
  price: number;
  description: string;
  usesPerDay?: number;
}

export const UTILITY_RODS: Record<string, UtilityRodDefinition> = {
  'absorption': {
    id: '3wSpzWLleO4AYlA1',
    name: 'Rod of Absorption',
    price: 50000,
    description: 'Absorbs spells targeted at you (up to 50 spell levels). Use stored energy to cast your own spells.'
  },
  'negation': {
    id: 'lHiJXzyg8KvbiLzy',
    name: 'Rod of Negation',
    price: 37000,
    usesPerDay: 3,
    description: 'Dispel magic vs items, 3/day'
  },
  'splendor': {
    id: 'TnYIqcvhwuHacN0e',
    name: 'Rod of Splendor',
    price: 25000,
    description: '+4 enhancement bonus to Charisma while held. Creates fine clothes and pavilion.'
  }
} as const;

// =============================================================================
// STAFF DEFINITIONS
// =============================================================================

export interface StaffSpell {
  name: string;
  charges: number;
}

export interface StaffDefinition {
  id: string;           // D35E compendium ID (if available)
  name: string;
  price: number;
  charges: number;      // Usually 50 when new
  spells: StaffSpell[]; // Spells contained in the staff
  weaponBonus?: number; // Some staffs are +1/+2 quarterstaffs
  bonusToAC?: number;   // Staff of Power gives +2 luck to AC
  bonusToSaves?: number; // Staff of Power gives +2 luck to saves
  description: string;
}

/**
 * Staff pricing notes:
 * - School staffs (Evocation, Conjuration, etc.) are all 65,000 gp
 * - Staff of Fire (28,500 gp) is the most affordable combat staff
 * - Staff of Healing (27,750 gp) is best for divine casters
 * - Staff of Power (211,000 gp) is the ultimate arcane staff
 */
export const STAFFS: Record<string, StaffDefinition> = {
  // === AFFORDABLE STAFFS (Level 10-13) ===
  'charming': {
    id: 'qb4onLydtyD2i2Qk',
    name: 'Staff of Charming',
    price: 16500,
    charges: 50,
    spells: [
      { name: 'Charm Person', charges: 1 },
      { name: 'Charm Monster', charges: 2 }
    ],
    description: 'Enchantment-focused staff. Great for social encounters.'
  },
  'fire': {
    id: 'KOUlwwjFLuVVyqet',
    name: 'Staff of Fire',
    price: 17750,
    charges: 50,
    spells: [
      { name: 'Burning Hands', charges: 1 },
      { name: 'Fireball', charges: 1 },
      { name: 'Wall of Fire', charges: 2 }
    ],
    description: 'Evocation staff. All spells use YOUR caster level and save DC!'
  },
  'healing': {
    id: 'wR5wutMkZEv0EvOq',
    name: 'Staff of Healing',
    price: 27750,
    charges: 50,
    spells: [
      { name: 'Lesser Restoration', charges: 1 },
      { name: 'Cure Serious Wounds', charges: 1 },
      { name: 'Remove Blindness/Deafness', charges: 2 },
      { name: 'Remove Disease', charges: 3 }
    ],
    description: 'Divine caster must-have. Flexible healing and condition removal.'
  },
  'illumination': {
    id: '3HPdqcJToIv5NrTS',
    name: 'Staff of Illumination',
    price: 48250,
    charges: 50,
    spells: [
      { name: 'Dancing Lights', charges: 1 },
      { name: 'Flare', charges: 1 },
      { name: 'Daylight', charges: 2 },
      { name: 'Sunburst', charges: 3 }
    ],
    description: 'Light-based spells. Sunburst is devastating vs undead.'
  },

  // === MID-TIER STAFFS (Level 13-15) ===
  'frost': {
    id: '0t8wWGTVhXeajpQr',
    name: 'Staff of Frost',
    price: 56250,
    charges: 50,
    spells: [
      { name: 'Ice Storm', charges: 1 },
      { name: 'Wall of Ice', charges: 2 },
      { name: 'Cone of Cold', charges: 3 }
    ],
    weaponBonus: 2,
    description: 'Cold damage evocation. Also functions as +2 quarterstaff.'
  },
  'defense': {
    id: '9vYZFdJXeOEp3L6M',
    name: 'Staff of Defense',
    price: 58250,
    charges: 50,
    spells: [
      { name: 'Shield', charges: 1 },
      { name: 'Shield of Faith', charges: 1 },
      { name: 'Shield Other', charges: 1 },
      { name: 'Shield of Law', charges: 3 }
    ],
    description: 'Defensive spells for protecting yourself and allies.'
  },

  // === SCHOOL STAFFS (Level 15+) ===
  'evocation': {
    id: 'NDBp3OQA1QCVVYEJ',
    name: 'Staff of Evocation',
    price: 65000,
    charges: 50,
    spells: [
      { name: 'Magic Missile', charges: 1 },
      { name: 'Shatter', charges: 1 },
      { name: 'Fireball', charges: 1 },
      { name: 'Ice Storm', charges: 2 },
      { name: 'Wall of Force', charges: 2 },
      { name: 'Chain Lightning', charges: 3 }
    ],
    description: 'Comprehensive evocation suite. Great for blaster wizards.'
  },
  'conjuration': {
    id: 'EMwU6H7WZ2OyI3FH',
    name: 'Staff of Conjuration',
    price: 65000,
    charges: 50,
    spells: [
      { name: 'Unseen Servant', charges: 1 },
      { name: 'Stinking Cloud', charges: 1 },
      { name: 'Minor Creation', charges: 2 },
      { name: "Cloudkill", charges: 2 },
      { name: 'Major Creation', charges: 3 }
    ],
    description: 'Summoning and creation spells.'
  },
  'enchantment': {
    id: '37gXSMx9UMOxOPcW',
    name: 'Staff of Enchantment',
    price: 65000,
    charges: 50,
    spells: [
      { name: 'Sleep', charges: 1 },
      { name: 'Hideous Laughter', charges: 1 },
      { name: 'Suggestion', charges: 2 },
      { name: 'Crushing Despair', charges: 2 },
      { name: 'Mind Fog', charges: 3 },
      { name: 'Mass Suggestion', charges: 3 }
    ],
    description: 'Mind-affecting spells for social and combat control.'
  },
  'necromancy': {
    id: 'ewsQYTmwiGPgJMII',
    name: 'Staff of Necromancy',
    price: 65000,
    charges: 50,
    spells: [
      { name: 'Cause Fear', charges: 1 },
      { name: 'Ghoul Touch', charges: 1 },
      { name: 'Halt Undead', charges: 1 },
      { name: 'Enervation', charges: 2 },
      { name: 'Waves of Fatigue', charges: 2 },
      { name: 'Circle of Death', charges: 3 }
    ],
    description: 'Death and fear effects. Great for battlefield control.'
  },
  'transmutation': {
    id: 'b0R82BVJyqayO74B',
    name: 'Staff of Transmutation',
    price: 65000,
    charges: 50,
    spells: [
      { name: 'Expeditious Retreat', charges: 1 },
      { name: 'Alter Self', charges: 2 },
      { name: 'Blink', charges: 2 },
      { name: 'Polymorph', charges: 3 },
      { name: 'Baleful Polymorph', charges: 3 },
      { name: 'Disintegrate', charges: 3 }
    ],
    description: 'Transformation and movement spells.'
  },
  'abjuration': {
    id: 'y4Y3ltYlVIeEDIj9',
    name: 'Staff of Abjuration',
    price: 65000,
    charges: 50,
    spells: [
      { name: 'Shield', charges: 1 },
      { name: 'Resist Energy', charges: 1 },
      { name: 'Dispel Magic', charges: 1 },
      { name: 'Lesser Globe of Invulnerability', charges: 2 },
      { name: 'Dismissal', charges: 2 },
      { name: 'Repulsion', charges: 3 }
    ],
    description: 'Protection and dispelling. Defensive spellcasting.'
  },
  'illusion': {
    id: 'lzhDqhSQVdBw6eYp',
    name: 'Staff of Illusion',
    price: 65000,
    charges: 50,
    spells: [
      { name: 'Disguise Self', charges: 1 },
      { name: 'Mirror Image', charges: 1 },
      { name: 'Major Image', charges: 1 },
      { name: 'Rainbow Pattern', charges: 2 },
      { name: 'Persistent Image', charges: 2 },
      { name: 'Mislead', charges: 3 }
    ],
    description: 'Illusion spells for deception and misdirection.'
  },
  'divination': {
    id: 'WDDxJL8SXxfeFuly',
    name: 'Staff of Divination',
    price: 73500,
    charges: 50,
    spells: [
      { name: 'Detect Secret Doors', charges: 1 },
      { name: 'Locate Object', charges: 2 },
      { name: 'Tongues', charges: 2 },
      { name: 'Locate Creature', charges: 3 },
      { name: 'Prying Eyes', charges: 3 },
      { name: 'True Seeing', charges: 3 }
    ],
    description: 'Information gathering spells.'
  },

  // === HIGH-TIER STAFFS (Level 17+) ===
  'earthAndStone': {
    id: 'DTGgmFoDE8ZEvVTY',
    name: 'Staff of Earth and Stone',
    price: 80500,
    charges: 50,
    spells: [
      { name: 'Passwall', charges: 1 },
      { name: 'Move Earth', charges: 1 }
    ],
    description: 'Terrain manipulation for dungeon delving.'
  },
  'woodlands': {
    id: 'Ljavrp5n7vYyD4Rn',
    name: 'Staff of Woodlands',
    price: 101250,
    charges: 50,
    spells: [
      { name: 'Charm Animal', charges: 1 },
      { name: 'Speak with Animals', charges: 1 },
      { name: 'Barkskin', charges: 2 },
      { name: 'Summon Nature\'s Ally VI', charges: 3 },
      { name: 'Wall of Thorns', charges: 3 },
      { name: 'Animate Plants', charges: 4 }
    ],
    weaponBonus: 2,
    description: 'Druid\'s best friend. Also functions as +2 quarterstaff and Pass without Trace at will.'
  },
  'life': {
    id: 'R8UzYDngNvXNVEMp',
    name: 'Staff of Life',
    price: 155750,
    charges: 50,
    spells: [
      { name: 'Heal', charges: 1 },
      { name: 'Resurrection', charges: 5 }
    ],
    description: 'Ultimate divine healing staff. Resurrection without costly components!'
  },
  'passage': {
    id: 'f474tSI6bRAd76Ks',
    name: 'Staff of Passage',
    price: 170500,
    charges: 50,
    spells: [
      { name: 'Dimension Door', charges: 1 },
      { name: 'Passwall', charges: 1 },
      { name: 'Phase Door', charges: 2 },
      { name: 'Greater Teleport', charges: 2 },
      { name: 'Astral Projection', charges: 2 }
    ],
    description: 'Ultimate mobility. Teleportation on demand.'
  },

  // === ULTIMATE STAFF ===
  'power': {
    id: 'DyMHNfRtxKJmR7Yh',
    name: 'Staff of Power',
    price: 211000,
    charges: 50,
    spells: [
      { name: 'Magic Missile', charges: 1 },
      { name: 'Ray of Enfeeblement', charges: 1 },
      { name: 'Continual Flame', charges: 1 },
      { name: 'Levitate', charges: 1 },
      { name: 'Lightning Bolt', charges: 1 },
      { name: 'Fireball', charges: 1 },
      { name: 'Cone of Cold', charges: 2 },
      { name: 'Hold Monster', charges: 2 },
      { name: 'Wall of Force', charges: 2 },
      { name: 'Globe of Invulnerability', charges: 2 }
    ],
    weaponBonus: 2,
    bonusToAC: 2,
    bonusToSaves: 2,
    description: 'The ultimate arcane staff. +2 quarterstaff, +2 luck to AC and saves. Can be broken for retributive strike (200 ft. radius, 20d6 damage).'
  },
  'magi': {
    id: 'dMrF7SyYfvvuEDTp',
    name: 'Staff of the Magi',
    price: 0, // Artifact - no price
    charges: 50,
    spells: [
      { name: 'Spell Absorption', charges: 0 },
      { name: 'Detect Magic', charges: 0 },
      { name: 'Enlarge Person', charges: 0 },
      { name: 'Hold Portal', charges: 0 },
      { name: 'Light', charges: 0 },
      { name: 'Mage Armor', charges: 0 },
      { name: 'Mage Hand', charges: 0 }
    ],
    description: 'Legendary artifact staff. Absorbs spells and has many at-will abilities.'
  },
  'swarmingInsects': {
    id: 'oNLdYcsibE18CTrC',
    name: 'Staff of Swarming Insects',
    price: 24750,
    charges: 50,
    spells: [
      { name: 'Summon Swarm', charges: 1 },
      { name: 'Insect Plague', charges: 3 }
    ],
    description: 'Summon insect swarms for area denial.'
  },
  'sizeAlteration': {
    id: 'Qd9cr6IKI6xyNoQa',
    name: 'Staff of Size Alteration',
    price: 29000,
    charges: 50,
    spells: [
      { name: 'Enlarge Person', charges: 1 },
      { name: 'Reduce Person', charges: 1 },
      { name: 'Shrink Item', charges: 1 },
      { name: 'Mass Enlarge Person', charges: 1 }
    ],
    description: 'Size manipulation spells.'
  }
} as const;

// =============================================================================
// ROD SELECTION RECOMMENDATIONS BY LEVEL
// =============================================================================

export interface RodRecommendation {
  rod: MetamagicRodDefinition;
  priority: number;     // Lower = higher priority
  reasoning: string;
}

/**
 * Shuffle an array in place using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Get recommended metamagic rods for a caster at a given level and budget
 * 
 * Priority order (with randomization):
 * - 60% chance: Quicken gets top priority (action economy is king)
 * - 40% chance: Skip Quicken, prioritize other metamagics first
 * - Within each tier, rods are shuffled for variety
 * 
 * This creates interesting variety - sometimes you get the "optimal" Quicken build,
 * sometimes you get a character who prefers Extend/Empower/Maximize instead.
 * 
 * @param forceGreaterQuicken - If true, buy Greater Quicken Rod regardless of budget (from special purchase decision)
 */
export function selectRods(
  level: number,
  budget: number,
  characterClass: string,
  forceGreaterQuicken: boolean = false
): { rods: RodRecommendation[]; totalCost: number; overspend: number } {
  const selectedRods: RodRecommendation[] = [];
  let remainingBudget = budget;
  let overspend = 0;
  
  // No rods below level 5 (not enough budget to be worthwhile) - unless forcing Greater Quicken
  if (!forceGreaterQuicken && (level < 5 || budget < 3000)) {
    return { rods: [], totalCost: 0, overspend: 0 };
  }

  // SPECIAL PURCHASE: Greater Quicken Rod (if decision was made in selectCasterItems)
  if (forceGreaterQuicken) {
    const greaterQuicken = METAMAGIC_RODS['quicken-greater'];
    if (greaterQuicken) {
      overspend = Math.max(0, greaterQuicken.price - budget);
      console.log(`  🎯 SPECIAL PURCHASE: Greater Quicken Rod: ${greaterQuicken.price} gp, Budget: ${budget} gp, Overspend: ${overspend} gp`);
      
      selectedRods.push({
        rod: greaterQuicken,
        priority: 1,
        reasoning: 'SPECIAL PURCHASE: Cast ANY spell (up to 9th level) as a swift action, 3/day!'
      });
      remainingBudget = Math.max(0, budget - greaterQuicken.price);
      
      // Continue buying other rods with remaining budget if any
      console.log(`  Remaining budget after Greater Quicken: ${remainingBudget} gp`);
    }
  }

  // RANDOMIZATION: Should this character prioritize Quicken?
  // 60% chance to prioritize Quicken (the "optimal" choice)
  // 40% chance to skip Quicken entirely and focus on other metamagics
  // Skip this roll if we already bought Greater Quicken
  const prioritizeQuicken = forceGreaterQuicken ? false : (Math.random() < 0.60);
  if (!forceGreaterQuicken) {
    console.log(`Rod Selection: ${prioritizeQuicken ? 'PRIORITIZING Quicken' : 'SKIPPING Quicken'} (random roll)`);
  }

  // Define rod pools by tier - each pool is shuffled for variety
  let rodPools: { tier: number; rods: { key: string; minLevel: number }[] }[] = [];
  
  if (level >= 17) {
    if (prioritizeQuicken) {
      rodPools = [
        // Tier 1: Quicken rods (action economy is king)
        { tier: 1, rods: shuffleArray([
          { key: 'quicken-greater', minLevel: 20 },
          { key: 'quicken-normal', minLevel: 17 },
          { key: 'quicken-lesser', minLevel: 17 }
        ])},
        // Tier 2: Greater rods (shuffled for variety)
        { tier: 2, rods: shuffleArray([
          { key: 'extend-greater', minLevel: 17 },
          { key: 'empower-greater', minLevel: 17 },
          { key: 'maximize-greater', minLevel: 19 }
        ])},
        // Tier 3: Normal rods (shuffled)
        { tier: 3, rods: shuffleArray([
          { key: 'extend-normal', minLevel: 17 },
          { key: 'empower-normal', minLevel: 17 },
          { key: 'maximize-normal', minLevel: 17 }
        ])},
        // Tier 4: Lesser rods (shuffled)
        { tier: 4, rods: shuffleArray([
          { key: 'extend-lesser', minLevel: 17 },
          { key: 'empower-lesser', minLevel: 17 },
          { key: 'maximize-lesser', minLevel: 17 }
        ])}
      ];
    } else {
      // Skip Quicken - focus on other metamagics
      rodPools = [
        // Tier 1: Greater rods first (shuffled)
        { tier: 1, rods: shuffleArray([
          { key: 'extend-greater', minLevel: 17 },
          { key: 'empower-greater', minLevel: 17 },
          { key: 'maximize-greater', minLevel: 19 }
        ])},
        // Tier 2: Normal rods (shuffled)
        { tier: 2, rods: shuffleArray([
          { key: 'extend-normal', minLevel: 17 },
          { key: 'empower-normal', minLevel: 17 },
          { key: 'maximize-normal', minLevel: 17 }
        ])},
        // Tier 3: Lesser rods (shuffled)
        { tier: 3, rods: shuffleArray([
          { key: 'extend-lesser', minLevel: 17 },
          { key: 'empower-lesser', minLevel: 17 },
          { key: 'maximize-lesser', minLevel: 17 }
        ])}
        // NO Quicken rods in this build!
      ];
    }
  } else if (level >= 13) {
    if (prioritizeQuicken) {
      rodPools = [
        // Tier 1: Quicken (if affordable)
        { tier: 1, rods: [
          { key: 'quicken-lesser', minLevel: 13 }
        ]},
        // Tier 2: Normal rods (shuffled)
        { tier: 2, rods: shuffleArray([
          { key: 'extend-normal', minLevel: 13 },
          { key: 'empower-normal', minLevel: 13 },
          { key: 'maximize-normal', minLevel: 15 }
        ])},
        // Tier 3: Lesser rods (shuffled)
        { tier: 3, rods: shuffleArray([
          { key: 'extend-lesser', minLevel: 13 },
          { key: 'empower-lesser', minLevel: 13 },
          { key: 'maximize-lesser', minLevel: 13 }
        ])}
      ];
    } else {
      // Skip Quicken
      rodPools = [
        // Tier 1: Normal rods first (shuffled)
        { tier: 1, rods: shuffleArray([
          { key: 'extend-normal', minLevel: 13 },
          { key: 'empower-normal', minLevel: 13 },
          { key: 'maximize-normal', minLevel: 15 }
        ])},
        // Tier 2: Lesser rods (shuffled)
        { tier: 2, rods: shuffleArray([
          { key: 'extend-lesser', minLevel: 13 },
          { key: 'empower-lesser', minLevel: 13 },
          { key: 'maximize-lesser', minLevel: 13 }
        ])}
      ];
    }
  } else {
    // Lower levels: Lesser rods only
    if (prioritizeQuicken && level >= 11) {
      rodPools = [
        // Tier 1: Quicken if you can afford it
        { tier: 1, rods: [
          { key: 'quicken-lesser', minLevel: 11 }
        ]},
        // Tier 2: Other lesser rods (shuffled for variety)
        { tier: 2, rods: shuffleArray([
          { key: 'extend-lesser', minLevel: 5 },
          { key: 'empower-lesser', minLevel: 7 },
          { key: 'maximize-lesser', minLevel: 9 }
        ])}
      ];
    } else {
      // Skip Quicken or too low level
      rodPools = [
        // Just other lesser rods (shuffled)
        { tier: 1, rods: shuffleArray([
          { key: 'extend-lesser', minLevel: 5 },
          { key: 'empower-lesser', minLevel: 7 },
          { key: 'maximize-lesser', minLevel: 9 }
        ])}
      ];
    }
  }

  // Flatten pools into priority list
  const availableRods: { key: string; minLevel: number; priority: number }[] = [];
  let priorityCounter = 1;
  for (const pool of rodPools) {
    for (const rod of pool.rods) {
      if (level >= rod.minLevel) {
        availableRods.push({ ...rod, priority: priorityCounter++ });
      }
    }
  }

  // Select rods within budget
  const maxRods = level >= 17 ? 8 : (level >= 13 ? 4 : (level >= 9 ? 2 : 1));
  
  console.log(`Rod selection: Level ${level}, Budget ${budget} gp, Max rods ${maxRods}`);
  
  for (const rodPriority of availableRods) {
    if (selectedRods.length >= maxRods) break;
    
    const rod = METAMAGIC_RODS[rodPriority.key];
    if (!rod) continue;
    
    // Check if we can afford it
    if (rod.price <= remainingBudget) {
      // Don't get another version of same metamagic feat we already have
      const hasAnyVersionOfSameFeat = selectedRods.some(sr => 
        sr.rod.metamagicFeat === rod.metamagicFeat
      );
      
      if (!hasAnyVersionOfSameFeat) {
        selectedRods.push({
          rod,
          priority: rodPriority.priority,
          reasoning: getRodReasoning(rod, level)
        });
        remainingBudget -= rod.price;
        console.log(`  + ${rod.name} (${rod.price} gp), remaining: ${remainingBudget} gp`);
      }
    }
  }
  
  // SECOND PASS: If significant budget remaining (> 30%), buy additional rods
  const budgetThreshold = budget * 0.30;
  if (remainingBudget > budgetThreshold && selectedRods.length < maxRods) {
    console.log(`  Second pass: ${remainingBudget} gp remaining, looking for more rods...`);
    
    for (const rodPriority of availableRods) {
      if (selectedRods.length >= maxRods) break;
      
      const rod = METAMAGIC_RODS[rodPriority.key];
      if (!rod || rod.price > remainingBudget) continue;
      
      // Check if we already have this exact rod OR any version of same metamagic
      const alreadyHave = selectedRods.some(sr => sr.rod.name === rod.name);
      const hasAnyVersionOfSameFeat = selectedRods.some(sr => 
        sr.rod.metamagicFeat === rod.metamagicFeat
      );
      
      // In second pass, allow buying different tier of same feat (e.g., Lesser Extend if you have Greater Extend)
      // This gives more uses per day across different spell levels
      if (!alreadyHave && !hasAnyVersionOfSameFeat) {
        selectedRods.push({
          rod,
          priority: rodPriority.priority,
          reasoning: getRodReasoning(rod, level)
        });
        remainingBudget -= rod.price;
        console.log(`  + (extra) ${rod.name} (${rod.price} gp), remaining: ${remainingBudget} gp`);
      }
    }
  }
  
  // THIRD PASS: For level 17+ with HUGE budgets (>50k remaining), allow duplicate metamagics at different tiers
  // e.g., Greater Empower for high-level spells AND Lesser Empower for low-level spells
  if (level >= 17 && remainingBudget > 50000 && selectedRods.length < maxRods) {
    console.log(`  Third pass (high-level): ${remainingBudget} gp remaining, looking for secondary tier rods...`);
    
    for (const rodPriority of availableRods) {
      if (selectedRods.length >= maxRods) break;
      
      const rod = METAMAGIC_RODS[rodPriority.key];
      if (!rod || rod.price > remainingBudget) continue;
      
      // Check if we already have this exact rod
      const alreadyHave = selectedRods.some(sr => sr.rod.name === rod.name);
      
      if (!alreadyHave) {
        selectedRods.push({
          rod,
          priority: rodPriority.priority + 100, // Lower priority for duplicates
          reasoning: `${getRodReasoning(rod, level)} (secondary tier for versatility)`
        });
        remainingBudget -= rod.price;
        console.log(`  + (secondary tier) ${rod.name} (${rod.price} gp), remaining: ${remainingBudget} gp`);
      }
    }
  }

  const totalCost = selectedRods.reduce((sum, sr) => sum + sr.rod.price, 0);
  
  console.log(`Rod Selection for Level ${level} (${budget} gp budget):`);
  if (selectedRods.length > 0) {
    for (const sr of selectedRods) {
      console.log(`  ${sr.rod.name} (${sr.rod.price} gp) - ${sr.reasoning}`);
    }
    console.log(`  Total: ${totalCost} gp, Remaining: ${remainingBudget} gp`);
    if (overspend > 0) {
      console.log(`  ⚠️ Overspend: ${overspend} gp (from special purchase)`);
    }
  } else {
    console.log(`  No rods selected (insufficient budget or level)`);
  }

  return { rods: selectedRods, totalCost, overspend };
}

function getRodReasoning(rod: MetamagicRodDefinition, level: number): string {
  switch (rod.metamagicFeat) {
    case 'Extend Spell':
      return 'Double buff durations without using higher spell slots';
    case 'Empower Spell':
      return '+50% damage/healing on your best spells';
    case 'Maximize Spell':
      return 'Guaranteed maximum damage for devastating strikes';
    case 'Quicken Spell':
      return 'Cast spells as swift actions - two spells per round!';
    default:
      return rod.description;
  }
}

// =============================================================================
// STAFF SELECTION RECOMMENDATIONS BY LEVEL
// =============================================================================

export interface StaffRecommendation {
  staff: StaffDefinition;
  priority: number;
  reasoning: string;
}

/**
 * Get recommended staff for a caster at a given level and budget
 * 
 * Staff selection by class:
 * - Wizard/Sorcerer: Staff of Evocation, Transmutation, or Power
 * - Cleric: Staff of Healing, then Life
 * - Druid: Staff of the Woodlands
 * 
 * Price tiers:
 * - Cheap (16,500-28,500): Charming, Fire, Healing
 * - Mid (48,250-65,000): School staffs
 * - High (82,000-101,250): Conjuration, Abjuration, Woodlands
 * - Ultimate (155,750-211,000): Life, Passage, Power
 * 
 * New approach: Buy the most expensive staff you can afford from preferred list.
 * This gives more variety at high levels instead of always buying Evocation.
 * 
 * SPECIAL: Level 20 arcane casters have 50% chance to "decide" on Staff of Power,
 * purchasing it even if it exceeds the budget. The overspend is tracked and
 * deducted from final gold.
 * 
 * @param forceStaffOfPower - If true, buy Staff of Power regardless of budget (from special purchase decision)
 */
export function selectStaff(
  level: number,
  budget: number,
  characterClass: string,
  forceStaffOfPower: boolean = false
): { staff: StaffRecommendation | null; totalCost: number; overspend: number } {
  // Debug: Show incoming budget
  console.log(`selectStaff called: Level ${level}, Budget ${budget} gp, Class ${characterClass}${forceStaffOfPower ? ' [FORCE STAFF OF POWER]' : ''}`);
  
  // No staffs below level 10 (not enough budget) - unless forcing Staff of Power
  if (!forceStaffOfPower && (level < 10 || budget < 16500)) {
    return { staff: null, totalCost: 0, overspend: 0 };
  }

  const className = characterClass.toLowerCase();
  
  // SPECIAL PURCHASE: Staff of Power (if decision was made in selectCasterItems)
  const staffOfPower = STAFFS['power'];
  if (forceStaffOfPower && staffOfPower) {
    const overspend = Math.max(0, staffOfPower.price - budget);
    console.log(`  🎯 SPECIAL PURCHASE: Staff of Power: ${staffOfPower.price} gp, Budget: ${budget} gp, Overspend: ${overspend} gp`);
    
    const staffRec: StaffRecommendation = {
      staff: staffOfPower,
      priority: 1,
      reasoning: 'SPECIAL PURCHASE: The ultimate arcane staff - offense, defense, and can break for emergency nuke!'
    };
    
    return { staff: staffRec, totalCost: staffOfPower.price, overspend };
  }
  
  // Define preferred staffs by class - larger lists for more variety
  // The algorithm will pick the most expensive affordable one from this list
  let preferredStaffs: string[] = [];
  
  if (className === 'wizard' || className === 'sorcerer') {
    // Arcane casters - wide variety of options
    // Power > Passage > school staffs > affordable staffs
    preferredStaffs = [
      'power',          // 211,000 - ultimate arcane staff
      'passage',        // 170,500 - teleportation on demand
      'evocation',      // 65,000 - blaster classics
      'transmutation',  // 65,000 - polymorph, disintegrate
      'conjuration',    // 65,000 - cloudkill, summoning
      'necromancy',     // 65,000 - enervation, circle of death  
      'enchantment',    // 65,000 - mind control
      'illusion',       // 65,000 - deception
      'abjuration',     // 65,000 - protection, dispel
      'frost',          // 56,250 - cold damage + weapon
      'fire',           // 17,750 - classic fire spells
      'charming'        // 16,500 - budget enchantment
    ];
  } else if (className === 'cleric') {
    // Clerics prefer healing, defense, and necromancy (for evil clerics)
    preferredStaffs = [
      'life',           // 155,750 - heal + resurrection!
      'passage',        // 170,500 - mobility for the party
      'healing',        // 27,750 - affordable healing
      'abjuration',     // 65,000 - protection spells
      'necromancy',     // 65,000 - death effects (some deities)
      'defense',        // 58,250 - shield spells
      'illumination'    // 48,250 - sunburst vs undead!
    ];
  } else if (className === 'druid') {
    // Druids prefer nature-themed staffs
    preferredStaffs = [
      'woodlands',      // 101,250 - the druid's best friend
      'life',           // 155,750 - heal + resurrection
      'passage',        // 170,500 - mobility
      'swarmingInsects',// 24,750 - insect plague
      'healing',        // 27,750 - affordable healing
      'conjuration',    // 65,000 - summoning
      'earthAndStone'   // 80,500 - terrain manipulation
    ];
  } else if (className === 'bard') {
    // Bards prefer enchantment and utility
    preferredStaffs = [
      'passage',        // 170,500 - mobility
      'enchantment',    // 65,000 - mass suggestion
      'illusion',       // 65,000 - deception
      'charming',       // 16,500 - social encounters
      'divination',     // 73,500 - true seeing, info gathering
      'illumination'    // 48,250 - light-based utility
    ];
  } else {
    // Default priority for other casters
    preferredStaffs = [
      'passage',        // 170,500 - universally useful
      'life',           // 155,750 - if they can use it
      'evocation',      // 65,000 - damage spells
      'fire',           // 17,750 - affordable damage
      'healing'         // 27,750 - if they can use it
    ];
  }

  // Filter to staffs this character can afford and meets level requirements for
  // Level requirements:
  // - Level 20: Staff of Power (211k) - only at max level
  // - Level 17+: Staff of Life (155k), Passage (170k), Woodlands (101k)
  // - Level 15+: School staffs (65k+), Earth and Stone (80k), Divination (73k)
  // - Level 13+: Defense (58k), Frost (56k), Illumination (48k)
  // - Level 10+: Fire (17k), Healing (27k), Charming (16k), etc.
  
  const affordableStaffs = preferredStaffs
    .map(key => ({ key, staff: STAFFS[key] }))
    .filter(({ key, staff }) => {
      if (!staff) return false;
      if (staff.price > budget) return false;
      if (staff.price === 0) return false;  // Artifacts like Staff of the Magi
      
      // Level gates for expensive staffs
      if (staff.price >= 200000 && level < 20) return false;  // Power (level 20 only)
      if (staff.price >= 100000 && level < 17) return false;  // Life, Passage, Woodlands
      if (staff.price >= 65000 && level < 15) return false;   // School staffs
      if (staff.price >= 48000 && level < 13) return false;   // Mid-tier
      
      return true;
    });

  if (affordableStaffs.length === 0) {
    console.log(`Staff Selection for Level ${level} ${className}: No affordable staff found within ${budget} gp budget`);
    return { staff: null, totalCost: 0, overspend: 0 };
  }

  // Sort by price descending
  affordableStaffs.sort((a, b) => b.staff.price - a.staff.price);
  
  // RANDOMIZATION: Don't always pick the most expensive!
  // - 50% chance to pick the most expensive affordable staff
  // - 30% chance to pick from the top 3 options (weighted toward expensive)
  // - 20% chance to pick any affordable staff (true variety)
  const roll = Math.random();
  let chosen;
  
  if (roll < 0.50 || affordableStaffs.length === 1) {
    // 50%: Pick the most expensive (optimal choice)
    chosen = affordableStaffs[0];
    console.log(`Staff Selection: Rolled optimal (${(roll * 100).toFixed(0)}%) - picking most expensive`);
  } else if (roll < 0.80 && affordableStaffs.length >= 2) {
    // 30%: Pick from top 3 (or however many are available)
    const topChoices = affordableStaffs.slice(0, Math.min(3, affordableStaffs.length));
    chosen = topChoices[Math.floor(Math.random() * topChoices.length)];
    console.log(`Staff Selection: Rolled top-tier (${(roll * 100).toFixed(0)}%) - picking from top ${topChoices.length} options`);
  } else {
    // 20%: Pick any affordable staff (variety!)
    chosen = affordableStaffs[Math.floor(Math.random() * affordableStaffs.length)];
    console.log(`Staff Selection: Rolled variety (${(roll * 100).toFixed(0)}%) - picking randomly from all ${affordableStaffs.length} options`);
  }
  
  const staffRec: StaffRecommendation = {
    staff: chosen.staff,
    priority: 1,  // It's our top pick
    reasoning: getStaffReasoning(chosen.staff, characterClass)
  };
  
  console.log(`Staff Selection for Level ${level} ${className} (${budget} gp budget):`);
  console.log(`  Chose ${chosen.staff.name} (${chosen.staff.price} gp)`);
  console.log(`  Reasoning: ${staffRec.reasoning}`);
  console.log(`  Other affordable options: ${affordableStaffs.filter(s => s !== chosen).map(s => s.staff.name).join(', ') || 'none'}`);

  return { staff: staffRec, totalCost: chosen.staff.price, overspend: 0 };
}

function getStaffReasoning(staff: StaffDefinition, characterClass: string): string {
  const className = characterClass.toLowerCase();
  
  switch (staff.name) {
    case 'Staff of Fire':
      return 'Affordable blast staff - Fireball at YOUR caster level!';
    case 'Staff of Healing':
      return 'Essential for any healer - flexible condition removal';
    case 'Staff of Evocation':
      return 'Full evocation suite from Magic Missile to Chain Lightning';
    case 'Staff of Power':
      return 'The ultimate arcane staff - offense, defense, and can break for emergency nuke';
    case 'Staff of the Woodlands':
      return 'Perfect for druids - nature spells plus +2 quarterstaff';
    case 'Staff of Charming':
      return 'Social encounters and mind control at your fingertips';
    default:
      return staff.description;
  }
}

// =============================================================================
// COMBINED SELECTION
// =============================================================================

export interface CasterItemSelection {
  rods: RodRecommendation[];
  staff: StaffRecommendation | null;
  rodsCost: number;
  staffCost: number;
  totalCost: number;
  overspend: number;  // Amount over budget (e.g., for Staff of Power special purchase)
}

/**
 * Select both rods and staff for a caster
 * 
 * Budget split philosophy:
 * - Levels 5-9: 100% rods (staffs too expensive)
 * - Levels 10-12: 40% rods, 60% staff (get first staff)
 * - Levels 13-16: 50% rods, 50% staff (balance both)
 * - Levels 17-19: 30% rods, 70% staff (high-end staffs priority)
 * - Level 20: 40% rods, 60% staff (special purchases handled separately)
 * 
 * SPECIAL PURCHASES (Level 20 arcane casters only):
 * - 50% chance to "decide" on a special purchase
 * - If yes, randomly choose between Staff of Power OR Greater Quicken Rod
 * - The overspend is tracked and deducted from final gold
 */
export function selectCasterItems(
  level: number,
  budget: number,
  characterClass: string
): CasterItemSelection {
  console.log(`\n=== CASTER ITEM SELECTION (Level ${level}, ${budget} gp) ===`);
  
  const className = characterClass.toLowerCase();
  const isArcaneCaster = ['wizard', 'sorcerer'].includes(className);
  
  // SPECIAL PURCHASE DECISION (Level 20 arcane casters only)
  // Decide FIRST before any budget splits, so staff and rod selection know what's happening
  type SpecialPurchase = 'staff-of-power' | 'greater-quicken' | 'none';
  let specialPurchase: SpecialPurchase = 'none';
  
  if (level >= 20 && isArcaneCaster) {
    const wantsSpecialPurchase = Math.random() < 0.50;
    if (wantsSpecialPurchase) {
      // 50/50 between Staff of Power and Greater Quicken Rod
      specialPurchase = Math.random() < 0.50 ? 'staff-of-power' : 'greater-quicken';
      console.log(`🎯 Level 20 ${className}: SPECIAL PURCHASE - ${specialPurchase === 'staff-of-power' ? 'Staff of Power' : 'Greater Quicken Rod'}!`);
    } else {
      console.log(`Level 20 ${className}: Decided to skip special purchase, buying normally.`);
    }
  }
  
  // Determine budget split
  let rodPercent: number;
  let staffPercent: number;
  
  if (level < 10) {
    // No staffs yet, all to rods
    rodPercent = 1.0;
    staffPercent = 0.0;
  } else if (level < 13) {
    // First staff priority
    rodPercent = 0.40;
    staffPercent = 0.60;
  } else if (level < 17) {
    // Balance both
    rodPercent = 0.50;
    staffPercent = 0.50;
  } else if (level < 20) {
    // High-end staffs priority (Life, Passage, Woodlands)
    rodPercent = 0.30;
    staffPercent = 0.70;
  } else {
    // Level 20: Normal split - special purchases handled via overspend logic
    rodPercent = 0.40;
    staffPercent = 0.60;
  }
  
  const rodBudget = Math.floor(budget * rodPercent);
  const staffBudget = Math.floor(budget * staffPercent);
  
  console.log(`Budget split: Rods ${rodBudget} gp (${(rodPercent * 100).toFixed(0)}%), Staff ${staffBudget} gp (${(staffPercent * 100).toFixed(0)}%)`);
  
  // Select staff first (more important at higher levels)
  // Pass the special purchase decision so it knows whether to buy Staff of Power
  const staffResult = selectStaff(level, staffBudget, characterClass, specialPurchase === 'staff-of-power');
  
  // Give leftover staff budget to rods
  const leftoverBudget = staffBudget - staffResult.totalCost;
  const actualRodBudget = rodBudget + leftoverBudget;
  
  // Select rods
  // Pass the special purchase decision so it knows whether to buy Greater Quicken
  const rodsResult = selectRods(level, actualRodBudget, characterClass, specialPurchase === 'greater-quicken');
  
  const totalCost = rodsResult.totalCost + staffResult.totalCost;
  const totalOverspend = staffResult.overspend + rodsResult.overspend;
  
  console.log(`\nFinal Selection:`);
  console.log(`  Rods: ${rodsResult.rods.length} items (${rodsResult.totalCost} gp)`);
  console.log(`  Staff: ${staffResult.staff ? staffResult.staff.staff.name : 'None'} (${staffResult.totalCost} gp)`);
  console.log(`  Total: ${totalCost} gp`);
  if (totalOverspend > 0) {
    console.log(`  ⚠️ Special purchase overspend: ${totalOverspend} gp (will be deducted from final gold)`);
  }
  console.log(`  Remaining: ${budget - totalCost} gp`);
  console.log(`=== CASTER ITEM SELECTION COMPLETE ===\n`);
  
  return {
    rods: rodsResult.rods,
    staff: staffResult.staff,
    rodsCost: rodsResult.totalCost,
    staffCost: staffResult.totalCost,
    totalCost,
    overspend: totalOverspend
  };
}

// =============================================================================
// HELPER: CHECK IF CLASS IS PURE CASTER
// =============================================================================

/**
 * Determine if a class should skip weapon enhancements entirely
 * and use rods/staffs instead
 */
export function isPureCaster(characterClass: string): boolean {
  const className = characterClass.toLowerCase();
  return ['wizard', 'sorcerer'].includes(className);
}

/**
 * Determine if a class should skip armor enhancements
 * (uses Bracers of Armor instead)
 */
export function skipArmorEnhancements(characterClass: string): boolean {
  const className = characterClass.toLowerCase();
  // Wizards and Sorcerers can't wear armor (arcane spell failure)
  return ['wizard', 'sorcerer'].includes(className);
}

/**
 * Determine if a class is a divine caster who CAN wear armor
 */
export function isDivineCaster(characterClass: string): boolean {
  const className = characterClass.toLowerCase();
  return ['cleric', 'druid'].includes(className);
}
