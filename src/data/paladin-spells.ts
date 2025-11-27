/**
 * Paladin Spell List for D&D 3.5e
 * 
 * Paladins are divine spellcasters who gain spells starting at 4th level.
 * They prepare spells from the paladin spell list, which focuses on:
 * - Healing and protection
 * - Smiting evil and detecting alignment
 * - Mount and weapon enhancements
 * - Curing diseases and removing curses
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

// Paladin spell slots by level (from PHB)
// Paladins don't cast until level 4
const PALADIN_SPELL_SLOTS: Record<number, number[]> = {
  1: [0, 0, 0, 0, 0], // Not casting yet
  2: [0, 0, 0, 0, 0],
  3: [0, 0, 0, 0, 0],
  4: [0, 0, 0, 0, 0], // Can cast with Cha bonus only
  5: [0, 0, 0, 0, 0],
  6: [0, 1, 0, 0, 0],
  7: [0, 1, 0, 0, 0],
  8: [0, 1, 0, 0, 0],
  9: [0, 1, 0, 0, 0],
  10: [0, 1, 1, 0, 0],
  11: [0, 1, 1, 0, 0],
  12: [0, 1, 1, 0, 0],
  13: [0, 1, 1, 0, 0],
  14: [0, 2, 1, 1, 0],
  15: [0, 2, 1, 1, 0],
  16: [0, 2, 2, 1, 0],
  17: [0, 2, 2, 1, 0],
  18: [0, 3, 2, 1, 1],
  19: [0, 3, 3, 2, 1],
  20: [0, 3, 3, 3, 2]
};

// =============================================================================
// PALADIN 1ST LEVEL SPELLS
// =============================================================================

export const PALADIN_SPELLS_LEVEL_1: SpellDefinition[] = [
  {
    id: 'bless',
    name: 'Bless',
    level: 1,
    minCasterLevel: 1,
    school: 'Enchantment',
    description: 'Allies gain +1 on attack rolls and saves against fear.',
    tags: ['buff']
  },
  {
    id: 'blessWeapon',
    name: 'Bless Weapon',
    level: 1,
    minCasterLevel: 1,
    school: 'Transmutation',
    description: 'Weapon strikes true against evil (bypasses DR). Iconic paladin spell!',
    tags: ['buff']
  },
  {
    id: 'cureLightWounds',
    name: 'Cure Light Wounds',
    level: 1,
    minCasterLevel: 1,
    school: 'Conjuration',
    description: 'Heals 1d8+1/level (max +5) hp.',
    tags: ['healing']
  },
  {
    id: 'divineFavor',
    name: 'Divine Favor',
    level: 1,
    minCasterLevel: 1,
    school: 'Evocation',
    description: '+1 luck bonus per 3 levels (max +3) on attack and damage. Great self-buff!',
    tags: ['buff']
  },
  {
    id: 'endureElements',
    name: 'Endure Elements',
    level: 1,
    minCasterLevel: 1,
    school: 'Abjuration',
    description: 'Exist comfortably in -50°F to 140°F.',
    tags: ['utility']
  },
  {
    id: 'magicWeapon',
    name: 'Magic Weapon',
    level: 1,
    minCasterLevel: 1,
    school: 'Transmutation',
    description: 'Weapon becomes +1 (overcomes DR/magic).',
    tags: ['buff']
  },
  {
    id: 'protectionFromEvil',
    name: 'Protection from Evil',
    level: 1,
    minCasterLevel: 1,
    school: 'Abjuration',
    description: '+2 AC and saves vs evil. Signature paladin defensive spell!',
    tags: ['defense']
  },
  {
    id: 'lesserRestoration',
    name: 'Restoration, Lesser',
    level: 1,
    minCasterLevel: 1,
    school: 'Conjuration',
    description: 'Dispels magical ability damage or restores 1d4 ability damage.',
    tags: ['healing']
  },
  {
    id: 'detectPoison',
    name: 'Detect Poison',
    level: 1,
    minCasterLevel: 1,
    school: 'Divination',
    description: 'Detects poison in one creature or object.',
    tags: ['detection']
  },
  {
    id: 'detectUndead',
    name: 'Detect Undead',
    level: 1,
    minCasterLevel: 1,
    school: 'Divination',
    description: 'Reveals undead within 60 ft.',
    tags: ['detection']
  },
  {
    id: 'createWater',
    name: 'Create Water',
    level: 1,
    minCasterLevel: 1,
    school: 'Conjuration',
    description: 'Creates 2 gallons/level of pure water.',
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
  }
];

// =============================================================================
// PALADIN 2ND LEVEL SPELLS
// =============================================================================

export const PALADIN_SPELLS_LEVEL_2: SpellDefinition[] = [
  {
    id: 'bullsStrength',
    name: 'Bull\'s Strength',
    level: 2,
    minCasterLevel: 3,
    school: 'Transmutation',
    description: '+4 enhancement bonus to Strength. Excellent combat buff!',
    tags: ['buff']
  },
  {
    id: 'cureModerateWounds',
    name: 'Cure Moderate Wounds',
    level: 2,
    minCasterLevel: 3,
    school: 'Conjuration',
    description: 'Heals 2d8+1/level (max +10) hp.',
    tags: ['healing']
  },
  {
    id: 'delayPoison',
    name: 'Delay Poison',
    level: 2,
    minCasterLevel: 3,
    school: 'Conjuration',
    description: 'Stops poison from harming subject for duration.',
    tags: ['defense']
  },
  {
    id: 'eaglesSplendor',
    name: 'Eagle\'s Splendor',
    level: 2,
    minCasterLevel: 3,
    school: 'Transmutation',
    description: '+4 enhancement bonus to Charisma. Boosts spellcasting!',
    tags: ['buff']
  },
  {
    id: 'owlsWisdom',
    name: 'Owl\'s Wisdom',
    level: 2,
    minCasterLevel: 3,
    school: 'Transmutation',
    description: '+4 enhancement bonus to Wisdom.',
    tags: ['buff']
  },
  {
    id: 'removeParalysis',
    name: 'Remove Paralysis',
    level: 2,
    minCasterLevel: 3,
    school: 'Conjuration',
    description: 'Frees 1-4 creatures from paralysis or slow.',
    tags: ['healing']
  },
  {
    id: 'resistEnergy',
    name: 'Resist Energy',
    level: 2,
    minCasterLevel: 3,
    school: 'Abjuration',
    description: 'Ignore 10 (or more) damage/attack from one energy type. Essential!',
    tags: ['defense']
  },
  {
    id: 'zoneOfTruth',
    name: 'Zone of Truth',
    level: 2,
    minCasterLevel: 3,
    school: 'Enchantment',
    description: 'Subjects within range cannot lie. Iconic paladin spell!',
    tags: ['social']
  },
  {
    id: 'shieldOther',
    name: 'Shield Other',
    level: 2,
    minCasterLevel: 3,
    school: 'Abjuration',
    description: 'You take half of subject\'s damage.',
    tags: ['defense']
  },
  {
    id: 'undetectableAlignment',
    name: 'Undetectable Alignment',
    level: 2,
    minCasterLevel: 3,
    school: 'Abjuration',
    description: 'Conceals alignment for 24 hours.',
    tags: ['utility']
  }
];

// =============================================================================
// PALADIN 3RD LEVEL SPELLS
// =============================================================================

export const PALADIN_SPELLS_LEVEL_3: SpellDefinition[] = [
  {
    id: 'cureSeriousWounds',
    name: 'Cure Serious Wounds',
    level: 3,
    minCasterLevel: 5,
    school: 'Conjuration',
    description: 'Heals 3d8+1/level (max +15) hp.',
    tags: ['healing']
  },
  {
    id: 'daylight',
    name: 'Daylight',
    level: 3,
    minCasterLevel: 5,
    school: 'Evocation',
    description: '60-ft. radius of bright light. Counters darkness.',
    tags: ['utility']
  },
  {
    id: 'discernLies',
    name: 'Discern Lies',
    level: 3,
    minCasterLevel: 5,
    school: 'Divination',
    description: 'Reveals deliberate falsehoods. Upgraded Zone of Truth.',
    tags: ['detection', 'social']
  },
  {
    id: 'dispelMagic',
    name: 'Dispel Magic',
    level: 3,
    minCasterLevel: 5,
    school: 'Abjuration',
    description: 'Cancels magical spells and effects. Essential utility!',
    tags: ['utility']
  },
  {
    id: 'healMount',
    name: 'Heal Mount',
    level: 3,
    minCasterLevel: 5,
    school: 'Conjuration',
    description: 'Heals mount completely. Only for paladin\'s special mount.',
    tags: ['healing']
  },
  {
    id: 'magicCircleAgainstEvil',
    name: 'Magic Circle against Evil',
    level: 3,
    minCasterLevel: 5,
    school: 'Abjuration',
    description: 'As Protection from Evil, but 10-ft. radius. Party-wide protection!',
    tags: ['defense']
  },
  {
    id: 'greaterMagicWeapon',
    name: 'Magic Weapon, Greater',
    level: 3,
    minCasterLevel: 5,
    school: 'Transmutation',
    description: '+1 enhancement/4 levels (max +5). Powerful weapon buff!',
    tags: ['buff']
  },
  {
    id: 'prayer',
    name: 'Prayer',
    level: 3,
    minCasterLevel: 5,
    school: 'Enchantment',
    description: 'Allies +1 on most rolls, enemies -1. Great party buff!',
    tags: ['buff']
  },
  {
    id: 'removeBlindnessDeafness',
    name: 'Remove Blindness/Deafness',
    level: 3,
    minCasterLevel: 5,
    school: 'Conjuration',
    description: 'Cures normal or magical blindness/deafness.',
    tags: ['healing']
  },
  {
    id: 'removeCurse',
    name: 'Remove Curse',
    level: 3,
    minCasterLevel: 5,
    school: 'Abjuration',
    description: 'Frees object or person from curse.',
    tags: ['utility']
  }
];

// =============================================================================
// PALADIN 4TH LEVEL SPELLS
// =============================================================================

export const PALADIN_SPELLS_LEVEL_4: SpellDefinition[] = [
  {
    id: 'breakEnchantment',
    name: 'Break Enchantment',
    level: 4,
    minCasterLevel: 7,
    school: 'Abjuration',
    description: 'Frees subjects from enchantments, transmutations, curses.',
    tags: ['utility']
  },
  {
    id: 'cureCriticalWounds',
    name: 'Cure Critical Wounds',
    level: 4,
    minCasterLevel: 7,
    school: 'Conjuration',
    description: 'Heals 4d8+1/level (max +20) hp. Best paladin healing!',
    tags: ['healing']
  },
  {
    id: 'deathWard',
    name: 'Death Ward',
    level: 4,
    minCasterLevel: 7,
    school: 'Necromancy',
    description: 'Immunity to death spells, energy drain, negative energy. Essential vs undead!',
    tags: ['defense']
  },
  {
    id: 'dispelEvil',
    name: 'Dispel Evil',
    level: 4,
    minCasterLevel: 7,
    school: 'Abjuration',
    description: '+4 AC vs evil, dispel vs evil summons. Iconic paladin spell!',
    tags: ['defense']
  },
  {
    id: 'holySword',
    name: 'Holy Sword',
    level: 4,
    minCasterLevel: 7,
    school: 'Evocation',
    description: 'Weapon becomes +5 holy weapon. ULTIMATE PALADIN SPELL!',
    tags: ['buff']
  },
  {
    id: 'markOfJustice',
    name: 'Mark of Justice',
    level: 4,
    minCasterLevel: 7,
    school: 'Necromancy',
    description: 'Designates action that triggers curse.',
    tags: ['utility']
  },
  {
    id: 'neutralizePoison',
    name: 'Neutralize Poison',
    level: 4,
    minCasterLevel: 7,
    school: 'Conjuration',
    description: 'Immunizes subject against poison, detoxifies venom.',
    tags: ['healing']
  },
  {
    id: 'restoration',
    name: 'Restoration',
    level: 4,
    minCasterLevel: 7,
    school: 'Conjuration',
    description: 'Restores level and ability score drains. Critical vs undead!',
    tags: ['healing']
  }
];

// =============================================================================
// SPELL SELECTION FUNCTION
// =============================================================================

/**
 * Select spells for a Paladin character
 * Paladins start casting at level 4, use Charisma for spellcasting
 */
export function selectPaladinSpells(level: number, charismaScore: number): SpellSelection {
  const abilityMod = getAbilityModifier(charismaScore);
  const baseSlots = PALADIN_SPELL_SLOTS[level] || PALADIN_SPELL_SLOTS[1];

  // Paladins don't cast until level 4
  if (level < 4) {
    return {
      spells: [],
      spellbookConfig: {
        name: 'Primary',
        class: 'paladin',
        casterLevel: 0,
        spellcastingType: 'divine',
        ability: 'cha',
        spontaneous: false,
        hasSpecialSlot: false,
        arcaneSpellFailure: false,
        spellSlots: buildSpellSlots([0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 0)
      }
    };
  }

  // Build spell list based on level
  const selectedSpells: SpellItem[] = [];

  // Helper to add spells with priority
  const addSpell = (spellArray: SpellDefinition[], spellName: string, priority: number) => {
    const spell = spellArray.find(s => s.name === spellName);
    if (spell) {
      selectedSpells.push({
        compendiumId: spell.id,
        name: spell.name,
        level: spell.level,
        school: spell.school,
        preparationMode: 'prepared',
        priority
      });
    }
  };

  // Level 4+: Can cast 1st level spells (with Charisma bonus)
  if (level >= 4) {
    addSpell(PALADIN_SPELLS_LEVEL_1, 'Divine Favor', 100);
    addSpell(PALADIN_SPELLS_LEVEL_1, 'Bless Weapon', 95);
    addSpell(PALADIN_SPELLS_LEVEL_1, 'Protection from Evil', 90);
    addSpell(PALADIN_SPELLS_LEVEL_1, 'Cure Light Wounds', 85);
  }

  if (level >= 6) {
    addSpell(PALADIN_SPELLS_LEVEL_1, 'Bless', 80);
    addSpell(PALADIN_SPELLS_LEVEL_1, 'Restoration, Lesser', 75);
    addSpell(PALADIN_SPELLS_LEVEL_1, 'Endure Elements', 70);
  }

  // Level 10+: Add 2nd level spells
  if (level >= 10) {
    addSpell(PALADIN_SPELLS_LEVEL_2, 'Resist Energy', 100);
    addSpell(PALADIN_SPELLS_LEVEL_2, 'Bull\'s Strength', 95);
    addSpell(PALADIN_SPELLS_LEVEL_2, 'Cure Moderate Wounds', 90);
  }

  if (level >= 12) {
    addSpell(PALADIN_SPELLS_LEVEL_2, 'Zone of Truth', 85);
    addSpell(PALADIN_SPELLS_LEVEL_2, 'Eagle\'s Splendor', 80);
    addSpell(PALADIN_SPELLS_LEVEL_2, 'Remove Paralysis', 75);
  }

  // Level 14+: Add 3rd level spells
  if (level >= 14) {
    addSpell(PALADIN_SPELLS_LEVEL_3, 'Magic Circle against Evil', 100);
    addSpell(PALADIN_SPELLS_LEVEL_3, 'Prayer', 95);
    addSpell(PALADIN_SPELLS_LEVEL_3, 'Dispel Magic', 90);
  }

  if (level >= 16) {
    addSpell(PALADIN_SPELLS_LEVEL_3, 'Magic Weapon, Greater', 85);
    addSpell(PALADIN_SPELLS_LEVEL_3, 'Cure Serious Wounds', 80);
    addSpell(PALADIN_SPELLS_LEVEL_3, 'Remove Curse', 75);
  }

  // Level 18+: Add 4th level spells
  if (level >= 18) {
    addSpell(PALADIN_SPELLS_LEVEL_4, 'Holy Sword', 100);
    addSpell(PALADIN_SPELLS_LEVEL_4, 'Death Ward', 95);
    addSpell(PALADIN_SPELLS_LEVEL_4, 'Dispel Evil', 90);
  }

  if (level >= 19) {
    addSpell(PALADIN_SPELLS_LEVEL_4, 'Cure Critical Wounds', 85);
    addSpell(PALADIN_SPELLS_LEVEL_4, 'Neutralize Poison', 80);
  }

  if (level >= 20) {
    addSpell(PALADIN_SPELLS_LEVEL_4, 'Restoration', 75);
  }

  // Build spellbook configuration
  const spellbookConfig: SpellbookConfiguration = {
    name: 'Primary',
    class: 'paladin',
    casterLevel: level,
    spellcastingType: 'divine',
    ability: 'cha',
    spontaneous: false,
    hasSpecialSlot: false,
    arcaneSpellFailure: false,
    spellSlots: buildSpellSlots(baseSlots, abilityMod)
  };

  console.log(`Selected ${selectedSpells.length} paladin spells for level ${level} paladin (CHA ${charismaScore}, +${abilityMod}):`);
  for (let lvl = 1; lvl <= 4; lvl++) {
    const spellsAtLevel = selectedSpells.filter(s => s.level === lvl);
    const slots = spellbookConfig.spellSlots[`spell${lvl}` as keyof typeof spellbookConfig.spellSlots].max;
    if (spellsAtLevel.length > 0 || slots > 0) {
      console.log(`  Level ${lvl}: ${spellsAtLevel.length} spells (${slots} daily slots)`);
    }
  }

  return {
    spells: selectedSpells,
    spellbookConfig
  };
}

