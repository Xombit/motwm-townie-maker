/**
 * D35E Enhancement Definitions
 * Generated from D35E.enhancements compendium
 * Total: 88 enhancements (1 weapon base, 46 weapon special, 1 armor base, 30 armor special, 10 other)
 */

export interface EnhancementDefinition {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'shield' | 'other';
  enhIncrease: number;
  enhIsLevel: boolean;
  nameExtension: {
    prefix: string;
    suffix: string;
  };
  allowedTypes?: string[][];
  weaponData?: {
    damageRoll?: string;
    damageType?: string;
    damageTypeId?: string;
  };
  damageReduction?: string[][];
  requirements?: string;
  description?: string;
}

// =============================================================================
// WEAPON ENHANCEMENTS
// =============================================================================

/**
 * Base weapon enhancement (+1 to +5)
 * Set the 'enh' and 'enhIncrease' fields to the desired bonus level
 */
export const WEAPON_BASE_ENHANCEMENT: EnhancementDefinition = {
  id: 'Ng5AlRupmkMOgqQi',
  name: '+1 Weapon Enhancement',
  type: 'weapon',
  enhIncrease: 1,
  enhIsLevel: false,
  nameExtension: { prefix: '', suffix: '' },
  description: 'Magic weapons have enhancement bonuses ranging from +1 to +5. They apply these bonuses to both attack and damage rolls when used in combat.'
};

/**
 * Weapon Special Abilities
 * Alphabetically organized for easy reference
 */
export const WEAPON_SPECIAL_ABILITIES: Record<string, EnhancementDefinition> = {
  // Anarchic (+2) - Chaos-aligned, +2d6 vs lawful
  anarchic: {
    id: 'k0Ab5SnYk0Y39baq',
    name: 'Anarchic',
    type: 'weapon',
    enhIncrease: 2,
    enhIsLevel: false,
    nameExtension: { prefix: 'Anarchic', suffix: '' },
    weaponData: { damageRoll: '2d6', damageType: '', damageTypeId: 'damage-untyped' },
    requirements: 'CL 7th; Craft Magic Arms and Armor, chaos hammer, creator must be chaotic'
  },

  // Axiomatic (+2) - Law-aligned, +2d6 vs chaotic
  axiomatic: {
    id: 'sTSIrZVFXpfgYIDO',
    name: 'Axiomatic',
    type: 'weapon',
    enhIncrease: 2,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: '' },
    weaponData: { damageRoll: '2d6', damageType: '', damageTypeId: 'damage-untyped' },
    requirements: 'CL 7th; Craft Magic Arms and Armor, order\'s wrath, creator must be lawful'
  },

  // Bane - All creature types (+1 each, +2 enhancement +2d6 damage vs type)
  baneAberrations: {
    id: 'lWOcM2Z4AFPcqEYZ',
    name: 'Bane of Aberrations',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Bane of Aberrations' },
    weaponData: { damageRoll: '2d6', damageType: '', damageTypeId: 'damage-untyped' }
  },
  baneAnimals: {
    id: 'k6oQnwAQMzoJE9lc',
    name: 'Bane of Animals',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Bane of Animals' },
    weaponData: { damageRoll: '2d6', damageType: '', damageTypeId: 'damage-untyped' }
  },
  baneConstructs: {
    id: '9S2SATvB3MtC7RXm',
    name: 'Bane of Constructs',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Bane of Constructs' },
    weaponData: { damageRoll: '2d6', damageType: '', damageTypeId: 'damage-untyped' }
  },
  baneDragons: {
    id: 'RneNZPpmevib1gwd',
    name: 'Bane of Dragons',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Bane of Dragons' },
    weaponData: { damageRoll: '2d6', damageType: '', damageTypeId: 'damage-untyped' }
  },
  baneElementals: {
    id: 'mPZoCRCwXwUs8RER',
    name: 'Bane of Elementals',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Bane of Elementals' },
    weaponData: { damageRoll: '2d6', damageType: '', damageTypeId: 'damage-untyped' }
  },
  baneFey: {
    id: '7C6OD57df9VvTuJH',
    name: 'Bane of Fey',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Bane of Fey' },
    weaponData: { damageRoll: '2d6', damageType: '', damageTypeId: 'damage-untyped' }
  },
  baneGiants: {
    id: 'WR4UuJblSHkw3P9F',
    name: 'Bane of Giants',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Bane of Giants' },
    weaponData: { damageRoll: '2d6', damageType: '', damageTypeId: 'damage-untyped' }
  },
  baneHumanoids: {
    id: 'fR5rDXwOT8dNfWP1',
    name: 'Bane of Humanoids',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Bane of Humanoids' },
    weaponData: { damageRoll: '2d6', damageType: '', damageTypeId: 'damage-untyped' }
  },
  baneMagicalBeasts: {
    id: '9rAUGcASqHCEwago',
    name: 'Bane of Magical Beasts',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Bane of Magical Beasts' },
    weaponData: { damageRoll: '2d6', damageType: '', damageTypeId: 'damage-untyped' }
  },
  baneMonstrousHumanoids: {
    id: 'msECRBt5PmPwl442',
    name: 'Bane of Monstrous Humanoids',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Bane of Monstrous Humanoids' },
    weaponData: { damageRoll: '2d6', damageType: '', damageTypeId: 'damage-untyped' }
  },
  baneOozes: {
    id: 'nF54DTV7kbxQHyWH',
    name: 'Bane of Oozes',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Bane of Oozes' },
    weaponData: { damageRoll: '2d6', damageType: '', damageTypeId: 'damage-untyped' }
  },
  baneOutsiders: {
    id: 'O6Tj6ejvPbfmVAkV',
    name: 'Bane of Outsiders',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Bane of Outsiders' },
    weaponData: { damageRoll: '2d6', damageType: '', damageTypeId: 'damage-untyped' }
  },
  banePlants: {
    id: 'aCd2XFASrTCgcPER',
    name: 'Bane of Plants',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Bane of Plants' },
    weaponData: { damageRoll: '2d6', damageType: '', damageTypeId: 'damage-untyped' }
  },
  baneUndead: {
    id: '4u5NcGxpPH8ep6D3',
    name: 'Bane of Undead',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Bane of Undead' },
    weaponData: { damageRoll: '2d6', damageType: '', damageTypeId: 'damage-untyped' }
  },
  baneVermin: {
    id: 'otZjWPlqfjJ1J2AA',
    name: 'Bane of Vermin',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Bane of Vermin' },
    weaponData: { damageRoll: '2d6', damageType: '', damageTypeId: 'damage-untyped' }
  },

  // Brilliant Energy (+4) - Ignores armor/shield bonuses
  brilliantEnergy: {
    id: '0wqBeQtwZVbIH87Q',
    name: 'Brilliant Energy',
    type: 'weapon',
    enhIncrease: 4,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Brilliant Energy' },
    requirements: 'CL 16th; Craft Magic Arms and Armor, gaseous form, continual flame'
  },

  // Dancing (+4) - Weapon fights on its own
  dancing: {
    id: 'HBzfLgyJDyAiQ3As',
    name: 'Dancing',
    type: 'weapon',
    enhIncrease: 4,
    enhIsLevel: false,
    nameExtension: { prefix: 'Dancing', suffix: '' },
    requirements: 'CL 15th; Craft Magic Arms and Armor, animate objects'
  },

  // Defending (+1) - Transfer enhancement bonus to AC
  defending: {
    id: 'slKKGJe2ge31NiIt',
    name: 'Defending',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: 'Defending', suffix: '' },
    allowedTypes: [['weapon']],
    requirements: 'CL 8th; Craft Magic Arms and Armor, shield or shield of faith'
  },

  // Disruption (+2) - DC 14 Will save or undead destroyed (bludgeoning only)
  disruption: {
    id: 'NTsxFyUyiyCekxYb',
    name: 'Disruption',
    type: 'weapon',
    enhIncrease: 2,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Disruption' },
    allowedTypes: [['bludgeoning'], ['weapon']],
    requirements: 'CL 12th; Craft Magic Arms and Armor, heal'
  },

  // Distance (+1) - Doubles range increment (ranged only)
  distance: {
    id: 'WOoIBY8BzeOIrrfk',
    name: 'Distance',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Distance' },
    allowedTypes: [['weapon'], ['ranged']],
    requirements: 'CL 6th; Craft Magic Arms and Armor, clairaudience/clairvoyance'
  },

  // Dread of Undead (+7) - Ultimate anti-undead weapon
  dreadUndead: {
    id: 'Sw3cKIQLLVhhFHjQ',
    name: 'Dread of Undead',
    type: 'weapon',
    enhIncrease: 7,
    enhIsLevel: false,
    nameExtension: { prefix: 'Undead Dread', suffix: '' },
    weaponData: { damageRoll: '4d6', damageType: '', damageTypeId: 'damage-untyped' }
  },

  // Everdancing (+8) - Permanent dancing effect
  everdancing: {
    id: '2wZe6N32jo7bNdSn',
    name: 'Everdancing',
    type: 'weapon',
    enhIncrease: 8,
    enhIsLevel: false,
    nameExtension: { prefix: 'Everdancing', suffix: '' },
    allowedTypes: [['weapon']]
  },

  // Flaming (+1) - +1d6 fire damage
  flaming: {
    id: '8ymQFRb8BnIsKViV',
    name: 'Flaming',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: true,
    nameExtension: { prefix: 'Flaming', suffix: '' },
    allowedTypes: [['weapon']],
    weaponData: { damageRoll: '1d6', damageType: 'Fire', damageTypeId: 'energy-fire' },
    requirements: 'CL 10th; Craft Magic Arms and Armor, flame blade, flame strike, or fireball'
  },

  // Flaming Burst (+2) - +1d6 fire, +1d10 per multiplier on crit
  flamingBurst: {
    id: '02G45mX3YioHskwG',
    name: 'Flaming Burst',
    type: 'weapon',
    enhIncrease: 2,
    enhIsLevel: false,
    nameExtension: { prefix: 'Flaming Burst', suffix: '' },
    allowedTypes: [['weapon']],
    weaponData: { damageRoll: '1d6+(((@critMult))-(1))d10', damageType: 'Fire', damageTypeId: 'energy-fire' },
    requirements: 'CL 12th; Craft Magic Arms and Armor, flame blade, flame strike, or fireball'
  },

  // Frost (+1) - +1d6 cold damage
  frost: {
    id: 'q61KOQ6iNiptC0Bx',
    name: 'Frost',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: 'Frost', suffix: '' },
    weaponData: { damageRoll: '1d6', damageType: 'Cold', damageTypeId: 'energy-cold' },
    requirements: 'CL 10th; Craft Magic Arms and Armor and chill metal or ice storm'
  },

  // Ghost Touch (+1) - Affects incorporeal
  ghostTouch: {
    id: 'JwWLdIDaE8RtQDr2',
    name: 'Ghost Touch',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: 'Ghost Touch', suffix: '' },
    requirements: 'CL 9th; Craft Magic Arms and Armor, plane shift'
  },

  // Holy (+2) - +2d6 vs evil
  holy: {
    id: 'RaPnsGo8W0u2nb4l',
    name: 'Holy',
    type: 'weapon',
    enhIncrease: 2,
    enhIsLevel: false,
    nameExtension: { prefix: 'Holy', suffix: '' },
    weaponData: { damageRoll: '2d6', damageType: '', damageTypeId: 'damage-untyped' },
    requirements: 'CL 7th; Craft Magic Arms and Armor, holy smite, creator must be good'
  },

  // Icy Burst (+2) - +1d6 cold, +1d10 per multiplier on crit
  icyBurst: {
    id: 'TTGG19LQgFU2U6Ze',
    name: 'Icy Burst',
    type: 'weapon',
    enhIncrease: 2,
    enhIsLevel: false,
    nameExtension: { prefix: 'Icy Burst', suffix: '' },
    allowedTypes: [['weapon']],
    weaponData: { damageRoll: '1d6+(((@critMult))-(1))d10', damageType: 'Cold', damageTypeId: 'energy-cold' },
    requirements: 'CL 10th; Craft Magic Arms and Armor, chill metal or ice storm'
  },

  // Keen (+1) - Doubles threat range (slashing only)
  keen: {
    id: 'PPGTD9TygqYq1gPA',
    name: 'Keen',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: 'Keen', suffix: '' },
    allowedTypes: [['weapon'], ['slashing']],
    requirements: 'CL 10th; Craft Magical Arms and Armor, keen edge'
  },

  // Ki Focus (+1) - Monk can use ki strike abilities
  kiFocus: {
    id: '4mIkE7i2nfIThqm7',
    name: 'Ki Focus',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Ki Focus' },
    allowedTypes: [['weapon'], ['melee']],
    requirements: 'CL 8th; Craft Magic Arms and Armor, creator must be a monk'
  },

  // Merciful (+1) - +1d6 nonlethal, all damage is nonlethal
  merciful: {
    id: 'uGsscWT6NCrQivin',
    name: 'Merciful',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: 'Merciful', suffix: '' },
    allowedTypes: [['weapon']],
    weaponData: { damageRoll: '1d6', damageType: 'Nonlethal', damageTypeId: 'nonlethal' },
    requirements: 'CL 5th; Craft Magic Arms and Armor, cure light wounds'
  },

  // Mighty Cleaving (+1) - Free cleave on kill
  mightyCleaving: {
    id: 'CV7Ytnv5OgZLeReC',
    name: 'Mighty Cleaving',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Mighty Cleaving' },
    requirements: 'CL 8th; Craft Magic Arms and Armor, divine power'
  },

  // Returning (+1) - Returns to hand after thrown
  returning: {
    id: 'YWn7ILrquXx6wmHg',
    name: 'Returning',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: 'Returning', suffix: '' },
    allowedTypes: [['weapon'], ['thrown']],
    requirements: 'CL 7th; Craft Magic Arms and Armor, telekinesis'
  },

  // Seeking (+1) - Negates miss chance from concealment (ranged only)
  seeking: {
    id: 'XJYT5YK1ccCqhvq3',
    name: 'Seeking',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: 'Seeking', suffix: '' },
    allowedTypes: [['weapon'], ['ranged']],
    requirements: 'CL 12th; Craft Magic Arms and Armor, true seeing'
  },

  // Shock (+1) - +1d6 electricity damage
  shock: {
    id: 'CG0Tm1y2G74DCREn',
    name: 'Shock',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: 'Shock', suffix: '' },
    allowedTypes: [['weapon']],
    weaponData: { damageRoll: '1d6', damageType: 'Electricity', damageTypeId: 'energy-electric' },
    requirements: 'CL 8th; Craft Magic Arms and Armor, call lightning or lightning bolt'
  },

  // Shocking Burst (+2) - +1d6 electricity, +1d10 per multiplier on crit
  shockingBurst: {
    id: 'Kj7YAs2ELLFJfjlO',
    name: 'Shocking Burst',
    type: 'weapon',
    enhIncrease: 2,
    enhIsLevel: false,
    nameExtension: { prefix: 'Shocking Burst', suffix: '' },
    allowedTypes: [['weapon']],
    weaponData: { damageRoll: '1d6+(((@critMult))-(1))d10', damageType: 'Electricity', damageTypeId: 'energy-electric' },
    requirements: 'CL 10th; Craft Magic Arms and Armor, call lightning or lightning bolt'
  },

  // Speed (+3) - Extra attack at full BAB
  speed: {
    id: 'i5uiIHPkrW4US3fl',
    name: 'Speed',
    type: 'weapon',
    enhIncrease: 3,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Speed' },
    requirements: 'CL 7th; Craft Magic Arms and Armor, haste'
  },

  // Spell Storing (+1) - Store one spell (up to 3rd level)
  spellStoring: {
    id: 'JyH6oNkM7YjO2tYj',
    name: 'Spell Storing',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: 'Spell Storing', suffix: '' },
    requirements: 'CL 12th; Craft Magic Arms and Armor, imbue with spell ability'
  },

  // Throwing (+1) - Melee weapon gains 10 ft range increment
  throwing: {
    id: 'QQgHYJsXOG3PylSy',
    name: 'Throwing',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: 'Throwing', suffix: '' },
    allowedTypes: [['weapon'], ['melee']],
    requirements: 'CL 5th; Craft Magic Arms and Armor, magic stone'
  },

  // Thundering (+1) - +1d8 sonic on crit, DC 14 Fort or deafened
  thundering: {
    id: 'AVr5C03szoFJQkDO',
    name: 'Thundering',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: 'Thundering', suffix: '' },
    allowedTypes: [['weapon']],
    weaponData: { damageRoll: '(((@critMult))-(1))d10', damageType: 'Sonic', damageTypeId: 'energy-sonic' },
    requirements: 'CL 5th; Craft Magic Arms and Armor, blindness/deafness'
  },

  // Unholy (+2) - +2d6 vs good
  unholy: {
    id: 'yRXBQpq80qsBCVyB',
    name: 'Unholy',
    type: 'weapon',
    enhIncrease: 2,
    enhIsLevel: false,
    nameExtension: { prefix: 'Unholy', suffix: '' },
    weaponData: { damageRoll: '2d6', damageType: '', damageTypeId: 'damage-untyped' },
    requirements: 'CL 7th; Craft Magic Arms and Armor, unholy blight, creator must be evil'
  },

  // Vicious (+1) - +2d6 damage, 1d6 to wielder
  vicious: {
    id: 'SwfdifYHAXfIiyPJ',
    name: 'Vicious',
    type: 'weapon',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: 'Vicious', suffix: '' },
    allowedTypes: [['weapon'], ['melee']],
    weaponData: { damageRoll: '2d6', damageType: '', damageTypeId: 'damage-untyped' },
    requirements: 'CL 9th; Craft Magic Arms and Armor, enervation'
  },

  // Vorpal (+5) - Natural 20 + confirm = decapitation (slashing only)
  vorpal: {
    id: 'wBOvLs4RGaWBWydH',
    name: 'Vorpal',
    type: 'weapon',
    enhIncrease: 5,
    enhIsLevel: false,
    nameExtension: { prefix: 'Vorpal', suffix: '' },
    allowedTypes: [['weapon'], ['melee'], ['slashing']],
    requirements: 'CL 18th; Craft Magic Arms and Armor, circle of death, keen edge'
  },

  // Wounding (+2) - 1 point Constitution damage per hit
  wounding: {
    id: 'npKVpmW3UiBPSIdt',
    name: 'Wounding',
    type: 'weapon',
    enhIncrease: 2,
    enhIsLevel: false,
    nameExtension: { prefix: 'Wounding', suffix: '' },
    requirements: 'CL 10th; Craft Magic Arms and Armor, Mordenkainen\'s sword'
  }
};

// =============================================================================
// ARMOR ENHANCEMENTS
// =============================================================================

/**
 * Base armor enhancement (+1 to +5)
 * Set the 'enh' and 'enhIncrease' fields to the desired bonus level
 */
export const ARMOR_BASE_ENHANCEMENT: EnhancementDefinition = {
  id: 'iOhtLsgtgmt2l9CM',
  name: '+1 Armor Enhancement',
  type: 'armor',
  enhIncrease: 1,
  enhIsLevel: false,
  nameExtension: { prefix: '', suffix: '' },
  description: 'Magic armor has enhancement bonuses ranging from +1 to +5. All magic armor is also masterwork armor.'
};

/**
 * Armor Special Abilities
 * Alphabetically organized for easy reference
 * 
 * NOTE: Many resistance enhancements have enhIncrease: 0
 * This means they're priced differently (fixed GP cost, not bonus levels)
 */
export const ARMOR_SPECIAL_ABILITIES: Record<string, EnhancementDefinition> = {
  // Acid Resistance (0) - Resist 10 acid
  acidResistance: {
    id: 'XhvBWDpdW92xGkOS',
    name: 'Acid Resistance',
    type: 'armor',
    enhIncrease: 0,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Acid Resistance' }
  },
  acidResistanceGreater: {
    id: 'Jv8vuoWG5Uu1mt53',
    name: 'Acid Resistance, Greater',
    type: 'armor',
    enhIncrease: 0,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Greater Acid Resistance' }
  },
  acidResistanceImproved: {
    id: 'Ti0nYgd5UTFtPHVI',
    name: 'Acid Resistance, Improved',
    type: 'armor',
    enhIncrease: 0,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Improved Acid Resistance' }
  },

  // Animated (+2) - Shield animates, no penalties
  animated: {
    id: 'J5FLWFShaTjTXpGu',
    name: 'Animated',
    type: 'armor',
    enhIncrease: 2,
    enhIsLevel: false,
    nameExtension: { prefix: 'Animated', suffix: '' },
    requirements: 'CL 12th; Craft Magic Arms and Armor, animate objects'
  },

  // Arrow Catching (+1) - Shield deflects ranged attacks
  arrowCatching: {
    id: 'oHoYZizXSauB3UkB',
    name: 'Arrow Catching',
    type: 'armor',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: 'Arrow Catching', suffix: '' },
    requirements: 'CL 8th; Craft Magic Arms and Armor, entropic shield'
  },

  // Arrow Deflection (+2) - Deflect Shield feat once per round
  arrowDeflection: {
    id: 'p3HuFX608G4YtqhZ',
    name: 'Arrow Deflection',
    type: 'armor',
    enhIncrease: 2,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Arrow Deflection' },
    requirements: 'CL 5th; Craft Magic Arms and Armor, shield'
  },

  // Bashing (+1) - Shield deals more damage
  bashing: {
    id: 'oKhu0fyM7tJeS8GO',
    name: 'Bashing',
    type: 'armor',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Bashing' },
    requirements: 'CL 8th; Craft Magic Arms and Armor, bull\'s strength'
  },

  // Blinding (+1) - Blind attackers on confirm
  blinding: {
    id: 'E4kg8L3TojKfZf7O',
    name: 'Blinding',
    type: 'armor',
    enhIncrease: 1,
    enhIsLevel: false,
    nameExtension: { prefix: 'Blinding', suffix: '' },
    requirements: 'CL 7th; Craft Magic Arms and Armor, searing light'
  },

  // Cold Resistance (0) - Resist 10 cold
  coldResistance: {
    id: 'gUa6WECiXI7H5Zjh',
    name: 'Cold Resistance',
    type: 'armor',
    enhIncrease: 0,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Cold Resistance' }
  },
  coldResistanceGreater: {
    id: '2T484OMyTSiqiPaZ',
    name: 'Cold Resistance, Greater',
    type: 'armor',
    enhIncrease: 0,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Greater Cold Resistance' }
  },
  coldResistanceImproved: {
    id: 'E1QBi1i1XEdlziVX',
    name: 'Cold Resistance, Improved',
    type: 'armor',
    enhIncrease: 0,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Improved Cold Resistance' }
  },

  // Electricity Resistance (0) - Resist 10 electricity
  electricityResistance: {
    id: 'Xj1dJIa4egV2ES7f',
    name: 'Electricity Resistance',
    type: 'armor',
    enhIncrease: 0,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Electricity Resistance' }
  },
  electricityResistanceGreater: {
    id: 'CwuEpntNO1HoMgSC',
    name: 'Electricity Resistance, Greater',
    type: 'armor',
    enhIncrease: 0,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Greater Electricity Resistance' }
  },
  electricityResistanceImproved: {
    id: '6KJsATHN2vTV2wtM',
    name: 'Electricity Resistance, Improved',
    type: 'armor',
    enhIncrease: 0,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Improved Electricity Resistance' }
  },

  // Etherealness (0) - Become ethereal 1/day
  etherealness: {
    id: 'wOgrV7Qv5LndyNG3',
    name: 'Etherealness',
    type: 'armor',
    enhIncrease: 0,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Etherealness' },
    requirements: 'CL 13th; Craft Magic Arms and Armor, ethereal jaunt'
  },

  // Fire Resistance (0) - Resist 10 fire
  fireResistance: {
    id: 'dj6mQljg7t1smkK2',
    name: 'Fire Resistance',
    type: 'armor',
    enhIncrease: 0,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Fire Resistance' }
  },
  fireResistanceGreater: {
    id: 'RMFlj5tFzlsvBBuP',
    name: 'Fire Resistance, Greater',
    type: 'armor',
    enhIncrease: 0,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Greater Fire Resistance' }
  },
  fireResistanceImproved: {
    id: 'cf0DegnbVctoU9KX',
    name: 'Fire Resistance, Improved',
    type: 'armor',
    enhIncrease: 0,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Improved Fire Resistance' }
  },

  // Fortification (+1/+3/+5) - 25%/75%/100% chance to negate critical hits
  // Uses enhIsLevel: true with enh field to control Light (1), Moderate (2), Heavy (3)
  fortification: {
    id: 'STDeZl8OzwXSyLTB',  // Correct enhancement ID
    name: 'Fortification',
    type: 'armor',
    enhIncrease: 1, // Light=1 (+1), Moderate=3 (+3), Heavy=5 (+5) via @enhancement*2-1 formula
    enhIsLevel: true, // This enhancement has levels
    nameExtension: { prefix: '', suffix: 'Fortification' },
    requirements: 'CL 13th; Craft Magic Arms and Armor, limited wish or miracle'
  },

  // Glamered (0) - Change appearance at will
  glamered: {
    id: '4H7zIMRG4Stlet5j',
    name: 'Glamered',
    type: 'armor',
    enhIncrease: 0,
    enhIsLevel: false,
    nameExtension: { prefix: 'Glamered', suffix: '' },
    requirements: 'CL 10th; Craft Magic Arms and Armor, disguise self'
  },

  // Invulnerability (+3) - DR 5/magic
  invulnerability: {
    id: 'mTRqWfCH1G5qWVie',
    name: 'Invulnerability',
    type: 'armor',
    enhIncrease: 3,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Invulnerability' },
    damageReduction: [['5', 'magic']],
    requirements: 'CL 18th; Craft Magic Arms and Armor, stoneskin, wish or miracle'
  },

  // Reflecting (+5) - Reflects spells back at caster
  reflecting: {
    id: 'RThyTYahgFuDnVJQ',
    name: 'Reflecting',
    type: 'armor',
    enhIncrease: 5,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: '' },
    requirements: 'CL 14th; Craft Magic Arms and Armor, spell turning'
  },

  // Shadow (0) - +5 competence bonus to Hide
  shadow: {
    id: 'r2I4wKm3NAJKN6sh',
    name: 'Shadow',
    type: 'armor',
    enhIncrease: 0,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Shadow' },
    requirements: 'CL 5th; Craft Magic Arms and Armor, invisibility'
  },

  // Silent Moves (0) - +5 competence bonus to Move Silently
  silentMoves: {
    id: 'ulJT76GsSoSUoYCK',
    name: 'Silent Moves',
    type: 'armor',
    enhIncrease: 0,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Silent Moves' },
    requirements: 'CL 5th; Craft Magic Arms and Armor, silence'
  },

  // Slick (0) - +5 competence bonus to Escape Artist
  slick: {
    id: '8OaIZq2wsPZaUVvD',
    name: 'Slick',
    type: 'armor',
    enhIncrease: 0,
    enhIsLevel: false,
    nameExtension: { prefix: 'Slick', suffix: '' },
    requirements: 'CL 4th; Craft Magic Arms and Armor, grease'
  },

  // Sonic Resistance (0) - Resist 10 sonic
  sonicResistance: {
    id: '7oUj276yj4bK9o2f',
    name: 'Sonic Resistance',
    type: 'armor',
    enhIncrease: 0,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Sonic Resistance' }
  },
  sonicResistanceGreater: {
    id: 'CM3uVPE5RnRCsFa4',
    name: 'Sonic Resistance, Greater',
    type: 'armor',
    enhIncrease: 0,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Greater FireSonicResistance' } // Note: Typo in compendium
  },
  sonicResistanceImproved: {
    id: 'SWs7wMhzeYGrAlWH',
    name: 'Sonic Resistance, Improved',
    type: 'armor',
    enhIncrease: 0,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Improved Sonic Resistance' }
  },

  // Undead Controlling (0) - Control up to 26 HD undead per day
  undeadControlling: {
    id: 'hNIRkA1PoqraKQNz',
    name: 'Undead Controlling',
    type: 'armor',
    enhIncrease: 0,
    enhIsLevel: false,
    nameExtension: { prefix: '', suffix: 'Undead Controlling' },
    requirements: 'CL 13th; Craft Magic Arms and Armor, control undead'
  },

  // Wild (+3) - Armor melds into wild shape form
  wild: {
    id: 'zRR8JX67V8HkHFZ8',
    name: 'Wild',
    type: 'armor',
    enhIncrease: 3,
    enhIsLevel: false,
    nameExtension: { prefix: 'Wild', suffix: '' },
    requirements: 'CL 9th; Craft Magic Arms and Armor, baleful polymorph'
  }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get all weapon special abilities as an array
 */
export function getAllWeaponSpecialAbilities(): EnhancementDefinition[] {
  return Object.values(WEAPON_SPECIAL_ABILITIES);
}

/**
 * Get all armor special abilities as an array
 */
export function getAllArmorSpecialAbilities(): EnhancementDefinition[] {
  return Object.values(ARMOR_SPECIAL_ABILITIES);
}

/**
 * Get weapon special abilities that cost specific bonus levels
 */
export function getWeaponAbilitiesByCost(cost: number): EnhancementDefinition[] {
  return Object.values(WEAPON_SPECIAL_ABILITIES).filter(e => e.enhIncrease === cost);
}

/**
 * Get armor special abilities that cost specific bonus levels
 */
export function getArmorAbilitiesByCost(cost: number): EnhancementDefinition[] {
  return Object.values(ARMOR_SPECIAL_ABILITIES).filter(e => e.enhIncrease === cost);
}

/**
 * Get weapon special abilities by allowed weapon types
 * @param weaponTypes Array of weapon type restrictions (e.g., ['slashing'], ['ranged'])
 */
export function getWeaponAbilitiesByType(weaponTypes: string[]): EnhancementDefinition[] {
  return Object.values(WEAPON_SPECIAL_ABILITIES).filter(ability => {
    if (!ability.allowedTypes || ability.allowedTypes.length === 0) {
      return true; // No restrictions, works on all weapons
    }
    
    // Check if weapon matches any of the allowed type combinations
    return ability.allowedTypes.some(allowedCombo =>
      weaponTypes.some(wType => allowedCombo.includes(wType))
    );
  });
}

/**
 * Calculate total enhancement cost
 * @param baseBonus Enhancement bonus (+1 to +5)
 * @param specialAbilities Array of special ability costs
 * @returns Total bonus levels (max 10)
 */
export function calculateTotalBonusLevels(baseBonus: number, specialAbilities: number[]): number {
  const total = baseBonus + specialAbilities.reduce((sum, cost) => sum + cost, 0);
  return Math.min(total, 10); // Max +10 per SRD rules
}

/**
 * Get enhancement cost in gold pieces
 * @param totalBonusLevels Total enhancement bonus levels (1-10)
 * @returns Cost in gold pieces
 */
export function getEnhancementCost(totalBonusLevels: number): number {
  const costs = [0, 2000, 8000, 18000, 32000, 50000, 72000, 98000, 128000, 162000, 200000];
  return costs[Math.min(totalBonusLevels, 10)];
}
