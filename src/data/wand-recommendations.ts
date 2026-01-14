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
 * 
 * Higher-level casters should have MORE wands and higher-level wands
 * Wands can contain spells up to 4th level (per SRD)
 */
export const WAND_PRIORITIES_BY_CLASS: Record<string, string[]> = {
  // Wizards want lots of utility wands - include 4th level spells for high-level characters
  wizard: [
    'MAGE_ARMOR', 'SHIELD', 'INVISIBILITY', 'MIRROR_IMAGE', 'HASTE', 'FLY', 'DISPEL_MAGIC',
    'SCORCHING_RAY', 'MAGIC_MISSILE', 'DISPLACEMENT', 'FIREBALL', 'LIGHTNING_BOLT',
    // 4th level spells (max for wands)
    'STONESKIN', 'GREATER_INVISIBILITY', 'ENERVATION', 'DIMENSION_DOOR', 'EVARDS_BLACK_TENTACLES', 'SOLID_FOG'
  ],
  // Sorcerers prefer damage and utility
  sorcerer: [
    'MAGE_ARMOR', 'SHIELD', 'MAGIC_MISSILE', 'SCORCHING_RAY', 'INVISIBILITY', 'FIREBALL',
    'HASTE', 'FLY', 'MIRROR_IMAGE', 'LIGHTNING_BOLT', 'DISPLACEMENT',
    // 4th level spells
    'STONESKIN', 'GREATER_INVISIBILITY', 'ENERVATION', 'DIMENSION_DOOR', 'EVARDS_BLACK_TENTACLES'
  ],
  // Clerics need LOTS of healing wands - include 4th level for high-level clerics
  cleric: [
    'CURE_LIGHT_WOUNDS', 'CURE_MODERATE_WOUNDS', 'CURE_SERIOUS_WOUNDS',
    'SHIELD_OF_FAITH', 'BLESS', 'DIVINE_FAVOR', 'BULLS_STRENGTH',
    'RESIST_ENERGY', 'REMOVE_FEAR', 'REMOVE_PARALYSIS', 'REMOVE_DISEASE',
    // 4th level divine spells
    'CURE_CRITICAL_WOUNDS', 'NEUTRALIZE_POISON', 'DEATH_WARD', 'RESTORATION'
  ],
  // Druids get nature-themed healing and buffs
  druid: [
    'CURE_LIGHT_WOUNDS', 'CURE_MODERATE_WOUNDS', 'CURE_SERIOUS_WOUNDS',
    'RESIST_ENERGY', 'BULLS_STRENGTH', 'BARKSKIN', 'CATS_GRACE',
    // 4th level divine spells
    'CURE_CRITICAL_WOUNDS', 'NEUTRALIZE_POISON', 'DEATH_WARD'
  ],
  // Bards need utility and some healing
  bard: ['CURE_LIGHT_WOUNDS', 'INVISIBILITY', 'GLITTERDUST', 'HASTE', 'MIRROR_IMAGE'],
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
  
  // Map arcane spells (levels 0-4, max for wands per SRD)
  Object.entries(Spells.ARCANE_CANTRIPS).forEach(([key, spell]) => spellMap[key] = spell);
  Object.entries(Spells.ARCANE_LEVEL_1).forEach(([key, spell]) => spellMap[key] = spell);
  Object.entries(Spells.ARCANE_LEVEL_2).forEach(([key, spell]) => spellMap[key] = spell);
  Object.entries(Spells.ARCANE_LEVEL_3).forEach(([key, spell]) => spellMap[key] = spell);
  Object.entries(Spells.ARCANE_LEVEL_4).forEach(([key, spell]) => spellMap[key] = spell);
  
  // Map divine spells (levels 1-4, max for wands per SRD)
  Object.entries(Spells.DIVINE_LEVEL_1).forEach(([key, spell]) => spellMap[key] = spell);
  Object.entries(Spells.DIVINE_LEVEL_2).forEach(([key, spell]) => spellMap[key] = spell);
  Object.entries(Spells.DIVINE_LEVEL_3).forEach(([key, spell]) => spellMap[key] = spell);
  Object.entries(Spells.DIVINE_LEVEL_4).forEach(([key, spell]) => spellMap[key] = spell);
  
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
 * - HIGH-LEVEL CHARACTERS: Buy more wands, including duplicates of essential wands
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
  
  // Determine max wands based on level and budget
  // Higher level characters can have MORE wands
  // Level 5-8: 2-3 wands, Level 9-12: 3-5 wands, Level 13-16: 4-7 wands, Level 17+: 5-10 wands
  const maxWands = characterLevel >= 17 ? 10 : (characterLevel >= 13 ? 7 : (characterLevel >= 9 ? 5 : 3));
  
  console.log(`Wand selection: Level ${characterLevel}, Budget ${budget} gp, Max wands ${maxWands}`);
  
  // Strategy: Buy wands in priority order, one of each type first
  for (const wand of recommendations) {
    if (selectedWands.length >= maxWands) break;
    
    if (wand.cost <= remainingBudget) {
      // Check if we already have a wand of this spell
      const alreadyHave = selectedWands.some(w => w.spell.id === wand.spell.id);
      if (!alreadyHave) {
        selectedWands.push(wand);
        remainingBudget -= wand.cost;
        console.log(`  + ${wand.spell.name} (${wand.cost} gp), remaining: ${remainingBudget} gp`);
      }
    }
  }
  
  // SECOND PASS: If we have significant budget left (> 20% of original), buy duplicates
  // High-level casters benefit from extra healing wands, buff wands, etc.
  const budgetThreshold = budget * 0.2;
  if (remainingBudget > budgetThreshold && selectedWands.length < maxWands) {
    console.log(`  Second pass: ${remainingBudget} gp remaining, looking for duplicates...`);
    
    // Priority for duplicates: healing > buff > utility
    const duplicatePriority = selectedWands
      .filter(w => w.spell.tags.includes('healing') || w.spell.tags.includes('buff'))
      .sort((a, b) => {
        // Healing first
        const aHealing = a.spell.tags.includes('healing') ? 0 : 1;
        const bHealing = b.spell.tags.includes('healing') ? 0 : 1;
        return aHealing - bHealing;
      });
    
    for (const wand of duplicatePriority) {
      if (selectedWands.length >= maxWands) break;
      if (wand.cost <= remainingBudget) {
        selectedWands.push({ ...wand }); // Add duplicate
        remainingBudget -= wand.cost;
        console.log(`  + (duplicate) ${wand.spell.name} (${wand.cost} gp), remaining: ${remainingBudget} gp`);
      }
    }
  }
  
  // THIRD PASS: If still lots of budget left, buy even more wands
  // This handles cases where we have massive budgets at high levels
  if (remainingBudget > budgetThreshold && selectedWands.length < maxWands) {
    console.log(`  Third pass: ${remainingBudget} gp remaining, buying more wands...`);
    
    for (const wand of recommendations) {
      if (selectedWands.length >= maxWands) break;
      if (wand.cost <= remainingBudget) {
        // Allow buying a second copy of ANY wand if we have the budget
        const existingCount = selectedWands.filter(w => w.spell.id === wand.spell.id).length;
        if (existingCount < 2) {  // Max 2 of each wand type
          selectedWands.push({ ...wand });
          remainingBudget -= wand.cost;
          console.log(`  + (extra) ${wand.spell.name} (${wand.cost} gp), remaining: ${remainingBudget} gp`);
        }
      }
    }
  }
  
  console.log(`Wand selection complete: ${selectedWands.length} wands, ${budget - remainingBudget} gp spent`);
  
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
