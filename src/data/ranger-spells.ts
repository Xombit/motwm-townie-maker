/**
 * Ranger Spell List for D&D 3.5e
 * 
 * Rangers are divine spellcasters who gain spells starting at 4th level.
 * They prepare spells from the ranger spell list, which focuses on:
 * - Nature and wilderness magic
 * - Healing and survival
 * - Animal handling and tracking
 * - Environmental adaptation
 */

import { SpellDefinition } from './spells';
import { 
  SpellSelection, 
  SpellItem, 
  SpellbookConfiguration, 
  getAbilityModifier, 
  getBonusSpellSlots, 
  buildSpellSlots 
} from './spell-selection';

// Ranger spell slots by level (from PHB)
// Rangers don't cast until level 4
const RANGER_SPELL_SLOTS: Record<number, number[]> = {
  1: [0, 0, 0, 0, 0], // Not casting yet
  2: [0, 0, 0, 0, 0],
  3: [0, 0, 0, 0, 0],
  4: [0, 0, 0, 0, 0], // Can cast with Wis bonus only
  5: [0, 0, 0, 0, 0],
  6: [0, 1, 0, 0, 0],
  7: [0, 1, 0, 0, 0],
  8: [0, 1, 0, 0, 0],
  9: [0, 1, 0, 0, 0],
  10: [0, 1, 1, 0, 0],
  11: [0, 1, 1, 0, 0],
  12: [0, 1, 1, 1, 0],
  13: [0, 1, 1, 1, 0],
  14: [0, 2, 1, 1, 0],
  15: [0, 2, 1, 1, 1],
  16: [0, 2, 2, 1, 1],
  17: [0, 2, 2, 1, 1],
  18: [0, 3, 2, 1, 1],
  19: [0, 3, 3, 2, 1],
  20: [0, 3, 3, 3, 2]
};

// =============================================================================
// RANGER 1ST LEVEL SPELLS
// =============================================================================

export const RANGER_SPELLS_LEVEL_1: SpellDefinition[] = [
  {
    id: 'alarm',
    name: 'Alarm',
    level: 1,
    minCasterLevel: 1,
    school: 'Abjuration',
    description: 'Wards an area for 2 hours/level. Alerts you of intruders.',
    tags: ['utility']
  },
  {
    id: 'delayPoison',
    name: 'Delay Poison',
    level: 1,
    minCasterLevel: 1,
    school: 'Conjuration',
    description: 'Stops poison from harming subject for 1 hour/level.',
    tags: ['healing']
  },
  {
    id: 'detectAnimalsOrPlants',
    name: 'Detect Animals or Plants',
    level: 1,
    minCasterLevel: 1,
    school: 'Divination',
    description: 'Detects kinds of animals or plants.',
    tags: ['utility']
  },
  {
    id: 'detectPoison',
    name: 'Detect Poison',
    level: 1,
    minCasterLevel: 1,
    school: 'Divination',
    description: 'Detects poison in one creature or object.',
    tags: ['utility']
  },
  {
    id: 'detectSnaresAndPits',
    name: 'Detect Snares and Pits',
    level: 1,
    minCasterLevel: 1,
    school: 'Divination',
    description: 'Reveals natural or primitive traps.',
    tags: ['utility']
  },
  {
    id: 'endureElements',
    name: 'Endure Elements',
    level: 1,
    minCasterLevel: 1,
    school: 'Abjuration',
    description: 'Exist comfortably in hot or cold environments.',
    tags: ['utility']
  },
  {
    id: 'entangle',
    name: 'Entangle',
    level: 1,
    minCasterLevel: 1,
    school: 'Transmutation',
    description: 'Plants entangle everyone in 40-ft. radius.',
    tags: ['control']
  },
  {
    id: 'hideFromAnimals',
    name: 'Hide from Animals',
    level: 1,
    minCasterLevel: 1,
    school: 'Abjuration',
    description: 'Animals cannot perceive one subject/level.',
    tags: ['utility']
  },
  {
    id: 'jump',
    name: 'Jump',
    level: 1,
    minCasterLevel: 1,
    school: 'Transmutation',
    description: 'Subject gets +10/20/30 bonus on Jump checks.',
    tags: ['buff']
  },
  {
    id: 'longstrider',
    name: 'Longstrider',
    level: 1,
    minCasterLevel: 1,
    school: 'Transmutation',
    description: 'Increases your speed by 10 ft. Essential ranger mobility!',
    tags: ['buff']
  },
  {
    id: 'magicFang',
    name: 'Magic Fang',
    level: 1,
    minCasterLevel: 1,
    school: 'Transmutation',
    description: 'One natural weapon gets +1 on attack and damage rolls.',
    tags: ['buff']
  },
  {
    id: 'passWithoutTrace',
    name: 'Pass without Trace',
    level: 1,
    minCasterLevel: 1,
    school: 'Transmutation',
    description: 'One subject/level leaves no tracks. Perfect for rangers!',
    tags: ['utility']
  },
  {
    id: 'readMagic',
    name: 'Read Magic',
    level: 1,
    minCasterLevel: 1,
    school: 'Divination',
    description: 'Read scrolls and spellbooks.',
    tags: ['utility']
  },
  {
    id: 'resistEnergy',
    name: 'Resist Energy',
    level: 1,
    minCasterLevel: 1,
    school: 'Abjuration',
    description: 'Ignores 10 (or more) points of damage/attack from specified energy type.',
    tags: ['defense']
  },
  {
    id: 'speakWithAnimals',
    name: 'Speak with Animals',
    level: 1,
    minCasterLevel: 1,
    school: 'Divination',
    description: 'You can communicate with animals.',
    tags: ['utility']
  }
];

// =============================================================================
// RANGER 2ND LEVEL SPELLS
// =============================================================================

export const RANGER_SPELLS_LEVEL_2: SpellDefinition[] = [
  {
    id: 'barkskin',
    name: 'Barkskin',
    level: 2,
    minCasterLevel: 3,
    school: 'Transmutation',
    description: 'Grants +2 (or higher) enhancement to natural armor.',
    tags: ['buff']
  },
  {
    id: 'bearsEndurance',
    name: "Bear's Endurance",
    level: 2,
    minCasterLevel: 3,
    school: 'Transmutation',
    description: 'Subject gains +4 to Con for 1 min./level.',
    tags: ['buff']
  },
  {
    id: 'catsGrace',
    name: "Cat's Grace",
    level: 2,
    minCasterLevel: 3,
    school: 'Transmutation',
    description: 'Subject gains +4 to Dex for 1 min./level. Essential for archer rangers!',
    tags: ['buff']
  },
  {
    id: 'cureLightWounds',
    name: 'Cure Light Wounds',
    level: 2,
    minCasterLevel: 3,
    school: 'Conjuration',
    description: 'Cures 1d8 damage +1/level (max +5).',
    tags: ['healing']
  },
  {
    id: 'holdAnimal',
    name: 'Hold Animal',
    level: 2,
    minCasterLevel: 3,
    school: 'Enchantment',
    description: 'Paralyzes one animal for 1 round/level.',
    tags: ['control']
  },
  {
    id: 'owlsWisdom',
    name: "Owl's Wisdom",
    level: 2,
    minCasterLevel: 3,
    school: 'Transmutation',
    description: 'Subject gains +4 to Wis for 1 min./level.',
    tags: ['buff']
  },
  {
    id: 'protectionFromEnergy',
    name: 'Protection from Energy',
    level: 2,
    minCasterLevel: 3,
    school: 'Abjuration',
    description: 'Absorb 12 points/level of damage from one kind of energy.',
    tags: ['defense']
  },
  {
    id: 'snare',
    name: 'Snare',
    level: 2,
    minCasterLevel: 3,
    school: 'Transmutation',
    description: 'Creates a magic booby trap.',
    tags: ['utility']
  },
  {
    id: 'speakWithPlants',
    name: 'Speak with Plants',
    level: 2,
    minCasterLevel: 3,
    school: 'Divination',
    description: 'You can talk to normal plants and plant creatures.',
    tags: ['utility']
  },
  {
    id: 'spikeGrowth',
    name: 'Spike Growth',
    level: 2,
    minCasterLevel: 3,
    school: 'Transmutation',
    description: 'Creatures in area take 1d4 damage, may be slowed.',
    tags: ['control']
  },
  {
    id: 'windWall',
    name: 'Wind Wall',
    level: 2,
    minCasterLevel: 3,
    school: 'Evocation',
    description: 'Deflects arrows, smaller creatures, and gases.',
    tags: ['defense']
  }
];

// =============================================================================
// RANGER 3RD LEVEL SPELLS
// =============================================================================

export const RANGER_SPELLS_LEVEL_3: SpellDefinition[] = [
  {
    id: 'commandPlants',
    name: 'Command Plants',
    level: 3,
    minCasterLevel: 5,
    school: 'Transmutation',
    description: 'Sway the actions of one or more plant creatures.',
    tags: ['control']
  },
  {
    id: 'cureModerateWounds',
    name: 'Cure Moderate Wounds',
    level: 3,
    minCasterLevel: 5,
    school: 'Conjuration',
    description: 'Cures 2d8 damage +1/level (max +10).',
    tags: ['healing']
  },
  {
    id: 'darkvision',
    name: 'Darkvision',
    level: 3,
    minCasterLevel: 5,
    school: 'Transmutation',
    description: 'See 60 ft. in total darkness.',
    tags: ['utility']
  },
  {
    id: 'diminishPlants',
    name: 'Diminish Plants',
    level: 3,
    minCasterLevel: 5,
    school: 'Transmutation',
    description: 'Reduces size or blights growth of normal plants.',
    tags: ['utility']
  },
  {
    id: 'greaterMagicFang',
    name: 'Magic Fang, Greater',
    level: 3,
    minCasterLevel: 5,
    school: 'Transmutation',
    description: 'One natural weapon gets +1/three caster levels (max +5) on attack and damage.',
    tags: ['buff']
  },
  {
    id: 'neutralizePoison',
    name: 'Neutralize Poison',
    level: 3,
    minCasterLevel: 5,
    school: 'Conjuration',
    description: 'Immunizes subject against poison, detoxifies venom in or on subject.',
    tags: ['healing']
  },
  {
    id: 'plantGrowth',
    name: 'Plant Growth',
    level: 3,
    minCasterLevel: 5,
    school: 'Transmutation',
    description: 'Grows vegetation, improves crops.',
    tags: ['utility']
  },
  {
    id: 'reduceAnimal',
    name: 'Reduce Animal',
    level: 3,
    minCasterLevel: 5,
    school: 'Transmutation',
    description: 'Shrinks one willing animal.',
    tags: ['utility']
  },
  {
    id: 'removeDisease',
    name: 'Remove Disease',
    level: 3,
    minCasterLevel: 5,
    school: 'Conjuration',
    description: 'Cures all diseases affecting subject.',
    tags: ['healing']
  },
  {
    id: 'repelVermin',
    name: 'Repel Vermin',
    level: 3,
    minCasterLevel: 5,
    school: 'Abjuration',
    description: 'Insects, spiders, and other vermin stay 10 ft. away.',
    tags: ['defense']
  },
  {
    id: 'treeShape',
    name: 'Tree Shape',
    level: 3,
    minCasterLevel: 5,
    school: 'Transmutation',
    description: 'You look exactly like a tree for 1 hour/level.',
    tags: ['utility']
  },
  {
    id: 'waterWalk',
    name: 'Water Walk',
    level: 3,
    minCasterLevel: 5,
    school: 'Transmutation',
    description: 'Subject treads on water as if solid.',
    tags: ['utility']
  }
];

// =============================================================================
// RANGER 4TH LEVEL SPELLS
// =============================================================================

export const RANGER_SPELLS_LEVEL_4: SpellDefinition[] = [
  {
    id: 'animalGrowth',
    name: 'Animal Growth',
    level: 4,
    minCasterLevel: 7,
    school: 'Transmutation',
    description: 'One animal/two levels doubles in size.',
    tags: ['buff']
  },
  {
    id: 'communeWithNature',
    name: 'Commune with Nature',
    level: 4,
    minCasterLevel: 7,
    school: 'Divination',
    description: 'Learn about terrain for 1 mile/level.',
    tags: ['utility']
  },
  {
    id: 'cureSeriousWounds',
    name: 'Cure Serious Wounds',
    level: 4,
    minCasterLevel: 7,
    school: 'Conjuration',
    description: 'Cures 3d8 damage +1/level (max +15).',
    tags: ['healing']
  },
  {
    id: 'freedomOfMovement',
    name: 'Freedom of Movement',
    level: 4,
    minCasterLevel: 7,
    school: 'Abjuration',
    description: 'Subject moves normally despite impediments. Essential ranger spell!',
    tags: ['utility']
  },
  {
    id: 'nondetection',
    name: 'Nondetection',
    level: 4,
    minCasterLevel: 7,
    school: 'Abjuration',
    description: 'Hides subject from divination and scrying.',
    tags: ['defense']
  },
  {
    id: 'treeStride',
    name: 'Tree Stride',
    level: 4,
    minCasterLevel: 7,
    school: 'Conjuration',
    description: 'Step from one tree to another far away.',
    tags: ['utility']
  }
];

// =============================================================================
// SPELL SELECTION
// =============================================================================

/**
 * Select spells for a Ranger character
 */
export function selectRangerSpells(
  characterLevel: number,
  wisdomScore: number
): SpellSelection {
  // Rangers don't cast until level 4
  if (characterLevel < 4) {
    return {
      spells: [],
      spellbook: {
        class: 'Ranger',
        preparedSpells: {},
        availableSpellLevels: []
      }
    };
  }

  const wisdomMod = getAbilityModifier(wisdomScore);
  const baseSlots = RANGER_SPELL_SLOTS[characterLevel];
  const spellSlots = buildSpellSlots(baseSlots, wisdomMod);

  // Build spell list by level
  const allSpells: Record<number, SpellDefinition[]> = {
    1: RANGER_SPELLS_LEVEL_1,
    2: RANGER_SPELLS_LEVEL_2,
    3: RANGER_SPELLS_LEVEL_3,
    4: RANGER_SPELLS_LEVEL_4
  };

  // Spell priorities for Rangers (nature-focused)
  const priorities: Record<number, string[]> = {
    1: [
      'longstrider',        // Movement speed
      'resistEnergy',       // Energy protection
      'passWithoutTrace',   // Stealth/tracking
      'endureElements',     // Environmental protection
      'entangle',           // Battlefield control
      'detectSnaresAndPits' // Trap detection
    ],
    2: [
      'cureLightWounds',    // Healing
      'catsGrace',          // Dex boost (archery)
      'barkskin',           // AC boost
      'bearsEndurance',     // Con boost
      'protectionFromEnergy', // Better energy protection
      'owlsWisdom'          // Wis boost (casting)
    ],
    3: [
      'cureModerateWounds', // Better healing
      'darkvision',         // See in dark
      'neutralizePoison',   // Poison cure
      'removeDisease',      // Disease cure
      'waterWalk',          // Mobility
      'greaterMagicFang'    // Animal companion buff
    ],
    4: [
      'cureSeriousWounds',  // Best healing
      'freedomOfMovement',  // Anti-grapple/entangle
      'communeWithNature',  // Information gathering
      'treeStride'          // Teleportation
    ]
  };

  const selectedSpells: SpellItem[] = [];
  const preparedSpells: Record<number, string[]> = {};
  const availableSpellLevels: number[] = [];

  // Select spells for each level the ranger can cast
  for (let spellLevel = 1; spellLevel <= 4; spellLevel++) {
    if (spellSlots[spellLevel] === 0) continue;

    availableSpellLevels.push(spellLevel);
    const levelSpells = allSpells[spellLevel];
    const levelPriorities = priorities[spellLevel];
    preparedSpells[spellLevel] = [];

    // Select spells based on priority and available slots
    const slotsForLevel = spellSlots[spellLevel];
    let selected = 0;

    // First, add priority spells
    for (const spellId of levelPriorities) {
      if (selected >= slotsForLevel * 2) break; // Prepare 2x slots for flexibility

      const spell = levelSpells.find(s => s.id === spellId);
      if (spell) {
        selectedSpells.push({
          spell: spell,
          prepared: selected < slotsForLevel, // Mark first N as prepared
          spellLevel: spellLevel
        });

        if (selected < slotsForLevel) {
          preparedSpells[spellLevel].push(spell.id);
        }
        selected++;
      }
    }

    // Fill remaining slots with other useful spells
    for (const spell of levelSpells) {
      if (selected >= slotsForLevel * 2) break;
      if (levelPriorities.includes(spell.id)) continue;

      selectedSpells.push({
        spell: spell,
        prepared: false,
        spellLevel: spellLevel
      });
      selected++;
    }
  }

  return {
    spells: selectedSpells,
    spellbook: {
      class: 'Ranger',
      preparedSpells: preparedSpells,
      availableSpellLevels: availableSpellLevels,
      abilityScore: wisdomScore,
      spellSlots: spellSlots
    }
  };
}
