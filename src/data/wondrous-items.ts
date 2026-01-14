/**
 * D35E Wondrous Items and "Big Six" Definitions
 * Extracted from D35E.magicitems compendium
 * 
 * The "Big Six" are the most important magic items in 3.5e:
 * 1. Weapon Enhancement (already implemented in enhancements.ts)
 * 2. Armor Enhancement (already implemented in enhancements.ts)
 * 3. Stat Booster (Headband of Intellect, Belt of Strength, etc.)
 * 4. Cloak of Resistance (+saves)
 * 5. Ring of Protection (+AC deflection)
 * 6. Amulet of Natural Armor (+natural AC)
 */

export interface WondrousItemDefinition {
  id: string;
  name: string;
  slot: string;
  price: number;
  bonus: number;
  description?: string;
}

// =============================================================================
// STAT BOOSTERS
// =============================================================================

/**
 * Headband of Intellect
 * Grants enhancement bonus to Intelligence
 * Slot: headband
 * 
 * Note: In 3.5e, only Intelligence uses headbands. Wisdom and Charisma use
 * Periapts and Cloaks respectively, but those aren't in the base compendium.
 * For now, we'll use Headband of Intellect for INT-based casters (Wizards).
 */
export const HEADBAND_OF_INTELLECT: Record<number, WondrousItemDefinition> = {
  2: {
    id: '6R9yCjWQoVGxOItW',
    name: 'Headband of Intellect +2',
    slot: 'headband',
    price: 4000,
    bonus: 2,
    description: '+2 enhancement bonus to Intelligence'
  },
  4: {
    id: '4CLtSpaEFULAkt1p',
    name: 'Headband of Intellect +4',
    slot: 'headband',
    price: 16000,
    bonus: 4,
    description: '+4 enhancement bonus to Intelligence'
  },
  6: {
    id: 'v3WZ87DoUuRY0V6X',
    name: 'Headband of Intellect +6',
    slot: 'headband',
    price: 36000,
    bonus: 6,
    description: '+6 enhancement bonus to Intelligence'
  }
} as const;

/**
 * Periapt of Wisdom
 * Grants enhancement bonus to Wisdom
 * Slot: neck
 * 
 * Essential for WIS-based casters: Clerics, Druids, Rangers
 * Competes with Amulet of Natural Armor for neck slot at higher levels
 */
export const PERIAPT_OF_WISDOM: Record<number, WondrousItemDefinition> = {
  2: {
    id: 'pR2Hpz1YJ8s8bsxr',
    name: 'Periapt of Wisdom +2',
    slot: 'neck',
    price: 4000,
    bonus: 2,
    description: '+2 enhancement bonus to Wisdom'
  },
  4: {
    id: 'h5p6AJ2CL1ychoGp',
    name: 'Periapt of Wisdom +4',
    slot: 'neck',
    price: 16000,
    bonus: 4,
    description: '+4 enhancement bonus to Wisdom'
  },
  6: {
    id: 'Q3SlDIDVITp6mNqZ',
    name: 'Periapt of Wisdom +6',
    slot: 'neck',
    price: 36000,
    bonus: 6,
    description: '+6 enhancement bonus to Wisdom'
  }
} as const;

/**
 * Cloak of Charisma
 * Grants enhancement bonus to Charisma
 * Slot: shoulders
 * 
 * Essential for CHA-based casters: Sorcerers, Bards, Paladins
 * Competes with Cloak of Resistance for shoulders slot - players must choose!
 */
export const CLOAK_OF_CHARISMA: Record<number, WondrousItemDefinition> = {
  2: {
    id: '3E9dw6bIOvTMB1u3',
    name: 'Cloak of Charisma +2',
    slot: 'shoulders',
    price: 4000,
    bonus: 2,
    description: '+2 enhancement bonus to Charisma'
  },
  4: {
    id: '5Lk7hjNCSUVmpa61',
    name: 'Cloak of Charisma +4',
    slot: 'shoulders',
    price: 16000,
    bonus: 4,
    description: '+4 enhancement bonus to Charisma'
  },
  6: {
    id: 'qbX0hSglUSmsBhpV',
    name: 'Cloak of Charisma +6',
    slot: 'shoulders',
    price: 36000,
    bonus: 6,
    description: '+6 enhancement bonus to Charisma'
  }
} as const;

/**
 * Amulet of Mighty Fists
 * Grants enhancement bonus to unarmed strikes and natural attacks
 * Slot: neck (CRITICAL: Competes with Amulet of Natural Armor and Periapt of Wisdom!)
 * 
 * This is THE signature monk item. Stacks with Ki Strike's magic property.
 * Monks should prioritize this over defensive neck slot items.
 * 
 * Pricing follows enhancement bonus squared × 6000 gp formula
 */
export const AMULET_OF_MIGHTY_FISTS: Record<number, WondrousItemDefinition> = {
  1: {
    id: 'tXiJigkXecce1BQc',
    name: 'Amulet of Mighty Fists +1',
    slot: 'neck',
    price: 6000,
    bonus: 1,
    description: '+1 enhancement bonus to unarmed strikes and natural attacks'
  },
  2: {
    id: 'LicOTfMUuaGz3yBf',
    name: 'Amulet of Mighty Fists +2',
    slot: 'neck',
    price: 24000,
    bonus: 2,
    description: '+2 enhancement bonus to unarmed strikes and natural attacks'
  },
  3: {
    id: 'qj4lqs66wOwWQ4Do',
    name: 'Amulet of Mighty Fists +3',
    slot: 'neck',
    price: 54000,
    bonus: 3,
    description: '+3 enhancement bonus to unarmed strikes and natural attacks'
  },
  4: {
    id: 'N4HW2fvonDlyecSr',
    name: 'Amulet of Mighty Fists +4',
    slot: 'neck',
    price: 96000,
    bonus: 4,
    description: '+4 enhancement bonus to unarmed strikes and natural attacks'
  },
  5: {
    id: 'ebAYp1Y2uu7PinYc',
    name: 'Amulet of Mighty Fists +5',
    slot: 'neck',
    price: 150000,
    bonus: 5,
    description: '+5 enhancement bonus to unarmed strikes and natural attacks'
  }
} as const;

/**
 * Gloves of Dexterity
 * Grants enhancement bonus to Dexterity
 * Slot: hands
 * 
 * Perfect for DEX-based builds: Rangers, Rogues, Monks (ranged/finesse fighters)
 * Competes with Gauntlets of Ogre Power for hands slot
 */
export const GLOVES_OF_DEXTERITY: Record<number, WondrousItemDefinition> = {
  2: {
    id: '4P5yn0LYo3dwQjme',
    name: 'Gloves of Dexterity +2',
    slot: 'hands',
    price: 4000,
    bonus: 2,
    description: '+2 enhancement bonus to Dexterity'
  },
  4: {
    id: 'QtTlWHZg506MRg2A',
    name: 'Gloves of Dexterity +4',
    slot: 'hands',
    price: 16000,
    bonus: 4,
    description: '+4 enhancement bonus to Dexterity'
  },
  6: {
    id: '6Wa5nrzzOrvvj3en',
    name: 'Gloves of Dexterity +6',
    slot: 'hands',
    price: 36000,
    bonus: 6,
    description: '+6 enhancement bonus to Dexterity'
  }
} as const;

/**
 * Gauntlets of Ogre Power
 * Grants +2 enhancement bonus to Strength
 * Slot: hands
 * 
 * This is the lower-level STR boost option, perfect for martial characters
 * at levels 3-7 before they can afford Belt of Giant Strength +4 (16,000 gp).
 */
export const GAUNTLETS_OF_OGRE_POWER: WondrousItemDefinition = {
  id: 'gHNzDGpj4p395bDI',
  name: 'Gauntlets of Ogre Power',
  slot: 'hands',
  price: 4000,
  bonus: 2,
  description: '+2 enhancement bonus to Strength'
} as const;

/**
 * Belt of Giant Strength
 * Grants enhancement bonus to Strength
 * Slot: belt
 * 
 * Higher-level STR boost options. For +2 STR at lower levels, use Gauntlets of Ogre Power.
 */
export const BELT_OF_GIANT_STRENGTH: Record<number, WondrousItemDefinition> = {
  4: {
    id: 'mhVAmMlvsyvr7zEd',
    name: 'Belt of Giant Strength +4',
    slot: 'belt',
    price: 16000,
    bonus: 4,
    description: '+4 enhancement bonus to Strength'
  },
  6: {
    id: 'D9fHVRPO15pnBVsr',
    name: 'Belt of Giant Strength +6',
    slot: 'belt',
    price: 36000,
    bonus: 6,
    description: '+6 enhancement bonus to Strength'
  }
} as const;

// =============================================================================
// DEFENSIVE ITEMS (Big Six #4-6)
// =============================================================================

/**
 * Cloak of Resistance
 * Grants resistance bonus to all saving throws
 * Slot: shoulders
 * 
 * This is arguably the MOST important magic item - affects all saves!
 */
export const CLOAK_OF_RESISTANCE: Record<number, WondrousItemDefinition> = {
  1: {
    id: 'ObPMgxSZvTZwWV9U',
    name: 'Cloak of Resistance +1',
    slot: 'shoulders',
    price: 1000,
    bonus: 1,
    description: '+1 resistance bonus on all saving throws'
  },
  2: {
    id: 'LhGOs0sbxuSOlHsF',
    name: 'Cloak of Resistance +2',
    slot: 'shoulders',
    price: 4000,
    bonus: 2,
    description: '+2 resistance bonus on all saving throws'
  },
  3: {
    id: 'bHQt8TdoYfWyOF52',
    name: 'Cloak of Resistance +3',
    slot: 'shoulders',
    price: 9000,
    bonus: 3,
    description: '+3 resistance bonus on all saving throws'
  },
  4: {
    id: 'qxeHC61g7zMGNhmD',
    name: 'Cloak of Resistance +4',
    slot: 'shoulders',
    price: 16000,
    bonus: 4,
    description: '+4 resistance bonus on all saving throws'
  },
  5: {
    id: 'JmsEWLLfuz9WADI8',
    name: 'Cloak of Resistance +5',
    slot: 'shoulders',
    price: 25000,
    bonus: 5,
    description: '+5 resistance bonus on all saving throws'
  }
} as const;

/**
 * Ring of Protection
 * Grants deflection bonus to AC
 * Slot: ring
 * 
 * Deflection bonuses stack with armor, natural armor, and shield bonuses.
 * One of the "Big Six" essential items.
 */
export const RING_OF_PROTECTION: Record<number, WondrousItemDefinition> = {
  1: {
    id: 'H8427167HgyvVAUp',
    name: 'Ring of Protection +1',
    slot: 'ring',
    price: 2000,
    bonus: 1,
    description: '+1 deflection bonus to AC'
  },
  2: {
    id: 'r1edeTIqnSpnSRDe',
    name: 'Ring of Protection +2',
    slot: 'ring',
    price: 8000,
    bonus: 2,
    description: '+2 deflection bonus to AC'
  },
  3: {
    id: 'BBxAGHt3q8aDGgBV',
    name: 'Ring of Protection +3',
    slot: 'ring',
    price: 18000,
    bonus: 3,
    description: '+3 deflection bonus to AC'
  },
  4: {
    id: '24Crt6ShpblXXuOK',
    name: 'Ring of Protection +4',
    slot: 'ring',
    price: 32000,
    bonus: 4,
    description: '+4 deflection bonus to AC'
  },
  5: {
    id: 'KpH5Ox673moCh6nE',
    name: 'Ring of Protection +5',
    slot: 'ring',
    price: 50000,
    bonus: 5,
    description: '+5 deflection bonus to AC'
  }
} as const;

/**
 * Amulet of Natural Armor
 * Grants enhancement bonus to natural armor
 * Slot: neck
 * 
 * Stacks with armor bonuses but not with other natural armor bonuses.
 * Essential for characters without heavy armor.
 */
export const AMULET_OF_NATURAL_ARMOR: Record<number, WondrousItemDefinition> = {
  1: {
    id: 'muZv1yul1HJp7LP0',
    name: 'Amulet of Natural Armor +1',
    slot: 'neck',
    price: 2000,
    bonus: 1,
    description: '+1 enhancement bonus to natural armor'
  },
  2: {
    id: 'xQVyML17Agkgyudu',
    name: 'Amulet of Natural Armor +2',
    slot: 'neck',
    price: 8000,
    bonus: 2,
    description: '+2 enhancement bonus to natural armor'
  },
  3: {
    id: 'D3B4ayTzPQRT3YD2',
    name: 'Amulet of Natural Armor +3',
    slot: 'neck',
    price: 18000,
    bonus: 3,
    description: '+3 enhancement bonus to natural armor'
  },
  4: {
    id: 'V18JX5EJHHZVckft',
    name: 'Amulet of Natural Armor +4',
    slot: 'neck',
    price: 32000,
    bonus: 4,
    description: '+4 enhancement bonus to natural armor'
  },
  5: {
    id: 't305aOZlQOkyIHW6',
    name: 'Amulet of Natural Armor +5',
    slot: 'neck',
    price: 50000,
    bonus: 5,
    description: '+5 enhancement bonus to natural armor'
  }
} as const;

/**
 * Bracers of Armor
 * Grants armor bonus to AC (no arcane spell failure, no armor check penalty)
 * Slot: wrists
 * 
 * Perfect for pure casters (wizards/sorcerers) who can't wear armor due to
 * arcane spell failure. Provides the "armor" component of AC without penalties.
 * 
 * Pricing formula: bonus^2 × 1,000 gp
 * +1 = 1,000 gp, +2 = 4,000 gp, +3 = 9,000 gp, +4 = 16,000 gp, +5 = 25,000 gp
 * +6 = 36,000 gp, +7 = 49,000 gp, +8 = 64,000 gp
 */
export const BRACERS_OF_ARMOR: Record<number, WondrousItemDefinition> = {
  1: {
    id: '6PsJOv5Gz8k0OLgU',
    name: 'Bracers of Armor +1',
    slot: 'wrists',
    price: 1000,
    bonus: 1,
    description: '+1 armor bonus to AC. No armor check penalty or arcane spell failure.'
  },
  2: {
    id: 'uMdb7TlnUWaod7kp',
    name: 'Bracers of Armor +2',
    slot: 'wrists',
    price: 4000,
    bonus: 2,
    description: '+2 armor bonus to AC. No armor check penalty or arcane spell failure.'
  },
  3: {
    id: '4iTA8I89BXxw7GXI',
    name: 'Bracers of Armor +3',
    slot: 'wrists',
    price: 9000,
    bonus: 3,
    description: '+3 armor bonus to AC. No armor check penalty or arcane spell failure.'
  },
  4: {
    id: '65PkQkllUQiydlBJ',
    name: 'Bracers of Armor +4',
    slot: 'wrists',
    price: 16000,
    bonus: 4,
    description: '+4 armor bonus to AC. No armor check penalty or arcane spell failure.'
  },
  5: {
    id: 'xWr9GkxCZWOzT4GX',
    name: 'Bracers of Armor +5',
    slot: 'wrists',
    price: 25000,
    bonus: 5,
    description: '+5 armor bonus to AC. No armor check penalty or arcane spell failure.'
  },
  6: {
    id: '0ws1rDjVweODWFd9',
    name: 'Bracers of Armor +6',
    slot: 'wrists',
    price: 36000,
    bonus: 6,
    description: '+6 armor bonus to AC. No armor check penalty or arcane spell failure.'
  },
  7: {
    id: 'BJ8RfOD2G6ahi6IA',
    name: 'Bracers of Armor +7',
    slot: 'wrists',
    price: 49000,
    bonus: 7,
    description: '+7 armor bonus to AC. No armor check penalty or arcane spell failure.'
  },
  8: {
    id: '4FbeOWqbhXjuIDT5',
    name: 'Bracers of Armor +8',
    slot: 'wrists',
    price: 64000,
    bonus: 8,
    description: '+8 armor bonus to AC. No armor check penalty or arcane spell failure.'
  }
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get all available bonuses for a specific item type
 */
export function getAvailableBonuses(itemType: 'headband' | 'periapt' | 'charisma-cloak' | 'belt' | 'gloves' | 'cloak' | 'ring' | 'amulet' | 'bracers' | 'mighty-fists'): number[] {
  switch (itemType) {
    case 'headband':
      return Object.keys(HEADBAND_OF_INTELLECT).map(Number);
    case 'periapt':
      return Object.keys(PERIAPT_OF_WISDOM).map(Number);
    case 'charisma-cloak':
      return Object.keys(CLOAK_OF_CHARISMA).map(Number);
    case 'belt':
      return Object.keys(BELT_OF_GIANT_STRENGTH).map(Number);
    case 'gloves':
      return Object.keys(GLOVES_OF_DEXTERITY).map(Number);
    case 'mighty-fists':
      return Object.keys(AMULET_OF_MIGHTY_FISTS).map(Number);
    case 'cloak':
      return Object.keys(CLOAK_OF_RESISTANCE).map(Number);
    case 'ring':
      return Object.keys(RING_OF_PROTECTION).map(Number);
    case 'amulet':
      return Object.keys(AMULET_OF_NATURAL_ARMOR).map(Number);
    case 'bracers':
      return Object.keys(BRACERS_OF_ARMOR).map(Number);
  }
}

/**
 * Get the best affordable item for a given budget
 * Returns null if no items are affordable
 */
export function getBestAffordableBonus(
  itemType: 'headband' | 'periapt' | 'charisma-cloak' | 'belt' | 'gloves' | 'cloak' | 'ring' | 'amulet' | 'bracers' | 'mighty-fists',
  budget: number
): WondrousItemDefinition | null {
  const bonuses = getAvailableBonuses(itemType);
  
  for (let i = bonuses.length - 1; i >= 0; i--) {
    const bonus = bonuses[i];
    let item: WondrousItemDefinition | undefined;
    
    switch (itemType) {
      case 'headband':
        item = HEADBAND_OF_INTELLECT[bonus];
        break;
      case 'periapt':
        item = PERIAPT_OF_WISDOM[bonus];
        break;
      case 'charisma-cloak':
        item = CLOAK_OF_CHARISMA[bonus];
        break;
      case 'belt':
        item = BELT_OF_GIANT_STRENGTH[bonus];
        break;
      case 'gloves':
        item = GLOVES_OF_DEXTERITY[bonus];
        break;
      case 'mighty-fists':
        item = AMULET_OF_MIGHTY_FISTS[bonus];
        break;
      case 'cloak':
        item = CLOAK_OF_RESISTANCE[bonus];
        break;
      case 'ring':
        item = RING_OF_PROTECTION[bonus];
        break;
      case 'amulet':
        item = AMULET_OF_NATURAL_ARMOR[bonus];
        break;
      case 'bracers':
        item = BRACERS_OF_ARMOR[bonus];
        break;
    }
    
    if (item && item.price <= budget) {
      return item;
    }
  }
  
  return null;
}

/**
 * Get recommended item priorities for different character classes
 */
export const BIG_SIX_PRIORITIES = {
  // Melee martials need weapon > armor > stats > cloak > ring/amulet
  fighter: ['weapon', 'armor', 'belt', 'cloak', 'ring', 'amulet'] as const,
  barbarian: ['weapon', 'armor', 'belt', 'cloak', 'amulet', 'ring'] as const,
  // Paladins use CHA for spells but need STR for combat - use charisma-cloak for spell DCs
  paladin: ['weapon', 'armor', 'charisma-cloak', 'belt', 'ring', 'amulet'] as const,
  // Rangers use DEX for ranged attacks and AC - gloves for DEX boost
  ranger: ['weapon', 'armor', 'gloves', 'cloak', 'ring', 'amulet'] as const,
  
  // Rogues need weapon > cloak (saves!) > ring/amulet > armor
  rogue: ['weapon', 'cloak', 'ring', 'amulet', 'armor', 'belt'] as const,
  
  // Monks: Amulet of Mighty Fists takes neck slot, so no periapt/amulet!
  // Belt for STR (attack/damage), Gloves for DEX (AC), Bracers for armor bonus
  // Ring of Protection is their main AC item now
  monk: ['mighty-fists', 'belt', 'gloves', 'cloak', 'ring', 'bracers'] as const,
  
  // Casters need stats > cloak > ring/amulet > armor (no weapon!)
  // Wizards use INT
  wizard: ['headband', 'cloak', 'ring', 'amulet', 'armor'] as const,
  // Sorcerers use CHA - charisma-cloak competes with cloak of resistance!
  sorcerer: ['charisma-cloak', 'ring', 'amulet', 'armor'] as const,
  
  // Divine casters use WIS - periapt competes with amulet of natural armor!
  cleric: ['weapon', 'armor', 'periapt', 'cloak', 'ring'] as const,
  druid: ['armor', 'periapt', 'cloak', 'ring', 'weapon'] as const,
  // Bards use CHA - charisma-cloak competes with cloak of resistance!
  bard: ['armor', 'charisma-cloak', 'ring', 'amulet', 'weapon'] as const
} as const;

// =============================================================================
// UTILITY WONDROUS ITEMS
// =============================================================================

/**
 * Additional wondrous items from SRD for utility and flavor
 * These can be purchased after the Big Six are handled
 * All IDs verified against D35E.magicitems compendium
 */
export const UTILITY_WONDROUS_ITEMS: Record<string, WondrousItemDefinition> = {
  // Storage Items - ESSENTIAL for carrying consumables!
  'handy-haversack': {
    id: 'mgzGRMp4Q5oMagZz',
    name: 'Handy Haversack',
    slot: 'slotless',
    price: 2000,
    bonus: 0,
    description: 'Magical backpack with multiple extradimensional pockets. Retrieves items as move action. Holds 120 lbs but weighs only 5 lbs.'
  },
  'bag-of-holding-1': {
    id: 'eEyPJMJaStWsrg8J',
    name: 'Bag of Holding (Type 1)',
    slot: 'slotless',
    price: 2500,
    bonus: 0,
    description: 'Holds 250 lbs in 15 cubic ft. Weighs only 15 lbs regardless of contents.'
  },
  'bag-of-holding-2': {
    id: 'vvp8z8QU6Yk7C33p',
    name: 'Bag of Holding (Type 2)',
    slot: 'slotless',
    price: 5000,
    bonus: 0,
    description: 'Holds 500 lbs in 70 cubic ft. Weighs only 25 lbs regardless of contents.'
  },
  'bag-of-holding-3': {
    id: 'NWzu4cYFbFpPMA1y',
    name: 'Bag of Holding (Type 3)',
    slot: 'slotless',
    price: 7400,
    bonus: 0,
    description: 'Holds 1000 lbs in 150 cubic ft. Weighs only 35 lbs regardless of contents.'
  },
  'bag-of-holding-4': {
    id: '78lhpMaPVSIkrR7v',
    name: 'Bag of Holding (Type 4)',
    slot: 'slotless',
    price: 10000,
    bonus: 0,
    description: 'Holds 1500 lbs in 250 cubic ft. Weighs only 60 lbs regardless of contents.'
  },
  
  // Mobility Items
  'boots-of-speed': {
    id: 'y4P1MmRAl2vGf2cS',
    name: 'Boots of Speed',
    slot: 'feet',
    price: 12000,
    bonus: 0,
    description: 'Act as haste spell for up to 10 rounds per day (activated as free action). +30 ft speed, extra attack, +1 AC/Reflex.'
  },
  'boots-of-striding-and-springing': {
    id: 'B9sqwS0G3G1SXGsk',
    name: 'Boots of Striding and Springing',
    slot: 'feet',
    price: 5500,
    bonus: 0,
    description: 'Speed increases by 10 ft. +5 competence bonus on Jump checks. Allows normal jumping distance despite armor or encumbrance.'
  },
  'slippers-of-spider-climbing': {
    id: 'LVt0ObU6Y4D9Vdrv',
    name: 'Slippers of Spider Climbing',
    slot: 'feet',
    price: 4800,
    bonus: 0,
    description: 'Walk on walls and ceilings. Functions as spider climb spell continuously.'
  },
  
  // Vision & Senses
  'eyes-of-the-eagle': {
    id: '4Eif1LpYfJju9HPK',
    name: 'Eyes of the Eagle',
    slot: 'eyes',
    price: 2500,
    bonus: 0,
    description: '+5 competence bonus on Spot checks. See up to 10 times as far as normal in dim light.'
  },
  'goggles-of-night': {
    id: 'NAoEcu4dUYosGb9f',
    name: 'Goggles of Night',
    slot: 'slotless',
    price: 12000,
    bonus: 0,
    description: 'Grant continuous darkvision 60 ft. If wearer already has darkvision, extends it by 60 ft.'
  },
  
  // Protection Items
  'bracers-of-armor-1': {
    id: '6PsJOv5Gz8k0OLgU',
    name: 'Bracers of Armor +1',
    slot: 'wrists',
    price: 1000,
    bonus: 1,
    description: '+1 armor bonus to AC. No armor check penalty or arcane spell failure. Good for casters!'
  },
  'bracers-of-armor-2': {
    id: 'uMdb7TlnUWaod7kp',
    name: 'Bracers of Armor +2',
    slot: 'wrists',
    price: 4000,
    bonus: 2,
    description: '+2 armor bonus to AC. Ideal for monks and wizards who don\'t wear armor.'
  },
  'bracers-of-armor-3': {
    id: '4iTA8I89BXxw7GXI',
    name: 'Bracers of Armor +3',
    slot: 'wrists',
    price: 9000,
    bonus: 3,
    description: '+3 armor bonus to AC. No armor check penalty or spell failure.'
  },
  'scarab-of-protection': {
    id: 'Q3wc4XVVMgA3WFux',
    name: 'Scarab of Protection',
    slot: 'slotless',
    price: 38000,
    bonus: 0,
    description: 'Grants +5 resistance bonus on saves vs death effects and energy drain. 12 charges total (absorbs 1 level per charge).'
  },
  
  // Ability Enhancement (alternative to headband for DEX builds)
  'gloves-of-dexterity-2': {
    id: '4P5yn0LYo3dwQjme',
    name: 'Gloves of Dexterity +2',
    slot: 'hands',
    price: 4000,
    bonus: 2,
    description: '+2 enhancement bonus to Dexterity.'
  },
  'gloves-of-dexterity-4': {
    id: 'QtTlWHZg506MRg2A',
    name: 'Gloves of Dexterity +4',
    slot: 'hands',
    price: 16000,
    bonus: 4,
    description: '+4 enhancement bonus to Dexterity.'
  },
  'gloves-of-dexterity-6': {
    id: '6Wa5nrzzOrvvj3en',
    name: 'Gloves of Dexterity +6',
    slot: 'hands',
    price: 36000,
    bonus: 6,
    description: '+6 enhancement bonus to Dexterity.'
  },
  
  // High-End Utility
  'boots-of-teleportation': {
    id: 'Eq4WLjlfU2QCYjMP',
    name: 'Boots of Teleportation',
    slot: 'feet',
    price: 49000,
    bonus: 0,
    description: 'Teleport 3 times per day as teleport spell (CL 9). Must speak command word.'
  },
  
  // Pearls of Power (Casters only - recall expended spells)
  // NOTE: Only ONE pearl should be purchased - the highest level affordable
  'pearl-of-power-1': {
    id: 'OkUi8BK1iST50BMW',
    name: 'Pearl of Power (1st)',
    slot: 'slotless',
    price: 1000,
    bonus: 0,
    description: 'Once per day, recall one 1st-level spell that has already been cast. Casters only.'
  },
  'pearl-of-power-2': {
    id: 'sClvvjs3ntuDy4rU',
    name: 'Pearl of Power (2nd)',
    slot: 'slotless',
    price: 4000,
    bonus: 0,
    description: 'Once per day, recall one 2nd-level spell. Casters only.'
  },
  'pearl-of-power-3': {
    id: 'J4071uAIrOLDEGEV',
    name: 'Pearl of Power (3rd)',
    slot: 'slotless',
    price: 9000,
    bonus: 0,
    description: 'Once per day, recall one 3rd-level spell. Casters only.'
  },
  'pearl-of-power-4': {
    id: '1Hoom9beAdeicAty',
    name: 'Pearl of Power (4th)',
    slot: 'slotless',
    price: 16000,
    bonus: 0,
    description: 'Once per day, recall one 4th-level spell. Casters only.'
  },
  'pearl-of-power-5': {
    id: 'cuxQ5ye8cBrEXmFK',
    name: 'Pearl of Power (5th)',
    slot: 'slotless',
    price: 25000,
    bonus: 0,
    description: 'Once per day, recall one 5th-level spell. Casters only.'
  },
  'pearl-of-power-6': {
    id: 'MOfw6kpKqIYpd3Jv',
    name: 'Pearl of Power (6th)',
    slot: 'slotless',
    price: 36000,
    bonus: 0,
    description: 'Once per day, recall one 6th-level spell. Casters only.'
  },
  'pearl-of-power-7': {
    id: 'U6Y24buGyYRynSiT',
    name: 'Pearl of Power (7th)',
    slot: 'slotless',
    price: 49000,
    bonus: 0,
    description: 'Once per day, recall one 7th-level spell. Casters only.'
  },
  'pearl-of-power-8': {
    id: 'TCrp8tLWpmPmWHhF',
    name: 'Pearl of Power (8th)',
    slot: 'slotless',
    price: 64000,
    bonus: 0,
    description: 'Once per day, recall one 8th-level spell. Casters only.'
  },
  'pearl-of-power-9': {
    id: 'TfanJynualxaj1SV',
    name: 'Pearl of Power (9th)',
    slot: 'slotless',
    price: 81000,
    bonus: 0,
    description: 'Once per day, recall one 9th-level spell. Casters only (requires 9th level slots).'
  }
} as const;

// =============================================================================
// CUSTOM ITEMS FOR D35E COMPATIBILITY
// =============================================================================

/**
 * Custom Handy Haversack (Loot Container Version)
 * 
 * The D35E system's Handy Haversack (mgzGRMp4Q5oMagZz) is an "equipment" type
 * with slot "slotless", which makes it unable to function as a container.
 * 
 * This custom version is a "loot" type with "container" subtype, making it
 * compatible with the D35E container system while maintaining all the haversack's
 * properties and benefits.
 * 
 * Properties:
 * - Type: loot (container subtype)
 * - Capacity: 120 lbs (80 lbs center + 40 lbs in side pouches)
 * - Weight: 5 lbs (constant, regardless of contents)
 * - Price: 2,000 gp
 * - Benefits: Items always on top (move action to retrieve), no AoO
 * 
 * This is NOT in the D35E compendium - we create it directly in the actor's inventory.
 */
export interface CustomContainerItem {
  name: string;
  type: 'loot';
  img: string;
  system: {
    subType: 'container';
    bagOfHoldingLike: boolean;
    capacity: number;
    weight: number;
    constantWeight: boolean;
    price: number;
    description: {
      value: string;
      chat: string;
      unidentified: string;
    };
    identified: boolean;
    carried: boolean;
    equipped: boolean;
    containerWeightless: boolean;
  };
}

export const CUSTOM_HANDY_HAVERSACK: CustomContainerItem = {
  name: 'Handy Haversack',
  type: 'loot',
  img: 'systems/D35E/icons/items/magic/wonders/Tailoring_50_bigmagic_bag.png',
  system: {
    subType: 'container',
    bagOfHoldingLike: true,
    capacity: 120,  // 80 lbs center + 40 lbs sides
    weight: 5,      // Always weighs 5 lbs when filled
    constantWeight: true,
    price: 2000,
    description: {
      value: '<div topic="Handy Haversack" level="8"><p><b>Handy Haversack:</b> A backpack of this sort appears to be well made, well used, and quite ordinary. It is constructed of finely tanned leather, and the straps have brass hardware and buckles. It has two side pouches, each of which appears large enough to hold about a quart of material. In fact, each is like a <i>bag of holding</i> and can actually hold material of as much as 2 cubic feet in volume or 20 pounds in weight. The large central portion of the pack can contain up to 8 cubic feet or 80 pounds of material. Even when so filled, the backpack always weighs only 5 pounds.</p><p>While such storage is useful enough, the pack has an even greater power in addition. When the wearer reaches into it for a specific item, that item is always on top. Thus, no digging around and fumbling is ever necessary to find what a haversack contains. Retrieving any specific item from a haversack is a move action, but it does not provoke the attacks of opportunity that retrieving a stored item usually does.</p><p>Moderate conjuration; CL 9th; Craft Wondrous Item, <i>secret chest</i>; Price 2,000 gp; Weight 5 lb.</p></div>',
      chat: '',
      unidentified: ''
    },
    identified: true,
    carried: true,
    equipped: true,
    containerWeightless: false
  }
} as const;

/**
 * Custom Scarab of Protection
 * 
 * The D35E compendium version is missing the changes[] array that applies SR 20.
 * We create a fixed version directly with the proper mechanics applied.
 * 
 * Properties:
 * - Type: equipment (wondrous item)
 * - Slot: slotless
 * - Spell Resistance: 20
 * - Price: 38,000 gp
 * - Charges: 12 (absorbs energy drain/death effects/negative energy)
 * 
 * Bug Fix: Adds changes array with SR 20 enhancement bonus
 */
export interface CustomWondrousItem {
  name: string;
  type: 'equipment';
  img: string;
  system: {
    equipmentType: 'misc';
    equipmentSubtype: 'wondrous';
    slot: string;
    price: number;
    weight: number;
    description: {
      value: string;
      chat: string;
      unidentified: string;
    };
    changes: Array<[string, string, string, string]>;
    identified: boolean;
    identifiedName: string;
    unidentified: {
      name: string;
      price: number;
    };
    carried: boolean;
    equipped: boolean;
  };
}

export const CUSTOM_SCARAB_OF_PROTECTION: CustomWondrousItem = {
  name: 'Scarab of Protection',
  type: 'equipment',
  img: 'systems/D35E/icons/items/loot/jewelry/jewelry_78.PNG',
  system: {
    equipmentType: 'misc',
    equipmentSubtype: 'wondrous',
    slot: 'slotless',
    price: 38000,
    weight: 0,
    description: {
      value: '<div topic="Scarab of Protection" level="8"><p><b>Scarab of Protection:</b> This device appears to be a silver medallion in the shape of a beetle. If it is held for 1 round, an inscription appears on its surface letting the holder know that it is a protective device.</p><p>The scarab\'s possessor gains spell resistance 20. The scarab can also absorb energy-draining attacks, death effects, and negative energy effects. Upon absorbing twelve such attacks, the scarab turns to powder and is destroyed.</p><p>Strong abjuration and necromancy; CL 18th; Craft Wondrous Item, <i>death ward</i>, <i>spell resistance</i>; Price 38,000 gp.</p></div>',
      chat: '',
      unidentified: ''
    },
    // CRITICAL FIX: Add the changes array that the compendium is missing
    changes: [
      ['20', 'misc', 'spellResistance', 'enh']
    ],
    identified: true,
    identifiedName: 'Scarab of Protection',
    unidentified: {
      name: 'Scarab',
      price: 0
    },
    carried: true,
    equipped: true
  }
} as const;


