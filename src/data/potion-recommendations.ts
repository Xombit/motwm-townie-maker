/**
 * Potion recommendations for D&D 3.5e characters
 * 
 * Potions are limited to 3rd level spells maximum and can be used by anyone.
 * Pricing: Spell Level × Caster Level × 50 gp (using minimum caster level)
 */

import { PotionRecommendation } from './magic-item-system';

export interface PotionDefinition {
  name: string;
  spellLevel: number;
  casterLevel: number; // Minimum CL for the spell
  cost: number; // Spell Level × CL × 50
  reasoning: string;
}

/**
 * Essential potions from D&D 3.5e SRD
 * All potions use minimum caster level for cost efficiency
 */
export const POTION_DEFINITIONS: Record<string, PotionDefinition> = {
  // Healing Potions (most common and essential)
  'cure-light-wounds': {
    name: 'Cure Light Wounds',
    spellLevel: 1,
    casterLevel: 1,
    cost: 50, // 1 × 1 × 50
    reasoning: 'Essential emergency healing, most cost-effective HP restoration'
  },
  'cure-moderate-wounds': {
    name: 'Cure Moderate Wounds',
    spellLevel: 2,
    casterLevel: 3,
    cost: 300, // 2 × 3 × 50
    reasoning: 'Better healing per potion, good for serious injuries'
  },
  'cure-serious-wounds': {
    name: 'Cure Serious Wounds',
    spellLevel: 3,
    casterLevel: 5,
    cost: 750, // 3 × 5 × 50
    reasoning: 'Maximum healing potion, for critical situations'
  },
  'lesser-restoration': {
    name: 'Lesser Restoration',
    spellLevel: 2,
    casterLevel: 3,
    cost: 300, // 2 × 3 × 50
    reasoning: 'Removes ability damage, fatigue, essential for long adventures'
  },
  
  // Physical Enhancement Potions (combat buffs)
  'bulls-strength': {
    name: "Bull's Strength",
    spellLevel: 2,
    casterLevel: 3,
    cost: 300, // 2 × 3 × 50
    reasoning: '+4 STR for 3 minutes, excellent for melee combat'
  },
  'cats-grace': {
    name: "Cat's Grace",
    spellLevel: 2,
    casterLevel: 3,
    cost: 300, // 2 × 3 × 50
    reasoning: '+4 DEX for 3 minutes, improves AC and attack rolls'
  },
  'bears-endurance': {
    name: "Bear's Endurance",
    spellLevel: 2,
    casterLevel: 3,
    cost: 300, // 2 × 3 × 50
    reasoning: '+4 CON for 3 minutes, extra HP and Fort saves'
  },
  
  // Defensive Potions
  'barkskin': {
    name: 'Barkskin',
    spellLevel: 2,
    casterLevel: 3,
    cost: 300, // 2 × 3 × 50 (gives +2 natural armor at CL 3)
    reasoning: '+2 natural armor bonus for 30 minutes'
  },
  'shield-of-faith': {
    name: 'Shield of Faith',
    spellLevel: 1,
    casterLevel: 3,
    cost: 150, // 1 × 3 × 50 (gives +2 deflection at CL 3)
    reasoning: '+2 deflection bonus to AC for 3 minutes'
  },
  
  // Combat Enhancement Potions
  'haste': {
    name: 'Haste',
    spellLevel: 3,
    casterLevel: 5,
    cost: 750, // 3 × 5 × 50
    reasoning: '+1 attack, +1 AC, +1 Reflex, extra attack, +30 ft speed for 5 rounds. AMAZING combat buff!'
  },
  
  // Utility Potions
  'invisibility': {
    name: 'Invisibility',
    spellLevel: 2,
    casterLevel: 3,
    cost: 300, // 2 × 3 × 50
    reasoning: 'Invisibility until attack, essential for stealth or escape'
  },
  'fly': {
    name: 'Fly',
    spellLevel: 3,
    casterLevel: 5,
    cost: 750, // 3 × 5 × 50
    reasoning: 'Flight for 5 minutes, excellent mobility and tactical advantage'
  },
  'darkvision': {
    name: 'Darkvision',
    spellLevel: 2,
    casterLevel: 3,
    cost: 300, // 2 × 3 × 50
    reasoning: 'Darkvision 60 ft for 3 hours, no light source needed'
  },
  'water-breathing': {
    name: 'Water Breathing',
    spellLevel: 3,
    casterLevel: 5,
    cost: 750, // 3 × 5 × 50
    reasoning: 'Breathe underwater for 5 hours, essential for aquatic adventures'
  },
  'gaseous-form': {
    name: 'Gaseous Form',
    spellLevel: 3,
    casterLevel: 5,
    cost: 750, // 3 × 5 × 50
    reasoning: 'Become gaseous cloud, fly 10 ft, immune to physical attacks. Great escape option!'
  },
  'heroism': {
    name: 'Heroism',
    spellLevel: 3,
    casterLevel: 5,
    cost: 750, // 3 × 5 × 50
    reasoning: '+2 morale bonus on attack rolls, saves, and skill checks for 50 minutes'
  },
  
  // Condition Removal (expensive but sometimes essential)
  'neutralize-poison': {
    name: 'Neutralize Poison',
    spellLevel: 3,
    casterLevel: 5,
    cost: 750, // 3 × 5 × 50
    reasoning: 'Removes poison, detoxifies, essential against venomous creatures'
  },
  'remove-disease': {
    name: 'Remove Disease',
    spellLevel: 3,
    casterLevel: 5,
    cost: 750, // 3 × 5 × 50
    reasoning: 'Cures disease, removes sickness, rare but critical'
  },
  'remove-curse': {
    name: 'Remove Curse',
    spellLevel: 3,
    casterLevel: 5,
    cost: 750, // 3 × 5 × 50
    reasoning: 'Removes curses from objects or creatures'
  },
  'remove-blindness-deafness': {
    name: 'Remove Blindness/Deafness',
    spellLevel: 3,
    casterLevel: 5,
    cost: 750, // 3 × 5 × 50
    reasoning: 'Cures blindness or deafness'
  }
};


/**
 * Class-specific potion priorities
 * Higher priority = selected first when budget allows
 */
export const POTION_PRIORITIES_BY_CLASS: Record<string, Array<{ potionId: string; priority: number; minQuantity: number }>> = {
  fighter: [
    { potionId: 'cure-light-wounds', priority: 10, minQuantity: 10 }, // Bulk healing
    { potionId: 'cure-moderate-wounds', priority: 9, minQuantity: 5 }, // Better healing
    { potionId: 'haste', priority: 8, minQuantity: 3 }, // Amazing combat buff
    { potionId: 'bulls-strength', priority: 8, minQuantity: 3 }, // STR boost
    { potionId: 'bears-endurance', priority: 7, minQuantity: 3 }, // CON boost
    { potionId: 'cure-serious-wounds', priority: 6, minQuantity: 2 }, // Emergency healing
    { potionId: 'heroism', priority: 6, minQuantity: 2 }, // Morale bonus
    { potionId: 'shield-of-faith', priority: 5, minQuantity: 2 }, // AC boost
    { potionId: 'lesser-restoration', priority: 4, minQuantity: 2 }, // Ability damage
    { potionId: 'barkskin', priority: 3, minQuantity: 2 }, // Natural armor
    { potionId: 'fly', priority: 2, minQuantity: 1 }, // Mobility
    { potionId: 'gaseous-form', priority: 2, minQuantity: 1 }, // Escape
    { potionId: 'neutralize-poison', priority: 1, minQuantity: 1 } // Emergency
  ],
  
  barbarian: [
    { potionId: 'cure-light-wounds', priority: 10, minQuantity: 10 }, // Bulk healing
    { potionId: 'cure-moderate-wounds', priority: 9, minQuantity: 5 }, // Better healing
    { potionId: 'bears-endurance', priority: 8, minQuantity: 3 }, // CON boost
    { potionId: 'bulls-strength', priority: 7, minQuantity: 3 }, // STR boost
    { potionId: 'cure-serious-wounds', priority: 6, minQuantity: 2 }, // Emergency healing
    { potionId: 'lesser-restoration', priority: 5, minQuantity: 2 }, // Ability damage
    { potionId: 'fly', priority: 4, minQuantity: 1 }, // Mobility
    { potionId: 'neutralize-poison', priority: 3, minQuantity: 1 } // Emergency
  ],
  
  rogue: [
    { potionId: 'cure-light-wounds', priority: 10, minQuantity: 8 }, // Healing (less HP than fighter)
    { potionId: 'invisibility', priority: 9, minQuantity: 3 }, // Stealth
    { potionId: 'cats-grace', priority: 8, minQuantity: 3 }, // DEX boost
    { potionId: 'cure-moderate-wounds', priority: 7, minQuantity: 3 }, // Better healing
    { potionId: 'shield-of-faith', priority: 6, minQuantity: 2 }, // AC boost
    { potionId: 'darkvision', priority: 5, minQuantity: 2 }, // Vision
    { potionId: 'lesser-restoration', priority: 4, minQuantity: 2 }, // Ability damage
    { potionId: 'fly', priority: 3, minQuantity: 1 }, // Mobility
    { potionId: 'neutralize-poison', priority: 2, minQuantity: 1 }, // Emergency
    { potionId: 'cure-serious-wounds', priority: 1, minQuantity: 1 } // Emergency healing
  ],
  
  monk: [
    { potionId: 'cure-light-wounds', priority: 10, minQuantity: 8 }, // Healing
    { potionId: 'cats-grace', priority: 9, minQuantity: 3 }, // DEX boost
    { potionId: 'bears-endurance', priority: 8, minQuantity: 3 }, // CON boost
    { potionId: 'cure-moderate-wounds', priority: 7, minQuantity: 3 }, // Better healing
    { potionId: 'barkskin', priority: 6, minQuantity: 2 }, // AC boost
    { potionId: 'lesser-restoration', priority: 5, minQuantity: 2 }, // Ability damage
    { potionId: 'darkvision', priority: 4, minQuantity: 2 }, // Vision
    { potionId: 'fly', priority: 3, minQuantity: 1 }, // Mobility
    { potionId: 'neutralize-poison', priority: 2, minQuantity: 1 }, // Emergency
    { potionId: 'cure-serious-wounds', priority: 1, minQuantity: 1 } // Emergency healing
  ],
  
  // Partial casters get potions for backup/convenience
  bard: [
    { potionId: 'cure-light-wounds', priority: 10, minQuantity: 5 }, // Backup healing
    { potionId: 'invisibility', priority: 9, minQuantity: 2 }, // Stealth
    { potionId: 'cats-grace', priority: 8, minQuantity: 2 }, // DEX boost
    { potionId: 'cure-moderate-wounds', priority: 7, minQuantity: 2 }, // Better healing
    { potionId: 'lesser-restoration', priority: 6, minQuantity: 2 }, // Ability damage
    { potionId: 'fly', priority: 5, minQuantity: 1 }, // Mobility
    { potionId: 'darkvision', priority: 4, minQuantity: 1 } // Vision
  ],
  
  paladin: [
    { potionId: 'cure-light-wounds', priority: 10, minQuantity: 8 }, // Backup healing
    { potionId: 'bulls-strength', priority: 9, minQuantity: 3 }, // STR boost
    { potionId: 'cure-moderate-wounds', priority: 8, minQuantity: 3 }, // Better healing
    { potionId: 'bears-endurance', priority: 7, minQuantity: 2 }, // CON boost
    { potionId: 'lesser-restoration', priority: 6, minQuantity: 2 }, // Ability damage
    { potionId: 'neutralize-poison', priority: 5, minQuantity: 1 }, // Emergency
    { potionId: 'remove-disease', priority: 4, minQuantity: 1 }, // Emergency
    { potionId: 'fly', priority: 3, minQuantity: 1 } // Mobility
  ],
  
  ranger: [
    { potionId: 'cure-light-wounds', priority: 10, minQuantity: 8 }, // Backup healing
    { potionId: 'cats-grace', priority: 9, minQuantity: 3 }, // DEX boost
    { potionId: 'cure-moderate-wounds', priority: 8, minQuantity: 3 }, // Better healing
    { potionId: 'darkvision', priority: 7, minQuantity: 2 }, // Vision
    { potionId: 'barkskin', priority: 6, minQuantity: 2 }, // AC boost
    { potionId: 'lesser-restoration', priority: 5, minQuantity: 2 }, // Ability damage
    { potionId: 'neutralize-poison', priority: 4, minQuantity: 1 }, // Emergency
    { potionId: 'fly', priority: 3, minQuantity: 1 } // Mobility
  ],
  
  // Full casters get minimal potions (rely on spells)
  wizard: [
    { potionId: 'cure-light-wounds', priority: 10, minQuantity: 5 }, // Emergency healing
    { potionId: 'cure-moderate-wounds', priority: 9, minQuantity: 2 }, // Better healing
    { potionId: 'lesser-restoration', priority: 8, minQuantity: 1 }, // Ability damage
    { potionId: 'neutralize-poison', priority: 7, minQuantity: 1 } // Emergency
  ],
  
  sorcerer: [
    { potionId: 'cure-light-wounds', priority: 10, minQuantity: 5 }, // Emergency healing
    { potionId: 'cure-moderate-wounds', priority: 9, minQuantity: 2 }, // Better healing
    { potionId: 'lesser-restoration', priority: 8, minQuantity: 1 }, // Ability damage
    { potionId: 'neutralize-poison', priority: 7, minQuantity: 1 } // Emergency
  ],
  
  cleric: [
    { potionId: 'cure-light-wounds', priority: 10, minQuantity: 5 }, // Backup healing
    { potionId: 'cure-moderate-wounds', priority: 9, minQuantity: 2 }, // Better healing
    { potionId: 'lesser-restoration', priority: 8, minQuantity: 1 } // Ability damage
  ],
  
  druid: [
    { potionId: 'cure-light-wounds', priority: 10, minQuantity: 5 }, // Backup healing
    { potionId: 'cure-moderate-wounds', priority: 9, minQuantity: 2 }, // Better healing
    { potionId: 'lesser-restoration', priority: 8, minQuantity: 1 } // Ability damage
  ]
};

/**
 * Select potions based on character class, level, and available budget
 * 
 * @param characterClass - The character's class (fighter, wizard, etc.)
 * @param level - Character level
 * @param budget - Available gold for potions
 * @returns Object containing selected potions and total cost
 */
export function selectPotions(
  characterClass: string,
  level: number,
  budget: number
): { potions: PotionRecommendation[]; totalCost: number } {
  const classLower = characterClass.toLowerCase();
  let priorities = POTION_PRIORITIES_BY_CLASS[classLower] || POTION_PRIORITIES_BY_CLASS.fighter;
  
  // CRITICAL: Healing potions MUST be top priority for ALL characters
  // Clone priorities to avoid mutating original
  priorities = [...priorities];
  
  // Define healing potion IDs
  const healingPotionIds = ['cure-light-wounds', 'cure-moderate-wounds', 'cure-serious-wounds'];
  
  // For ALL classes, boost ALL healing potions to top priority (10-9-8 range)
  // This ensures healing is ALWAYS purchased before utility potions
  for (const priority of priorities) {
    if (healingPotionIds.includes(priority.potionId)) {
      // All healing potions get priority 8+ to ensure they're bought first
      if (priority.priority < 8) {
        priority.priority = 8;
      }
    }
  }
  
  // For high-level martials, upgrade to BETTER healing potions
  // Note: Potions max at 3rd level spells, so Cure Serious is the best available
  const martialClasses = ['fighter', 'barbarian', 'paladin', 'ranger', 'rogue', 'monk'];
  if (martialClasses.includes(classLower) && level >= 8) {
    // Replace CLW priority with better healing potions based on level
    const clwIndex = priorities.findIndex(p => p.potionId === 'cure-light-wounds');
    if (clwIndex !== -1) {
      if (level >= 11) {
        // Level 11+: Prioritize Cure Serious Wounds (3rd level, max potion healing)
        priorities[clwIndex] = { potionId: 'cure-serious-wounds', priority: 10, minQuantity: 10 };
        // Add moderate as backup
        const cmwIndex = priorities.findIndex(p => p.potionId === 'cure-moderate-wounds');
        if (cmwIndex !== -1) {
          priorities[cmwIndex] = { potionId: 'cure-moderate-wounds', priority: 9, minQuantity: 5 };
        }
      } else if (level >= 8) {
        // Level 8-10: Prioritize Cure Moderate Wounds over CLW
        priorities[clwIndex] = { potionId: 'cure-moderate-wounds', priority: 10, minQuantity: 10 };
        // Add some Cure Serious as secondary
        const cswIndex = priorities.findIndex(p => p.potionId === 'cure-serious-wounds');
        if (cswIndex !== -1) {
          priorities[cswIndex] = { potionId: 'cure-serious-wounds', priority: 9, minQuantity: 5 };
        }
      }
    }
  }
  
  const selectedPotions: PotionRecommendation[] = [];
  let remainingBudget = budget;
  
  // Sort by priority (highest first)
  const sortedPriorities = [...priorities].sort((a, b) => b.priority - a.priority);
  
  // First pass: Buy minimum quantities
  for (const priority of sortedPriorities) {
    const potion = POTION_DEFINITIONS[priority.potionId];
    if (!potion) continue;
    
    const totalCost = potion.cost * priority.minQuantity;
    if (totalCost <= remainingBudget) {
      selectedPotions.push({
        name: potion.name,
        spellLevel: potion.spellLevel,
        casterLevel: potion.casterLevel,
        cost: potion.cost,
        quantity: priority.minQuantity
      });
      remainingBudget -= totalCost;
    }
  }
  
  // Second pass: Buy additional potions with remaining budget
  // Cap TOTAL healing potions at 30 to leave room for utility potions
  const MAX_TOTAL_HEALING_POTIONS = 30;
  const MAX_HEALING_POTION_QUANTITY = 20; // Max of any single healing potion type
  const MAX_UTILITY_POTION_QUANTITY = 3;  // Max 3 of each utility potion for variety
  
  const healingPotionNames = ['Cure Light Wounds', 'Cure Moderate Wounds', 'Cure Serious Wounds'];
  
  let passCount = 0;
  const maxPasses = 100; // Prevent infinite loop
  
  while (remainingBudget > 0 && passCount < maxPasses) {
    let purchasedThisPass = false;
    passCount++;
    
    for (const priority of sortedPriorities) {
      const potion = POTION_DEFINITIONS[priority.potionId];
      if (!potion || potion.cost > remainingBudget) continue;
      
      // Find existing entry
      const existing = selectedPotions.find(p => p.name === potion.name);
      
      // Check healing potion cap
      const isHealingPotion = healingPotionNames.includes(potion.name);
      if (isHealingPotion) {
        const totalHealingPotions = selectedPotions
          .filter(p => healingPotionNames.includes(p.name))
          .reduce((sum, p) => sum + p.quantity, 0);
        
        if (totalHealingPotions >= MAX_TOTAL_HEALING_POTIONS) {
          continue; // Skip, hit total healing cap
        }
        
        // Check individual healing potion cap
        if (existing && existing.quantity >= MAX_HEALING_POTION_QUANTITY) {
          continue; // Skip this healing potion type, already at max
        }
      } else {
        // Check utility potion cap (much lower - only 3 each for variety)
        if (existing && existing.quantity >= MAX_UTILITY_POTION_QUANTITY) {
          continue; // Skip this utility potion, already at max (3)
        }
      }
      
      // Buy one more of this potion
      if (existing) {
        existing.quantity += 1;
      } else {
        selectedPotions.push({
          name: potion.name,
          spellLevel: potion.spellLevel,
          casterLevel: potion.casterLevel,
          cost: potion.cost,
          quantity: 1
        });
      }
      
      remainingBudget -= potion.cost;
      purchasedThisPass = true;
      break; // Buy one at a time, then re-evaluate
    }
    
    if (!purchasedThisPass) break; // Can't afford anything else
  }
  
  const totalCost = budget - remainingBudget;
  
  return {
    potions: selectedPotions,
    totalCost
  };
}
