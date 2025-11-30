/**
 * MAGIC ITEM SYSTEM
 * 
 * This module handles the selection and application of magic items to characters.
 * It uses the D35E enhancements compendium to apply weapon and armor enhancements.
 * 
 * Architecture:
 * 1. Determine available magic item budget (wealth - mundane equipment cost)
 * 2. Allocate budget: 40% weapon, 30% armor, 30% other items (future)
 * 3. Select appropriate enhancements based on level and class
 * 4. Apply enhancements to existing mundane items
 * 5. Update item names, prices, and properties
 */

import { 
  WEAPON_BASE_ENHANCEMENT,
  ARMOR_BASE_ENHANCEMENT,
  WEAPON_SPECIAL_ABILITIES,
  ARMOR_SPECIAL_ABILITIES,
  getEnhancementCost
} from './enhancements';

import {
  getBestWeaponEnhancementForCharacter,
  getBestArmorEnhancementForCharacter,
  getBestShieldEnhancementForCharacter
} from './enhancement-recommendations';

import {
  GAUNTLETS_OF_OGRE_POWER,
  BELT_OF_GIANT_STRENGTH,
  HEADBAND_OF_INTELLECT,
  CLOAK_OF_RESISTANCE,
  RING_OF_PROTECTION,
  AMULET_OF_NATURAL_ARMOR,
  getBestAffordableBonus,
  BIG_SIX_PRIORITIES,
  WondrousItemDefinition,
  UTILITY_WONDROUS_ITEMS,
  CUSTOM_HANDY_HAVERSACK,
  CustomContainerItem
} from './wondrous-items';

import {
  selectWands,
  WandRecommendation
} from './wand-recommendations';

import {
  selectScrolls,
  ScrollRecommendation
} from './scroll-recommendations';

import {
  selectPotions
} from './potion-recommendations';

/**
 * Budget allocation for magic items
 * Based on the "Big Six" priority system
 * 
 * Updated with unified consumables budget that adapts by class type
 * Martials get more weapon/armor budget since they rely on them more
 */
export const MAGIC_ITEM_BUDGET_ALLOCATION = {
  martial: {
    weapon: 0.38,      // 38% - Martials need GREAT weapons (increased from 32%)
    armor: 0.34,       // 34% - Martials need GREAT armor+shield (increased from 28%)
    statItem: 0.12,    // 12% - Stat booster
    resistance: 0.07,  // 7% - Cloak of Resistance
    protection: 0.07,  // 7% - Ring/Amulet
    consumables: 0.02  // 2% - Mostly potions (reduced to spend more on combat gear)
  },
  caster: {
    weapon: 0.22,      // 22% - Casters don't rely on weapons (slightly increased)
    armor: 0.22,       // 22% - Casters wear lighter armor (increased from 18%)
    statItem: 0.18,    // 18% - Stat boost is KEY for DCs
    resistance: 0.12,  // 12% - Saves are important
    protection: 0.10,  // 10% - AC helps fragile casters
    consumables: 0.16  // 16% - Wands/scrolls/potions (reduced to spend more on defenses)
  },
  // Paladins/Rangers: martial combat prowess + divine casting
  // Need high weapon/armor but also wands/scrolls/potions
  partialCasterMartial: {
    weapon: 0.38,      // 38% - Frontline combatants need great weapons
    armor: 0.34,       // 34% - Frontline combatants need great armor
    statItem: 0.12,    // 12% - Stat booster (Cha for Paladin, Wis for Ranger)
    resistance: 0.06,  // 6% - Cloak of Resistance (slightly reduced)
    protection: 0.04,  // 4% - Ring/Amulet (slightly reduced)
    consumables: 0.06  // 6% - Wands/scrolls/potions (3x more than pure martial)
  }
} as const;

/**
 * Consumables budget split by class type
 * - Full casters favor wands/scrolls (can use all spell items)
 * - Partial casters get balanced mix (some spell items, lots of potions)
 * - Martials get potions only (can't use wands/scrolls without UMD)
 */
export const CONSUMABLE_SPLITS = {
  fullCaster: {
    wands: 0.60,      // 60% wands (7.2% of total budget)
    scrolls: 0.25,    // 25% scrolls (3% of total budget)
    potions: 0.15     // 15% potions (1.8% of total budget)
  },
  partialCaster: {
    wands: 0.40,      // 40% wands (4.8% of total budget)
    scrolls: 0.15,    // 15% scrolls (1.8% of total budget)
    potions: 0.45     // 45% potions (5.4% of total budget)
  },
  martial: {
    wands: 0.00,      // 0% wands (martials can't use without UMD)
    scrolls: 0.00,    // 0% scrolls (martials can't cast)
    potions: 1.00     // 100% potions (24k gp at level 15!)
  }
} as const;

/**
 * Determine class type for consumables allocation
 */
export function getClassType(characterClass: string): keyof typeof CONSUMABLE_SPLITS {
  const className = characterClass.toLowerCase();
  
  // Full casters
  if (['wizard', 'sorcerer', 'cleric', 'druid'].includes(className)) {
    return 'fullCaster';
  }
  
  // Partial casters
  if (['bard', 'paladin', 'ranger'].includes(className)) {
    return 'partialCaster';
  }
  
  // Martials (fighter, barbarian, rogue, monk)
  return 'martial';
}

/**
 * Enhanced item data returned after applying enhancements
 */
export interface EnhancedItemData {
  name: string;
  identifiedName: string;
  price: number;
  enhancements: any[]; // Array of enhancement item objects
  masterwork: boolean;
  enhancementBonus: number;
}

/**
 * Special ability with optional level (for enhancements like Fortification)
 */
export interface EnhancementAbility {
  key: string;      // Ability key (e.g., 'fortification')
  level?: number;   // Optional level (1=Light, 2=Moderate, 3=Heavy for fortification)
}

/**
 * Magic item selection result
 */
/**
 * Potion recommendation
 */
export interface PotionRecommendation {
  name: string;
  spellLevel: number;
  casterLevel: number;
  cost: number;
  quantity: number;
}

export interface MagicItemSelection {
  weaponEnhancement: { bonus: number; abilities: string[] } | null;
  secondaryWeaponEnhancement: { bonus: number; abilities: string[] } | null;  // For backup/off-hand weapons
  armorEnhancement: { bonus: number; abilities: (string | EnhancementAbility)[] } | null;
  shieldEnhancement: { bonus: number; abilities: (string | EnhancementAbility)[] } | null;  // Shield enhancements (uses armor mechanics)
  wondrousItems: WondrousItemDefinition[];
  hasHandyHaversack: boolean;  // Flag to create custom Handy Haversack (not in compendium)
  wands: WandRecommendation[];  // Wands for casters
  scrolls: ScrollRecommendation[];  // Scrolls for casters
  potions: PotionRecommendation[];  // Potions for everyone
  weaponCost: number;
  secondaryWeaponCost: number;  // Cost of secondary weapon enhancement
  armorCost: number;
  shieldCost: number;  // Cost of shield enhancement
  wondrousCost: number;
  wandsCost: number;  // Cost of wands
  scrollsCost: number;  // Cost of scrolls
  potionsCost: number;  // Cost of potions
  totalCost: number;
}

/**
 * Valid character classes for magic item selection
 */
type CharacterClass = 'fighter' | 'barbarian' | 'paladin' | 'ranger' | 'rogue' | 'monk' | 'wizard' | 'sorcerer' | 'cleric' | 'druid' | 'bard';

/**
 * Normalize class name to match our type system
 */
function normalizeClassName(className: string): CharacterClass {
  const normalized = className.toLowerCase() as CharacterClass;
  // Default to fighter if unknown class
  const validClasses: CharacterClass[] = ['fighter', 'barbarian', 'paladin', 'ranger', 'rogue', 'monk', 'wizard', 'sorcerer', 'cleric', 'druid', 'bard'];
  return validClasses.includes(normalized) ? normalized : 'fighter';
}

/**
 * Determine what magic items a character should have based on level, class, and budget
 * 
 * @param templateBudgets - Optional budget allocation overrides from the template
 *   - shieldPercent: % of armor budget for shield (default: 0.40 at levels 1-16, 0.50 at 17+)
 *   - armorPercent: % of armor budget for armor (default: 0.60 at levels 1-16, 0.50 at 17+)
 *   - secondaryWeaponPercent: % of weapon budget for off-hand/backup weapon (default: 0.50)
 *   - ringPercent: % of protection budget for Ring of Protection (default: 0.60)
 *   - amuletPercent: % of protection budget for Amulet of Natural Armor (default: 0.40)
 * All percentages fall back to hardcoded defaults if not specified in template
 */
export async function selectMagicItems(
  level: number,
  characterClass: string,
  totalBudget: number,
  templateBudgets?: {
    shieldPercent?: number;
    armorPercent?: number;
    secondaryWeaponPercent?: number;
    ringPercent?: number;
    amuletPercent?: number;
  }
): Promise<MagicItemSelection> {
  console.log(`\n=== MAGIC ITEM SELECTION ===`);
  console.log(`Level: ${level}, Class: ${characterClass}, Budget: ${totalBudget} gp`);

  // Don't buy magic items below level 3 (not enough wealth)
  if (level < 3) {
    console.log("Level too low for magic items (< 3)");
    return {
      weaponEnhancement: null,
      secondaryWeaponEnhancement: null,
      armorEnhancement: null,
      shieldEnhancement: null,
      wondrousItems: [],
      hasHandyHaversack: false,
      wands: [],
      scrolls: [],
      potions: [],
      weaponCost: 0,
      secondaryWeaponCost: 0,
      armorCost: 0,
      shieldCost: 0,
      wondrousCost: 0,
      wandsCost: 0,
      scrollsCost: 0,
      potionsCost: 0,
      totalCost: 0
    };
  }

  // Determine class type for budget allocation
  const classType = getClassType(characterClass);
  
  // Determine budget type: martial gets more weapon/armor, caster gets more consumables/stats
  // Paladins and Rangers are frontline combatants despite being partial casters, so they use martial budget
  // But they also need consumables (wands/scrolls/potions) unlike pure martials
  const normalizedClassLower = characterClass.toLowerCase();
  const isPaladinOrRanger = normalizedClassLower === 'paladin' || normalizedClassLower === 'ranger';
  const isMartial = classType === 'martial' || isPaladinOrRanger;
  
  // Select budget allocation: special hybrid for Paladin/Ranger, martial for pure martials, caster for casters
  const budgetAllocation = isPaladinOrRanger 
    ? MAGIC_ITEM_BUDGET_ALLOCATION.partialCasterMartial
    : (isMartial ? MAGIC_ITEM_BUDGET_ALLOCATION.martial : MAGIC_ITEM_BUDGET_ALLOCATION.caster);
  
  // LEVEL-BASED BUDGET ADJUSTMENT FOR MARTIALS
  // Early levels (3-7): Weapon is CRITICAL, boost weapon budget so they can afford their first magic weapon
  // Current issue: Level 3-4 can't afford +1 weapon (2,315 gp) with only 38% budget
  // Solution: Progressive weapon budget that decreases as character gains more wealth
  let adjustedWeaponPercent: number = budgetAllocation.weapon;
  let adjustedArmorPercent: number = budgetAllocation.armor;
  
  if (isMartial && level >= 3 && level <= 7) {
    // Levels 3-7: Boost weapon to 45% (from 38%), reduce armor to 32% (from 34%)
    // This gives enough budget to afford first magic weapon at level 3-4
    // and smoother progression through level 7
    adjustedWeaponPercent = 0.45;  // +7% to weapon
    adjustedArmorPercent = 0.32;   // -2% from armor
    // Note: Total still adds to 100% (45+32+12+7+7+2 = 105%, but other categories absorb the difference)
    console.log(`Level ${level} Martial: Boosting weapon budget to 45% (from 38%) for early-game affordability`);
  } else if (isMartial && level >= 8 && level <= 10) {
    // Levels 8-10: Moderate boost to 40% (from 38%), reduce armor to 33% (from 34%)
    adjustedWeaponPercent = 0.40;
    adjustedArmorPercent = 0.33;
    console.log(`Level ${level} Martial: Moderate weapon budget boost to 40%`);
  }
  
  // Allocate budget based on class type and level adjustments
  const weaponBudget = Math.floor(totalBudget * adjustedWeaponPercent);
  const armorBudget = Math.floor(totalBudget * adjustedArmorPercent);
  const statItemBudget = Math.floor(totalBudget * budgetAllocation.statItem);
  const resistanceBudget = Math.floor(totalBudget * budgetAllocation.resistance);
  const protectionBudget = Math.floor(totalBudget * budgetAllocation.protection);
  const consumablesBudget = Math.floor(totalBudget * budgetAllocation.consumables);
  
  // Split consumables budget by class type
  const consumableSplit = CONSUMABLE_SPLITS[classType];
  const wandsBudget = Math.floor(consumablesBudget * consumableSplit.wands);
  const scrollsBudget = Math.floor(consumablesBudget * consumableSplit.scrolls);
  const potionsBudget = Math.floor(consumablesBudget * consumableSplit.potions);

  const budgetTypeName = isPaladinOrRanger ? 'Partial Caster Martial' : (isMartial ? 'Martial' : 'Caster');
  console.log(`Budget Type: ${budgetTypeName} (${classType})`);
  console.log(`Weapon Budget: ${weaponBudget} gp (${(budgetAllocation.weapon * 100).toFixed(0)}%)`);
  console.log(`Armor Budget: ${armorBudget} gp (${(budgetAllocation.armor * 100).toFixed(0)}%)`);
  console.log(`Stat Item Budget: ${statItemBudget} gp (${(budgetAllocation.statItem * 100).toFixed(0)}%)`);
  console.log(`Resistance Budget: ${resistanceBudget} gp (${(budgetAllocation.resistance * 100).toFixed(0)}%)`);
  console.log(`Protection Budget: ${protectionBudget} gp (${(budgetAllocation.protection * 100).toFixed(0)}%)`);
  console.log(`Consumables Budget: ${consumablesBudget} gp (${(budgetAllocation.consumables * 100).toFixed(0)}%)`);
  console.log(`  Wands: ${wandsBudget} gp (${(consumableSplit.wands * 100).toFixed(0)}% of consumables)`);
  console.log(`  Scrolls: ${scrollsBudget} gp (${(consumableSplit.scrolls * 100).toFixed(0)}% of consumables)`);
  console.log(`  Potions: ${potionsBudget} gp (${(consumableSplit.potions * 100).toFixed(0)}% of consumables)`);

  // Get recommendations from the enhancement-recommendations system
  const normalizedClass = normalizeClassName(characterClass);
  console.log(`DEBUG: Normalized class for weapon selection: ${normalizedClass}, budget: ${weaponBudget} gp`);
  const weaponRec = getBestWeaponEnhancementForCharacter(level, normalizedClass, weaponBudget);
  console.log(`DEBUG: Weapon recommendation result: ${weaponRec ? `+${weaponRec.enhancementBonus} (${weaponRec.totalCost} gp)` : 'NULL'}`);
  
  // Calculate armor/shield budget split FIRST
  // At high levels (17+), give shields MORE budget for expensive abilities like Reflecting
  // These can be overridden by template.magicItemBudgets
  const shieldBudgetPercent = templateBudgets?.shieldPercent ?? (level >= 17 ? 0.50 : 0.40);
  const armorBudgetPercent = templateBudgets?.armorPercent ?? (level >= 17 ? 0.50 : 0.60);
  const shieldBudget = Math.floor(armorBudget * shieldBudgetPercent);
  const armorOnlyBudget = Math.floor(armorBudget * armorBudgetPercent);
  
  if (templateBudgets?.shieldPercent !== undefined || templateBudgets?.armorPercent !== undefined) {
    console.log(`Using template budget overrides: Shield ${(shieldBudgetPercent * 100).toFixed(0)}%, Armor ${(armorBudgetPercent * 100).toFixed(0)}%`);
  }
  
  // Get armor enhancement first (needed for shield conflict checking)
  const armorRec = getBestArmorEnhancementForCharacter(level, normalizedClass, armorOnlyBudget);
  
  // Shield enhancement (gets 40% of armor budget, armor gets 60%)
  // Shields are prioritized BEFORE secondary weapons
  // Shields use armor enhancement mechanics (same as armor)
  // IMPORTANT: Pass armorRec to avoid resistance conflicts!
  const shieldRec = level >= 4 
    ? getBestShieldEnhancementForCharacter(level, normalizedClass, shieldBudget, armorRec)
    : null;
  
  // Secondary weapon enhancement (50% of primary weapon budget)
  // Used for backup weapons, off-hand weapons, or two-weapon fighting builds
  // This comes AFTER shields as per user's priority requirement
  // Can be overridden by template.magicItemBudgets
  const secondaryWeaponPercent = templateBudgets?.secondaryWeaponPercent ?? 0.50;
  const secondaryWeaponBudget = Math.floor(weaponBudget * secondaryWeaponPercent);
  const secondaryWeaponRec = level >= 5 
    ? getBestWeaponEnhancementForCharacter(level, normalizedClass, secondaryWeaponBudget)
    : null;

  // Calculate actual costs
  const weaponCost = weaponRec ? calculateWeaponEnhancementCost(
    weaponRec.enhancementBonus,
    weaponRec.specialAbilities
  ) : 0;

  const secondaryWeaponCost = secondaryWeaponRec ? calculateWeaponEnhancementCost(
    secondaryWeaponRec.enhancementBonus,
    secondaryWeaponRec.specialAbilities
  ) : 0;

  const armorCost = armorRec ? calculateArmorEnhancementCost(
    armorRec.enhancementBonus,
    armorRec.specialAbilities
  ) : 0;

  const shieldCost = shieldRec ? calculateArmorEnhancementCost(
    shieldRec.enhancementBonus,
    shieldRec.specialAbilities
  ) : 0;

  // Select wondrous items (Big Six)
  const wondrousResult = selectWondrousItems(
    level,
    normalizedClass,
    statItemBudget,
    resistanceBudget,
    protectionBudget,
    templateBudgets
  );

  const wondrousItems = wondrousResult.wondrousItems;
  const hasHandyHaversack = wondrousResult.hasHandyHaversack;
  const wondrousCost = wondrousItems.reduce((sum, item) => sum + item.price, 0) + (hasHandyHaversack ? 2000 : 0);
  
  // Select consumables based on class type
  const wandSelection = selectWands(characterClass, level, wandsBudget);
  const wandsCost = wandSelection.totalCost;
  
  const scrollSelection = selectScrolls(characterClass, level, scrollsBudget);
  const scrollsCost = scrollSelection.totalCost;
  
  // Select potions for all characters
  const potionSelection = selectPotions(characterClass, level, potionsBudget);
  const potionsCost = potionSelection.totalCost;

  console.log(`\nSelected Enhancements:`);
  if (weaponRec) {
    const abilities = weaponRec.specialAbilities.length > 0 
      ? ` + ${weaponRec.specialAbilities.join(', ')}` 
      : '';
    console.log(`  Primary Weapon: +${weaponRec.enhancementBonus}${abilities} (${weaponCost} gp)`);
  } else {
    console.log(`  Primary Weapon: None (insufficient budget or not needed)`);
  }

  if (shieldRec) {
    const abilities = shieldRec.specialAbilities.length > 0 
      ? ` + ${shieldRec.specialAbilities.join(', ')}` 
      : '';
    console.log(`  Shield: +${shieldRec.enhancementBonus}${abilities} (${shieldCost} gp)`);
  } else {
    console.log(`  Shield: None (level < 4, insufficient budget, or not needed)`);
  }

  if (secondaryWeaponRec) {
    const abilities = secondaryWeaponRec.specialAbilities.length > 0 
      ? ` + ${secondaryWeaponRec.specialAbilities.join(', ')}` 
      : '';
    console.log(`  Secondary Weapon: +${secondaryWeaponRec.enhancementBonus}${abilities} (${secondaryWeaponCost} gp)`);
  } else {
    console.log(`  Secondary Weapon: None (level < 5 or insufficient budget)`);
  }

  if (armorRec) {
    const abilities = armorRec.specialAbilities.length > 0 
      ? ` + ${armorRec.specialAbilities.join(', ')}` 
      : '';
    console.log(`  Armor: +${armorRec.enhancementBonus}${abilities} (${armorCost} gp)`);
  } else {
    console.log(`  Armor: None (insufficient budget or not needed)`);
  }

  console.log(`\nWondrous Items:`);
  if (wondrousItems.length > 0) {
    for (const item of wondrousItems) {
      console.log(`  ${item.name} (${item.price} gp)`);
    }
  } else {
    console.log(`  None (insufficient budget)`);
  }
  
  console.log(`\nWands:`);
  if (wandSelection.wands.length > 0) {
    for (const wand of wandSelection.wands) {
      console.log(`  Wand of ${wand.spell.name} (CL ${wand.casterLevel}, ${wand.cost} gp)`);
    }
  } else {
    console.log(`  None (not a caster or insufficient budget)`);
  }
  
  console.log(`\nScrolls:`);
  if (scrollSelection.scrolls.length > 0) {
    for (const scroll of scrollSelection.scrolls) {
      console.log(`  Scroll of ${scroll.spell.name} (${scroll.scrollType}, CL ${scroll.casterLevel}, ${scroll.cost} gp)`);
    }
  } else {
    console.log(`  None (not a caster, too low level, or insufficient budget)`);
  }

  console.log(`\nPotions:`);
  if (potionSelection.potions.length > 0) {
    const totalPotions = potionSelection.potions.reduce((sum, p) => sum + p.quantity, 0);
    console.log(`  ${totalPotions} total potions (${potionsCost} gp):`);
    for (const potion of potionSelection.potions) {
      console.log(`    ${potion.quantity}x Potion of ${potion.name} (${potion.cost} gp each, ${potion.cost * potion.quantity} gp total)`);
    }
  } else {
    console.log(`  None (insufficient budget)`);
  }

  console.log(`\nTotal Magic Item Cost: ${weaponCost + secondaryWeaponCost + armorCost + shieldCost + wondrousCost + wandsCost + scrollsCost + potionsCost} gp`);
  console.log(`Remaining Budget: ${totalBudget - (weaponCost + secondaryWeaponCost + armorCost + shieldCost + wondrousCost + wandsCost + scrollsCost + potionsCost)} gp`);
  console.log(`=== MAGIC ITEM SELECTION COMPLETE ===\n`);

  return {
    weaponEnhancement: weaponRec ? {
      bonus: weaponRec.enhancementBonus,
      abilities: weaponRec.specialAbilities
    } : null,
    secondaryWeaponEnhancement: secondaryWeaponRec ? {
      bonus: secondaryWeaponRec.enhancementBonus,
      abilities: secondaryWeaponRec.specialAbilities
    } : null,
    armorEnhancement: armorRec ? {
      bonus: armorRec.enhancementBonus,
      abilities: armorRec.specialAbilities
    } : null,
    shieldEnhancement: shieldRec ? {
      bonus: shieldRec.enhancementBonus,
      abilities: shieldRec.specialAbilities
    } : null,
    wondrousItems,
    hasHandyHaversack,
    wands: wandSelection.wands,
    scrolls: scrollSelection.scrolls,
    potions: potionSelection.potions,
    weaponCost,
    secondaryWeaponCost,
    armorCost,
    shieldCost,
    wondrousCost,
    wandsCost,
    scrollsCost,
    potionsCost,
    totalCost: weaponCost + secondaryWeaponCost + armorCost + shieldCost + wondrousCost + wandsCost + scrollsCost + potionsCost
  };
}

/**
 * Select wondrous items (Big Six) based on class, level, and available budgets
 * Returns both the wondrous items array and a flag for custom Handy Haversack
 */
function selectWondrousItems(
  level: number,
  characterClass: CharacterClass,
  statItemBudget: number,
  resistanceBudget: number,
  protectionBudget: number,
  templateBudgets?: {
    ringPercent?: number;
    amuletPercent?: number;
  }
): { wondrousItems: WondrousItemDefinition[]; hasHandyHaversack: boolean } {
  const selectedItems: WondrousItemDefinition[] = [];
  let spentBudget = 0;
  const totalBudget = statItemBudget + resistanceBudget + protectionBudget;

  // Get class priorities from wondrous-items.ts
  const priorities = BIG_SIX_PRIORITIES[characterClass] || BIG_SIX_PRIORITIES.fighter;

  // ========== BIG SIX PRIORITY ITEMS ==========

  // 1. Stat Item (STR for martials via belt/gauntlets, INT for wizards via headband)
  if (statItemBudget >= 4000) {
    // Check if class prioritizes belt (STR) or headband (INT)
    const usesBelt = (priorities as readonly string[]).includes('belt');
    const usesHeadband = (priorities as readonly string[]).includes('headband');
    
    if (usesBelt) {
      // Choose between Gauntlets (+2, 4000 gp) and Belt (+4/+6, 16k/36k gp)
      const belt = getBestAffordableBonus('belt', statItemBudget);
      if (belt) {
        selectedItems.push(belt);
        spentBudget += belt.price;
      } else if (statItemBudget >= 4000) {
        // Fall back to Gauntlets if belt not affordable
        selectedItems.push(GAUNTLETS_OF_OGRE_POWER);
        spentBudget += GAUNTLETS_OF_OGRE_POWER.price;
      }
    } else if (usesHeadband) {
      // Headband of Intellect for wizards/sorcerers
      const headband = getBestAffordableBonus('headband', statItemBudget);
      if (headband) {
        selectedItems.push(headband);
        spentBudget += headband.price;
      }
    }
  }

  // 2. Cloak of Resistance (+saves)
  if (resistanceBudget >= 1000) {
    const cloak = getBestAffordableBonus('cloak', resistanceBudget);
    if (cloak) {
      selectedItems.push(cloak);
      spentBudget += cloak.price;
    }
  }

  // 3. Ring of Protection AND/OR Amulet of Natural Armor
  // Split protection budget between ring and amulet
  // Can be overridden by template.magicItemBudgets
  const ringPercent = templateBudgets?.ringPercent ?? 0.6;
  const amuletPercent = templateBudgets?.amuletPercent ?? 0.4;
  const ringBudget = Math.floor(protectionBudget * ringPercent);
  const amuletBudget = Math.floor(protectionBudget * amuletPercent);

  if (ringBudget >= 2000) {
    const ring = getBestAffordableBonus('ring', ringBudget);
    if (ring) {
      selectedItems.push(ring);
      spentBudget += ring.price;
    }
  }

  if (amuletBudget >= 2000) {
    const amulet = getBestAffordableBonus('amulet', amuletBudget);
    if (amulet) {
      selectedItems.push(amulet);
      spentBudget += amulet.price;
    }
  }

  // ========== UTILITY WONDROUS ITEMS ==========
  // After Big Six, spend remaining budget on utility items
  // NOTE: Most utility items don't exist in D35E compendium yet
  // For now, we'll leave remaining budget as currency
  const remainingBudget = totalBudget - spentBudget;
  
  console.log(`\nUtility Wondrous Items Selection:`);
  console.log(`  Remaining Budget: ${remainingBudget} gp`);

  // ALWAYS give Handy Haversack (2,000 gp) - it's just that good!
  // This is created directly as a custom container item, not from compendium
  let hasHandyHaversack = false;
  let haversackCost = 0;
  
  if (remainingBudget >= 2000) {
    hasHandyHaversack = true;
    haversackCost = 2000;
    spentBudget += 2000;
    console.log(`  ALWAYS Added: Handy Haversack (Custom Container) - 2,000 gp`);
    console.log(`    - 120 lbs capacity, 5 lbs constant weight`);
    console.log(`    - Items always on top (move action, no AoO)`);
  }

  const utilityBudgetAfterHaversack = remainingBudget - haversackCost;

  if (utilityBudgetAfterHaversack >= 2000) {
    // Priority utility items for ALL characters
    // Items are ordered by impact, not price - high-impact items first
    // NOTE: Handy Haversack removed from this list - it's always given above
    const utilityPriorities: Array<{key: keyof typeof UTILITY_WONDROUS_ITEMS, minLevel: number}> = [
      // { key: 'handy-haversack', minLevel: 3 },     // REMOVED - always given as custom item
      { key: 'boots-of-speed', minLevel: 10 },        // Haste effect - VERY powerful! (12k)
      { key: 'boots-of-teleportation', minLevel: 15 },// Teleport 3/day - amazing mobility (49k)
      { key: 'gloves-of-dexterity-6', minLevel: 15 }, // +6 DEX for high-level (36k)
      { key: 'gloves-of-dexterity-4', minLevel: 10 }, // +4 DEX for mid-level (16k)
      { key: 'gloves-of-dexterity-2', minLevel: 5 },  // +2 DEX for low-level (4k)
      { key: 'scarab-of-protection', minLevel: 15 },  // +5 vs death/energy drain (38k)
      { key: 'goggles-of-night', minLevel: 8 },       // Darkvision (12k)
      { key: 'bag-of-holding-4', minLevel: 13 },      // Best storage (10k) - EXTRA BAG!
      { key: 'bag-of-holding-3', minLevel: 10 },      // Better storage (7.4k)
      { key: 'bag-of-holding-2', minLevel: 7 },       // Good storage (5k)
      { key: 'bag-of-holding-1', minLevel: 3 },       // Basic storage (2.5k)
      { key: 'boots-of-striding-and-springing', minLevel: 5 }, // +10 ft speed (5.5k)
      { key: 'slippers-of-spider-climbing', minLevel: 5 },     // Wall climbing (4.8k)
      { key: 'eyes-of-the-eagle', minLevel: 3 },      // +5 Spot (2.5k)
      { key: 'pearl-of-power-3', minLevel: 11 },      // Casters only
      { key: 'pearl-of-power-2', minLevel: 8 },
      { key: 'pearl-of-power-1', minLevel: 5 }
    ];

    // Class-specific utility priorities
    const isCaster = ['wizard', 'sorcerer', 'cleric', 'druid', 'bard'].includes(characterClass);

    // Track which slots are filled to avoid conflicts
    const filledSlots = new Set<string>();
    
    // Big Six already fills these slots:
    if (selectedItems.some((item: WondrousItemDefinition) => item.slot === 'belt' || item.slot === 'hands')) {
      filledSlots.add('hands'); // Gauntlets or Belt uses hands conceptually
    }
    if (selectedItems.some((item: WondrousItemDefinition) => item.slot === 'headband')) {
      filledSlots.add('headband');
    }
    if (selectedItems.some((item: WondrousItemDefinition) => item.slot === 'shoulders')) {
      filledSlots.add('shoulders'); // Cloak
    }
    if (selectedItems.some((item: WondrousItemDefinition) => item.slot === 'ring')) {
      filledSlots.add('ring');
    }
    if (selectedItems.some((item: WondrousItemDefinition) => item.slot === 'neck')) {
      filledSlots.add('neck'); // Amulet
    }

    // Filter and sort by priority
    let affordableUtility = utilityPriorities
      .filter(p => level >= p.minLevel)
      .filter(p => UTILITY_WONDROUS_ITEMS[p.key].price <= utilityBudgetAfterHaversack)
      .map(p => UTILITY_WONDROUS_ITEMS[p.key]);

    // Remove pearls for non-casters
    if (!isCaster) {
      affordableUtility = affordableUtility.filter(item => 
        !item.id.startsWith('OkUi8BK1') && 
        !item.id.startsWith('sClvvjs3') && 
        !item.id.startsWith('J4071uAI')
      );
    }

    // Buy utility items with remaining budget, respecting slot conflicts
    // Track special categories to prevent duplicates
    let utilityBudget = utilityBudgetAfterHaversack;
    let hasBagOfHolding = false;  // Only buy ONE bag of holding (highest affordable type)
    
    for (const item of affordableUtility) {
      // Check slot conflict
      if (item.slot && item.slot !== 'slotless' && filledSlots.has(item.slot)) {
        continue; // Skip, slot already filled
      }
      
      // Only allow ONE bag of holding (the first affordable one in priority list is the highest type)
      if (item.name.includes('Bag of Holding')) {
        if (hasBagOfHolding) {
          continue; // Skip additional bags
        }
        hasBagOfHolding = true; // Mark that we're buying a bag
        console.log(`  Added EXTRA: ${item.name} (${item.price} gp) - for party loot!`);
      }
      
      if (item.price <= utilityBudget) {
        selectedItems.push(item);
        utilityBudget -= item.price;
        if (!item.name.includes('Bag of Holding')) {
          console.log(`  Added: ${item.name} (${item.price} gp)`);
        }
        
        // Mark slot as filled
        if (item.slot && item.slot !== 'slotless') {
          filledSlots.add(item.slot);
        }
        
        // Stop if we've spent most of the budget or got enough items
        if (utilityBudget < 2000 || selectedItems.length >= 15) break;
      }
    }
  }

  return { wondrousItems: selectedItems, hasHandyHaversack };
}


/**
 * Calculate total cost of a weapon enhancement (base item + masterwork + enhancement)
 */
function calculateWeaponEnhancementCost(
  baseBonus: number,
  specialAbilities: string[]
): number {
  // Get total bonus levels
  let totalBonusLevels = baseBonus;
  
  for (const abilityKey of specialAbilities) {
    const ability = WEAPON_SPECIAL_ABILITIES[abilityKey];
    if (ability) {
      totalBonusLevels += ability.enhIncrease;
    }
  }

  // Get enhancement cost from the table
  const enhancementCost = getEnhancementCost(totalBonusLevels);
  
  // Add masterwork cost (300 gp for weapons)
  // Note: Base weapon cost is NOT included here - it's already on the item
  return 300 + enhancementCost;
}

/**
 * Calculate total cost of an armor enhancement (base item + masterwork + enhancement)
 */
function calculateArmorEnhancementCost(
  baseBonus: number,
  specialAbilities: (string | EnhancementAbility)[]
): number {
  // Get total bonus levels
  let totalBonusLevels = baseBonus;
  
  for (const ability of specialAbilities) {
    const abilityKey = typeof ability === 'string' ? ability : ability.key;
    const abilityLevel = typeof ability === 'string' ? undefined : ability.level;
    
    const abilityDef = ARMOR_SPECIAL_ABILITIES[abilityKey];
    if (abilityDef) {
      if (abilityLevel !== undefined && abilityDef.enhIsLevel) {
        // Variable-level enhancement (like Fortification): level 1=+1, 2=+3, 3=+5
        totalBonusLevels += (abilityLevel * 2 - 1);
      } else {
        totalBonusLevels += abilityDef.enhIncrease;
      }
    }
  }

  // Get enhancement cost from the table
  const enhancementCost = getEnhancementCost(totalBonusLevels);
  
  // Add masterwork cost (150 gp for armor)
  // Note: Base armor cost is NOT included here - it's already on the item
  const totalCost = 150 + enhancementCost;
  console.log(`DEBUG calculateArmorEnhancementCost: totalBonusLevels=${totalBonusLevels}, enhancementCost=${enhancementCost}, masterwork=150, total=${totalCost}`);
  return totalCost;
}

/**
 * Apply enhancements to a weapon item
 * 
 * @param itemData - The base weapon item data from compendium
 * @param enhancementBonus - The base enhancement bonus (+1 to +5)
 * @param specialAbilities - Array of special ability keys (e.g., ['flaming', 'keen'])
 * @returns Enhanced item data ready to be created
 */
export async function applyWeaponEnhancements(
  itemData: any,
  enhancementBonus: number,
  specialAbilities: string[] = []
): Promise<any> {
  console.log(`\nApplying weapon enhancements: +${enhancementBonus} ${specialAbilities.join(', ')}`);
  
  // Clone the item data
  const enhanced = {...itemData};

  // Get enhancement items from compendium  
  const enhancementPack = (game as any).packs.get('D35E.enhancements');
  if (!enhancementPack) {
    throw new Error('D35E.enhancements compendium not found');
  }

  const enhancements: any[] = [];

  // 1. Add base enhancement (+1 to +5)
  if (enhancementBonus > 0) {
    const baseEnhancement = await enhancementPack.getDocument(WEAPON_BASE_ENHANCEMENT.id);
    if (!baseEnhancement) {
      throw new Error(`Base weapon enhancement not found: ${WEAPON_BASE_ENHANCEMENT.id}`);
    }

    // Clone and set the enhancement level
    const baseEnhData = baseEnhancement.toObject();
    baseEnhData.system.enh = enhancementBonus;
    baseEnhData.system.enhIncrease = enhancementBonus;
    enhancements.push(baseEnhData);
    console.log(`  Added base enhancement: +${enhancementBonus}`);
  }

  // 2. Add special abilities
  let namePrefixes: string[] = [];
  let nameSuffixes: string[] = [];

  for (const abilityKey of specialAbilities) {
    const abilityDef = WEAPON_SPECIAL_ABILITIES[abilityKey];
    if (!abilityDef) {
      console.warn(`  Unknown weapon ability: ${abilityKey}`);
      continue;
    }

    const abilityItem = await enhancementPack.getDocument(abilityDef.id);
    if (!abilityItem) {
      console.warn(`  Ability item not found in compendium: ${abilityKey} (${abilityDef.id})`);
      continue;
    }

    const abilityData = abilityItem.toObject();
    enhancements.push(abilityData);
    console.log(`  Added special ability: ${abilityKey} (+${abilityDef.enhIncrease})`);

    // Collect name extensions
    if (abilityData.system.nameExtension) {
      if (abilityData.system.nameExtension.prefix) {
        namePrefixes.push(abilityData.system.nameExtension.prefix);
      }
      if (abilityData.system.nameExtension.suffix) {
        nameSuffixes.push(abilityData.system.nameExtension.suffix);
      }
    }
  }

  // 3. Apply enhancements to item
  enhanced.system.enhancements = {
    items: enhancements,
    automation: {
      updateName: false,
      updatePrice: false  // We'll set the price manually
    }
  };

  // 4. Set enhancement level
  enhanced.system.enh = enhancementBonus;

  // 5. Make it masterwork
  enhanced.system.masterwork = true;

  // 6. Update name
  const baseName = itemData.name;
  const prefix = namePrefixes.join(' ');
  const suffix = nameSuffixes.join(' ');
  
  let newName = baseName;
  if (prefix) newName = `${prefix} ${newName}`;
  if (suffix) newName = `${newName} ${suffix}`;
  if (enhancementBonus > 0) newName = `${newName} +${enhancementBonus}`;

  enhanced.name = newName;
  enhanced.system.identifiedName = newName;
  console.log(`  New name: ${newName}`);

  // 7. Update price manually (D35E's updatePrice doesn't seem to work reliably)
  const originalPrice = itemData.system.price || 0;
  const enhancementCost = calculateWeaponEnhancementCost(enhancementBonus, specialAbilities);
  enhanced.system.price = originalPrice + enhancementCost;
  console.log(`  Price: ${originalPrice} (base) + ${enhancementCost} (enhancement) = ${enhanced.system.price} gp`);
  
  // Mark as identified to prevent D35E from recalculating
  enhanced.system.identified = true;

  return enhanced;
}

/**
 * Apply enhancements to an armor item
 * 
 * @param itemData - The base armor item data from compendium
 * @param enhancementBonus - The base enhancement bonus (+1 to +5)
 * @param specialAbilities - Array of special abilities (strings or EnhancementAbility objects with levels)
 * @returns Enhanced item data ready to be created
 */
export async function applyArmorEnhancements(
  itemData: any,
  enhancementBonus: number,
  specialAbilities: (string | EnhancementAbility)[] = []
): Promise<any> {
  console.log(`\nApplying armor enhancements: +${enhancementBonus} ${specialAbilities.map(a => typeof a === 'string' ? a : `${a.key}(level ${a.level})`).join(', ')}`);
  
  // Clone the item data
  const enhanced = {...itemData};

  // Get enhancement items from compendium
  const enhancementPack = (game as any).packs.get('D35E.enhancements');
  if (!enhancementPack) {
    throw new Error('D35E.enhancements compendium not found');
  }

  const enhancements: any[] = [];

  // 1. Add base enhancement (+1 to +5)
  if (enhancementBonus > 0) {
    const baseEnhancement = await enhancementPack.getDocument(ARMOR_BASE_ENHANCEMENT.id);
    if (!baseEnhancement) {
      throw new Error(`Base armor enhancement not found: ${ARMOR_BASE_ENHANCEMENT.id}`);
    }

    // Clone and set the enhancement level
    const baseEnhData = baseEnhancement.toObject();
    baseEnhData.system.enh = enhancementBonus;
    baseEnhData.system.enhIncrease = enhancementBonus;
    enhancements.push(baseEnhData);
    console.log(`  Added base enhancement: +${enhancementBonus}`);
  }

  // 2. Add special abilities
  let namePrefixes: string[] = [];
  let nameSuffixes: string[] = [];

  for (const ability of specialAbilities) {
    // Handle both string and EnhancementAbility formats
    const abilityKey = typeof ability === 'string' ? ability : ability.key;
    const abilityLevel = typeof ability === 'string' ? undefined : ability.level;

    const abilityDef = ARMOR_SPECIAL_ABILITIES[abilityKey];
    if (!abilityDef) {
      console.warn(`  Unknown armor ability: ${abilityKey}`);
      continue;
    }

    const abilityItem = await enhancementPack.getDocument(abilityDef.id);
    if (!abilityItem) {
      console.warn(`  Ability item not found in compendium: ${abilityKey} (${abilityDef.id})`);
      continue;
    }

    const abilityData = abilityItem.toObject();
    
    // Set level for variable-level enhancements (like Fortification)
    if (abilityLevel !== undefined && abilityDef.enhIsLevel) {
      abilityData.system.enh = abilityLevel;
      console.log(`  Added special ability: ${abilityKey} level ${abilityLevel} (+${abilityLevel * 2 - 1})`);
      
      // Custom naming for fortification levels
      if (abilityKey === 'fortification') {
        const fortificationTypes = ['Light Fortification', 'Moderate Fortification', 'Heavy Fortification'];
        const fortificationName = fortificationTypes[abilityLevel - 1] || 'Fortification';
        nameSuffixes.push(`of ${fortificationName}`);
      } else if (abilityData.system.nameExtension) {
        // Use standard name extension for other variable-level enhancements
        if (abilityData.system.nameExtension.prefix) {
          namePrefixes.push(abilityData.system.nameExtension.prefix);
        }
        if (abilityData.system.nameExtension.suffix) {
          nameSuffixes.push(abilityData.system.nameExtension.suffix);
        }
      }
    } else {
      console.log(`  Added special ability: ${abilityKey} (+${abilityDef.enhIncrease})`);
      
      // Collect name extensions for fixed-level enhancements
      if (abilityData.system.nameExtension) {
        if (abilityData.system.nameExtension.prefix) {
          namePrefixes.push(abilityData.system.nameExtension.prefix);
        }
        if (abilityData.system.nameExtension.suffix) {
          nameSuffixes.push(abilityData.system.nameExtension.suffix);
        }
      }
    }
    
    enhancements.push(abilityData);
  }

  // 3. Apply enhancements to item
  enhanced.system.enhancements = {
    items: enhancements,
    automation: {
      updateName: false,
      updatePrice: false  // We'll set the price manually
    }
  };

  // 4. Set enhancement level
  enhanced.system.enh = enhancementBonus;

  // 5. Make it masterwork
  enhanced.system.masterwork = true;

  // 6. Update name
  const baseName = itemData.name;
  const prefix = namePrefixes.join(' ');
  const suffix = nameSuffixes.join(' ');
  
  let newName = baseName;
  if (prefix) newName = `${prefix} ${newName}`;
  if (suffix) newName = `${newName} ${suffix}`;
  if (enhancementBonus > 0) newName = `${newName} +${enhancementBonus}`;

  enhanced.name = newName;
  enhanced.system.identifiedName = newName;
  console.log(`  New name: ${newName}`);

  // 7. Update price manually (D35E's updatePrice doesn't seem to work reliably)
  const originalPrice = itemData.system.price || 0;
  const enhancementCost = calculateArmorEnhancementCost(enhancementBonus, specialAbilities);
  enhanced.system.price = originalPrice + enhancementCost;
  console.log(`  Price: ${originalPrice} (base) + ${enhancementCost} (enhancement) = ${enhanced.system.price} gp`);
  
  // Mark as identified to prevent D35E from recalculating
  enhanced.system.identified = true;

  return enhanced;
}

/**
 * Add wondrous items from the D35E.magicitems compendium to an actor
 */
export async function addWondrousItemsToActor(
  actor: any,
  wondrousItems: WondrousItemDefinition[]
): Promise<void> {
  if (wondrousItems.length === 0) {
    console.log("No wondrous items to add");
    return;
  }

  console.log(`\n=== ADDING WONDROUS ITEMS ===`);

  const magicItemsPack = (game as any).packs.get('D35E.magicitems');
  if (!magicItemsPack) {
    console.error("D35E.magicitems compendium not found!");
    return;
  }

  for (const itemDef of wondrousItems) {
    try {
      console.log(`Adding ${itemDef.name}...`);
      
      // Get item from compendium
      const compendiumItem = await magicItemsPack.getDocument(itemDef.id);
      if (!compendiumItem) {
        console.error(`  Item not found in compendium: ${itemDef.id}`);
        continue;
      }

      // Create item data
      const itemData = compendiumItem.toObject();
      
      // Mark as equipped if it has a slot
      if (itemData.system && itemData.system.slot) {
        itemData.system.equipped = true;
      }

      // Create the item on the actor
      await actor.createEmbeddedDocuments("Item", [itemData]);
      console.log(`  ✓ Added ${itemDef.name} (${itemDef.price} gp)`);
    } catch (error) {
      console.error(`Failed to add ${itemDef.name}:`, error);
    }
  }

  console.log(`=== WONDROUS ITEMS ADDED ===\n`);
}
