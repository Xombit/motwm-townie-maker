/**
 * Magic Item Enhancement Selection by Level
 * 
 * This file defines which enhancements are appropriate for different level ranges,
 * based on wealth budget and character power progression.
 * 
 * PHILOSOPHY:
 * - Early levels (3-7): Simple +1/+2 enhancements only
 * - Mid levels (8-12): +2/+3 enhancements, start adding cheap special abilities (+1 cost)
 * - High levels (13-16): +3/+4 enhancements, multiple special abilities
 * - Epic levels (17-20): +4/+5 enhancements, expensive special abilities
 */

import { EnhancementDefinition } from './enhancements';

/**
 * Special ability with optional level (for enhancements like Fortification)
 */
export interface EnhancementAbility {
  key: string;      // Ability key (e.g., 'fortification')
  level?: number;   // Optional level (1=Light, 2=Moderate, 3=Heavy for fortification)
}

export interface EnhancementRecommendation {
  enhancementBonus: number;  // Base +1 to +5
  specialAbilities: (string | EnhancementAbility)[]; // Keys or objects with levels
  totalBonusLevels: number;   // Base + sum of special ability costs
  totalCost: number;          // In gold pieces (base item + masterwork + enhancement)
  reasoning: string;
}

// =============================================================================
// LEVEL RANGES AND BUDGETS
// =============================================================================

/**
 * Wealth by level from DMG
 */
export const WEALTH_BY_LEVEL = {
  1: 0,
  2: 900,
  3: 2700,      // First magic items possible
  4: 5600,
  5: 9000,
  6: 13000,
  7: 19000,
  8: 27000,
  9: 36000,
  10: 49000,
  11: 66000,
  12: 88000,
  13: 110000,
  14: 150000,
  15: 200000,
  16: 260000,
  17: 340000,
  18: 440000,
  19: 580000,
  20: 760000
} as const;

/**
 * Budget allocation guide
 * These percentages are rough guidelines based on character examples
 */
export const BUDGET_ALLOCATION = {
  // Big Six priority (weapons, armor, stat boosters, saves, AC)
  bigSix: 0.60,           // 60% on essential combat items
  
  // Secondary items (wands for casters, utility items)
  secondary: 0.25,        // 25% on support/utility
  
  // Situational/scrolls/consumables
  situational: 0.15       // 15% on niche items
} as const;

// =============================================================================
// WEAPON ENHANCEMENT RECOMMENDATIONS BY LEVEL
// =============================================================================

/**
 * Weapon Enhancement Recommendations
 * 
 * MARTIAL CHARACTERS (Fighter, Barbarian, Paladin, Ranger, Rogue):
 * - Weapon is priority #1 (after starting kit)
 * - Invest heavily in weapon enhancement early
 * 
 * CASTERS (Wizard, Sorcerer, Cleric, Druid, Bard):
 * - Skip weapon enhancements entirely (waste of gold)
 * - Invest in stat boosters and wands instead
 */
export const WEAPON_ENHANCEMENTS_BY_LEVEL: Record<string, EnhancementRecommendation[]> = {
  // Level 3-4: First magic weapon
  'level-3-4': [
    {
      enhancementBonus: 1,
      specialAbilities: [],
      totalBonusLevels: 1,
      totalCost: 2315, // Longsword: 15 base + 300 mw + 2000 enhancement
      reasoning: 'First magic weapon. +1 to hit and damage is significant at low levels. Keep it simple.'
    }
  ],

  // Level 5-7: Upgrade to +2 or add special ability
  'level-5-7': [
    {
      enhancementBonus: 2,
      specialAbilities: [],
      totalBonusLevels: 2,
      totalCost: 8315, // Longsword: 15 + 300 + 8000
      reasoning: 'Standard progression. +2 enhancement is affordable and provides consistent boost.'
    },
    {
      enhancementBonus: 1,
      specialAbilities: ['flaming'],
      totalBonusLevels: 2,
      totalCost: 8315, // Same cost as +2
      reasoning: 'Alternative: +1 Flaming. Extra 1d6 fire damage (avg 3.5) can outperform +1 to-hit/damage against some enemies. Fun factor!'
    },
    {
      enhancementBonus: 1,
      specialAbilities: ['returning'],
      totalBonusLevels: 2,
      totalCost: 8315, // Same cost as +2
      reasoning: '+1 Returning (thrown weapons only). Returns to hand after thrown. Essential for spear/javelin users - never lose your weapon!'
    }
  ],

  // Level 8-10: +2/+3 with possible special ability
  'level-8-10': [
    {
      enhancementBonus: 3,
      specialAbilities: [],
      totalBonusLevels: 3,
      totalCost: 18315, // 15 + 300 + 18000
      reasoning: 'Solid +3 weapon. Reliable and overcomes most DR.'
    },
    {
      enhancementBonus: 2,
      specialAbilities: ['flaming'],
      totalBonusLevels: 3,
      totalCost: 18315,
      reasoning: '+2 Flaming longsword. Good balance of accuracy and damage.'
    },
    {
      enhancementBonus: 1,
      specialAbilities: ['keen'], // Slashing weapons only!
      totalBonusLevels: 2,
      totalCost: 8315,
      reasoning: '+1 Keen (slashing only). Doubles threat range. AMAZING for crit-focused builds (19-20 becomes 17-20).'
    },
    {
      enhancementBonus: 2,
      specialAbilities: ['returning'],
      totalBonusLevels: 3,
      totalCost: 18315,
      reasoning: '+2 Returning (thrown weapons only). Returns after thrown with better enhancement bonus.'
    }
  ],

  // Level 11-13: +3/+4 with special abilities
  'level-11-13': [
    {
      enhancementBonus: 4,
      specialAbilities: [],
      totalBonusLevels: 4,
      totalCost: 32315, // 15 + 300 + 32000
      reasoning: 'Pure +4 enhancement. Overcomes DR 10/magic or DR X/adamantine.'
    },
    {
      enhancementBonus: 3,
      specialAbilities: ['flaming'],
      totalBonusLevels: 4,
      totalCost: 32315,
      reasoning: '+3 Flaming. Good mix of accuracy and damage. Works well for all martial characters.'
    },
    {
      enhancementBonus: 2,
      specialAbilities: ['keen', 'flaming'],
      totalBonusLevels: 4,
      totalCost: 32315,
      reasoning: '+2 Keen Flaming (slashing only). High crit rate + extra damage. Best for TWF or high BAB fighters.'
    },
    {
      enhancementBonus: 2,
      specialAbilities: ['holy'], // +2 cost
      totalBonusLevels: 4,
      totalCost: 32315,
      reasoning: '+2 Holy. +2d6 vs evil (most enemies). Excellent for paladins and good-aligned campaigns.'
    },
    {
      enhancementBonus: 1,
      specialAbilities: ['flaming', 'frost', 'shock'], // +1 each = +4 total
      totalBonusLevels: 4,
      totalCost: 32315,
      reasoning: '+1 Flaming Frost Shock. Triple energy damage (+1d6 each type). Fun "elemental fury" weapon!'
    }
  ],

  // Level 14-16: +4/+5 with multiple abilities
  'level-14-16': [
    {
      enhancementBonus: 5,
      specialAbilities: [],
      totalBonusLevels: 5,
      totalCost: 50315, // 15 + 300 + 50000
      reasoning: 'Maximum base enhancement. Overcomes nearly all DR. Simple and effective.'
    },
    {
      enhancementBonus: 4,
      specialAbilities: ['flaming'],
      totalBonusLevels: 5,
      totalCost: 50315,
      reasoning: '+4 Flaming. High accuracy with bonus damage.'
    },
    {
      enhancementBonus: 3,
      specialAbilities: ['keen', 'flaming'],
      totalBonusLevels: 5,
      totalCost: 50315,
      reasoning: '+3 Keen Flaming (slashing). Great for critical-focused builds.'
    },
    {
      enhancementBonus: 3,
      specialAbilities: ['holy'], // +2 cost
      totalBonusLevels: 5,
      totalCost: 50315,
      reasoning: '+3 Holy. Strong vs evil enemies (most campaigns).'
    },
    {
      enhancementBonus: 2,
      specialAbilities: ['speed'], // +3 cost!
      totalBonusLevels: 5,
      totalCost: 50315,
      reasoning: '+2 Speed. EXTRA ATTACK at full BAB! Game-changing for full-attack builds. Best ability in game.'
    }
  ],

  // Level 17-20: +5 with powerful abilities
  'level-17-20': [
    {
      enhancementBonus: 5,
      specialAbilities: ['flaming'],
      totalBonusLevels: 6,
      totalCost: 72315, // 15 + 300 + 72000
      reasoning: '+5 Flaming. Maximum accuracy with fire damage.'
    },
    {
      enhancementBonus: 5,
      specialAbilities: ['keen'], // Slashing only
      totalBonusLevels: 6,
      totalCost: 72315,
      reasoning: '+5 Keen (slashing). 17-20 crit range on longsword/greatsword. Devastating.'
    },
    {
      enhancementBonus: 4,
      specialAbilities: ['keen', 'flaming'],
      totalBonusLevels: 6,
      totalCost: 72315,
      reasoning: '+4 Keen Flaming (slashing). High crits + bonus damage.'
    },
    {
      enhancementBonus: 3,
      specialAbilities: ['speed'], // +3 cost
      totalBonusLevels: 6,
      totalCost: 72315,
      reasoning: '+3 Speed. Extra attack at full BAB. Always valuable.'
    },
    {
      enhancementBonus: 4,
      specialAbilities: ['holy'], // +2 cost
      totalBonusLevels: 6,
      totalCost: 72315,
      reasoning: '+4 Holy. Excellent vs evil (most enemies).'
    },
    {
      enhancementBonus: 2,
      specialAbilities: ['speed', 'flaming'], // +3 +1
      totalBonusLevels: 6,
      totalCost: 72315,
      reasoning: '+2 Speed Flaming. Extra attack + fire damage. Maximum offense.'
    },
    {
      enhancementBonus: 3,
      specialAbilities: ['flaming', 'frost', 'shock'], // +1 each = +6 total
      totalBonusLevels: 6,
      totalCost: 72315,
      reasoning: '+3 Flaming Frost Shock. Triple energy damage! Elemental devastation.'
    },
    // ULTIMATE WEAPONS (Level 18-20 only, +7 to +10 bonus levels)
    {
      enhancementBonus: 5,
      specialAbilities: ['keen', 'flaming'], // Total +7
      totalBonusLevels: 7,
      totalCost: 98315, // 15 + 300 + 98000
      reasoning: '+5 Keen Flaming (slashing). Maximum enhancement + crits + damage. Elite weapon.'
    },
    {
      enhancementBonus: 4,
      specialAbilities: ['keen', 'flaming', 'frost'], // +1 +1 +1 = total +7
      totalBonusLevels: 7,
      totalCost: 98315,
      reasoning: '+4 Keen Flaming Frost (slashing). Crits + double energy damage.'
    },
    {
      enhancementBonus: 3,
      specialAbilities: ['keen', 'holy'], // +1 +2 = total +6 (wait, this is +6 not +7!)
      totalBonusLevels: 6,
      totalCost: 72315,
      reasoning: '+3 Keen Holy (slashing). High crits + massive damage vs evil.'
    },
    {
      enhancementBonus: 4,
      specialAbilities: ['speed', 'flaming'], // +3 +1 = total +8
      totalBonusLevels: 8,
      totalCost: 128315, // 15 + 300 + 128000
      reasoning: '+4 Speed Flaming. Extra attack + high accuracy + fire damage. Top-tier offense.'
    },
    {
      enhancementBonus: 3,
      specialAbilities: ['speed', 'keen'], // +3 +1 = total +7 (slashing)
      totalBonusLevels: 7,
      totalCost: 98315,
      reasoning: '+3 Speed Keen (slashing). Extra attack + doubled crit range. Crit-fishing perfection.'
    },
    {
      enhancementBonus: 2,
      specialAbilities: ['speed', 'keen', 'flaming'], // +3 +1 +1 = total +7
      totalBonusLevels: 7,
      totalCost: 98315,
      reasoning: '+2 Speed Keen Flaming (slashing). Extra attack + crits + fire. Ultimate combo weapon!'
    },
    {
      enhancementBonus: 5,
      specialAbilities: ['speed'], // Total +8
      totalBonusLevels: 8,
      totalCost: 128315,
      reasoning: '+5 Speed. Maximum accuracy + extra attack. Simple but devastating.'
    },
    {
      enhancementBonus: 5,
      specialAbilities: ['vorpal'], // +5 cost, total +10 (MAX!)
      totalBonusLevels: 10,
      totalCost: 200315, // 15 + 300 + 200000
      reasoning: '+5 Vorpal (slashing, melee only). Natural 20 + confirm = DECAPITATION. Most iconic weapon in D&D. Reserved for level 20 characters.'
    }
  ]
};

// =============================================================================
// ARMOR ENHANCEMENT RECOMMENDATIONS BY LEVEL
// =============================================================================

/**
 * Armor Enhancement Recommendations
 * 
 * PRIORITIES:
 * 1. Weapon first (for martials)
 * 2. Armor second
 * 3. Special abilities come later (they're expensive relative to benefit)
 * 
 * SPECIAL NOTES:
 * - Wild (+3 cost) is ESSENTIAL for druids who wild shape
 * - Fortification is excellent for everyone (negate crits)
 * - Invulnerability (DR 5/magic) is expensive but powerful
 */
export const ARMOR_ENHANCEMENTS_BY_LEVEL: Record<string, EnhancementRecommendation[]> = {
  // Level 3-4: First magic armor (if budget allows after weapon)
  'level-3-4': [
    {
      enhancementBonus: 1,
      specialAbilities: [],
      totalBonusLevels: 1,
      totalCost: 1200, // Scale mail: 50 base + 150 mw + 1000 enhancement
      reasoning: 'First magic armor. +1 AC is good, but weapon takes priority for martials.'
    }
  ],

  // Level 5-7: +1/+2 armor
  'level-5-7': [
    {
      enhancementBonus: 2,
      specialAbilities: [],
      totalBonusLevels: 2,
      totalCost: 8200, // Scale mail: 50 + 150 + 8000
      reasoning: '+2 armor. Solid defense boost.'
    },
    {
      enhancementBonus: 1,
      specialAbilities: [],
      totalBonusLevels: 1,
      totalCost: 1200,
      reasoning: '+1 armor. Budget option if upgrading weapon to +2/+3.'
    }
  ],

  // Level 8-10: +2/+3 armor with Light Fortification options
  'level-8-10': [
    {
      enhancementBonus: 3,
      specialAbilities: [],
      totalBonusLevels: 3,
      totalCost: 18200, // 50 + 150 + 18000
      reasoning: '+3 armor. Standard progression.'
    },
    {
      enhancementBonus: 2,
      specialAbilities: [{ key: 'fortification', level: 1 }], // Light Fortification (+1 cost, 25% crit negation)
      totalBonusLevels: 3,
      totalCost: 18200,
      reasoning: '+2 Light Fortification. 25% crit negation - START getting fortification! Important for survivability.'
    },
    {
      enhancementBonus: 1,
      specialAbilities: [{ key: 'fortification', level: 2 }], // Moderate Fortification (+3 cost, 75% crit negation)
      totalBonusLevels: 4,
      totalCost: 32200,
      reasoning: '+1 Moderate Fortification. 75% crit negation! Better protection at higher cost.'
    },
    {
      enhancementBonus: 1,
      specialAbilities: [{ key: 'fortification', level: 1 }], // Light Fortification (+1 cost, 25% crit negation)
      totalBonusLevels: 2,
      totalCost: 4200,
      reasoning: '+1 Light Fortification. 25% crit negation! Budget-friendly option for levels 8-10.'
    },
    {
      enhancementBonus: 2,
      specialAbilities: [],
      totalBonusLevels: 2,
      totalCost: 8200,
      reasoning: '+2 armor. Budget option if fortification unaffordable.'
    },
    {
      enhancementBonus: 1,
      specialAbilities: ['fireResistance'],
      totalBonusLevels: 1,
      totalCost: 19350, // +18,000 gp for resistance
      reasoning: '+1 Fire Resistance. Resist 10 fire. Great vs dragons/fire spells!'
    },
    {
      enhancementBonus: 1,
      specialAbilities: ['coldResistance'],
      totalBonusLevels: 1,
      totalCost: 19350,
      reasoning: '+1 Cold Resistance. Resist 10 cold.'
    },
    {
      enhancementBonus: 1,
      specialAbilities: ['electricityResistance'],
      totalBonusLevels: 1,
      totalCost: 19350,
      reasoning: '+1 Electricity Resistance. Resist 10 electricity.'
    },
    {
      enhancementBonus: 1,
      specialAbilities: ['invulnerability'], // +3 cost (DR 5/magic)
      totalBonusLevels: 4,
      totalCost: 32200,
      reasoning: '+1 Invulnerability. DR 5/magic - great damage reduction for tanks.'
    }
  ],

  // Level 11-13: +3/+4 armor, start considering special abilities
  // Introduce Moderate Fortification at this level range
  'level-11-13': [
    {
      enhancementBonus: 2,
      specialAbilities: ['wild', { key: 'fortification', level: 1 }], // Wild +3, Light Fort +1
      totalBonusLevels: 6,
      totalCost: 72200,
      reasoning: '+2 Wild Light Fortification. DRUIDS: Best combo - armor works in wild shape + 25% crit negation.'
    },
    {
      enhancementBonus: 3,
      specialAbilities: ['wild'], // +3 cost - DRUIDS PRIORITY!
      totalBonusLevels: 6,
      totalCost: 72200,
      reasoning: '+3 Wild armor. ESSENTIAL for druids. Armor melds into wild shape form.'
    },
    {
      enhancementBonus: 3,
      specialAbilities: [{ key: 'fortification', level: 2 }], // Moderate Fortification (+3 cost, 75% crit negation)
      totalBonusLevels: 6,
      totalCost: 72200,
      reasoning: '+3 Moderate Fortification. 75% chance to negate critical hits. Excellent mid-level defense.'
    },
    {
      enhancementBonus: 2,
      specialAbilities: ['fireResistanceImproved'],
      totalBonusLevels: 2,
      totalCost: 38350, // +30,000 for improved resistance
      reasoning: '+2 Improved Fire Resistance. AC + Resist 20 fire! Better than Invulnerability for fire-heavy campaigns.'
    },
    {
      enhancementBonus: 2,
      specialAbilities: ['coldResistanceImproved'],
      totalBonusLevels: 2,
      totalCost: 38350,
      reasoning: '+2 Improved Cold Resistance. AC + Resist 20 cold!'
    },
    {
      enhancementBonus: 2,
      specialAbilities: ['electricityResistanceImproved'],
      totalBonusLevels: 2,
      totalCost: 38350,
      reasoning: '+2 Improved Electricity Resistance. AC + Resist 20 electricity!'
    },
    {
      enhancementBonus: 3,
      specialAbilities: ['invulnerability'], // +3 cost (DR 5/magic)
      totalBonusLevels: 6,
      totalCost: 72200,
      reasoning: '+3 Invulnerability. DR 5/magic reduces ALL physical damage by 5. Great for tanks.'
    },
    {
      enhancementBonus: 2,
      specialAbilities: [{ key: 'fortification', level: 2 }], // Moderate Fortification (+3 cost, 75% crit negation)
      totalBonusLevels: 5,
      totalCost: 50200,
      reasoning: '+2 Moderate Fortification. 75% crit negation, more affordable option.'
    },
    {
      enhancementBonus: 2,
      specialAbilities: ['invulnerability'], // +3 cost (DR 5/magic)
      totalBonusLevels: 5,
      totalCost: 50200,
      reasoning: '+2 Invulnerability. Budget DR option.'
    },
    {
      enhancementBonus: 4,
      specialAbilities: [],
      totalBonusLevels: 4,
      totalCost: 32200,
      reasoning: '+4 armor. Solid defense without special abilities.'
    },
    {
      enhancementBonus: 2,
      specialAbilities: [{ key: 'fortification', level: 1 }], // Light Fortification (+1 cost, 25% crit negation)
      totalBonusLevels: 3,
      totalCost: 18200,
      reasoning: '+2 Light Fortification. Fallback if Moderate unaffordable.'
    },
    {
      enhancementBonus: 1,
      specialAbilities: [{ key: 'fortification', level: 1 }], // Light Fortification (+1 cost, 25% crit negation)
      totalBonusLevels: 2,
      totalCost: 4200,
      reasoning: '+1 Light Fortification. Budget-friendly fortification for lower budgets at level 11-13.'
    },
    {
      enhancementBonus: 3,
      specialAbilities: [],
      totalBonusLevels: 3,
      totalCost: 18200,
      reasoning: '+3 armor. Budget option if fortification unaffordable.'
    },
  ],

  // Level 14-16: +4/+5 armor with abilities
  // Heavy Fortification starts appearing, Moderate becomes common
  'level-14-16': [
    {
      enhancementBonus: 3,
      specialAbilities: ['wild', { key: 'fortification', level: 2 }], // Wild +3, Moderate Fort +3
      totalBonusLevels: 9,
      totalCost: 162200,
      reasoning: '+3 Wild Moderate Fortification. DRUIDS: Best combo - wild shape compatible + 75% crit negation.'
    },
    {
      enhancementBonus: 2,
      specialAbilities: ['wild', { key: 'fortification', level: 2 }], // Wild +3, Moderate Fort +3
      totalBonusLevels: 8,
      totalCost: 128200,
      reasoning: '+2 Wild Moderate Fortification. DRUIDS: Budget version with great protection.'
    },
    {
      enhancementBonus: 4,
      specialAbilities: ['wild'], // +3 cost - DRUIDS PRIORITY!
      totalBonusLevels: 7,
      totalCost: 98200,
      reasoning: '+4 Wild. For druids who wild shape frequently.'
    },
    {
      enhancementBonus: 4,
      specialAbilities: [{ key: 'fortification', level: 3 }], // Heavy Fortification (+5 cost, 100% crit immune)
      totalBonusLevels: 9,
      totalCost: 162200,
      reasoning: '+4 Heavy Fortification. IMMUNE to critical hits! Very strong for level 14-16.'
    },
    {
      enhancementBonus: 3,
      specialAbilities: [{ key: 'fortification', level: 3 }], // Heavy Fortification (+5 cost, 100% crit immune)
      totalBonusLevels: 8,
      totalCost: 128200,
      reasoning: '+3 Heavy Fortification. Crit immunity at a more affordable price.'
    },
    {
      enhancementBonus: 5,
      specialAbilities: [{ key: 'fortification', level: 2 }], // Moderate Fortification (+3 cost, 75% crit negation)
      totalBonusLevels: 8,
      totalCost: 128200,
      reasoning: '+5 Moderate Fortification. Maximum AC with 75% crit negation.'
    },
    {
      enhancementBonus: 4,
      specialAbilities: [{ key: 'fortification', level: 2 }], // Moderate Fortification (+3 cost, 75% crit negation)
      totalBonusLevels: 7,
      totalCost: 98200,
      reasoning: '+4 Moderate Fortification. 75% crit negation, solid choice.'
    },
    {
      enhancementBonus: 5,
      specialAbilities: [],
      totalBonusLevels: 5,
      totalCost: 50200,
      reasoning: '+5 armor. Maximum base enhancement.'
    },
    {
      enhancementBonus: 3,
      specialAbilities: [{ key: 'fortification', level: 1 }], // Light Fortification (+1 cost, 25% crit negation)
      totalBonusLevels: 4,
      totalCost: 32200,
      reasoning: '+3 Light Fortification. Budget fallback option.'
    },
    {
      enhancementBonus: 2,
      specialAbilities: [{ key: 'fortification', level: 2 }], // Moderate Fortification (+3 cost, 75% crit negation)
      totalBonusLevels: 5,
      totalCost: 50200,
      reasoning: '+2 Moderate Fortification. Affordable 75% crit negation for level 14.'
    },
    {
      enhancementBonus: 2,
      specialAbilities: [{ key: 'fortification', level: 1 }], // Light Fortification (+1 cost, 25% crit negation)
      totalBonusLevels: 3,
      totalCost: 18200,
      reasoning: '+2 Light Fortification. Budget option for level 14 with limited budget.'
    },
    {
      enhancementBonus: 1,
      specialAbilities: [{ key: 'fortification', level: 1 }], // Light Fortification (+1 cost, 25% crit negation)
      totalBonusLevels: 2,
      totalCost: 4200,
      reasoning: '+1 Light Fortification. Ultra-budget fallback if needed.'
    },
    {
      enhancementBonus: 2,
      specialAbilities: ['invulnerability'], // +3 cost (DR 5/magic)
      totalBonusLevels: 5,
      totalCost: 50200,
      reasoning: '+2 Invulnerability. DR 5/magic for damage reduction.'
    }
  ],

  // Level 17-20: +5 armor with powerful abilities
  // Heavy Fortification is the standard, with +5 Heavy being the ultimate goal
  'level-17-20': [
    {
      enhancementBonus: 4,
      specialAbilities: ['wild', { key: 'fortification', level: 3 }], // Wild +3, Heavy Fort +5
      totalBonusLevels: 12, // OVER MAX but we'll handle it
      totalCost: 242200,
      reasoning: '+4 Wild Heavy Fortification. DRUIDS: ULTIMATE - wild shape + 100% crit immunity. (Total +12, exceeds +10 limit - system may cap)'
    },
    {
      enhancementBonus: 3,
      specialAbilities: ['wild', { key: 'fortification', level: 3 }], // Wild +3, Heavy Fort +5
      totalBonusLevels: 11, // OVER MAX
      totalCost: 200200,
      reasoning: '+3 Wild Heavy Fortification. DRUIDS: Amazing combo, slightly over +10 limit.'
    },
    {
      enhancementBonus: 2,
      specialAbilities: ['wild', { key: 'fortification', level: 3 }], // Wild +3, Heavy Fort +5
      totalBonusLevels: 10, // MAX!
      totalCost: 162200,
      reasoning: '+2 Wild Heavy Fortification. DRUIDS: Perfect +10 total - wild shape + 100% crit immunity.'
    },
    {
      enhancementBonus: 5,
      specialAbilities: ['wild'], // +3 cost - DRUIDS PRIORITY!
      totalBonusLevels: 8,
      totalCost: 128200,
      reasoning: '+5 Wild. Maximum armor for druids.'
    },
    {
      enhancementBonus: 5,
      specialAbilities: [{ key: 'fortification', level: 3 }], // Heavy Fortification (+5 cost, 100% crit immune)
      totalBonusLevels: 10, // MAX!
      totalCost: 200200,
      reasoning: '+5 Heavy Fortification. ULTIMATE ARMOR. Maximum AC + complete crit immunity.'
    },
    {
      enhancementBonus: 4,
      specialAbilities: [{ key: 'fortification', level: 3 }], // Heavy Fortification (+5 cost, 100% crit immune)
      totalBonusLevels: 9,
      totalCost: 162200,
      reasoning: '+4 Heavy Fortification. Crit immunity with great AC.'
    },
    {
      enhancementBonus: 3,
      specialAbilities: [{ key: 'fortification', level: 3 }], // Heavy Fortification (+5 cost, 100% crit immune)
      totalBonusLevels: 8,
      totalCost: 128200,
      reasoning: '+3 Heavy Fortification. Crit immunity at lower cost.'
    },
    {
      enhancementBonus: 5,
      specialAbilities: [{ key: 'fortification', level: 2 }], // Moderate Fortification (+3 cost, 75% crit negation)
      totalBonusLevels: 8,
      totalCost: 128200,
      reasoning: '+5 Moderate Fortification. Maximum AC with 75% crit negation.'
    },
    {
      enhancementBonus: 4,
      specialAbilities: [{ key: 'fortification', level: 2 }], // Moderate Fortification (+3 cost, 75% crit negation)
      totalBonusLevels: 7,
      totalCost: 98200,
      reasoning: '+4 Moderate Fortification. Fallback if Heavy unaffordable.'
    },
    {
      enhancementBonus: 3,
      specialAbilities: [{ key: 'fortification', level: 2 }], // Moderate Fortification (+3 cost, 75% crit negation)
      totalBonusLevels: 6,
      totalCost: 72200,
      reasoning: '+3 Moderate Fortification. Budget option for levels 17-18 with 75% crit negation.'
    },
    {
      enhancementBonus: 2,
      specialAbilities: [{ key: 'fortification', level: 3 }], // Heavy Fortification (+5 cost, 100% crit immune)
      totalBonusLevels: 7,
      totalCost: 98200,
      reasoning: '+2 Heavy Fortification. Budget crit immunity for levels 17-18.'
    },
    {
      enhancementBonus: 4,
      specialAbilities: [{ key: 'fortification', level: 1 }], // Light Fortification (+1 cost, 25% crit negation)
      totalBonusLevels: 5,
      totalCost: 50200,
      reasoning: '+4 Light Fortification. Affordable option for levels 17-18.'
    },
    {
      enhancementBonus: 3,
      specialAbilities: ['invulnerability'], // +3 cost
      totalBonusLevels: 6,
      totalCost: 72200,
      reasoning: '+3 Invulnerability. DR 5/magic + solid AC.'
    },
    {
      enhancementBonus: 5,
      specialAbilities: [{ key: 'fortification', level: 1 }], // Light Fortification (+1 cost, 25% crit negation)
      totalBonusLevels: 6,
      totalCost: 72200,
      reasoning: '+5 Light Fortification. Last resort fallback.'
    }
  ]
};

// =============================================================================
// SHIELD ENHANCEMENT RECOMMENDATIONS BY LEVEL
// =============================================================================

/**
 * Shield Enhancement Recommendations
 * 
 * PRIORITIES:
 * 1. Shield-specific abilities (Arrow Catching, Arrow Deflection, Reflecting)
 * 2. Elemental resistances (don't stack with armor resistances!)
 * 3. Skip Fortification (armor usually has it)
 * 
 * SHIELD-SPECIFIC ABILITIES:
 * - Arrow Catching (+1): Deflects ranged attacks
 * - Arrow Deflection (+2): Free Deflect Arrow feat
 * - Reflecting (+5): Reflects spells back at caster (POWERFUL but expensive!)
 * - Bashing (+1): More damage when shield bashing
 * - Animated (+2): Shield floats, no penalties (but can't shield bash)
 * 
 * ELEMENTAL RESISTANCES:
 * - Fire/Cold/Electricity/Sonic Resistance (18,000 gp each, +0 equivalent)
 * - Improved (30,000 gp, +0) - Resist 20
 * - Greater (66,000 gp, +0) - Resist 30
 * 
 * NOTE: Resistances are +0 cost but have flat GP costs. They DON'T STACK
 * between armor and shield, so we need to track which type was used.
 */
export const SHIELD_ENHANCEMENTS_BY_LEVEL: Record<string, EnhancementRecommendation[]> = {
  // Level 4-5: First shield enhancement
  'level-4-5': [
    {
      enhancementBonus: 1,
      specialAbilities: [],
      totalBonusLevels: 1,
      totalCost: 1170, // Heavy steel shield: 20 base + 150 mw + 1000 enhancement
      reasoning: '+1 shield. First shield enhancement. Solid AC boost.'
    },
    {
      enhancementBonus: 1,
      specialAbilities: ['arrowCatching'],
      totalBonusLevels: 2,
      totalCost: 4170, // 20 + 150 + 4000
      reasoning: '+1 Arrow Catching. Shield deflects ranged attacks. Great vs archers!'
    }
  ],

  // Level 6-7: +2 shields or +1 with abilities
  'level-6-7': [
    {
      enhancementBonus: 2,
      specialAbilities: [],
      totalBonusLevels: 2,
      totalCost: 4170,
      reasoning: '+2 shield. Standard progression.'
    },
    {
      enhancementBonus: 1,
      specialAbilities: ['arrowCatching'],
      totalBonusLevels: 2,
      totalCost: 4170,
      reasoning: '+1 Arrow Catching. Deflect ranged attacks.'
    },
    {
      enhancementBonus: 2,
      specialAbilities: ['arrowCatching'],
      totalBonusLevels: 3,
      totalCost: 9170,
      reasoning: '+2 Arrow Catching. Better AC + ranged protection.'
    }
  ],

  // Level 8-10: +2/+3 shields with resistances
  'level-8-10': [
    {
      enhancementBonus: 3,
      specialAbilities: [],
      totalBonusLevels: 3,
      totalCost: 9170,
      reasoning: '+3 shield. Solid AC progression.'
    },
    {
      enhancementBonus: 2,
      specialAbilities: ['arrowCatching'],
      totalBonusLevels: 3,
      totalCost: 9170,
      reasoning: '+2 Arrow Catching. AC + ranged protection.'
    },
    {
      enhancementBonus: 1,
      specialAbilities: ['arrowDeflection'],
      totalBonusLevels: 3,
      totalCost: 9170,
      reasoning: '+1 Arrow Deflection. Free Deflect Arrows feat once per round!'
    },
    {
      enhancementBonus: 1,
      specialAbilities: ['fireResistance'],
      totalBonusLevels: 1,
      totalCost: 19170, // +18,000 gp for resistance
      reasoning: '+1 Fire Resistance. Resist 10 fire. Great vs dragons/casters!'
    },
    {
      enhancementBonus: 1,
      specialAbilities: ['coldResistance'],
      totalBonusLevels: 1,
      totalCost: 19170,
      reasoning: '+1 Cold Resistance. Resist 10 cold.'
    },
    {
      enhancementBonus: 1,
      specialAbilities: ['electricityResistance'],
      totalBonusLevels: 1,
      totalCost: 19170,
      reasoning: '+1 Electricity Resistance. Resist 10 electricity.'
    }
  ],

  // Level 11-13: +3/+4 with abilities, improved resistances
  'level-11-13': [
    {
      enhancementBonus: 4,
      specialAbilities: [],
      totalBonusLevels: 4,
      totalCost: 16170,
      reasoning: '+4 shield. Strong AC boost.'
    },
    {
      enhancementBonus: 3,
      specialAbilities: ['arrowCatching'],
      totalBonusLevels: 4,
      totalCost: 16170,
      reasoning: '+3 Arrow Catching. AC + ranged deflection.'
    },
    {
      enhancementBonus: 2,
      specialAbilities: ['arrowDeflection'],
      totalBonusLevels: 4,
      totalCost: 16170,
      reasoning: '+2 Arrow Deflection. Good AC + Deflect Arrows.'
    },
    {
      enhancementBonus: 2,
      specialAbilities: ['fireResistance'],
      totalBonusLevels: 2,
      totalCost: 22170, // +18,000 for resistance
      reasoning: '+2 Fire Resistance. AC + Resist 10 fire.'
    },
    {
      enhancementBonus: 2,
      specialAbilities: ['fireResistanceImproved'],
      totalBonusLevels: 2,
      totalCost: 34170, // +30,000 for improved resistance
      reasoning: '+2 Improved Fire Resistance. AC + Resist 20 fire!'
    },
    {
      enhancementBonus: 2,
      specialAbilities: ['coldResistanceImproved'],
      totalBonusLevels: 2,
      totalCost: 34170,
      reasoning: '+2 Improved Cold Resistance. AC + Resist 20 cold!'
    },
    {
      enhancementBonus: 2,
      specialAbilities: ['electricityResistanceImproved'],
      totalBonusLevels: 2,
      totalCost: 34170,
      reasoning: '+2 Improved Electricity Resistance. AC + Resist 20 electricity!'
    },
    {
      enhancementBonus: 1,
      specialAbilities: ['animated'],
      totalBonusLevels: 3,
      totalCost: 9170,
      reasoning: '+1 Animated. Shield floats - no armor check penalty or spell failure!'
    }
  ],

  // Level 14-16: +4/+5 with powerful abilities
  'level-14-16': [
    {
      enhancementBonus: 5,
      specialAbilities: [],
      totalBonusLevels: 5,
      totalCost: 25170,
      reasoning: '+5 shield. Maximum AC bonus.'
    },
    {
      enhancementBonus: 4,
      specialAbilities: ['arrowDeflection'],
      totalBonusLevels: 6,
      totalCost: 36170,
      reasoning: '+4 Arrow Deflection. High AC + Deflect Arrows.'
    },
    {
      enhancementBonus: 3,
      specialAbilities: ['fireResistanceImproved'],
      totalBonusLevels: 3,
      totalCost: 39170, // +30,000 for improved resistance
      reasoning: '+3 Improved Fire Resistance. Good AC + Resist 20 fire.'
    },
    {
      enhancementBonus: 3,
      specialAbilities: ['fireResistanceGreater'],
      totalBonusLevels: 3,
      totalCost: 75170, // +66,000 for greater resistance
      reasoning: '+3 Greater Fire Resistance. AC + Resist 30 fire! Excellent protection.'
    },
    {
      enhancementBonus: 3,
      specialAbilities: ['coldResistanceGreater'],
      totalBonusLevels: 3,
      totalCost: 75170,
      reasoning: '+3 Greater Cold Resistance. AC + Resist 30 cold!'
    },
    {
      enhancementBonus: 3,
      specialAbilities: ['electricityResistanceGreater'],
      totalBonusLevels: 3,
      totalCost: 75170,
      reasoning: '+3 Greater Electricity Resistance. AC + Resist 30 electricity!'
    },
    {
      enhancementBonus: 2,
      specialAbilities: ['animated'],
      totalBonusLevels: 4,
      totalCost: 16170,
      reasoning: '+2 Animated. Shield floats - great for spellcasters who use shields!'
    }
  ],

  // Level 17-20: +5 shields with ultimate abilities
  'level-17-20': [
    {
      enhancementBonus: 5,
      specialAbilities: ['arrowDeflection'],
      totalBonusLevels: 7,
      totalCost: 49170,
      reasoning: '+5 Arrow Deflection. Maximum AC + Deflect Arrows.'
    },
    {
      enhancementBonus: 5,
      specialAbilities: ['fireResistanceGreater'],
      totalBonusLevels: 5,
      totalCost: 91170, // +66,000 for greater resistance
      reasoning: '+5 Greater Fire Resistance. Maximum AC + Resist 30 fire.'
    },
    {
      enhancementBonus: 4,
      specialAbilities: ['fireResistanceGreater'],
      totalBonusLevels: 4,
      totalCost: 82170,
      reasoning: '+4 Greater Fire Resistance. High AC + Resist 30 fire.'
    },
    {
      enhancementBonus: 3,
      specialAbilities: ['animated', 'arrowCatching'],
      totalBonusLevels: 6,
      totalCost: 36170,
      reasoning: '+3 Animated Arrow Catching. Floating shield + ranged deflection.'
    },
    {
      enhancementBonus: 5,
      specialAbilities: ['reflecting'],
      totalBonusLevels: 10, // MAX!
      totalCost: 200170, // Expensive but POWERFUL!
      reasoning: '+5 Reflecting. ULTIMATE SHIELD. Reflects spells back at caster! Anti-mage perfection.'
    },
    {
      enhancementBonus: 4,
      specialAbilities: ['reflecting'],
      totalBonusLevels: 9,
      totalCost: 162170,
      reasoning: '+4 Reflecting. Spell reflection at lower cost.'
    },
    {
      enhancementBonus: 3,
      specialAbilities: ['reflecting'],
      totalBonusLevels: 8,
      totalCost: 128170,
      reasoning: '+3 Reflecting. Reflects spells - amazing vs casters!'
    },
    {
      enhancementBonus: 3,
      specialAbilities: ['animated'],
      totalBonusLevels: 5,
      totalCost: 25170,
      reasoning: '+3 Animated. Good AC with floating shield.'
    }
  ]
};

// =============================================================================
// SPECIAL ABILITY PRIORITY LISTS
// =============================================================================

/**
 * Weapon Special Abilities Priority
 * Ordered by general usefulness for most characters
 */
export const WEAPON_ABILITY_PRIORITY = {
  // Tier 1: Always good (+1 cost)
  tier1: [
    'flaming',      // +1d6 fire, works on everything
    'frost',        // +1d6 cold, good alternative to flaming
    'shock',        // +1d6 electricity, less common resistance
    'keen',         // Double threat range (slashing only), amazing for crit builds
    'ghostTouch',   // Hit incorporeal creatures, situational but valuable
  ],
  
  // Tier 2: Situational but powerful (+1-2 cost)
  tier2: [
    'holy',         // +2d6 vs evil (+2 cost), excellent in most campaigns
    'unholy',       // +2d6 vs good (+2 cost), for evil campaigns
    'merciful',     // +1d6 nonlethal (+1 cost), for subdual
    'defending',    // Transfer bonus to AC (+1 cost), good for tanks
    'returning',    // Returns after thrown (+1 cost), thrown weapons only
  ],
  
  // Tier 3: Build-specific (+2-3 cost)
  tier3: [
    'speed',        // Extra attack (+3 cost), BEST ability for full-attackers
    'flamingBurst', // +1d6 + burst on crit (+2 cost)
    'icyBurst',     // +1d6 + burst on crit (+2 cost)
    'shockingBurst',// +1d6 + burst on crit (+2 cost)
    'wounding',     // Con damage (+2 cost), brutal
  ],
  
  // Tier 4: Epic level only (+4-5 cost)
  tier4: [
    'brilliantEnergy', // Ignores armor (+4 cost), niche but powerful
    'dancing',         // Weapon attacks on its own (+4 cost), fun but expensive
    'vorpal',          // Decapitation on crit (+5 cost), iconic but VERY expensive
  ],
  
  // Bane: Situational (campaign-specific)
  bane: [
    'baneUndead',      // Common enemy type
    'baneOutsiders',   // Common at high levels
    'baneDragons',     // Campaign-specific
    'baneGiants',      // Campaign-specific
    // (other bane types available but less common)
  ]
} as const;

/**
 * Armor Special Abilities Priority
 * Ordered by general usefulness
 */
export const ARMOR_ABILITY_PRIORITY = {
  // Tier 1: Universally good
  tier1: [
    'fortification',     // Negate crits (+1/+3/+5 for light/moderate/heavy)
    'wild',              // ESSENTIAL for druids (+3 cost)
    'invulnerability',   // DR 5/magic (+3 cost)
  ],
  
  // Tier 2: Useful utility (most are +0 cost, fixed GP pricing)
  tier2: [
    'shadow',            // +5 Hide (+0 cost, ~3,750 gp)
    'silentMoves',       // +5 Move Silently (+0 cost, ~3,750 gp)
    'slick',             // +5 Escape Artist (+0 cost, ~3,750 gp)
    'glamered',          // Change appearance (+0 cost, ~2,700 gp)
  ],
  
  // Tier 3: Energy resistances (+0 cost, useful but overshadowed by resist items)
  tier3: [
    'fireResistance',         // Resist 10 fire
    'coldResistance',         // Resist 10 cold
    'electricityResistance',  // Resist 10 electricity
    'acidResistance',         // Resist 10 acid
    'sonicResistance',        // Resist 10 sonic
    // (Improved and Greater variants available for higher resistance)
  ],
  
  // Tier 4: Shields only
  tier4: [
    'animated',          // Shield fights on its own (+2 cost)
    'arrowCatching',     // Deflect ranged (+1 cost)
    'arrowDeflection',   // Deflection feat (+2 cost)
    'bashing',           // More shield bash damage (+1 cost)
    'blinding',          // Blind on hit (+1 cost)
    'reflecting',        // Reflect spells (+5 cost!)
  ]
} as const;

// =============================================================================
// CHARACTER CLASS RECOMMENDATIONS
// =============================================================================

/**
 * Class-specific enhancement recommendations
 */
export const CLASS_ENHANCEMENT_PRIORITIES = {
  // MARTIAL CHARACTERS
  fighter: {
    priority: ['weapon', 'armor', 'stat'] as const,
    weaponAbilities: ['keen', 'flaming', 'speed'] as const, // Feat synergy with Weapon Focus, Improved Crit
    armorAbilities: ['fortification'] as const,
    notes: 'Fighters benefit most from weapon enhancements. Invest heavily in weapon first, armor second.'
  },
  
  barbarian: {
    priority: ['weapon', 'stat', 'armor'] as const, // Less armor due to fast movement
    weaponAbilities: ['flaming', 'frost', 'shock'] as const, // Simple, effective damage
    armorAbilities: ['fortification', 'invulnerability'] as const, // DR stacks with barbarian DR
    notes: 'Barbarians want high damage. Energy damage (flaming/frost/shock) works well. Light armor for speed.'
  },
  
  paladin: {
    priority: ['weapon', 'armor', 'stat'] as const,
    weaponAbilities: ['holy'] as const, // Obvious synergy with class abilities
    armorAbilities: ['fortification', 'invulnerability'] as const,
    notes: 'Holy weapon is thematic and powerful. Paladins use heavy armor, invest in good AC.'
  },
  
  ranger: {
    priority: ['weapon', 'stat', 'armor'] as const, // Light armor
    weaponAbilities: ['keen', 'flaming', 'baneX'] as const, // Bane synergizes with Favored Enemy
    armorAbilities: ['shadow', 'silentMoves'] as const, // Stealth bonuses
    notes: 'Rangers benefit from Bane weapons (matches Favored Enemy). TWF builds love Keen. Stealth armor helpful.'
  },
  
  rogue: {
    priority: ['weapon', 'stat', 'armor'] as const, // Light armor
    weaponAbilities: ['keen'] as const, // More crits = more sneak attack dice
    armorAbilities: ['shadow', 'silentMoves', 'slick'] as const, // All the stealth bonuses
    notes: 'Rogues LOVE Keen weapons (more sneak attacks on crits). Invest in stealth-enhancing armor.'
  },
  
  monk: {
    priority: ['stat', 'weapon'] as const, // Monks need Amulet of Mighty Fists, not weapon enhancements
    weaponAbilities: ['kiFocus'] as const, // Allows ki strike abilities
    armorAbilities: [] as const, // Monks don't wear armor!
    notes: 'Monks need Amulet of Mighty Fists (enhances unarmed strikes). Ki Focus weapons let them use ki abilities. No armor enhancements (AC bonus items instead).'
  },
  
  // CASTER CHARACTERS
  wizard: {
    priority: ['stat', 'saves', 'defensiveItems'] as const,
    weaponAbilities: [] as const, // DON'T ENHANCE WEAPONS FOR WIZARDS!
    armorAbilities: [] as const, // Wizards don't wear armor (or use Mage Armor spell)
    notes: 'Wizards should NEVER buy enhanced weapons. Invest in Headband of Intellect, Cloak of Resistance, and wands (Mage Armor, Shield, CLW).'
  },
  
  sorcerer: {
    priority: ['stat', 'saves', 'defensiveItems'] as const,
    weaponAbilities: [] as const, // DON'T ENHANCE WEAPONS FOR SORCERERS!
    armorAbilities: [] as const,
    notes: 'Sorcerers need Cloak of Charisma. Skip weapons, buy wands and metamagic rods instead.'
  },
  
  cleric: {
    priority: ['stat', 'weapon', 'armor'] as const, // Hybrid caster/melee
    weaponAbilities: ['disruption', 'holy'] as const, // Thematic for clerics
    armorAbilities: ['fortification'] as const,
    notes: 'Clerics are hybrid. Battle clerics need weapon+armor. Healbot clerics focus on stat booster + healing wands.'
  },
  
  druid: {
    priority: ['stat', 'armor', 'weapon'] as const,
    weaponAbilities: [] as const, // Don't work in wild shape
    armorAbilities: ['wild'] as const, // ESSENTIAL for wild shape druids!
    notes: 'Druids who wild shape MUST buy Wild armor (+3 cost) or armor is useless. Weapons do not work in animal form. Focus on neck/head/belt items that work in wild shape.'
  },
  
  bard: {
    priority: ['stat', 'saves', 'defensiveItems'] as const,
    weaponAbilities: ['flaming'] as const, // If using weapons (rare)
    armorAbilities: ['shadow', 'silentMoves'] as const, // Light armor, stealth bonuses
    notes: 'Bards need Cloak of Charisma. Can use light armor and weapons but focus on support items and wands.'
  }
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get recommended weapon enhancements for a character level
 */
export function getWeaponRecommendationsForLevel(level: number): EnhancementRecommendation[] {
  if (level <= 2) return []; // No magic items yet
  if (level <= 4) return WEAPON_ENHANCEMENTS_BY_LEVEL['level-3-4'];
  if (level <= 7) return WEAPON_ENHANCEMENTS_BY_LEVEL['level-5-7'];
  if (level <= 10) return WEAPON_ENHANCEMENTS_BY_LEVEL['level-8-10'];
  if (level <= 13) return WEAPON_ENHANCEMENTS_BY_LEVEL['level-11-13'];
  if (level <= 16) return WEAPON_ENHANCEMENTS_BY_LEVEL['level-14-16'];
  return WEAPON_ENHANCEMENTS_BY_LEVEL['level-17-20'];
}

/**
 * Get recommended armor enhancements for a character level
 */
export function getArmorRecommendationsForLevel(level: number): EnhancementRecommendation[] {
  if (level <= 2) return []; // No magic items yet
  if (level <= 4) return ARMOR_ENHANCEMENTS_BY_LEVEL['level-3-4'];
  if (level <= 7) return ARMOR_ENHANCEMENTS_BY_LEVEL['level-5-7'];
  if (level <= 10) return ARMOR_ENHANCEMENTS_BY_LEVEL['level-8-10'];
  if (level <= 13) return ARMOR_ENHANCEMENTS_BY_LEVEL['level-11-13'];
  if (level <= 16) return ARMOR_ENHANCEMENTS_BY_LEVEL['level-14-16'];
  return ARMOR_ENHANCEMENTS_BY_LEVEL['level-17-20'];
}

/**
 * Get recommended shield enhancements for a character level
 */
export function getShieldRecommendationsForLevel(level: number): EnhancementRecommendation[] {
  if (level <= 3) return []; // No shield enhancements yet
  if (level <= 5) return SHIELD_ENHANCEMENTS_BY_LEVEL['level-4-5'];
  if (level <= 7) return SHIELD_ENHANCEMENTS_BY_LEVEL['level-6-7'];
  if (level <= 10) return SHIELD_ENHANCEMENTS_BY_LEVEL['level-8-10'];
  if (level <= 13) return SHIELD_ENHANCEMENTS_BY_LEVEL['level-11-13'];
  if (level <= 16) return SHIELD_ENHANCEMENTS_BY_LEVEL['level-14-16'];
  return SHIELD_ENHANCEMENTS_BY_LEVEL['level-17-20'];
}

/**
 * Helper function to extract resistance type from ability name
 * Resistances don't stack between armor and shields, so we need to track them
 */
function getResistanceType(abilityKey: string): string | null {
  if (abilityKey.includes('fireResistance')) return 'fire';
  if (abilityKey.includes('coldResistance')) return 'cold';
  if (abilityKey.includes('electricityResistance')) return 'electricity';
  if (abilityKey.includes('acidResistance')) return 'acid';
  if (abilityKey.includes('sonicResistance')) return 'sonic';
  return null;
}

/**
 * Check if two enhancement recommendations have conflicting resistances
 * Returns true if they have the same resistance type (which doesn't stack)
 */
function hasResistanceConflict(
  abilities1: (string | EnhancementAbility)[],
  abilities2: (string | EnhancementAbility)[]
): boolean {
  const resistances1 = abilities1
    .map(a => typeof a === 'string' ? a : a.key)
    .map(getResistanceType)
    .filter(r => r !== null);
  
  const resistances2 = abilities2
    .map(a => typeof a === 'string' ? a : a.key)
    .map(getResistanceType)
    .filter(r => r !== null);
  
  // Check if any resistance types overlap
  for (const r1 of resistances1) {
    if (resistances2.includes(r1)) {
      return true; // Conflict found!
    }
  }
  
  return false;
}

/**
 * Get best weapon enhancement option for a character
 * @param level Character level
 * @param characterClass Character class
 * @param availableBudget Available gold (after other purchases)
 * @returns Best enhancement recommendation within budget
 */
export function getBestWeaponEnhancementForCharacter(
  level: number,
  characterClass: keyof typeof CLASS_ENHANCEMENT_PRIORITIES,
  availableBudget: number
): EnhancementRecommendation | null {
  
  // Casters shouldn't enhance weapons
  if (['wizard', 'sorcerer', 'bard'].includes(characterClass)) {
    return null;
  }
  
  const recommendations = getWeaponRecommendationsForLevel(level);
  const classPrefs = CLASS_ENHANCEMENT_PRIORITIES[characterClass];
  
  // Filter by budget
  const affordable = recommendations.filter(rec => rec.totalCost <= availableBudget);
  if (affordable.length === 0) return null;
  
  // Prefer enhancements with class-preferred abilities
  const withPreferredAbility = affordable.filter(rec =>
    rec.specialAbilities.some(ability => {
      const abilityKey = typeof ability === 'string' ? ability : ability.key;
      return classPrefs.weaponAbilities.includes(abilityKey as any);
    })
  );
  
  if (withPreferredAbility.length > 0) {
    // Return highest cost (most powerful) within preferred abilities
    return withPreferredAbility.reduce((best, current) =>
      current.totalCost > best.totalCost ? current : best
    );
  }
  
  // Otherwise, return highest enhancement we can afford
  return affordable.reduce((best, current) =>
    current.totalCost > best.totalCost ? current : best
  );
}

/**
 * Get best shield enhancement option for a character
 * Avoids resistance conflicts with armor
 * 
 * @param level Character level
 * @param characterClass Character class
 * @param availableBudget Available gold for shield
 * @param armorEnhancement Armor enhancement (to avoid resistance conflicts)
 * @returns Best shield enhancement recommendation within budget
 */
export function getBestShieldEnhancementForCharacter(
  level: number,
  characterClass: keyof typeof CLASS_ENHANCEMENT_PRIORITIES,
  availableBudget: number,
  armorEnhancement: EnhancementRecommendation | null
): EnhancementRecommendation | null {
  
  // Some classes don't use shields
  if (['wizard', 'sorcerer', 'monk', 'barbarian'].includes(characterClass)) {
    return null; // These classes typically don't use shields
  }
  
  const recommendations = getShieldRecommendationsForLevel(level);
  
  // Filter by budget
  let affordable = recommendations.filter(rec => rec.totalCost <= availableBudget);
  if (affordable.length === 0) return null;
  
  // Filter out recommendations that conflict with armor resistances
  // Resistances don't stack, so if armor has fire resistance, shield shouldn't
  if (armorEnhancement) {
    affordable = affordable.filter(shieldRec => 
      !hasResistanceConflict(shieldRec.specialAbilities, armorEnhancement.specialAbilities)
    );
  }
  
  // Skip Fortification on shields (armor usually has it, and it doesn't stack)
  affordable = affordable.filter(rec => 
    !rec.specialAbilities.some(ability => {
      const abilityKey = typeof ability === 'string' ? ability : ability.key;
      return abilityKey === 'fortification';
    })
  );
  
  // Prefer shield-specific abilities (arrow catching, deflection, reflecting, animated)
  const shieldSpecificAbilities = ['arrowCatching', 'arrowDeflection', 'reflecting', 'animated', 'bashing'];
  const withShieldAbility = affordable.filter(rec =>
    rec.specialAbilities.some(ability => {
      const abilityKey = typeof ability === 'string' ? ability : ability.key;
      return shieldSpecificAbilities.includes(abilityKey);
    })
  );
  
  if (withShieldAbility.length > 0) {
    // Prefer higher-cost (more powerful) shield abilities
    return withShieldAbility.reduce((best, current) =>
      current.totalCost > best.totalCost ? current : best
    );
  }
  
  // Otherwise, return highest enhancement we can afford
  return affordable.reduce((best, current) =>
    current.totalCost > best.totalCost ? current : best
  );
}
/**
 * Get best armor enhancement option for a character
 */
export function getBestArmorEnhancementForCharacter(
  level: number,
  characterClass: keyof typeof CLASS_ENHANCEMENT_PRIORITIES,
  availableBudget: number
): EnhancementRecommendation | null {
  
  // Some casters don't use armor
  if (['wizard', 'sorcerer', 'monk'].includes(characterClass)) {
    return null;
  }
  
  const recommendations = getArmorRecommendationsForLevel(level);
  const classPrefs = CLASS_ENHANCEMENT_PRIORITIES[characterClass];
  
  // Filter by budget
  let affordable = recommendations.filter(rec => rec.totalCost <= availableBudget);
  if (affordable.length === 0) return null;
  
  // Filter out Wild armor for non-druids (it's druid-specific)
  if (characterClass !== 'druid') {
    affordable = affordable.filter(rec => 
      !rec.specialAbilities.some(ability => {
        const abilityKey = typeof ability === 'string' ? ability : ability.key;
        return abilityKey === 'wild';
      })
    );
  }
  
  // Druids MUST have Wild armor if they can afford it
  if (characterClass === 'druid') {
    const wildArmor = affordable.find(rec => 
      rec.specialAbilities.some(ability => {
        const abilityKey = typeof ability === 'string' ? ability : ability.key;
        return abilityKey === 'wild';
      })
    );
    if (wildArmor) return wildArmor;
  }
  
  // FORTIFICATION PRIORITY (critical for survivability!)
  // At level 14+, PRIORITIZE Heavy Fortification (100% crit immunity)
  if (level >= 14) {
    const heavyFort = affordable.find(rec => 
      rec.specialAbilities.some(ability => {
        if (typeof ability === 'string') return false;
        return ability.key === 'fortification' && ability.level === 3; // Heavy Fort
      })
    );
    if (heavyFort) {
      console.log(`Level ${level}: Prioritizing Heavy Fortification on armor!`);
      return heavyFort;
    }
  }
  
  // At level 11+, prioritize Moderate Fortification (75% crit negation)
  if (level >= 11) {
    const moderateFort = affordable.find(rec => 
      rec.specialAbilities.some(ability => {
        if (typeof ability === 'string') return false;
        return ability.key === 'fortification' && ability.level === 2; // Moderate Fort
      })
    );
    if (moderateFort) {
      console.log(`Level ${level}: Prioritizing Moderate Fortification on armor!`);
      return moderateFort;
    }
  }
  
  // At level 8+, prioritize Light Fortification (25% crit negation)
  if (level >= 8) {
    const lightFort = affordable.find(rec => 
      rec.specialAbilities.some(ability => {
        if (typeof ability === 'string') return false;
        return ability.key === 'fortification' && ability.level === 1; // Light Fort
      })
    );
    if (lightFort) {
      console.log(`Level ${level}: Prioritizing Light Fortification on armor!`);
      return lightFort;
    }
  }
  
  // Prefer enhancements with class-preferred abilities
  const withPreferredAbility = affordable.filter(rec =>
    rec.specialAbilities.some(ability => {
      const abilityKey = typeof ability === 'string' ? ability : ability.key;
      return (classPrefs.armorAbilities as readonly string[]).includes(abilityKey);
    })
  );
  
  if (withPreferredAbility.length > 0) {
    return withPreferredAbility.reduce((best, current) =>
      current.totalCost > best.totalCost ? current : best
    );
  }
  
  // Otherwise, return highest enhancement we can afford
  return affordable.reduce((best, current) =>
    current.totalCost > best.totalCost ? current : best
  );
}
