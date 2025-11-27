/**
 * Scroll selection and recommendations for NPCs
 * 
 * Scrolls are one-time use emergency and utility items for rare situations.
 * Unlike wands (50 charges for frequently-used spells), scrolls should be
 * high-level spells (3rd-6th level) that are situational but critical.
 */

import { SpellDefinition, calculateScrollCost } from './spells.js';
import * as Spells from './spells.js';

/**
 * Scroll recommendation for a specific spell
 */
export interface ScrollRecommendation {
  /** The spell to create a scroll from */
  spell: SpellDefinition;
  /** Caster level for the scroll (affects power and price) */
  casterLevel: number;
  /** Calculated cost for this scroll */
  cost: number;
  /** Priority for this scroll (higher = more important) */
  priority: number;
  /** Reasoning for this recommendation */
  reasoning: string;
  /** Whether this is an arcane or divine scroll */
  scrollType: 'arcane' | 'divine';
}

/**
 * Class-specific scroll preferences
 * 
 * Scrolls focus on emergency/utility spells that are too expensive as wands:
 * - Wizards: Travel (Teleport), utility (Knock, Identify), defense (Stoneskin)
 * - Clerics: Restoration (Raise Dead, Restoration), emergency healing (Cure Critical, Heal)
 * - Druids: Similar to clerics with nature focus
 */
export const SCROLL_PRIORITIES_BY_CLASS: Record<string, string[]> = {
  wizard: [
    'TELEPORT', 'DIMENSION_DOOR', 'STONESKIN', 'BREAK_ENCHANTMENT_ARCANE', 
    'OVERLAND_FLIGHT', 'GREATER_TELEPORT', 'KNOCK', 'CONTINGENCY'
  ],
  sorcerer: [
    'TELEPORT', 'DIMENSION_DOOR', 'STONESKIN', 'GREATER_TELEPORT', 
    'OVERLAND_FLIGHT', 'KNOCK'
  ],
  cleric: [
    'RAISE_DEAD', 'RESTORATION', 'REMOVE_CURSE', 'NEUTRALIZE_POISON', 
    'CURE_CRITICAL_WOUNDS', 'BREAK_ENCHANTMENT', 'DEATH_WARD', 'HEAL', 
    'GREATER_RESTORATION', 'REMOVE_DISEASE', 'COMMUNE', 'RESURRECTION'
  ],
  druid: [
    'RAISE_DEAD', 'RESTORATION', 'NEUTRALIZE_POISON', 'REMOVE_DISEASE', 
    'CURE_CRITICAL_WOUNDS', 'REMOVE_CURSE', 'HEAL'
  ],
  bard: [
    'KNOCK', 'NEUTRALIZE_POISON', 'CURE_CRITICAL_WOUNDS', 'REMOVE_CURSE'
  ],
  // Paladins: Level 9 can only cast up to 2nd level, scrolls for 3rd level utility (Remove Curse)
  // Higher level scrolls (4th) require character level 13+ for paladins
  paladin: [
    'REMOVE_CURSE'  // 3rd level - usable as scroll even though can't cast yet
  ],
  ranger: [
    'NEUTRALIZE_POISON', 'REMOVE_DISEASE'
  ]
};

/**
 * Get scroll recommendations for a character
 * 
 * @param characterClass The character's class
 * @param characterLevel The character's level
 * @param budget Available gold for scrolls
 * @returns Array of scroll recommendations sorted by priority
 */
export function getScrollRecommendations(
  characterClass: string,
  characterLevel: number,
  budget: number
): ScrollRecommendation[] {
  const className = characterClass.toLowerCase();
  const priorities = SCROLL_PRIORITIES_BY_CLASS[className] || [];
  
  console.log(`DEBUG: Scroll selection for ${characterClass} (${className}), priorities: ${priorities.length}, budget: ${budget} gp, level: ${characterLevel}`);
  
  if (priorities.length === 0) {
    console.log(`No scroll priorities defined for class: ${characterClass}`);
    return [];
  }
  
  // Scrolls require caster levels - start at level 7+ (can cast 3rd+ level spells)
  if (characterLevel < 7) {
    console.log(`Character level ${characterLevel} too low for scrolls (need 7+)`);
    return [];
  }
  
  const recommendations: ScrollRecommendation[] = [];
  
  // Collect all available scrolls
  const isDivine = ['cleric', 'druid', 'paladin', 'ranger'].includes(className);
  const arcaneScrolls = Spells.getAllArcaneScrollSpells();
  const divineScrolls = Spells.getAllDivineScrollSpells();
  
  // Create a map of spell keys to spells
  const spellMap: Record<string, SpellDefinition> = {};
  
  // Map arcane scrolls
  Object.entries(Spells.ARCANE_SCROLL_LEVEL_2).forEach(([key, spell]) => spellMap[key] = spell);
  Object.entries(Spells.ARCANE_SCROLL_LEVEL_4).forEach(([key, spell]) => spellMap[key] = spell);
  Object.entries(Spells.ARCANE_SCROLL_LEVEL_5).forEach(([key, spell]) => spellMap[key] = spell);
  Object.entries(Spells.ARCANE_SCROLL_LEVEL_6).forEach(([key, spell]) => spellMap[key] = spell);
  Object.entries(Spells.ARCANE_SCROLL_LEVEL_7).forEach(([key, spell]) => spellMap[key] = spell);
  
  // Map divine scrolls
  spellMap['REMOVE_CURSE'] = Spells.DIVINE_LEVEL_3.REMOVE_CURSE;
  Object.entries(Spells.DIVINE_LEVEL_4).forEach(([key, spell]) => spellMap[key] = spell);
  Object.entries(Spells.DIVINE_LEVEL_5).forEach(([key, spell]) => spellMap[key] = spell);
  Object.entries(Spells.DIVINE_LEVEL_6).forEach(([key, spell]) => spellMap[key] = spell);
  Object.entries(Spells.DIVINE_LEVEL_7).forEach(([key, spell]) => spellMap[key] = spell);
  
  // Generate recommendations based on priorities
  priorities.forEach((spellKey, index) => {
    const spell = spellMap[spellKey];
    if (!spell) {
      console.warn(`Scroll spell not found: ${spellKey} for ${characterClass}`);
      return;
    }
    
    console.log(`DEBUG: Found scroll spell: ${spell.name} (${spellKey}), level ${spell.level}, minCL ${spell.minCasterLevel}`);
    
    // Determine appropriate caster level
    // For scrolls, use minimum CL to keep costs affordable 
    // Scrolls are emergency options and don't need to be high CL
    let casterLevel = spell.minCasterLevel;
    
    const cost = calculateScrollCost(spell.level, casterLevel);
    
    console.log(`DEBUG: Scroll cost: ${cost} gp (spell level ${spell.level}, CL ${casterLevel})`);
    
    // Skip spells that are way over budget (allow up to 150% for high-priority scrolls)
    if (cost > budget * 1.5) {
      console.log(`DEBUG: Skipping ${spell.name} - cost ${cost} gp exceeds 150% of budget (${budget * 1.5} gp)`);
      return;
    }
    
    // Determine scroll type
    const scrollType: 'arcane' | 'divine' = isDivine ? 'divine' : 'arcane';
    
    // Priority decreases with index (first in list = highest priority)
    const priority = 100 - (index * 3);
    
    recommendations.push({
      spell,
      casterLevel,
      cost,
      priority,
      reasoning: `${spell.name} (CL ${casterLevel}): ${spell.description}`,
      scrollType
    });
  });
  
  console.log(`DEBUG: Created ${recommendations.length} scroll recommendations`);
  
  // Filter to scrolls that fit the budget and sort by priority
  const affordableScrolls = recommendations
    .filter(s => s.cost <= budget)
    .sort((a, b) => b.priority - a.priority);
  
  console.log(`DEBUG: After budget filter (${budget} gp): ${affordableScrolls.length} affordable scrolls`);
  
  return affordableScrolls;
}

/**
 * Select scrolls for a character within a budget
 * 
 * Strategy:
 * - Start with highest priority scrolls
 * - Buy one of each type (no duplicates unless specified)
 * - Focus on utility and emergency spells
 * - Stop when budget is exhausted
 * 
 * @param characterClass The character's class
 * @param characterLevel The character's level
 * @param budget Available gold for scrolls
 * @returns Selected scrolls and total cost
 */
export function selectScrolls(
  characterClass: string,
  characterLevel: number,
  budget: number
): { scrolls: ScrollRecommendation[], totalCost: number } {
  const recommendations = getScrollRecommendations(characterClass, characterLevel, budget);
  
  const selectedScrolls: ScrollRecommendation[] = [];
  let remainingBudget = budget;
  
  // Strategy: Buy scrolls in priority order, one of each type
  for (const scroll of recommendations) {
    if (scroll.cost <= remainingBudget) {
      // Check if we already have a scroll of this spell
      const alreadyHave = selectedScrolls.some(s => s.spell.id === scroll.spell.id);
      if (!alreadyHave) {
        selectedScrolls.push(scroll);
        remainingBudget -= scroll.cost;
      }
    }
  }
  
  return {
    scrolls: selectedScrolls,
    totalCost: budget - remainingBudget
  };
}

/**
 * Get description of scroll selections for logging
 */
export function describeScrollSelections(scrolls: ScrollRecommendation[]): string {
  if (scrolls.length === 0) {
    return 'No scrolls selected';
  }
  
  const descriptions = scrolls.map(s =>
    `  - Scroll of ${s.spell.name} (${s.scrollType}, CL ${s.casterLevel}, ${s.cost} gp): ${s.spell.description}`
  );
  
  const totalCost = scrolls.reduce((sum, s) => sum + s.cost, 0);
  
  return `Scrolls (${scrolls.length}, ${totalCost} gp total):\n${descriptions.join('\n')}`;
}
