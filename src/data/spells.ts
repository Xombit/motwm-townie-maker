/**
 * Spell definitions for consumable creation (wands, scrolls, potions)
 * 
 * Wand Pricing Formula (D&D 3.5):
 * - Wand cost = Spell Level × Caster Level × 750 gp
 * - Minimum CL = minimum level to cast the spell
 * - 50 charges per wand
 * 
 * Example: Wand of Cure Light Wounds (CL 1) = 1 × 1 × 750 = 750 gp
 * Example: Wand of Fireball (CL 5) = 3 × 5 × 750 = 11,250 gp
 */

/**
 * Spell definition for creating consumables
 */
export interface SpellDefinition {
  /** Spell ID from D35E.spells compendium */
  id: string;
  /** Display name */
  name: string;
  /** Spell level (0-9) */
  level: number;
  /** Minimum caster level to cast this spell */
  minCasterLevel: number;
  /** Spell school (evo, con, trs, etc.) */
  school: string;
  /** Brief description for selection logic */
  description: string;
  /** Tags for categorization */
  tags: SpellTag[];
}

export type SpellTag = 
  | 'healing'      // Healing spells
  | 'buff'         // Buffs/enhancements
  | 'defense'      // Defensive spells
  | 'utility'      // General utility
  | 'damage'       // Direct damage
  | 'control'      // Battlefield control
  | 'summon'       // Summoning
  | 'detection'    // Detection/divination
  | 'movement'     // Movement/teleportation
  | 'social';      // Social/charm spells

/**
 * Calculate wand cost based on spell level and caster level
 */
export function calculateWandCost(spellLevel: number, casterLevel: number): number {
  // 0-level spells use 1/2 spell level (minimum 0.5)
  const effectiveSpellLevel = spellLevel === 0 ? 0.5 : spellLevel;
  return Math.round(effectiveSpellLevel * casterLevel * 750);
}

/**
 * Calculate scroll cost based on spell level and caster level
 */
export function calculateScrollCost(spellLevel: number, casterLevel: number): number {
  // Scroll cost = Spell Level × Caster Level × 25 gp
  const effectiveSpellLevel = spellLevel === 0 ? 0.5 : spellLevel;
  return Math.round(effectiveSpellLevel * casterLevel * 25);
}

// ============================================================================
// ARCANE SPELLS (Wizard/Sorcerer)
// ============================================================================

/**
 * Level 0 (Cantrip) Arcane Spells
 * Wand cost at CL 1: ~375 gp
 */
export const ARCANE_CANTRIPS: Record<string, SpellDefinition> = {
  DETECT_MAGIC: {
    id: 'VQ0QrFKM2yYHt9lm',
    name: 'Detect Magic',
    level: 0,
    minCasterLevel: 1,
    school: 'div',
    description: 'Detect magical auras within 60 ft.',
    tags: ['detection', 'utility']
  },
  READ_MAGIC: {
    id: 'TPjZCWxk1iXsJpqj',
    name: 'Read Magic',
    level: 0,
    minCasterLevel: 1,
    school: 'div',
    description: 'Read scrolls and spellbooks.',
    tags: ['utility']
  },
  LIGHT: {
    id: '6vRdB7yfgB8WjzKF',
    name: 'Light',
    level: 0,
    minCasterLevel: 1,
    school: 'evo',
    description: 'Create light in 20 ft. radius.',
    tags: ['utility']
  }
};

/**
 * Level 1 Arcane Spells
 * Wand cost at CL 1: 750 gp
 */
export const ARCANE_LEVEL_1: Record<string, SpellDefinition> = {
  MAGE_ARMOR: {
    id: 'efxfgetTchHAaRew',
    name: 'Mage Armor',
    level: 1,
    minCasterLevel: 1,
    school: 'con',
    description: '+4 armor bonus to AC for 1 hour/level.',
    tags: ['buff', 'defense']
  },
  SHIELD: {
    id: 'TqoDccTS9rBw6vXj',
    name: 'Shield',
    level: 1,
    minCasterLevel: 1,
    school: 'abj',
    description: '+4 shield bonus to AC, negates magic missiles.',
    tags: ['buff', 'defense']
  },
  MAGIC_MISSILE: {
    id: 'POLwho3lpuKuCo6q',
    name: 'Magic Missile',
    level: 1,
    minCasterLevel: 1,
    school: 'evo',
    description: '1d4+1 force damage per missile, auto-hit.',
    tags: ['damage']
  },
  IDENTIFY: {
    id: 'Iq6AMFhnc8sT5WF8',
    name: 'Identify',
    level: 1,
    minCasterLevel: 1,
    school: 'div',
    description: 'Identify magic item properties.',
    tags: ['utility', 'detection']
  },
  GREASE: {
    id: 'RoNN3vErCW37IJYO',
    name: 'Grease',
    level: 1,
    minCasterLevel: 1,
    school: 'con',
    description: 'Makes 10-ft. square slippery.',
    tags: ['control']
  },
  EXPEDITIOUS_RETREAT: {
    id: 'UhltFHfH9Bvl5vL8',
    name: 'Expeditious Retreat',
    level: 1,
    minCasterLevel: 1,
    school: 'trs',
    description: 'Increase base speed by 30 ft.',
    tags: ['buff', 'movement']
  },
  PROTECTION_FROM_EVIL: {
    id: 'HAPP1TTL9tu40LyF',
    name: 'Protection from Evil',
    level: 1,
    minCasterLevel: 1,
    school: 'abj',
    description: '+2 AC and saves vs evil, blocks possession.',
    tags: ['defense', 'buff']
  },
  ENLARGE_PERSON: {
    id: 'kRfTmmH5sBfYEd8Y',
    name: 'Enlarge Person',
    level: 1,
    minCasterLevel: 1,
    school: 'trs',
    description: 'Increase size, +2 STR, -2 DEX.',
    tags: ['buff']
  }
};

/**
 * Level 2 Arcane Spells
 * Wand cost at CL 3: 4,500 gp
 */
export const ARCANE_LEVEL_2: Record<string, SpellDefinition> = {
  INVISIBILITY: {
    id: 'mI78cxrch38mNAcr',
    name: 'Invisibility',
    level: 2,
    minCasterLevel: 3,
    school: 'ill',
    description: 'Subject becomes invisible for 1 min/level.',
    tags: ['utility', 'buff']
  },
  MIRROR_IMAGE: {
    id: 'ySYznGgMZ8R9BvQc',
    name: 'Mirror Image',
    level: 2,
    minCasterLevel: 3,
    school: 'ill',
    description: 'Creates 1d4+1 decoys of caster.',
    tags: ['defense', 'buff']
  },
  SCORCHING_RAY: {
    id: 'vazHxxE1Lk5QndgQ',
    name: 'Scorching Ray',
    level: 2,
    minCasterLevel: 3,
    school: 'evo',
    description: 'Ranged touch attack, 4d6 fire damage.',
    tags: ['damage']
  },
  GLITTERDUST: {
    id: 'IHDtX1q1IKwpsWWV',
    name: 'Glitterdust',
    level: 2,
    minCasterLevel: 3,
    school: 'con',
    description: 'Blinds targets, outlines invisible creatures.',
    tags: ['control', 'detection']
  },
  WEB: {
    id: '0X7OpnVunSsGsXi5',
    name: 'Web',
    level: 2,
    minCasterLevel: 3,
    school: 'con',
    description: 'Creates sticky webs, entangles creatures.',
    tags: ['control']
  },
  RESIST_ENERGY: {
    id: 'cwOdOxFDzabOOxnW',
    name: 'Resist Energy',
    level: 2,
    minCasterLevel: 3,
    school: 'abj',
    description: 'Resist 10 points of energy damage/attack.',
    tags: ['defense', 'buff']
  }
};

/**
 * Level 3 Arcane Spells
 * Wand cost at CL 5: 11,250 gp
 */
export const ARCANE_LEVEL_3: Record<string, SpellDefinition> = {
  FIREBALL: {
    id: 'D1KgQc1fRyoNPNwY',
    name: 'Fireball',
    level: 3,
    minCasterLevel: 5,
    school: 'evo',
    description: '1d6 fire damage/level, 20-ft. radius.',
    tags: ['damage']
  },
  LIGHTNING_BOLT: {
    id: '2Z9C0SLa5VZYvWph',
    name: 'Lightning Bolt',
    level: 3,
    minCasterLevel: 5,
    school: 'evo',
    description: '1d6 electricity damage/level, 120-ft. line.',
    tags: ['damage']
  },
  HASTE: {
    id: 'p8hKPtpj8yYC1Lg5',
    name: 'Haste',
    level: 3,
    minCasterLevel: 5,
    school: 'trs',
    description: 'Extra attack, +1 attack/AC/Reflex, +30 ft. speed.',
    tags: ['buff']
  },
  FLY: {
    id: '7V1PIzImnnFj5ApS',
    name: 'Fly',
    level: 3,
    minCasterLevel: 5,
    school: 'trs',
    description: 'Fly at 60 ft. speed.',
    tags: ['movement', 'utility']
  },
  DISPEL_MAGIC: {
    id: 'Q3ZxRzrxld8P0t1v',
    name: 'Dispel Magic',
    level: 3,
    minCasterLevel: 5,
    school: 'abj',
    description: 'Cancel magical effects.',
    tags: ['utility']
  },
  DISPLACEMENT: {
    id: 'C7Yi8lOzceDvLivl',
    name: 'Displacement',
    level: 3,
    minCasterLevel: 5,
    school: 'ill',
    description: '50% miss chance for 1 round/level.',
    tags: ['defense', 'buff']
  }
};

/**
 * Level 4 Arcane Spells (for wands - max spell level for wands per SRD)
 * Wand cost at CL 7: 21,000 gp
 */
export const ARCANE_LEVEL_4: Record<string, SpellDefinition> = {
  STONESKIN: {
    id: 'LMXJf1pUbMTU5gUt',
    name: 'Stoneskin',
    level: 4,
    minCasterLevel: 7,
    school: 'abj',
    description: 'DR 10/adamantine (absorb 10 points/level).',
    tags: ['defense', 'buff']
  },
  GREATER_INVISIBILITY: {
    id: 'vQ7jR3cF5KuX8nMy',
    name: 'Greater Invisibility',
    level: 4,
    minCasterLevel: 7,
    school: 'ill',
    description: 'Invisibility that doesn\'t end when attacking.',
    tags: ['buff', 'utility']
  },
  ENERVATION: {
    id: 'bX4pN1kQ8uR2mWsZ',
    name: 'Enervation',
    level: 4,
    minCasterLevel: 7,
    school: 'nec',
    description: 'Ray deals 1d4 negative levels.',
    tags: ['damage', 'control']
  },
  SOLID_FOG: {
    id: 'cY5qO2lR9vS3nXtA',
    name: 'Solid Fog',
    level: 4,
    minCasterLevel: 7,
    school: 'con',
    description: 'Heavy fog limits movement and attacks.',
    tags: ['control']
  },
  DIMENSION_DOOR: {
    id: 'qX3P4O9Y5ZxKj3TL',
    name: 'Dimension Door',
    level: 4,
    minCasterLevel: 7,
    school: 'con',
    description: 'Teleports you short distance (400ft + 40ft/level).',
    tags: ['utility', 'movement']
  },
  EVARDS_BLACK_TENTACLES: {
    id: 'dZ6rP3mS0wT4oYuB',
    name: 'Evard\'s Black Tentacles',
    level: 4,
    minCasterLevel: 7,
    school: 'con',
    description: 'Tentacles grapple creatures in area.',
    tags: ['control']
  }
};

// ============================================================================
// DIVINE SPELLS (Cleric/Druid)
// ============================================================================

/**
 * Level 1 Divine Spells
 * Wand cost at CL 1: 750 gp
 */
export const DIVINE_LEVEL_1: Record<string, SpellDefinition> = {
  CURE_LIGHT_WOUNDS: {
    id: 'lx681rDErdOKErnV',
    name: 'Cure Light Wounds',
    level: 1,  // 1st level for Cleric, Druid, Paladin, Bard (2nd for Ranger)
    minCasterLevel: 1,
    school: 'con',
    description: 'Heal 1d8+1/level (max +5) hit points.',
    tags: ['healing']
  },
  BLESS: {
    id: '7lIiKvIuEVVbr9dn',
    name: 'Bless',
    level: 1,
    minCasterLevel: 1,
    school: 'enc',
    description: '+1 attack and saves vs fear.',
    tags: ['buff']
  },
  DIVINE_FAVOR: {
    id: 'qIdVROi2KGyeF8Ta',
    name: 'Divine Favor',
    level: 1,
    minCasterLevel: 1,
    school: 'evo',
    description: '+1/3 levels to attack and damage (max +3).',
    tags: ['buff']
  },
  SHIELD_OF_FAITH: {
    id: 'd6WN7BnDUWpLaDef',
    name: 'Shield of Faith',
    level: 1,
    minCasterLevel: 1,
    school: 'abj',
    description: '+2 or higher deflection bonus to AC.',
    tags: ['defense', 'buff']
  },
  REMOVE_FEAR: {
    id: 'tEIMJCfMkZ9Cyw4S',
    name: 'Remove Fear',
    level: 1,
    minCasterLevel: 1,
    school: 'abj',
    description: '+4 on saves vs fear, suppress fear effects.',
    tags: ['utility', 'buff']
  }
};

/**
 * Level 2 Divine Spells
 * Wand cost at CL 3: 4,500 gp
 */
export const DIVINE_LEVEL_2: Record<string, SpellDefinition> = {
  CURE_MODERATE_WOUNDS: {
    id: 'XDUOxKSwjF8BOpY4',
    name: 'Cure Moderate Wounds',
    level: 2,  // 2nd level for Cleric, Druid, Bard
    minCasterLevel: 3,
    school: 'con',
    description: 'Heal 2d8+1/level (max +10) hit points.',
    tags: ['healing']
  },
  BULLS_STRENGTH: {
    id: 'JCW98LiIRWEoHHex',
    name: "Bull's Strength",
    level: 2,
    minCasterLevel: 3,
    school: 'trs',
    description: '+4 STR for 1 min/level.',
    tags: ['buff']
  },
  RESIST_ENERGY: {
    id: 'cwOdOxFDzabOOxnW',
    name: 'Resist Energy',
    level: 2,
    minCasterLevel: 3,
    school: 'abj',
    description: 'Resist 10 points of energy damage/attack.',
    tags: ['defense', 'buff']
  }
};

/**
 * Level 3 Divine Spells
 * Wand cost at CL 5: 11,250 gp
 */
export const DIVINE_LEVEL_3: Record<string, SpellDefinition> = {
  CURE_SERIOUS_WOUNDS: {
    id: '7wBkhLIOLd0Y6OSu',
    name: 'Cure Serious Wounds',
    level: 3,
    minCasterLevel: 5,
    school: 'con',
    description: 'Heal 3d8+1/level (max +15) hit points.',
    tags: ['healing']
  },
  REMOVE_DISEASE: {
    id: '6YQpRbuNWic0VR1b',
    name: 'Remove Disease',
    level: 3,
    minCasterLevel: 5,
    school: 'con',
    description: 'Cure all diseases.',
    tags: ['healing', 'utility']
  },
  PRAYER: {
    id: 'yWRcQhWD5xxkjs9N',
    name: 'Prayer',
    level: 3,
    minCasterLevel: 5,
    school: 'enc',
    description: 'Allies +1 attack/damage/saves/checks, enemies -1.',
    tags: ['buff']
  },
  REMOVE_CURSE: {
    id: 'xQlRqQMlBmwVsLpw',
    name: 'Remove Curse',
    level: 3,
    minCasterLevel: 5,
    school: 'abj',
    description: 'Breaks curses on creatures or objects.',
    tags: ['utility']
  }
};

/**
 * Level 4 Divine Spells (SCROLLS)
 * Scroll cost at CL 7: 700 gp
 */
export const DIVINE_LEVEL_4: Record<string, SpellDefinition> = {
  CURE_CRITICAL_WOUNDS: {
    id: 'eNPvFjmwNDKrqSwf',
    name: 'Cure Critical Wounds',
    level: 4,
    minCasterLevel: 7,
    school: 'con',
    description: 'Heal 4d8+1/level (max +20) hit points.',
    tags: ['healing']
  },
  NEUTRALIZE_POISON: {
    id: 'QWu4wMKa6T2Y4xG5',
    name: 'Neutralize Poison',
    level: 4,
    minCasterLevel: 7,
    school: 'con',
    description: 'Detoxifies poison, grants immunity for 10 min/level.',
    tags: ['healing', 'utility']
  },
  RESTORATION: {
    id: 'd7mXTb6CY0oKM9qy',
    name: 'Restoration',
    level: 4,
    minCasterLevel: 7,
    school: 'con',
    description: 'Removes ability drain, negative levels, fatigue.',
    tags: ['healing', 'utility']
  },
  DEATH_WARD: {
    id: 'qzqDZSDQVz9jLXnP',
    name: 'Death Ward',
    level: 4,
    minCasterLevel: 7,
    school: 'nec',
    description: 'Immunity to death spells and energy drain.',
    tags: ['defense', 'buff']
  }
};

/**
 * Level 5 Divine Spells (SCROLLS)
 * Scroll cost at CL 9: 1,125 gp
 */
export const DIVINE_LEVEL_5: Record<string, SpellDefinition> = {
  RAISE_DEAD: {
    id: 'Rn73xj1IZfNc8rzt',
    name: 'Raise Dead',
    level: 5,
    minCasterLevel: 9,
    school: 'con',
    description: 'Resurrects dead creature (dead ≤1 day/level).',
    tags: ['utility']
  },
  BREAK_ENCHANTMENT: {
    id: 'xR19gOKz4MkE2zZ5',
    name: 'Break Enchantment',
    level: 5,
    minCasterLevel: 9,
    school: 'abj',
    description: 'Frees victims from enchantments, curses, transmutations.',
    tags: ['utility']
  },
  COMMUNE: {
    id: 'JUg5HL0H72JcRhkf',
    name: 'Commune',
    level: 5,
    minCasterLevel: 9,
    school: 'div',
    description: 'Ask deity yes/no questions (1/level).',
    tags: ['utility']
  }
};

/**
 * Level 6 Divine Spells (SCROLLS)
 * Scroll cost at CL 11: 1,650 gp
 */
export const DIVINE_LEVEL_6: Record<string, SpellDefinition> = {
  HEAL: {
    id: 'WsY0uxWqbdO8EBYI',
    name: 'Heal',
    level: 6,
    minCasterLevel: 11,
    school: 'con',
    description: 'Heals 150 hp, removes most conditions.',
    tags: ['healing']
  }
};

/**
 * Level 7 Divine Spells (SCROLLS)
 * Scroll cost at CL 13: 2,275 gp
 */
export const DIVINE_LEVEL_7: Record<string, SpellDefinition> = {
  GREATER_RESTORATION: {
    id: 'czM7d6OjS9BgGFXh',
    name: 'Greater Restoration',
    level: 7,
    minCasterLevel: 13,
    school: 'con',
    description: 'Removes all ability drain, negative levels, conditions.',
    tags: ['healing', 'utility']
  },
  RESURRECTION: {
    id: '74SX2t3xIrFMbIBp',
    name: 'Resurrection',
    level: 7,
    minCasterLevel: 13,
    school: 'con',
    description: 'Resurrects dead creature (dead ≤10 years/level).',
    tags: ['utility']
  }
};

/**
 * Level 2 Arcane Scrolls
 * Scroll cost at CL 3: 150 gp
 */
export const ARCANE_SCROLL_LEVEL_2: Record<string, SpellDefinition> = {
  KNOCK: {
    id: '5PtYtW5gYMzCcYIh',
    name: 'Knock',
    level: 2,
    minCasterLevel: 3,
    school: 'trs',
    description: 'Opens locked or magically sealed doors.',
    tags: ['utility']
  }
};

/**
 * Level 4 Arcane Scrolls
 * Scroll cost at CL 7: 700 gp
 */
export const ARCANE_SCROLL_LEVEL_4: Record<string, SpellDefinition> = {
  DIMENSION_DOOR: {
    id: 'qX3P4O9Y5ZxKj3TL',
    name: 'Dimension Door',
    level: 4,
    minCasterLevel: 7,
    school: 'con',
    description: 'Teleports you short distance (400ft + 40ft/level).',
    tags: ['utility']
  },
  STONESKIN: {
    id: 'LMXJf1pUbMTU5gUt',
    name: 'Stoneskin',
    level: 4,
    minCasterLevel: 7,
    school: 'abj',
    description: 'DR 10/adamantine (absorb 10 points/level).',
    tags: ['defense', 'buff']
  }
};

/**
 * Level 5 Arcane Scrolls
 * Scroll cost at CL 9: 1,125 gp
 */
export const ARCANE_SCROLL_LEVEL_5: Record<string, SpellDefinition> = {
  TELEPORT: {
    id: 'N9J5CrFQ0GjU19bE',
    name: 'Teleport',
    level: 5,
    minCasterLevel: 9,
    school: 'con',
    description: 'Instantly transports you (and others) long distance.',
    tags: ['utility']
  },
  BREAK_ENCHANTMENT_ARCANE: {
    id: 'xR19gOKz4MkE2zZ5',
    name: 'Break Enchantment',
    level: 5,
    minCasterLevel: 9,
    school: 'abj',
    description: 'Frees victims from enchantments, curses, transmutations.',
    tags: ['utility']
  },
  OVERLAND_FLIGHT: {
    id: 'NcXqP4xWDTyBt9kU',
    name: 'Overland Flight',
    level: 5,
    minCasterLevel: 9,
    school: 'trs',
    description: 'Fly 40 ft. for hours/level.',
    tags: ['utility']
  }
};

/**
 * Level 6 Arcane Scrolls
 * Scroll cost at CL 11: 1,650 gp
 */
export const ARCANE_SCROLL_LEVEL_6: Record<string, SpellDefinition> = {
  CONTINGENCY: {
    id: 'MIckS46w8PQpJ7C0',
    name: 'Contingency',
    level: 6,
    minCasterLevel: 11,
    school: 'evo',
    description: 'Sets trigger condition for spell to activate.',
    tags: ['utility']
  }
};

/**
 * Level 7 Arcane Scrolls
 * Scroll cost at CL 13: 2,275 gp
 */
export const ARCANE_SCROLL_LEVEL_7: Record<string, SpellDefinition> = {
  GREATER_TELEPORT: {
    id: 'rScFsytH7bgV7rqR',
    name: 'Greater Teleport',
    level: 7,
    minCasterLevel: 13,
    school: 'con',
    description: 'Teleport with perfect accuracy.',
    tags: ['utility']
  }
};

// ============================================================================
// SPELL COLLECTIONS
// ============================================================================

/**
 * All arcane spell collections by level (for wands - up to level 4)
 */
export const ARCANE_SPELLS_BY_LEVEL = {
  0: ARCANE_CANTRIPS,
  1: ARCANE_LEVEL_1,
  2: ARCANE_LEVEL_2,
  3: ARCANE_LEVEL_3,
  4: ARCANE_LEVEL_4
};

/**
 * All divine spell collections by level (for wands - up to level 4)
 */
export const DIVINE_SPELLS_BY_LEVEL = {
  1: DIVINE_LEVEL_1,
  2: DIVINE_LEVEL_2,
  3: DIVINE_LEVEL_3,
  4: DIVINE_LEVEL_4
};

/**
 * Arcane scroll spell collections by level (4th+ level spells)
 */
export const ARCANE_SCROLL_SPELLS_BY_LEVEL = {
  2: ARCANE_SCROLL_LEVEL_2,
  4: ARCANE_SCROLL_LEVEL_4,
  5: ARCANE_SCROLL_LEVEL_5,
  6: ARCANE_SCROLL_LEVEL_6,
  7: ARCANE_SCROLL_LEVEL_7
};

/**
 * Divine scroll spell collections by level (4th+ level spells)
 */
export const DIVINE_SCROLL_SPELLS_BY_LEVEL = {
  3: { REMOVE_CURSE: DIVINE_LEVEL_3.REMOVE_CURSE }, // Only Remove Curse from level 3 for scrolls
  4: DIVINE_LEVEL_4,
  5: DIVINE_LEVEL_5,
  6: DIVINE_LEVEL_6,
  7: DIVINE_LEVEL_7
};

/**
 * Get all wand spells as a flat array (up to level 4 - max for wands per SRD)
 */
export function getAllArcaneSpells(): SpellDefinition[] {
  return [
    ...Object.values(ARCANE_CANTRIPS),
    ...Object.values(ARCANE_LEVEL_1),
    ...Object.values(ARCANE_LEVEL_2),
    ...Object.values(ARCANE_LEVEL_3),
    ...Object.values(ARCANE_LEVEL_4)
  ];
}

/**
 * Get all divine wand spells as a flat array (up to level 4 - max for wands per SRD)
 */
export function getAllDivineSpells(): SpellDefinition[] {
  return [
    ...Object.values(DIVINE_LEVEL_1),
    ...Object.values(DIVINE_LEVEL_2),
    ...Object.values(DIVINE_LEVEL_3),
    ...Object.values(DIVINE_LEVEL_4)
  ];
}

/**
 * Get all arcane scroll spells as a flat array
 */
export function getAllArcaneScrollSpells(): SpellDefinition[] {
  return [
    ...Object.values(ARCANE_SCROLL_LEVEL_2),
    ...Object.values(ARCANE_SCROLL_LEVEL_4),
    ...Object.values(ARCANE_SCROLL_LEVEL_5),
    ...Object.values(ARCANE_SCROLL_LEVEL_6),
    ...Object.values(ARCANE_SCROLL_LEVEL_7)
  ];
}

/**
 * Get all divine scroll spells as a flat array
 */
export function getAllDivineScrollSpells(): SpellDefinition[] {
  return [
    DIVINE_LEVEL_3.REMOVE_CURSE,
    ...Object.values(DIVINE_LEVEL_4),
    ...Object.values(DIVINE_LEVEL_5),
    ...Object.values(DIVINE_LEVEL_6),
    ...Object.values(DIVINE_LEVEL_7)
  ];
}

/**
 * Get spells by tag
 */
export function getSpellsByTag(tag: SpellTag, spells: SpellDefinition[]): SpellDefinition[] {
  return spells.filter(spell => spell.tags.includes(tag));
}
