/**
 * Feat Selection System for D&D 3.5e
 * 
 * Handles:
 * - Standard feat progression (1st, 3rd, 6th, 9th, 12th, 15th, 18th)
 * - Bonus human feat (1st level)
 * - Class bonus feats (Fighter, Wizard, Monk, Rogue special abilities)
 * - Class features with choices (Ranger favored enemy, Ranger combat style)
 */

import { FeatConfig } from '../types';

/**
 * Calculate which levels grant standard feats
 */
export function getStandardFeatLevels(level: number, isHuman: boolean = false): number[] {
  const featLevels: number[] = [1]; // Everyone gets a feat at level 1
  for (let lvl = 3; lvl <= level; lvl += 3) {
    featLevels.push(lvl);
  }
  
  // Humans get bonus feat at level 1
  if (isHuman) {
    featLevels.push(1);
  }
  
  return featLevels.sort((a, b) => a - b);
}

/**
 * Calculate which levels grant Fighter bonus feats
 * Fighters get bonus feats at 1st, 2nd, 4th, 6th, 8th, 10th, 12th, 14th, 16th, 18th, 20th
 */
export function getFighterBonusFeatLevels(level: number): number[] {
  const bonusLevels: number[] = [1, 2];
  for (let lvl = 4; lvl <= level; lvl += 2) {
    bonusLevels.push(lvl);
  }
  return bonusLevels;
}

/**
 * Calculate which levels grant Wizard bonus feats
 * Wizards get bonus feats at 5th, 10th, 15th, 20th
 */
export function getWizardBonusFeatLevels(level: number): number[] {
  const bonusLevels: number[] = [];
  for (let lvl = 5; lvl <= level; lvl += 5) {
    bonusLevels.push(lvl);
  }
  return bonusLevels;
}

/**
 * Calculate which levels grant Monk bonus feats
 * Monks get bonus feats at 1st, 2nd, 6th
 */
export function getMonkBonusFeatLevels(level: number): number[] {
  const bonusLevels: number[] = [];
  if (level >= 1) bonusLevels.push(1);
  if (level >= 2) bonusLevels.push(2);
  if (level >= 6) bonusLevels.push(6);
  return bonusLevels;
}

/**
 * Calculate which levels grant Rogue special abilities
 * Rogues get special abilities at 10th, 13th, 16th, 19th
 */
export function getRogueSpecialAbilityLevels(level: number): number[] {
  const specialLevels: number[] = [];
  if (level >= 10) specialLevels.push(10);
  if (level >= 13) specialLevels.push(13);
  if (level >= 16) specialLevels.push(16);
  if (level >= 19) specialLevels.push(19);
  return specialLevels;
}

/**
 * Calculate which levels grant Ranger combat style feats
 * Rangers get combat style feats at 2nd, 6th, 11th
 */
export function getRangerCombatStyleLevels(level: number): number[] {
  const styleLevels: number[] = [];
  if (level >= 2) styleLevels.push(2);
  if (level >= 6) styleLevels.push(6);
  if (level >= 11) styleLevels.push(11);
  return styleLevels;
}

/**
 * Calculate which levels grant Ranger favored enemy
 * Rangers get favored enemy at 1st, 5th, 10th, 15th, 20th
 */
export function getRangerFavoredEnemyLevels(level: number): number[] {
  const favoredLevels: number[] = [1];
  for (let lvl = 5; lvl <= level; lvl += 5) {
    favoredLevels.push(lvl);
  }
  return favoredLevels;
}

/**
 * Fighter bonus feat list (must meet prerequisites)
 */
export const FIGHTER_BONUS_FEATS = [
  // Ranged Combat
  'Point Blank Shot',
  'Precise Shot',
  'Rapid Shot',
  'Manyshot',
  'Shot on the Run',
  'Far Shot',
  'Improved Precise Shot',
  
  // Melee Combat - One-Handed
  'Power Attack',
  'Cleave',
  'Great Cleave',
  'Improved Sunder',
  'Improved Bull Rush',
  'Improved Overrun',
  
  // Melee Combat - Two-Weapon Fighting
  'Two-Weapon Fighting',
  'Improved Two-Weapon Fighting',
  'Greater Two-Weapon Fighting',
  'Two-Weapon Defense',
  
  // Melee Combat - Two-Handed
  // Power Attack feats (listed above)
  
  // Mounted Combat
  'Mounted Combat',
  'Mounted Archery',
  'Ride-By Attack',
  'Spirited Charge',
  'Trample',
  
  // Weapon Specialization
  'Weapon Focus',
  'Weapon Specialization',
  'Greater Weapon Focus',
  'Greater Weapon Specialization',
  'Improved Critical',
  
  // Defense
  'Dodge',
  'Mobility',
  'Spring Attack',
  'Combat Reflexes',
  'Whirlwind Attack',
  
  // Other
  'Exotic Weapon Proficiency',
  'Improved Unarmed Strike',
  'Improved Grapple',
  'Improved Disarm',
  'Improved Feint',
  'Improved Initiative',
  'Quick Draw'
];

/**
 * Wizard bonus feat list (metamagic and item creation)
 */
export const WIZARD_BONUS_FEATS = [
  // Metamagic Feats
  'Empower Spell',
  'Enlarge Spell',
  'Extend Spell',
  'Heighten Spell',
  'Maximize Spell',
  'Quicken Spell',
  'Silent Spell',
  'Still Spell',
  'Widen Spell',
  
  // Item Creation Feats
  'Brew Potion',
  'Craft Magic Arms and Armor',
  'Craft Rod',
  'Craft Staff',
  'Craft Wand',
  'Craft Wondrous Item',
  'Forge Ring',
  'Scribe Scroll',
  
  // Spell-related
  'Spell Focus',
  'Greater Spell Focus',
  'Spell Penetration',
  'Greater Spell Penetration'
];

/**
 * Monk bonus feat list (specific feat choices)
 */
export const MONK_BONUS_FEATS = [
  'Improved Grapple',
  'Stunning Fist',
  'Combat Reflexes',
  'Deflect Arrows',
  'Improved Disarm',
  'Improved Trip'
];

/**
 * Rogue special abilities (10th, 13th, 16th, 19th levels)
 */
export const ROGUE_SPECIAL_ABILITIES = [
  // Skill-based
  'Skill Mastery', // Select skills that can be used even under stress
  
  // Defensive
  'Defensive Roll',
  'Improved Evasion',
  'Opportunist',
  'Slippery Mind',
  
  // Offensive
  'Crippling Strike',
  'Feat' // Can choose any feat they qualify for
];

/**
 * Ranger combat styles
 */
export enum RangerCombatStyle {
  ARCHERY = 'archery',
  TWO_WEAPON = 'two-weapon'
}

/**
 * Get Ranger archery combat style feats by level
 */
export function getRangerArcheryFeats(level: number): string[] {
  const feats: string[] = [];
  if (level >= 2) feats.push('Rapid Shot');
  if (level >= 6) feats.push('Manyshot');
  if (level >= 11) feats.push('Improved Precise Shot');
  return feats;
}

/**
 * Get Ranger two-weapon combat style feats by level
 */
export function getRangerTwoWeaponFeats(level: number): string[] {
  const feats: string[] = [];
  if (level >= 2) feats.push('Two-Weapon Fighting');
  if (level >= 6) feats.push('Improved Two-Weapon Fighting');
  if (level >= 11) feats.push('Greater Two-Weapon Fighting');
  return feats;
}

/**
 * Ranger favored enemy types
 */
export const RANGER_FAVORED_ENEMIES = [
  'Aberration',
  'Animal',
  'Construct',
  'Dragon',
  'Elemental',
  'Fey',
  'Giant',
  'Humanoid (Aquatic)',
  'Humanoid (Dwarf)',
  'Humanoid (Elf)',
  'Humanoid (Goblinoid)',
  'Humanoid (Gnoll)',
  'Humanoid (Gnome)',
  'Humanoid (Halfling)',
  'Humanoid (Human)',
  'Humanoid (Orc)',
  'Humanoid (Reptilian)',
  'Magical Beast',
  'Monstrous Humanoid',
  'Ooze',
  'Outsider (Air)',
  'Outsider (Chaotic)',
  'Outsider (Earth)',
  'Outsider (Evil)',
  'Outsider (Fire)',
  'Outsider (Good)',
  'Outsider (Lawful)',
  'Outsider (Native)',
  'Outsider (Water)',
  'Plant',
  'Undead',
  'Vermin'
];

/**
 * Determine Ranger combat style from weapon loadout
 */
export function determineRangerCombatStyle(weapons: Array<{ name: string }>): RangerCombatStyle {
  if (weapons.length === 0) return RangerCombatStyle.ARCHERY; // Default
  
  const firstWeapon = weapons[0].name.toLowerCase();
  
  // Check if first weapon is ranged
  const rangedWeapons = ['bow', 'crossbow', 'sling'];
  const isRanged = rangedWeapons.some(type => firstWeapon.includes(type));
  
  return isRanged ? RangerCombatStyle.ARCHERY : RangerCombatStyle.TWO_WEAPON;
}

/**
 * Build complete feat list for a character
 */
export interface FeatAllocation {
  level: number;
  source: 'standard' | 'human' | 'fighter' | 'wizard' | 'monk' | 'rogue' | 'ranger-style';
  feat: string | FeatConfig;
}

/**
 * Allocate feats for a character based on class and level
 */
export function allocateFeats(
  className: string,
  level: number,
  isHuman: boolean,
  templateFeats: Array<string | FeatConfig>,
  rangerCombatStyle?: RangerCombatStyle
): FeatAllocation[] {
  const allocations: FeatAllocation[] = [];
  const classLower = className.toLowerCase();
  
  // Standard feats
  const standardLevels = getStandardFeatLevels(level, isHuman);
  let featIndex = 0;
  
  // Track which feats have been allocated
  const usedFeats = new Set<number>();
  
  // Special handling for Rangers - add combat style feats first
  if (classLower === 'ranger' && rangerCombatStyle) {
    const styleLevels = getRangerCombatStyleLevels(level);
    const styleFeats = rangerCombatStyle === RangerCombatStyle.ARCHERY 
      ? getRangerArcheryFeats(level)
      : getRangerTwoWeaponFeats(level);
    
    styleLevels.forEach((lvl, index) => {
      if (index < styleFeats.length) {
        allocations.push({
          level: lvl,
          source: 'ranger-style',
          feat: styleFeats[index]
        });
      }
    });
  }
  
  // Class bonus feats
  if (classLower === 'fighter') {
    const bonusLevels = getFighterBonusFeatLevels(level);
    bonusLevels.forEach(lvl => {
      if (featIndex < templateFeats.length) {
        allocations.push({
          level: lvl,
          source: 'fighter',
          feat: templateFeats[featIndex]
        });
        usedFeats.add(featIndex);
        featIndex++;
      }
    });
  } else if (classLower === 'wizard') {
    const bonusLevels = getWizardBonusFeatLevels(level);
    bonusLevels.forEach(lvl => {
      if (featIndex < templateFeats.length) {
        allocations.push({
          level: lvl,
          source: 'wizard',
          feat: templateFeats[featIndex]
        });
        usedFeats.add(featIndex);
        featIndex++;
      }
    });
  } else if (classLower === 'monk') {
    const bonusLevels = getMonkBonusFeatLevels(level);
    bonusLevels.forEach(lvl => {
      if (featIndex < templateFeats.length) {
        allocations.push({
          level: lvl,
          source: 'monk',
          feat: templateFeats[featIndex]
        });
        usedFeats.add(featIndex);
        featIndex++;
      }
    });
  } else if (classLower === 'rogue') {
    const specialLevels = getRogueSpecialAbilityLevels(level);
    specialLevels.forEach(lvl => {
      if (featIndex < templateFeats.length) {
        allocations.push({
          level: lvl,
          source: 'rogue',
          feat: templateFeats[featIndex]
        });
        usedFeats.add(featIndex);
        featIndex++;
      }
    });
  }
  
  // Allocate standard feats
  standardLevels.forEach(lvl => {
    if (featIndex < templateFeats.length) {
      // Skip if we already used this feat for bonus feat
      while (usedFeats.has(featIndex) && featIndex < templateFeats.length) {
        featIndex++;
      }
      
      if (featIndex < templateFeats.length) {
        allocations.push({
          level: lvl,
          source: isHuman && lvl === 1 && allocations.filter(a => a.level === 1).length > 0 ? 'human' : 'standard',
          feat: templateFeats[featIndex]
        });
        usedFeats.add(featIndex);
        featIndex++;
      }
    }
  });
  
  // Sort by level
  return allocations.sort((a, b) => a.level - b.level);
}
