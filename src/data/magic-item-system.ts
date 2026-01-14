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
  AMULET_OF_MIGHTY_FISTS,
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
 * 
 * CASTER TYPES:
 * - pureCaster (Wizard/Sorcerer): Skip weapons, redirect to rods/staves. Skip armor (arcane spell failure).
 * - divineCaster (Cleric/Druid): Skip weapons, can wear armor. Redirect weapon budget to rods/staves.
 * - caster (Bard, other): Original caster allocation.
 */
export const MAGIC_ITEM_BUDGET_ALLOCATION = {
  martial: {
    weapon: 0.38,      // 38% - Martials need GREAT weapons (increased from 32%)
    armor: 0.34,       // 34% - Martials need GREAT armor+shield (increased from 28%)
    statItem: 0.12,    // 12% - Stat booster
    resistance: 0.07,  // 7% - Cloak of Resistance
    protection: 0.07,  // 7% - Ring/Amulet
    consumables: 0.02, // 2% - Mostly potions (reduced to spend more on combat gear)
    rodsStaves: 0.00   // 0% - Martials don't use rods/staves
  },
  caster: {
    weapon: 0.22,      // 22% - Bards etc still use weapons somewhat
    armor: 0.22,       // 22% - Bards etc wear light armor
    statItem: 0.18,    // 18% - Stat boost is KEY for DCs
    resistance: 0.12,  // 12% - Saves are important
    protection: 0.10,  // 10% - AC helps fragile casters
    consumables: 0.16, // 16% - Wands/scrolls/potions
    rodsStaves: 0.00   // 0% - Generic casters use weapon budget
  },
  // PURE CASTERS (Wizard, Sorcerer): Can't use weapons or armor effectively
  // Redirect ALL weapon budget to rods/staves
  // Redirect armor budget to Bracers of Armor (handled in wondrous items)
  pureCaster: {
    weapon: 0.00,      // 0% - Don't waste gold on weapons they won't use
    armor: 0.00,       // 0% - Arcane spell failure - use Bracers of Armor instead
    statItem: 0.22,    // 22% - Mental stat is CRITICAL for spell DCs (boosted)
    resistance: 0.14,  // 14% - Saves are very important for squishy casters
    protection: 0.20,  // 20% - AC from Ring/Amulet/Bracers (boosted from 14% - casters NEED AC)
    consumables: 0.12, // 12% - Wands/scrolls/potions (reduced from 18% to fund bracers)
    rodsStaves: 0.32   // 32% - Metamagic rods and staffs (replaces weapon+armor)
  },
  // DIVINE CASTERS (Cleric, Druid): Can wear armor but don't need weapons
  // Redirect weapon budget to rods/staves, keep armor budget
  divineCaster: {
    weapon: 0.00,      // 0% - Divine casters don't need +5 weapons
    armor: 0.28,       // 28% - Can wear armor! (increased from caster)
    statItem: 0.18,    // 18% - Wisdom for DCs
    resistance: 0.12,  // 12% - Saves
    protection: 0.10,  // 10% - Ring/Amulet
    consumables: 0.12, // 12% - Wands/scrolls/potions (less than pure caster)
    rodsStaves: 0.20   // 20% - Rods and staves (replaces weapon budget)
  },
  // Paladins/Rangers: martial combat prowess + divine casting
  // Need high weapon/armor but also wands/scrolls/potions
  partialCasterMartial: {
    weapon: 0.38,      // 38% - Frontline combatants need great weapons
    armor: 0.34,       // 34% - Frontline combatants need great armor
    statItem: 0.12,    // 12% - Stat booster (Cha for Paladin, Wis for Ranger)
    resistance: 0.06,  // 6% - Cloak of Resistance (slightly reduced)
    protection: 0.04,  // 4% - Ring/Amulet (slightly reduced)
    consumables: 0.06, // 6% - Wands/scrolls/potions (3x more than pure martial)
    rodsStaves: 0.00   // 0% - Paladins/Rangers use weapons, not rods
  },
  // MONKS: Unique unarmed fighters who need Amulet of Mighty Fists instead of weapons
  // No armor (loses AC bonus), need Bracers of Armor for armor bonus
  // Multiple stat dependencies: STR (attack/damage), DEX (AC), WIS (AC)
  // Neck slot conflict: Amulet of Mighty Fists > Periapt of Wisdom > Amulet of Natural Armor
  // 
  // Monks have specific item needs with caps, but percentages ensure best-in-slot at each level:
  // - Mighty Fists: +1 (6k) to +5 (150k) - primary offense
  // - Belt/Gloves: +2 (4k) to +6 (36k each) - STR for damage, DEX for AC
  // - Ring: +1 (2k) to +5 (50k), Bracers: +1 (1k) to +8 (64k) - AC
  // - Cloak: +1 (1k) to +5 (25k) - saves
  // At high levels, monks naturally have leftover gold (frugal living is thematic!)
  monk: {
    weapon: 0.00,      // 0% - Monks use unarmed strikes, not weapons
    armor: 0.00,       // 0% - Monks lose AC bonus if wearing armor
    mightyFists: 0.30, // 30% - Amulet of Mighty Fists (primary offense, expensive!)
    statItem: 0.25,    // 25% - Belt of STR + Gloves of DEX (both important)
    protection: 0.25,  // 25% - Ring of Protection + Bracers of Armor (main AC sources)
    resistance: 0.08,  // 8% - Cloak of Resistance
    consumables: 0.12, // 12% - Potions (standard martial amount)
    rodsStaves: 0.00   // 0% - Monks don't use rods/staves
  },
  
  // ==========================================================================
  // CLERIC VARIANTS: Melee vs Caster focus
  // Both can wear heavy armor, use shields, and need Periapt of Wisdom
  // ==========================================================================
  
  // CLERIC (MELEE): Battle cleric with weapon and shield focus
  // Like a martial but with WIS stat item and some utility casting
  clericMelee: {
    weapon: 0.30,      // 30% - Good weapon enhancement (+3 to +4)
    armor: 0.32,       // 32% - Heavy armor + shield (shield can have abilities!)
    statItem: 0.15,    // 15% - Periapt of Wisdom for spell DCs
    resistance: 0.08,  // 8% - Cloak of Resistance
    protection: 0.07,  // 7% - Ring of Protection (no amulet - neck has periapt)
    consumables: 0.08, // 8% - Wands/scrolls/potions for utility
    rodsStaves: 0.00   // 0% - Battle clerics use weapons, not rods
  },
  
  // CLERIC (CASTER): Spell-focused cleric with metamagic rods
  // Still wears armor (no spell failure), but focuses on spellcasting
  clericCaster: {
    weapon: 0.00,      // 0% - Caster clerics don't focus on melee
    armor: 0.28,       // 28% - Still wear armor (no arcane spell failure!)
    statItem: 0.18,    // 18% - Periapt of Wisdom is crucial for DCs
    resistance: 0.12,  // 12% - Saves matter for frontline casters
    protection: 0.10,  // 10% - Ring of Protection
    consumables: 0.12, // 12% - Wands/scrolls/potions
    rodsStaves: 0.20   // 20% - Metamagic rods for Extend/Maximize buffs
  },
  
  // ==========================================================================
  // DRUID VARIANTS: Wildshape vs Caster focus
  // Both limited to non-metal armor (hide, leather, dragonhide)
  // ==========================================================================
  
  // DRUID (WILDSHAPE): Melee via animal forms
  // Like monks - need Amulet of Mighty Fists for natural attacks!
  // Wild armor is expensive but worth it
  druidWildshape: {
    weapon: 0.00,      // 0% - Use claws/bites in wildshape, not weapons
    armor: 0.20,       // 20% - Wild armor (melds with form) - dragonhide if possible
    mightyFists: 0.28, // 28% - Amulet of Mighty Fists for natural attacks!
    statItem: 0.18,    // 18% - Periapt of Wisdom for spells + Wild Empathy
    protection: 0.12,  // 12% - Ring + natural armor varies by form
    resistance: 0.10,  // 10% - Saves
    consumables: 0.12, // 12% - Potions work in wildshape!
    rodsStaves: 0.00   // 0% - Can't use rods in animal form
  },
  
  // DRUID (CASTER): Spell-focused druid with summons/control
  // Non-metal armor, metamagic rods for Extend/Empower summons
  druidCaster: {
    weapon: 0.00,      // 0% - Caster druids don't focus on weapons
    armor: 0.22,       // 22% - Non-metal armor (hide, dragonhide)
    statItem: 0.20,    // 20% - Periapt of Wisdom is critical
    resistance: 0.12,  // 12% - Saves
    protection: 0.10,  // 10% - Ring/Amulet (can use amulet if no mighty fists)
    consumables: 0.14, // 14% - Wands/scrolls/potions for utility
    rodsStaves: 0.22   // 22% - Extend rod for summons, Empower for damage spells
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

// Import rod/staff types
import {
  RodRecommendation,
  StaffRecommendation,
  selectCasterItems,
  isPureCaster,
  skipArmorEnhancements,
  isDivineCaster
} from './rod-staff-recommendations';

export interface MagicItemSelection {
  weaponEnhancement: { bonus: number; abilities: string[] } | null;
  secondaryWeaponEnhancement: { bonus: number; abilities: string[] } | null;  // For backup/off-hand weapons
  armorEnhancement: { bonus: number; abilities: (string | EnhancementAbility)[] } | null;
  shieldEnhancement: { bonus: number; abilities: (string | EnhancementAbility)[] } | null;  // Shield enhancements (uses armor mechanics)
  wondrousItems: WondrousItemDefinition[];
  hasHandyHaversack: boolean;  // Flag to create custom Handy Haversack (not in compendium)
  hasScarabOfProtection: boolean;  // Flag to create custom Scarab of Protection (D35E compendium missing SR 20)
  wands: WandRecommendation[];  // Wands for casters
  scrolls: ScrollRecommendation[];  // Scrolls for casters
  potions: PotionRecommendation[];  // Potions for everyone
  // NEW: Caster-specific items (rods and staves)
  rods: RodRecommendation[];  // Metamagic rods for casters
  staff: StaffRecommendation | null;  // Staff for casters
  weaponCost: number;
  secondaryWeaponCost: number;  // Cost of secondary weapon enhancement
  armorCost: number;
  shieldCost: number;  // Cost of shield enhancement
  wondrousCost: number;
  wandsCost: number;  // Cost of wands
  scrollsCost: number;  // Cost of scrolls
  potionsCost: number;  // Cost of potions
  rodsCost: number;  // Cost of metamagic rods
  staffCost: number;  // Cost of staff
  totalCost: number;
  overspend: number;  // Amount spent over budget (e.g., Staff of Power special purchase), deduct from final gold
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
 * @param strScore - Character's STR score (used to determine if Bag of Holding is appropriate)
 * @param hasShield - Whether the character's starting kit has a shield (used to detect melee vs caster build)
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
  },
  strScore: number = 10,
  hasShield: boolean = false  // From template.startingKit.shield
): Promise<MagicItemSelection> {
  console.log(`\n=== MAGIC ITEM SELECTION ===`);
  console.log(`Level: ${level}, Class: ${characterClass}, Budget: ${totalBudget} gp, STR: ${strScore}`);

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
      hasScarabOfProtection: false,
      wands: [],
      scrolls: [],
      potions: [],
      rods: [],
      staff: null,
      weaponCost: 0,
      secondaryWeaponCost: 0,
      armorCost: 0,
      shieldCost: 0,
      wondrousCost: 0,
      wandsCost: 0,
      scrollsCost: 0,
      potionsCost: 0,
      rodsCost: 0,
      staffCost: 0,
      totalCost: 0,
      overspend: 0
    };
  }

  // Determine class type for budget allocation
  const classType = getClassType(characterClass);
  
  // Determine budget type based on class
  // - Monks: Unique unarmed fighters, need Amulet of Mighty Fists
  // - Pure casters (wizard/sorcerer): Skip weapons entirely, use rods/staves
  // - Divine casters (cleric/druid): Skip weapons, but can wear armor
  // - Partial caster martials (paladin/ranger): Frontline fighters who can cast
  // - Martials: Pure weapon/armor focus
  // - Generic casters (bard): Some weapon use
  const normalizedClassLower = characterClass.toLowerCase();
  const isMonk = normalizedClassLower === 'monk';
  const isPaladinOrRanger = normalizedClassLower === 'paladin' || normalizedClassLower === 'ranger';
  const isPure = isPureCaster(characterClass);
  const isDivine = isDivineCaster(characterClass);
  const isMartial = classType === 'martial' || isPaladinOrRanger;
  
  // Select budget allocation based on class type
  // Use generic type to allow different budget configurations
  let budgetAllocation: {
    weapon: number;
    armor: number;
    statItem: number;
    resistance: number;
    protection: number;
    consumables: number;
    rodsStaves: number;
    mightyFists?: number;  // Monks and wildshape druids
  };
  let budgetTypeName: string;
  let usesMightyFists = false;  // Track whether this build uses Amulet of Mighty Fists
  
  if (isMonk) {
    budgetAllocation = MAGIC_ITEM_BUDGET_ALLOCATION.monk;
    budgetTypeName = 'Monk (Unarmed Fighter)';
    usesMightyFists = true;
  } else if (isPure) {
    budgetAllocation = MAGIC_ITEM_BUDGET_ALLOCATION.pureCaster;
    budgetTypeName = 'Pure Caster (Wizard/Sorcerer)';
  } else if (normalizedClassLower === 'cleric') {
    // CLERIC BUILD DETECTION: Shield in kit = War Cleric, No shield = Caster Cleric
    // Similar to how ranger combat style is detected from weapon loadout
    if (hasShield) {
      budgetAllocation = MAGIC_ITEM_BUDGET_ALLOCATION.clericMelee;
      budgetTypeName = 'Cleric (Battle/Melee)';
      console.log(`🛡️ CLERIC BUILD: Battle Cleric (has shield) - focusing on weapon + armor`);
    } else {
      budgetAllocation = MAGIC_ITEM_BUDGET_ALLOCATION.clericCaster;
      budgetTypeName = 'Cleric (Caster)';
      console.log(`📖 CLERIC BUILD: Caster Cleric (no shield) - focusing on spells + metamagic rods`);
    }
  } else if (normalizedClassLower === 'druid') {
    // DRUID BUILD DETECTION: Shield in kit = Wildshape Druid, No shield = Caster Druid
    // Wildshape druids need Amulet of Mighty Fists for their natural attacks!
    if (hasShield) {
      budgetAllocation = MAGIC_ITEM_BUDGET_ALLOCATION.druidWildshape;
      budgetTypeName = 'Druid (Wildshape)';
      usesMightyFists = true;  // Wildshape druids use Mighty Fists for natural attacks!
      console.log(`🐻 DRUID BUILD: Wildshape Druid (has shield) - focusing on Amulet of Mighty Fists`);
    } else {
      budgetAllocation = MAGIC_ITEM_BUDGET_ALLOCATION.druidCaster;
      budgetTypeName = 'Druid (Caster)';
      console.log(`🌿 DRUID BUILD: Caster Druid (no shield) - focusing on summons + metamagic rods`);
    }
  } else if (isDivine) {
    // Fallback for any other divine casters (shouldn't happen with current classes)
    budgetAllocation = MAGIC_ITEM_BUDGET_ALLOCATION.clericCaster;
    budgetTypeName = 'Divine Caster';
  } else if (isPaladinOrRanger) {
    budgetAllocation = MAGIC_ITEM_BUDGET_ALLOCATION.partialCasterMartial;
    budgetTypeName = 'Partial Caster Martial (Paladin/Ranger)';
  } else if (isMartial) {
    budgetAllocation = MAGIC_ITEM_BUDGET_ALLOCATION.martial;
    budgetTypeName = 'Martial';
  } else {
    budgetAllocation = MAGIC_ITEM_BUDGET_ALLOCATION.caster;
    budgetTypeName = 'Caster (Bard)';
  }
  
  // ==========================================================================
  // SELF-INVESTMENT DECISION (Level 5+)
  // 50% chance to spend extra on weapons, armor, or rods/staves
  // Investment amount: 75% of expected leftover (conservatively estimated at 15% of wealth)
  // ==========================================================================
  let investmentOverspend = 0;
  let investmentTarget: 'weapon' | 'armor' | 'rodsStaves' | 'none' = 'none';
  
  if (level >= 5) {
    const wantsToInvest = Math.random() < 0.50;
    
    if (wantsToInvest) {
      // Conservative estimate: 15% of budget typically left over
      // Investment uses 75% of that = 11.25% of total budget
      investmentOverspend = Math.floor(totalBudget * 0.15 * 0.75);
      
      // Determine target based on class type (B3: random selection)
      if (isPure) {
        // Pure casters (Wizard/Sorcerer): 100% to rods/staves
        investmentTarget = 'rodsStaves';
      } else if (isDivine) {
        // Divine casters (Cleric/Druid): 50/50 armor or rods/staves
        investmentTarget = Math.random() < 0.50 ? 'armor' : 'rodsStaves';
      } else {
        // Martials (Fighter, Barbarian, Paladin, Ranger, etc.): 50/50 weapon or armor
        investmentTarget = Math.random() < 0.50 ? 'weapon' : 'armor';
      }
      
      console.log(`💰 SELF-INVESTMENT: Spending ${investmentOverspend} gp extra on ${investmentTarget}!`);
    } else {
      console.log(`Level ${level}: Decided to save gold rather than invest in gear.`);
    }
  }
  
  // Calculate investment boosts for each category
  const weaponBudgetBoost = investmentTarget === 'weapon' ? investmentOverspend : 0;
  const armorBudgetBoost = investmentTarget === 'armor' ? investmentOverspend : 0;
  const rodsStavesBudgetBoost = investmentTarget === 'rodsStaves' ? investmentOverspend : 0;
  
  // Calculate rod/staff budget for casters (before weapon/armor, so we can skip them)
  const rodsStavesBudget = Math.floor(totalBudget * budgetAllocation.rodsStaves) + rodsStavesBudgetBoost;
  
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
  
  // Allocate budget based on class type and level adjustments (+ investment boosts)
  const weaponBudget = Math.floor(totalBudget * adjustedWeaponPercent) + weaponBudgetBoost;
  const armorBudget = Math.floor(totalBudget * adjustedArmorPercent) + armorBudgetBoost;
  const statItemBudget = Math.floor(totalBudget * budgetAllocation.statItem);
  const resistanceBudget = Math.floor(totalBudget * budgetAllocation.resistance);
  const protectionBudget = Math.floor(totalBudget * budgetAllocation.protection);
  const consumablesBudget = Math.floor(totalBudget * budgetAllocation.consumables);
  
  // MONK/WILDSHAPE DRUID: Amulet of Mighty Fists budget (replaces weapon budget)
  const mightyFistsBudget = usesMightyFists ? Math.floor(totalBudget * (budgetAllocation.mightyFists || 0)) : 0;
  
  // Split consumables budget by class type
  const consumableSplit = CONSUMABLE_SPLITS[classType];
  const wandsBudget = Math.floor(consumablesBudget * consumableSplit.wands);
  const scrollsBudget = Math.floor(consumablesBudget * consumableSplit.scrolls);
  const potionsBudget = Math.floor(consumablesBudget * consumableSplit.potions);

  console.log(`Budget Type: ${budgetTypeName} (${classType})`);
  if (usesMightyFists) {
    console.log(`Mighty Fists Budget: ${mightyFistsBudget} gp (${((budgetAllocation.mightyFists || 0) * 100).toFixed(0)}%)`);
  } else {
    console.log(`Weapon Budget: ${weaponBudget} gp (${(budgetAllocation.weapon * 100).toFixed(0)}%)`);
  }
  console.log(`Armor Budget: ${armorBudget} gp (${(budgetAllocation.armor * 100).toFixed(0)}%)`);
  console.log(`Rods/Staves Budget: ${rodsStavesBudget} gp (${(budgetAllocation.rodsStaves * 100).toFixed(0)}%)`);
  console.log(`Stat Item Budget: ${statItemBudget} gp (${(budgetAllocation.statItem * 100).toFixed(0)}%)`);
  console.log(`Resistance Budget: ${resistanceBudget} gp (${(budgetAllocation.resistance * 100).toFixed(0)}%)`);
  console.log(`Protection Budget: ${protectionBudget} gp (${(budgetAllocation.protection * 100).toFixed(0)}%)`);
  console.log(`Consumables Budget: ${consumablesBudget} gp (${(budgetAllocation.consumables * 100).toFixed(0)}%)`);
  console.log(`  Wands: ${wandsBudget} gp (${(consumableSplit.wands * 100).toFixed(0)}% of consumables)`);
  console.log(`  Scrolls: ${scrollsBudget} gp (${(consumableSplit.scrolls * 100).toFixed(0)}% of consumables)`);
  console.log(`  Potions: ${potionsBudget} gp (${(consumableSplit.potions * 100).toFixed(0)}% of consumables)`);

  // Get recommendations from the enhancement-recommendations system
  const normalizedClass = normalizeClassName(characterClass);
  
  // Weapon selection logic:
  // - Pure casters (wizard/sorcerer): weapon budget 0%, select rods/staves
  // - Caster clerics/druids: weapon budget 0%, select rods/staves
  // - Battle clerics: weapon budget 30%, get weapon enhancement
  // - Wildshape druids: weapon budget 0%, use Amulet of Mighty Fists
  // - Monks: weapon budget 0%, use Amulet of Mighty Fists
  // - Martials: weapon budget 30-38%, get weapon enhancement
  let weaponRec = null;
  let casterItemSelection = null;
  
  // Check if this build uses rods/staves instead of weapons
  const usesRodsStaves = budgetAllocation.rodsStaves > 0;
  
  if (isPure || (usesRodsStaves && !usesMightyFists)) {
    // Pure casters or caster-focused divine casters get rods/staves
    console.log(`${budgetTypeName}: Skipping weapon enhancements, selecting rods/staves instead`);
    casterItemSelection = selectCasterItems(level, rodsStavesBudget, characterClass);
  } else if (usesMightyFists) {
    // Monks and wildshape druids use Amulet of Mighty Fists instead of weapons
    console.log(`${budgetTypeName}: Skipping weapon enhancements, using Amulet of Mighty Fists instead`);
  } else if (weaponBudget > 0) {
    // Battle clerics, martials, partial casters with weapon budget
    console.log(`DEBUG: Normalized class for weapon selection: ${normalizedClass}, budget: ${weaponBudget} gp`);
    weaponRec = getBestWeaponEnhancementForCharacter(level, normalizedClass, weaponBudget);
    console.log(`DEBUG: Weapon recommendation result: ${weaponRec ? `+${weaponRec.enhancementBonus} (${weaponRec.totalCost} gp)` : 'NULL'}`);
  } else {
    console.log(`${budgetTypeName}: No weapon budget allocated`);
  }
  
  // Calculate armor/shield budget split FIRST
  // At high levels (17+), give shields MORE budget for expensive abilities like Reflecting
  // These can be overridden by template.magicItemBudgets
  // PURE CASTERS: Skip armor entirely (arcane spell failure), they use Bracers of Armor
  // MONKS: Skip armor entirely (lose AC bonus), they use Bracers of Armor
  const skipArmor = isPure || isMonk;
  const shieldBudgetPercent = templateBudgets?.shieldPercent ?? (level >= 17 ? 0.50 : 0.40);
  const armorBudgetPercent = templateBudgets?.armorPercent ?? (level >= 17 ? 0.50 : 0.60);
  const shieldBudget = skipArmor ? 0 : Math.floor(armorBudget * shieldBudgetPercent);
  const armorOnlyBudget = skipArmor ? 0 : Math.floor(armorBudget * armorBudgetPercent);
  
  if (templateBudgets?.shieldPercent !== undefined || templateBudgets?.armorPercent !== undefined) {
    console.log(`Using template budget overrides: Shield ${(shieldBudgetPercent * 100).toFixed(0)}%, Armor ${(armorBudgetPercent * 100).toFixed(0)}%`);
  }
  
  if (isPure) {
    console.log(`${budgetTypeName}: Skipping armor enhancements (arcane spell failure). Will use Bracers of Armor from wondrous items.`);
  } else if (isMonk) {
    console.log(`${budgetTypeName}: Skipping armor enhancements (lose AC bonus). Will use Bracers of Armor from wondrous items.`);
  }
  
  // Get armor enhancement first (needed for shield conflict checking)
  // Skip for pure casters and monks who can't wear armor
  const armorRec = skipArmor ? null : getBestArmorEnhancementForCharacter(level, normalizedClass, armorOnlyBudget);
  
  // Shield enhancement (gets 40% of armor budget, armor gets 60%)
  // Shields are prioritized BEFORE secondary weapons
  // Shields use armor enhancement mechanics (same as armor)
  // IMPORTANT: Pass armorRec to avoid resistance conflicts!
  // Skip for pure casters and monks
  const shieldRec = (skipArmor || level < 4) 
    ? null 
    : getBestShieldEnhancementForCharacter(level, normalizedClass, shieldBudget, armorRec);
  
  // Secondary weapon enhancement (50% of primary weapon budget)
  // Used for backup weapons, off-hand weapons, or two-weapon fighting builds
  // This comes AFTER shields as per user's priority requirement
  // Can be overridden by template.magicItemBudgets
  // Skip for pure casters, divine casters (they use rods/staves instead), and monks
  const secondaryWeaponPercent = templateBudgets?.secondaryWeaponPercent ?? 0.50;
  const secondaryWeaponBudget = Math.floor(weaponBudget * secondaryWeaponPercent);
  const secondaryWeaponRec = (isPure || isDivine || isMonk || level < 5) 
    ? null
    : getBestWeaponEnhancementForCharacter(level, normalizedClass, secondaryWeaponBudget);

  // Calculate actual costs
  const weaponCost = weaponRec ? calculateWeaponEnhancementCost(
    weaponRec.enhancementBonus,
    weaponRec.specialAbilities as string[]
  ) : 0;

  const secondaryWeaponCost = secondaryWeaponRec ? calculateWeaponEnhancementCost(
    secondaryWeaponRec.enhancementBonus,
    secondaryWeaponRec.specialAbilities as string[]
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
    templateBudgets,
    strScore,  // Pass STR to filter Bag of Holding by weight capacity
    mightyFistsBudget,  // For monks/wildshape druids: Amulet of Mighty Fists
    usesMightyFists  // Flag: this build uses Amulet of Mighty Fists
  );

  const wondrousItems = wondrousResult.wondrousItems;
  const hasHandyHaversack = wondrousResult.hasHandyHaversack;
  const hasScarabOfProtection = wondrousResult.hasScarabOfProtection;
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

  // Calculate rod/staff costs
  const rodsCost = casterItemSelection?.rodsCost ?? 0;
  const staffCost = casterItemSelection?.staffCost ?? 0;
  
  if (casterItemSelection) {
    console.log(`\nRods:`);
    if (casterItemSelection.rods.length > 0) {
      for (const rodRec of casterItemSelection.rods) {
        console.log(`  ${rodRec.rod.name} (${rodRec.rod.price} gp) - ${rodRec.reasoning}`);
      }
    } else {
      console.log(`  None (insufficient budget or level)`);
    }
    
    console.log(`\nStaff:`);
    if (casterItemSelection.staff) {
      console.log(`  ${casterItemSelection.staff.staff.name} (${casterItemSelection.staff.staff.price} gp) - ${casterItemSelection.staff.reasoning}`);
    } else {
      console.log(`  None (insufficient budget or level)`);
    }
  }

  const totalCost = weaponCost + secondaryWeaponCost + armorCost + shieldCost + wondrousCost + wandsCost + scrollsCost + potionsCost + rodsCost + staffCost;
  // Get overspend from caster items (e.g., Staff of Power special purchase)
  // NOTE: investmentOverspend is NOT added here - it's already reflected in the higher
  // category budgets and thus already included in the item costs above.
  // Only special purchase overspend (items that exceed even the boosted budget) counts.
  const casterOverspend = casterItemSelection?.overspend ?? 0;
  const overspend = casterOverspend;  // Only special purchase overspend, NOT investment
  
  console.log(`\nTotal Magic Item Cost: ${totalCost} gp`);
  if (investmentOverspend > 0) {
    console.log(`💰 Self-investment: ${investmentOverspend} gp added to ${investmentTarget} budget (already included in costs above)`);
  }
  if (casterOverspend > 0) {
    console.log(`⚠️ Special purchase overspend: ${casterOverspend} gp (will be deducted from final gold)`);
  }
  if (overspend > 0) {
    console.log(`📊 Total overspend: ${overspend} gp (will be deducted from final gold)`);
  }
  console.log(`Remaining Budget: ${totalBudget - totalCost} gp`);
  console.log(`=== MAGIC ITEM SELECTION COMPLETE ===\n`);

  return {
    weaponEnhancement: weaponRec ? {
      bonus: weaponRec.enhancementBonus,
      abilities: weaponRec.specialAbilities as string[]  // Type assertion for legacy compatibility
    } : null,
    secondaryWeaponEnhancement: secondaryWeaponRec ? {
      bonus: secondaryWeaponRec.enhancementBonus,
      abilities: secondaryWeaponRec.specialAbilities as string[]  // Type assertion for legacy compatibility
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
    hasScarabOfProtection,
    wands: wandSelection.wands,
    scrolls: scrollSelection.scrolls,
    potions: potionSelection.potions,
    rods: casterItemSelection?.rods ?? [],
    staff: casterItemSelection?.staff ?? null,
    weaponCost,
    secondaryWeaponCost,
    armorCost,
    shieldCost,
    wondrousCost,
    wandsCost,
    scrollsCost,
    potionsCost,
    rodsCost,
    staffCost,
    totalCost,
    overspend
  };
}

/**
 * Select wondrous items (Big Six) based on class, level, and available budgets
 * Returns both the wondrous items array and a flag for custom Handy Haversack
 * @param strScore - Character's STR score (used to determine if Bag of Holding is appropriate)
 * @param mightyFistsBudget - Budget for Amulet of Mighty Fists (monks and wildshape druids)
 * @param usesMightyFists - Whether this build uses Amulet of Mighty Fists
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
    bracersPercent?: number;
  },
  strScore: number = 10,
  mightyFistsBudget: number = 0,  // Monks and wildshape druids: Amulet of Mighty Fists budget
  usesMightyFists: boolean = false  // Whether this build uses Mighty Fists (monk or wildshape druid)
): { wondrousItems: WondrousItemDefinition[]; hasHandyHaversack: boolean; hasScarabOfProtection: boolean } {
  const selectedItems: WondrousItemDefinition[] = [];
  let spentBudget = 0;
  const totalBudget = statItemBudget + resistanceBudget + protectionBudget + mightyFistsBudget;
  let hasScarabOfProtection = false;
  const isMonk = characterClass === 'monk';

  // Get class priorities from wondrous-items.ts
  const priorities = BIG_SIX_PRIORITIES[characterClass] || BIG_SIX_PRIORITIES.fighter;

  // ========== AMULET OF MIGHTY FISTS (Monks & Wildshape Druids) ==========
  // This is THE signature item for unarmed/natural attack builds
  // Uses neck slot, so these builds can't use Periapt or Amulet of Natural Armor
  if (usesMightyFists && mightyFistsBudget >= 6000) {
    const buildType = isMonk ? 'Monk' : 'Wildshape Druid';
    console.log(`\n${buildType} Amulet of Mighty Fists Selection:`);
    console.log(`  Budget: ${mightyFistsBudget} gp`);
    const mightyFists = getBestAffordableBonus('mighty-fists', mightyFistsBudget);
    if (mightyFists) {
      selectedItems.push(mightyFists);
      spentBudget += mightyFists.price;
      const attackType = isMonk ? 'unarmed strikes' : 'natural attacks (claws/bites)';
      console.log(`  ✓ Added ${mightyFists.name} (${mightyFists.price} gp) - Enhancement to ${attackType}!`);
      console.log(`    NOTE: Uses neck slot - no Periapt or Amulet of Natural Armor!`);
    }
  }

  // ========== BIG SIX PRIORITY ITEMS ==========

  // 1. Stat Item (based on class primary stat)
  // - STR for martials via belt/gauntlets
  // - INT for wizards via headband
  // - WIS for clerics/druids via periapt (neck slot - competes with amulet!)
  // - CHA for sorcerers/bards/paladins via cloak of charisma (shoulders slot - competes with cloak of resistance!)
  // - DEX for rangers via gloves (hands slot - no conflicts)
  // - MONKS: Get BOTH Belt (STR) AND Gloves (DEX) from their expanded stat budget!
  if (statItemBudget >= 4000) {
    const usesBelt = (priorities as readonly string[]).includes('belt');
    const usesHeadband = (priorities as readonly string[]).includes('headband');
    const usesPeriapt = (priorities as readonly string[]).includes('periapt');
    const usesCharismaCloak = (priorities as readonly string[]).includes('charisma-cloak');
    const usesGloves = (priorities as readonly string[]).includes('gloves');
    
    // MONKS: Special handling - they need BOTH Belt (STR) AND Gloves (DEX)
    // Split their stat budget: 55% Belt (STR more important for damage), 45% Gloves
    if (isMonk && usesBelt && usesGloves) {
      console.log(`\nMonk Stat Items (Belt + Gloves):`);
      const beltBudget = Math.floor(statItemBudget * 0.55);
      const glovesBudget = Math.floor(statItemBudget * 0.45);
      console.log(`  Belt Budget (STR): ${beltBudget} gp (55%)`);
      console.log(`  Gloves Budget (DEX): ${glovesBudget} gp (45%)`);
      
      // Belt of Giant Strength for attack/damage
      const belt = getBestAffordableBonus('belt', beltBudget);
      if (belt) {
        selectedItems.push(belt);
        spentBudget += belt.price;
        console.log(`  ✓ Added ${belt.name} (${belt.price} gp) - STR for unarmed attack/damage`);
      } else if (beltBudget >= 4000) {
        selectedItems.push(GAUNTLETS_OF_OGRE_POWER);
        spentBudget += GAUNTLETS_OF_OGRE_POWER.price;
        console.log(`  ✓ Added Gauntlets of Ogre Power (4000 gp) - STR +2`);
      }
      
      // Gloves of Dexterity for AC and initiative
      const gloves = getBestAffordableBonus('gloves', glovesBudget);
      if (gloves) {
        selectedItems.push(gloves);
        spentBudget += gloves.price;
        console.log(`  ✓ Added ${gloves.name} (${gloves.price} gp) - DEX for AC & initiative`);
      }
    } else if (usesBelt) {
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
      // Headband of Intellect for wizards
      const headband = getBestAffordableBonus('headband', statItemBudget);
      if (headband) {
        selectedItems.push(headband);
        spentBudget += headband.price;
      }
    } else if (usesGloves) {
      // Gloves of Dexterity for rangers (DEX for ranged attacks and AC)
      const gloves = getBestAffordableBonus('gloves', statItemBudget);
      if (gloves) {
        selectedItems.push(gloves);
        spentBudget += gloves.price;
        console.log(`  ✓ Added Gloves of Dexterity: ${gloves.name} (${gloves.price} gp) - DEX for ranged attacks & AC`);
      }
    } else if (usesPeriapt) {
      // Periapt of Wisdom for clerics, druids
      // NOTE: This uses the neck slot, which competes with Amulet of Natural Armor!
      const periapt = getBestAffordableBonus('periapt', statItemBudget);
      if (periapt) {
        selectedItems.push(periapt);
        spentBudget += periapt.price;
        console.log(`  ✓ Added Periapt of Wisdom: ${periapt.name} (${periapt.price} gp) - WIS for spell DCs`);
        console.log(`    NOTE: Uses neck slot - no Amulet of Natural Armor!`);
      }
    } else if (usesCharismaCloak) {
      // Cloak of Charisma for sorcerers, bards, paladins
      // NOTE: This uses the shoulders slot, which competes with Cloak of Resistance!
      const charismaCloak = getBestAffordableBonus('charisma-cloak', statItemBudget);
      if (charismaCloak) {
        selectedItems.push(charismaCloak);
        spentBudget += charismaCloak.price;
        console.log(`  ✓ Added Cloak of Charisma: ${charismaCloak.name} (${charismaCloak.price} gp) - CHA for spell DCs`);
        console.log(`    NOTE: Uses shoulders slot - no Cloak of Resistance!`);
      }
    }
  }

  // 2. Cloak of Resistance (+saves) - SKIP if class already has Cloak of Charisma
  const hasCharismaCloak = selectedItems.some(item => item.name.includes('Cloak of Charisma'));
  if (resistanceBudget >= 1000 && !hasCharismaCloak) {
    const cloak = getBestAffordableBonus('cloak', resistanceBudget);
    if (cloak) {
      selectedItems.push(cloak);
      spentBudget += cloak.price;
    }
  } else if (hasCharismaCloak) {
    console.log(`  SKIPPED Cloak of Resistance - already has Cloak of Charisma in shoulders slot`);
  }

  // 3. Ring of Protection, Amulet of Natural Armor, AND Bracers of Armor (pure casters only)
  // Split protection budget between ring, amulet, and bracers
  // Pure casters: 40% Ring, 30% Amulet, 30% Bracers
  // Monks: 50% Ring, 50% Bracers (no Amulet - neck slot used by Mighty Fists!)
  // Others: 60% Ring, 40% Amulet (no bracers, they wear actual armor)
  // Can be overridden by template.magicItemBudgets
  const isPure = isPureCaster(characterClass);
  const hasMightyFists = selectedItems.some(item => item.name.includes('Amulet of Mighty Fists'));
  
  // Monks: Split between Ring and Bracers only (no amulet due to neck conflict)
  let ringPercent: number;
  let amuletPercent: number;
  let bracersPercent: number;
  
  if (isMonk) {
    ringPercent = templateBudgets?.ringPercent ?? 0.50;
    amuletPercent = 0;  // Can't use - Mighty Fists occupies neck
    bracersPercent = templateBudgets?.bracersPercent ?? 0.50;
  } else if (isPure) {
    ringPercent = templateBudgets?.ringPercent ?? 0.4;
    amuletPercent = templateBudgets?.amuletPercent ?? 0.3;
    bracersPercent = templateBudgets?.bracersPercent ?? 0.3;
  } else {
    ringPercent = templateBudgets?.ringPercent ?? 0.6;
    amuletPercent = templateBudgets?.amuletPercent ?? 0.4;
    bracersPercent = templateBudgets?.bracersPercent ?? 0.0;
  }
  
  const ringBudget = Math.floor(protectionBudget * ringPercent);
  const amuletBudget = Math.floor(protectionBudget * amuletPercent);
  const bracersBudget = Math.floor(protectionBudget * bracersPercent);

  if (ringBudget >= 2000) {
    const ring = getBestAffordableBonus('ring', ringBudget);
    if (ring) {
      selectedItems.push(ring);
      spentBudget += ring.price;
    }
  }

  // Amulet of Natural Armor - SKIP if class already has Periapt of Wisdom or Amulet of Mighty Fists (both use neck slot)
  const hasPeriapt = selectedItems.some(item => item.name.includes('Periapt of Wisdom'));
  if (amuletBudget >= 2000 && !hasPeriapt && !hasMightyFists) {
    const amulet = getBestAffordableBonus('amulet', amuletBudget);
    if (amulet) {
      selectedItems.push(amulet);
      spentBudget += amulet.price;
    }
  } else if (hasPeriapt) {
    console.log(`  SKIPPED Amulet of Natural Armor - already has Periapt of Wisdom in neck slot`);
  } else if (hasMightyFists) {
    console.log(`  SKIPPED Amulet of Natural Armor - already has Amulet of Mighty Fists in neck slot`);
  }

  // Bracers of Armor for pure casters and monks (no armor wearing)
  if (bracersBudget >= 1000 && (isPure || isMonk)) {
    const bracerType = isMonk ? 'Monk' : 'Pure caster';
    console.log(`  Bracers Budget: ${bracersBudget} gp (${bracerType} AC)`);
    const bracers = getBestAffordableBonus('bracers', bracersBudget);
    if (bracers) {
      selectedItems.push(bracers);
      spentBudget += bracers.price;
      console.log(`  ✓ Added Bracers of Armor: ${bracers.name} (${bracers.price} gp) - ${bracerType} AC`);
    } else {
      console.log(`  ⚠ No bracers affordable with budget ${bracersBudget} gp`);
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
      // Pearls of Power - Buy ONE, the highest level affordable
      // Ordered from highest to lowest so we get the best one first
      { key: 'pearl-of-power-9', minLevel: 17 },      // 81k - 9th level spells (casters only)
      { key: 'pearl-of-power-8', minLevel: 15 },      // 64k - 8th level spells
      { key: 'pearl-of-power-7', minLevel: 13 },      // 49k - 7th level spells  
      { key: 'pearl-of-power-6', minLevel: 11 },      // 36k - 6th level spells
      { key: 'pearl-of-power-5', minLevel: 9 },       // 25k - 5th level spells
      { key: 'pearl-of-power-4', minLevel: 7 },       // 16k - 4th level spells
      { key: 'pearl-of-power-3', minLevel: 5 },       // 9k - 3rd level spells
      { key: 'pearl-of-power-2', minLevel: 3 },       // 4k - 2nd level spells
      { key: 'pearl-of-power-1', minLevel: 1 }        // 1k - 1st level spells
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

    // Remove pearls for non-casters (pearls require prepared spell slots)
    if (!isCaster) {
      affordableUtility = affordableUtility.filter(item => 
        !item.name.includes('Pearl of Power')
      );
    }
    
    // Remove Gloves of DEX for classes that use Periapt of Wisdom or already have stat gloves
    // Clerics/Druids use Periapt - they don't need DEX
    // Monks already have stat item budget for both Belt + Gloves
    // Rangers use Gloves from Big Six, so hands slot is filled
    const usesPeriapt = (priorities as readonly string[]).includes('periapt');
    const isWisdomCaster = ['cleric', 'druid'].includes(characterClass.toLowerCase());
    if (usesPeriapt || isWisdomCaster || isMonk) {
      affordableUtility = affordableUtility.filter(item => 
        !item.name.includes('Gloves of Dexterity')
      );
      if (usesPeriapt || isWisdomCaster) {
        console.log(`  Excluding Gloves of DEX: ${characterClass} uses Periapt of Wisdom instead`);
      }
    }

    // Buy utility items with remaining budget, respecting slot conflicts
    // Track special categories to prevent duplicates
    let utilityBudget = utilityBudgetAfterHaversack;
    let hasBagOfHolding = false;  // Only buy ONE bag of holding (highest affordable type)
    let hasPearlOfPower = false;  // Only buy ONE pearl of power (highest level affordable)
    
    // Bag of Holding weight requirements:
    // Type 1: 15 lbs (STR 10+), Type 2: 25 lbs (STR 12+), Type 3: 35 lbs (STR 12+), Type 4: 60 lbs (STR 14+)
    const canCarryBagType4 = strScore >= 14;  // 60 lbs
    const canCarryBagType3 = strScore >= 12;  // 35 lbs
    const canCarryBagType2 = strScore >= 12;  // 25 lbs
    const canCarryBagType1 = strScore >= 10;  // 15 lbs
    
    console.log(`  STR ${strScore}: Can carry Bag Type 4: ${canCarryBagType4}, Type 3: ${canCarryBagType3}, Type 2: ${canCarryBagType2}, Type 1: ${canCarryBagType1}`);
    
    for (const item of affordableUtility) {
      // Check slot conflict
      if (item.slot && item.slot !== 'slotless' && filledSlots.has(item.slot)) {
        continue; // Skip, slot already filled
      }
      
      // Only allow ONE bag of holding (the first affordable one in priority list is the highest type)
      // AND only if character's STR can handle the weight!
      if (item.name.includes('Bag of Holding')) {
        if (hasBagOfHolding) {
          continue; // Skip additional bags
        }
        
        // Check if character can carry this bag type
        const isBagType4 = item.name.includes('Type 4') || item.name.includes('Type IV');
        const isBagType3 = item.name.includes('Type 3') || item.name.includes('Type III');
        const isBagType2 = item.name.includes('Type 2') || item.name.includes('Type II');
        
        if (isBagType4 && !canCarryBagType4) {
          console.log(`  SKIPPED: ${item.name} - STR ${strScore} too low for 60 lb bag`);
          continue;
        }
        if (isBagType3 && !canCarryBagType3) {
          console.log(`  SKIPPED: ${item.name} - STR ${strScore} too low for 35 lb bag`);
          continue;
        }
        if (isBagType2 && !canCarryBagType2) {
          console.log(`  SKIPPED: ${item.name} - STR ${strScore} too low for 25 lb bag`);
          continue;
        }
        if (!canCarryBagType1) {
          console.log(`  SKIPPED: ${item.name} - STR ${strScore} too low for any bag`);
          continue;
        }
        
        hasBagOfHolding = true; // Mark that we're buying a bag
        console.log(`  Added EXTRA: ${item.name} (${item.price} gp) - for party loot!`);
      }
      
      // Only allow ONE Pearl of Power (the first affordable one is the highest level)
      if (item.name.includes('Pearl of Power')) {
        if (hasPearlOfPower) {
          continue; // Skip additional pearls
        }
        hasPearlOfPower = true;
        console.log(`  Added Pearl: ${item.name} (${item.price} gp) - recall one spell/day!`);
      }
      
      // Track if Scarab of Protection was selected (needs custom version for D35E bug fix)
      if (item.name.includes('Scarab of Protection')) {
        hasScarabOfProtection = true;
        console.log(`  Added Scarab: ${item.name} (${item.price} gp) - SR 20 + death ward!`);
      }
      
      if (item.price <= utilityBudget) {
        selectedItems.push(item);
        utilityBudget -= item.price;
        if (!item.name.includes('Bag of Holding') && !item.name.includes('Pearl of Power') && !item.name.includes('Scarab of Protection')) {
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

  return { wondrousItems: selectedItems, hasHandyHaversack, hasScarabOfProtection };
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
 * @param identifyItems - If true, item will be identified; if false, unidentified
 * @returns Enhanced item data ready to be created
 */
export async function applyWeaponEnhancements(
  itemData: any,
  enhancementBonus: number,
  specialAbilities: string[] = [],
  identifyItems: boolean = false
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
  
  // Set unidentified name to base item type (e.g., "Longsword", "Dagger")
  enhanced.system.unidentified = {
    name: baseName,
    price: 0
  };
  console.log(`  New name: ${newName}`);

  // 7. Update price manually (D35E's updatePrice doesn't seem to work reliably)
  const originalPrice = itemData.system.price || 0;
  const enhancementCost = calculateWeaponEnhancementCost(enhancementBonus, specialAbilities);
  enhanced.system.price = originalPrice + enhancementCost;
  console.log(`  Price: ${originalPrice} (base) + ${enhancementCost} (enhancement) = ${enhanced.system.price} gp`);
  
  // Set identified status based on parameter (default unidentified for loot)
  enhanced.system.identified = identifyItems;

  return enhanced;
}

/**
 * Apply enhancements to an armor item
 * 
 * @param itemData - The base armor item data from compendium
 * @param enhancementBonus - The base enhancement bonus (+1 to +5)
 * @param specialAbilities - Array of special abilities (strings or EnhancementAbility objects with levels)
 * @param identifyItems - If true, item will be identified; if false, unidentified
 * @returns Enhanced item data ready to be created
 */
export async function applyArmorEnhancements(
  itemData: any,
  enhancementBonus: number,
  specialAbilities: (string | EnhancementAbility)[] = [],
  identifyItems: boolean = false
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
  
  // Set unidentified name to base item type (e.g., "Full Plate", "Heavy Steel Shield")
  enhanced.system.unidentified = {
    name: baseName,
    price: 0
  };
  console.log(`  New name: ${newName}`);

  // 7. Update price manually (D35E's updatePrice doesn't seem to work reliably)
  const originalPrice = itemData.system.price || 0;
  const enhancementCost = calculateArmorEnhancementCost(enhancementBonus, specialAbilities);
  enhanced.system.price = originalPrice + enhancementCost;
  console.log(`  Price: ${originalPrice} (base) + ${enhancementCost} (enhancement) = ${enhanced.system.price} gp`);
  
  // Set identified status based on parameter (default unidentified for loot)
  enhanced.system.identified = identifyItems;

  return enhanced;
}

/**
 * Add wondrous items from the D35E.magicitems compendium to an actor
 * @param identifyItems - If true, items will be identified; if false, unidentified
 */
export async function addWondrousItemsToActor(
  actor: any,
  wondrousItems: WondrousItemDefinition[],
  identifyItems: boolean = false
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
      
      // Set identified status (default unidentified for loot)
      itemData.system.identified = identifyItems;
      
      // Set unidentified name based on slot
      const slotToName: Record<string, string> = {
        'headband': 'Headband',
        'head': 'Helm',
        'eyes': 'Goggles',
        'neck': 'Amulet',
        'shoulders': 'Cloak',
        'chest': 'Vest',
        'body': 'Robe',
        'armor': 'Armor',
        'belt': 'Belt',
        'wrists': 'Bracers',
        'hands': 'Gloves',
        'ring': 'Ring',
        'ring1': 'Ring',
        'ring2': 'Ring',
        'feet': 'Boots',
        'slotless': 'Wondrous Item'
      };
      const unidentifiedName = slotToName[itemData.system?.slot] || 'Wondrous Item';
      itemData.system.identifiedName = itemData.name;
      itemData.system.unidentified = {
        name: unidentifiedName,
        price: 0
      };

      // Create the item on the actor
      await actor.createEmbeddedDocuments("Item", [itemData]);
      console.log(`  ✓ Added ${itemDef.name} (${itemDef.price} gp)${identifyItems ? '' : ' [unidentified]'}`);
    } catch (error) {
      console.error(`Failed to add ${itemDef.name}:`, error);
    }
  }

  console.log(`=== WONDROUS ITEMS ADDED ===\n`);
}
