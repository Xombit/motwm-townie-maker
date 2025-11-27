/**
 * Wand selection and recommendations for NPCs
 * 
 * Wands are created dynamically from spells and provide utility, buff, and utility options
 * for spellcasting NPCs. This module defines which wands are appropriate for each class
 * and level range.
 */

import { SpellDefinition, calculateWandCost } from './spells.js';
import * as Spells from './spells.js';

/**
 * Wand recommendation for a specific spell
 */
export interface WandRecommendation {
  /** The spell to create a wand from */
  spell: SpellDefinition;
  /** Caster level for the wand (affects both power and price) */
  casterLevel: number;
  /** Calculated cost for this wand */
  cost: number;
  /** Priority for this wand (higher = more important) */
  priority: number;
  /** Reasoning for this recommendation */
  reasoning: string;
}

/**
 * Class-specific wand preferences
 * 
 * Each class has different priorities for wand selection based on their role:
 * - Wizards: Utility and buff wands (Mage Armor, Shield, Invisibility)
 * - Sorcerers: Combat and utility wands (Magic Missile, Scorching Ray)
 * - Clerics: Healing and buff wands (CLW, Bless, Shield of Faith)
 * - Druids: Similar to clerics with nature focus
 */
export const WAND_PRIORITIES_BY_CLASS: Record<string, string[]> = {
  wizard: ['MAGE_ARMOR', 'SHIELD', 'INVISIBILITY', 'MIRROR_IMAGE', 'HASTE', 'FLY', 'DISPEL_MAGIC'],
  sorcerer: ['MAGE_ARMOR', 'SHIELD', 'MAGIC_MISSILE', 'SCORCHING_RAY', 'INVISIBILITY', 'FIREBALL'],
  cleric: ['CURE_LIGHT_WOUNDS', 'CURE_MODERATE_WOUNDS', 'SHIELD_OF_FAITH', 'BLESS', 'DIVINE_FAVOR', 'BULLS_STRENGTH', 'CURE_SERIOUS_WOUNDS'],
  druid: ['CURE_LIGHT_WOUNDS', 'CURE_MODERATE_WOUNDS', 'RESIST_ENERGY', 'BULLS_STRENGTH', 'CURE_SERIOUS_WOUNDS'],
  bard: ['CURE_LIGHT_WOUNDS', 'INVISIBILITY', 'GLITTERDUST', 'HASTE'],
  // Paladins have limited spell list - only spells they can actually cast
  paladin: ['CURE_LIGHT_WOUNDS', 'BLESS', 'DIVINE_FAVOR'],  // 1st level only for wands
  ranger: ['CURE_LIGHT_WOUNDS', 'RESIST_ENERGY']
};

/**
 * Get wand recommendations for a character
 * 
 * @param characterClass The character's class
 * @param characterLevel The character's level
 * @param budget Available gold for wands
 * @returns Array of wand recommendations sorted by priority
 */
export function getWandRecommendations(
  characterClass: string,
  characterLevel: number,
  budget: number
): WandRecommendation[] {
  const className = characterClass.toLowerCase();
  const priorities = WAND_PRIORITIES_BY_CLASS[className] || [];
  
  console.log(`DEBUG: Wand selection for ${characterClass} (${className}), priorities: ${priorities.length}, budget: ${budget} gp`);
  
  if (priorities.length === 0) {
    console.log(`No wand priorities defined for class: ${characterClass}`);
    return [];
  }
  
  const recommendations: WandRecommendation[] = [];
  
  // Collect all available spells
  const allArcaneSpells = Spells.getAllArcaneSpells();
  const allDivineSpells = Spells.getAllDivineSpells();
  const isDivine = ['cleric', 'druid', 'paladin', 'ranger'].includes(className);
  const spellList = isDivine ? allDivineSpells : allArcaneSpells;
  
  // Create a map of spell keys to spells
  const spellMap: Record<string, SpellDefinition> = {};
  
  // Map arcane spells
  Object.entries(Spells.ARCANE_CANTRIPS).forEach(([key, spell]) => spellMap[key] = spell);
  Object.entries(Spells.ARCANE_LEVEL_1).forEach(([key, spell]) => spellMap[key] = spell);
  Object.entries(Spells.ARCANE_LEVEL_2).forEach(([key, spell]) => spellMap[key] = spell);
  Object.entries(Spells.ARCANE_LEVEL_3).forEach(([key, spell]) => spellMap[key] = spell);
  
  // Map divine spells
  Object.entries(Spells.DIVINE_LEVEL_1).forEach(([key, spell]) => spellMap[key] = spell);
  Object.entries(Spells.DIVINE_LEVEL_2).forEach(([key, spell]) => spellMap[key] = spell);
  Object.entries(Spells.DIVINE_LEVEL_3).forEach(([key, spell]) => spellMap[key] = spell);
  
  // Generate recommendations based on priorities
  priorities.forEach((spellKey, index) => {
    const spell = spellMap[spellKey];
    if (!spell) {
      console.warn(`Wand spell not found: ${spellKey} for ${characterClass}`);
      return;
    }
    
    console.log(`DEBUG: Found wand spell: ${spell.name} (${spellKey}), level ${spell.level}, minCL ${spell.minCasterLevel}`);
    
    // Determine appropriate caster level
    // For wands, use minimum CL to keep costs affordable (wands are consumable utility items)
    // Players can always buy higher CL wands themselves if they want more power
    let casterLevel = spell.minCasterLevel;
    
    const cost = calculateWandCost(spell.level, casterLevel);
    
    console.log(`DEBUG: Wand cost: ${cost} gp (spell level ${spell.level}, CL ${casterLevel})`);
    
    // Priority decreases with index (first in list = highest priority)
    const priority = 100 - (index * 5);
    
    recommendations.push({
      spell,
      casterLevel,
      cost,
      priority,
      reasoning: `${spell.name} (CL ${casterLevel}): ${spell.description}`
    });
  });
  
  console.log(`DEBUG: Created ${recommendations.length} wand recommendations`);
  
  // Filter to wands that fit the budget and sort by priority
  const affordableWands = recommendations
    .filter(w => w.cost <= budget)
    .sort((a, b) => b.priority - a.priority);
  
  console.log(`DEBUG: After budget filter (${budget} gp): ${affordableWands.length} affordable wands`);
  
  return affordableWands;
}

/**
 * Select wands for a character within a budget
 * 
 * Strategy:
 * - Start with highest priority wands
 * - Buy most expensive (highest CL) version we can afford
 * - Move to next priority if current wand is too expensive
 * - Stop when budget is exhausted
 * 
 * @param characterClass The character's class
 * @param characterLevel The character's level
 * @param budget Available gold for wands
 * @returns Selected wands and total cost
 */
export function selectWands(
  characterClass: string,
  characterLevel: number,
  budget: number
): { wands: WandRecommendation[], totalCost: number } {
  const recommendations = getWandRecommendations(characterClass, characterLevel, budget);
  
  const selectedWands: WandRecommendation[] = [];
  let remainingBudget = budget;
  
  // Strategy: Buy wands in priority order, one of each type
  for (const wand of recommendations) {
    if (wand.cost <= remainingBudget) {
      // Check if we already have a wand of this spell
      const alreadyHave = selectedWands.some(w => w.spell.id === wand.spell.id);
      if (!alreadyHave) {
        selectedWands.push(wand);
        remainingBudget -= wand.cost;
      }
    }
  }
  
  // If we have budget left and few wands, consider buying duplicates of important wands
  if (selectedWands.length < 3 && remainingBudget > 1000) {
    // Look for healing or buff wands to duplicate
    const importantWands = selectedWands.filter(w =>
      w.spell.tags.includes('healing') ||
      w.spell.tags.includes('buff')
    );
    
    for (const wand of importantWands) {
      if (wand.cost <= remainingBudget) {
        selectedWands.push({ ...wand }); // Add duplicate
        remainingBudget -= wand.cost;
        break; // Only one duplicate for now
      }
    }
  }
  
  return {
    wands: selectedWands,
    totalCost: budget - remainingBudget
  };
}

/**
 * Get description of wand selections for logging
 */
export function describeWandSelections(wands: WandRecommendation[]): string {
  if (wands.length === 0) {
    return 'No wands selected';
  }
  
  const descriptions = wands.map(w =>
    `  - Wand of ${w.spell.name} (CL ${w.casterLevel}, ${w.cost} gp): ${w.spell.description}`
  );
  
  const totalCost = wands.reduce((sum, w) => sum + w.cost, 0);
  
  return `Wands (${wands.length}, ${totalCost} gp total):\n${descriptions.join('\n')}`;
}
