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
 * Get recommended metamagic rods for a caster at a given level and budget
 * 
 * Priority order:
 * 1. Extend (Lesser) - Double buff durations, incredible value at 3,000 gp
 * 2. Empower (Lesser) - +50% damage, great for damage spells
 * 3. Quicken (Lesser) - Swift action casting, game-changing when affordable
 * 4. Normal tier versions as budget allows
 * 5. Greater tier for high levels
 */
export function selectRods(
  level: number,
  budget: number,
  characterClass: string
): { rods: RodRecommendation[]; totalCost: number } {
  const selectedRods: RodRecommendation[] = [];
  let remainingBudget = budget;
  
  // No rods below level 5 (not enough budget to be worthwhile)
  if (level < 5 || budget < 3000) {
    return { rods: [], totalCost: 0 };
  }

  // Define rod priority by level tier
  // At each tier, we prefer certain rods based on their value
  const rodPriorities: { key: string; minLevel: number; priority: number }[] = [
    // Level 5+: Lesser rods
    { key: 'extend-lesser', minLevel: 5, priority: 1 },    // 3,000 gp - best value
    { key: 'empower-lesser', minLevel: 7, priority: 2 },   // 9,000 gp - damage boost
    { key: 'maximize-lesser', minLevel: 9, priority: 3 },  // 14,000 gp - max damage
    { key: 'quicken-lesser', minLevel: 11, priority: 4 },  // 35,000 gp - swift action
    
    // Level 13+: Normal rods
    { key: 'extend-normal', minLevel: 13, priority: 5 },   // 11,000 gp
    { key: 'empower-normal', minLevel: 13, priority: 6 },  // 32,500 gp
    { key: 'maximize-normal', minLevel: 15, priority: 7 }, // 54,000 gp
    { key: 'quicken-normal', minLevel: 17, priority: 8 },  // 75,500 gp
    
    // Level 17+: Greater rods
    { key: 'extend-greater', minLevel: 17, priority: 9 },  // 24,500 gp
    { key: 'empower-greater', minLevel: 17, priority: 10 }, // 73,000 gp
    { key: 'maximize-greater', minLevel: 19, priority: 11 }, // 121,500 gp
    { key: 'quicken-greater', minLevel: 20, priority: 12 }  // 170,000 gp (only at L20)
  ];

  // Filter by level and sort by priority
  const availableRods = rodPriorities
    .filter(rp => level >= rp.minLevel)
    .sort((a, b) => a.priority - b.priority);

  // Select rods within budget, max 2-3 rods
  const maxRods = level >= 17 ? 3 : (level >= 13 ? 2 : 1);
  
  for (const rodPriority of availableRods) {
    if (selectedRods.length >= maxRods) break;
    
    const rod = METAMAGIC_RODS[rodPriority.key];
    if (!rod) continue;
    
    // Check if we can afford it
    if (rod.price <= remainingBudget) {
      // Don't get lesser version if we already have normal/greater of same feat
      const hasBetterVersion = selectedRods.some(sr => 
        sr.rod.metamagicFeat === rod.metamagicFeat && 
        (sr.rod.tier === 'normal' || sr.rod.tier === 'greater')
      );
      
      if (!hasBetterVersion) {
        selectedRods.push({
          rod,
          priority: rodPriority.priority,
          reasoning: getRodReasoning(rod, level)
        });
        remainingBudget -= rod.price;
      }
    }
  }

  const totalCost = selectedRods.reduce((sum, sr) => sum + sr.rod.price, 0);
  
  console.log(`Rod Selection for Level ${level} (${budget} gp budget):`);
  if (selectedRods.length > 0) {
    for (const sr of selectedRods) {
      console.log(`  ${sr.rod.name} (${sr.rod.price} gp) - ${sr.reasoning}`);
    }
    console.log(`  Total: ${totalCost} gp`);
  } else {
    console.log(`  No rods selected (insufficient budget or level)`);
  }

  return { rods: selectedRods, totalCost };
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
 * - Ultimate (170,500-211,000): Passage, Power
 */
export function selectStaff(
  level: number,
  budget: number,
  characterClass: string
): { staff: StaffRecommendation | null; totalCost: number } {
  // No staffs below level 10 (not enough budget)
  if (level < 10 || budget < 16500) {
    return { staff: null, totalCost: 0 };
  }

  const className = characterClass.toLowerCase();
  
  // Define staff priorities by class
  let staffPriorities: string[] = [];
  
  if (className === 'wizard' || className === 'sorcerer') {
    // Arcane casters prefer offensive/utility staffs
    staffPriorities = ['evocation', 'fire', 'transmutation', 'power', 'conjuration'];
  } else if (className === 'cleric') {
    // Clerics prefer healing and defensive staffs
    staffPriorities = ['healing', 'abjuration', 'necromancy'];
  } else if (className === 'druid') {
    // Druids prefer nature-themed staffs
    staffPriorities = ['woodlands', 'healing', 'conjuration'];
  } else if (className === 'bard') {
    // Bards prefer enchantment and utility
    staffPriorities = ['charming', 'enchantment', 'illumination'];
  } else {
    // Default priority for other casters
    staffPriorities = ['fire', 'evocation', 'healing'];
  }

  // Find best affordable staff
  for (const staffKey of staffPriorities) {
    const staff = STAFFS[staffKey];
    if (!staff) continue;
    
    // Check if we can afford it
    if (staff.price <= budget) {
      // Level requirements for expensive staffs
      if (staff.price > 100000 && level < 17) continue;  // Woodlands, Passage, Power
      if (staff.price > 65000 && level < 15) continue;   // School staffs above base
      
      const staffRec: StaffRecommendation = {
        staff,
        priority: staffPriorities.indexOf(staffKey) + 1,
        reasoning: getStaffReasoning(staff, characterClass)
      };
      
      console.log(`Staff Selection for Level ${level} ${className} (${budget} gp budget):`);
      console.log(`  ${staff.name} (${staff.price} gp) - ${staffRec.reasoning}`);
      
      return { staff: staffRec, totalCost: staff.price };
    }
  }

  console.log(`Staff Selection for Level ${level} ${className}: No affordable staff found`);
  return { staff: null, totalCost: 0 };
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
}

/**
 * Select both rods and staff for a caster
 * 
 * Budget split philosophy:
 * - Levels 5-9: 100% rods (staffs too expensive)
 * - Levels 10-12: 40% rods, 60% staff (get first staff)
 * - Levels 13-16: 50% rods, 50% staff (balance both)
 * - Levels 17+: 40% rods, 60% staff (staff of power priority)
 */
export function selectCasterItems(
  level: number,
  budget: number,
  characterClass: string
): CasterItemSelection {
  console.log(`\n=== CASTER ITEM SELECTION (Level ${level}, ${budget} gp) ===`);
  
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
  } else {
    // Staff of Power priority
    rodPercent = 0.40;
    staffPercent = 0.60;
  }
  
  const rodBudget = Math.floor(budget * rodPercent);
  const staffBudget = Math.floor(budget * staffPercent);
  
  console.log(`Budget split: Rods ${rodBudget} gp (${(rodPercent * 100).toFixed(0)}%), Staff ${staffBudget} gp (${(staffPercent * 100).toFixed(0)}%)`);
  
  // Select staff first (more important at higher levels)
  const staffResult = selectStaff(level, staffBudget, characterClass);
  
  // Give leftover staff budget to rods
  const leftoverBudget = staffBudget - staffResult.totalCost;
  const actualRodBudget = rodBudget + leftoverBudget;
  
  // Select rods
  const rodsResult = selectRods(level, actualRodBudget, characterClass);
  
  const totalCost = rodsResult.totalCost + staffResult.totalCost;
  
  console.log(`\nFinal Selection:`);
  console.log(`  Rods: ${rodsResult.rods.length} items (${rodsResult.totalCost} gp)`);
  console.log(`  Staff: ${staffResult.staff ? staffResult.staff.staff.name : 'None'} (${staffResult.totalCost} gp)`);
  console.log(`  Total: ${totalCost} gp`);
  console.log(`  Remaining: ${budget - totalCost} gp`);
  console.log(`=== CASTER ITEM SELECTION COMPLETE ===\n`);
  
  return {
    rods: rodsResult.rods,
    staff: staffResult.staff,
    rodsCost: rodsResult.totalCost,
    staffCost: staffResult.totalCost,
    totalCost
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
