/**
 * Spell Selection System for D&D 3.5e
 * 
 * Handles spell selection for all caster classes with their unique mechanics:
 * - Prepared casters (Wizard, Cleric, Druid, Paladin, Ranger)
 * - Spontaneous casters (Sorcerer, Bard)
 * - Arcane vs Divine spell lists
 * - Spells known vs spellbook mechanics
 */

/**
 * Spell selection result for a character
 */
export interface SpellSelection {
  spells: SpellItem[];
  spellbookConfig: SpellbookConfiguration;
}

/**
 * Individual spell item to be added to actor
 */
export interface SpellItem {
  compendiumId: string; // ID in D35E.spells compendium
  name: string;
  level: number; // 0-9
  school: string;
  preparationMode: 'prepared' | 'spontaneous';
  priority: number; // Higher = more important
}

/**
 * Spellbook configuration for actor.system.attributes.spells.spellbooks.primary
 */
export interface SpellbookConfiguration {
  name: string; // "Primary"
  class: string; // "wizard", "sorcerer", "cleric", etc.
  casterLevel: number;
  spellcastingType: 'arcane' | 'divine';
  ability: 'int' | 'wis' | 'cha';
  spontaneous: boolean;
  hasSpecialSlot: boolean; // Wizard specialization or Cleric domains
  arcaneSpellFailure: boolean;
  spellSlots: SpellSlots;
}

/**
 * Spell slots per level (0-9)
 */
export interface SpellSlots {
  spell0: { max: number };
  spell1: { max: number };
  spell2: { max: number };
  spell3: { max: number };
  spell4: { max: number };
  spell5: { max: number };
  spell6: { max: number };
  spell7: { max: number };
  spell8: { max: number };
  spell9: { max: number };
}

/**
 * Caster class types
 */
export type CasterClass = 'wizard' | 'sorcerer' | 'cleric' | 'druid' | 'bard' | 'paladin' | 'ranger';

/**
 * Spell school types
 */
export type SpellSchool = 
  | 'abj' // Abjuration
  | 'con' // Conjuration
  | 'div' // Divination
  | 'enc' // Enchantment
  | 'evo' // Evocation
  | 'ill' // Illusion
  | 'nec' // Necromancy
  | 'trs'; // Transmutation

/**
 * Main spell selection function - routes to class-specific selector
 */
export async function selectSpells(
  characterClass: CasterClass,
  level: number,
  abilityScores: { int: number; wis: number; cha: number }
): Promise<SpellSelection | null> {
  // Only casters get spells
  if (!isCasterClass(characterClass)) {
    return null;
  }
  
  // Paladin and Ranger start casting at level 4
  const classLower = characterClass.toLowerCase();
  if ((classLower === 'paladin' || classLower === 'ranger') && level < 4) {
    return null;
  }
  
  // Route to class-specific selector
  switch (classLower) {
    case 'wizard':
      const { selectWizardSpells } = await import('./wizard-spells');
      return selectWizardSpells(level, abilityScores.int);
      
    case 'sorcerer':
      const { selectSorcererSpells } = await import('./sorcerer-spells');
      return selectSorcererSpells(level, abilityScores.cha);
      
    case 'cleric':
      const { selectClericSpells } = await import('./cleric-spells');
      return selectClericSpells(level, abilityScores.wis);
      
    case 'druid':
      const { selectDruidSpells } = await import('./druid-spells');
      return selectDruidSpells(level, abilityScores.wis);
      
    case 'bard':
      console.warn('Bard spells not yet implemented');
      return null;
      
    case 'paladin':
      const { selectPaladinSpells } = await import('./paladin-spells');
      return selectPaladinSpells(level, abilityScores.cha);
      
    case 'ranger':
      const { selectRangerSpells } = await import('./ranger-spells');
      return selectRangerSpells(level, abilityScores.wis);
      
    default:
      return null;
  }
}

/**
 * Check if a class is a spellcaster
 */
export function isCasterClass(characterClass: string): boolean {
  const casters: CasterClass[] = ['wizard', 'sorcerer', 'cleric', 'druid', 'bard', 'paladin', 'ranger'];
  return casters.includes(characterClass.toLowerCase() as CasterClass);
}

/**
 * Calculate ability modifier from ability score
 */
export function getAbilityModifier(abilityScore: number): number {
  return Math.floor((abilityScore - 10) / 2);
}

/**
 * Calculate bonus spell slots from ability modifier
 * Returns bonus slots per spell level (0 if can't cast that level)
 */
export function getBonusSpellSlots(abilityModifier: number, spellLevel: number): number {
  if (spellLevel === 0) return 0; // No bonus cantrips
  if (abilityModifier < spellLevel) return 0; // Can't cast this level without min ability
  return Math.floor((abilityModifier - spellLevel + 1) / 4) + 1;
}

/**
 * Wizard spell slots per level (base, before ability modifier)
 * Table: The Wizard from PHB
 */
export const WIZARD_SPELL_SLOTS: Record<number, number[]> = {
  1:  [3, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  2:  [4, 2, 0, 0, 0, 0, 0, 0, 0, 0],
  3:  [4, 2, 1, 0, 0, 0, 0, 0, 0, 0],
  4:  [4, 3, 2, 0, 0, 0, 0, 0, 0, 0],
  5:  [4, 3, 2, 1, 0, 0, 0, 0, 0, 0],
  6:  [4, 3, 3, 2, 0, 0, 0, 0, 0, 0],
  7:  [4, 4, 3, 2, 1, 0, 0, 0, 0, 0],
  8:  [4, 4, 3, 3, 2, 0, 0, 0, 0, 0],
  9:  [4, 4, 4, 3, 2, 1, 0, 0, 0, 0],
  10: [4, 4, 4, 3, 3, 2, 0, 0, 0, 0],
  11: [4, 4, 4, 4, 3, 2, 1, 0, 0, 0],
  12: [4, 4, 4, 4, 3, 3, 2, 0, 0, 0],
  13: [4, 4, 4, 4, 4, 3, 2, 1, 0, 0],
  14: [4, 4, 4, 4, 4, 3, 3, 2, 0, 0],
  15: [4, 4, 4, 4, 4, 4, 3, 2, 1, 0],
  16: [4, 4, 4, 4, 4, 4, 3, 3, 2, 0],
  17: [4, 4, 4, 4, 4, 4, 4, 3, 2, 1],
  18: [4, 4, 4, 4, 4, 4, 4, 3, 3, 2],
  19: [4, 4, 4, 4, 4, 4, 4, 4, 3, 3],
  20: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
};

/**
 * Sorcerer spell slots per level (base, before ability modifier)
 * Table: The Sorcerer from PHB
 */
export const SORCERER_SPELL_SLOTS: Record<number, number[]> = {
  1:  [5, 3, 0, 0, 0, 0, 0, 0, 0, 0],
  2:  [6, 4, 0, 0, 0, 0, 0, 0, 0, 0],
  3:  [6, 5, 0, 0, 0, 0, 0, 0, 0, 0],
  4:  [6, 6, 3, 0, 0, 0, 0, 0, 0, 0],
  5:  [6, 6, 4, 0, 0, 0, 0, 0, 0, 0],
  6:  [6, 6, 5, 3, 0, 0, 0, 0, 0, 0],
  7:  [6, 6, 6, 4, 0, 0, 0, 0, 0, 0],
  8:  [6, 6, 6, 5, 3, 0, 0, 0, 0, 0],
  9:  [6, 6, 6, 6, 4, 0, 0, 0, 0, 0],
  10: [6, 6, 6, 6, 5, 3, 0, 0, 0, 0],
  11: [6, 6, 6, 6, 6, 4, 0, 0, 0, 0],
  12: [6, 6, 6, 6, 6, 5, 3, 0, 0, 0],
  13: [6, 6, 6, 6, 6, 6, 4, 0, 0, 0],
  14: [6, 6, 6, 6, 6, 6, 5, 3, 0, 0],
  15: [6, 6, 6, 6, 6, 6, 6, 4, 0, 0],
  16: [6, 6, 6, 6, 6, 6, 6, 5, 3, 0],
  17: [6, 6, 6, 6, 6, 6, 6, 6, 4, 0],
  18: [6, 6, 6, 6, 6, 6, 6, 6, 5, 3],
  19: [6, 6, 6, 6, 6, 6, 6, 6, 6, 4],
  20: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6]
};

/**
 * Sorcerer spells known per level
 * Table: Sorcerer Spells Known from PHB
 */
export const SORCERER_SPELLS_KNOWN: Record<number, number[]> = {
  1:  [4, 2, 0, 0, 0, 0, 0, 0, 0, 0],
  2:  [5, 2, 0, 0, 0, 0, 0, 0, 0, 0],
  3:  [5, 3, 0, 0, 0, 0, 0, 0, 0, 0],
  4:  [6, 3, 1, 0, 0, 0, 0, 0, 0, 0],
  5:  [6, 4, 2, 0, 0, 0, 0, 0, 0, 0],
  6:  [7, 4, 2, 1, 0, 0, 0, 0, 0, 0],
  7:  [7, 5, 3, 2, 0, 0, 0, 0, 0, 0],
  8:  [8, 5, 3, 2, 1, 0, 0, 0, 0, 0],
  9:  [8, 5, 4, 3, 2, 0, 0, 0, 0, 0],
  10: [9, 5, 4, 3, 2, 1, 0, 0, 0, 0],
  11: [9, 5, 5, 4, 3, 2, 0, 0, 0, 0],
  12: [9, 5, 5, 4, 3, 2, 1, 0, 0, 0],
  13: [9, 5, 5, 4, 4, 3, 2, 0, 0, 0],
  14: [9, 5, 5, 4, 4, 3, 2, 1, 0, 0],
  15: [9, 5, 5, 4, 4, 4, 3, 2, 0, 0],
  16: [9, 5, 5, 4, 4, 4, 3, 2, 1, 0],
  17: [9, 5, 5, 4, 4, 4, 3, 3, 2, 0],
  18: [9, 5, 5, 4, 4, 4, 3, 3, 2, 1],
  19: [9, 5, 5, 4, 4, 4, 3, 3, 3, 2],
  20: [9, 5, 5, 4, 4, 4, 3, 3, 3, 3]
};

/**
 * Cleric/Druid spell slots per level (base, before ability modifier)
 * Table: The Cleric / The Druid from PHB
 */
export const CLERIC_SPELL_SLOTS: Record<number, number[]> = {
  1:  [3, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  2:  [4, 2, 0, 0, 0, 0, 0, 0, 0, 0],
  3:  [4, 2, 1, 0, 0, 0, 0, 0, 0, 0],
  4:  [5, 3, 2, 0, 0, 0, 0, 0, 0, 0],
  5:  [5, 3, 2, 1, 0, 0, 0, 0, 0, 0],
  6:  [5, 3, 3, 2, 0, 0, 0, 0, 0, 0],
  7:  [6, 4, 3, 2, 1, 0, 0, 0, 0, 0],
  8:  [6, 4, 3, 3, 2, 0, 0, 0, 0, 0],
  9:  [6, 4, 4, 3, 2, 1, 0, 0, 0, 0],
  10: [6, 4, 4, 3, 3, 2, 0, 0, 0, 0],
  11: [6, 5, 4, 4, 3, 2, 1, 0, 0, 0],
  12: [6, 5, 4, 4, 3, 3, 2, 0, 0, 0],
  13: [6, 5, 5, 4, 4, 3, 2, 1, 0, 0],
  14: [6, 5, 5, 4, 4, 3, 3, 2, 0, 0],
  15: [6, 5, 5, 5, 4, 4, 3, 2, 1, 0],
  16: [6, 5, 5, 5, 4, 4, 3, 3, 2, 0],
  17: [6, 5, 5, 5, 5, 4, 4, 3, 2, 1],
  18: [6, 5, 5, 5, 5, 4, 4, 3, 3, 2],
  19: [6, 5, 5, 5, 5, 5, 4, 4, 3, 3],
  20: [6, 5, 5, 5, 5, 5, 4, 4, 4, 4]
};

/**
 * Build spell slots object with bonus slots from ability modifier
 */
export function buildSpellSlots(
  baseSlots: number[],
  abilityModifier: number
): SpellSlots {
  const slots: SpellSlots = {
    spell0: { max: baseSlots[0] || 0 },
    spell1: { max: (baseSlots[1] || 0) + getBonusSpellSlots(abilityModifier, 1) },
    spell2: { max: (baseSlots[2] || 0) + getBonusSpellSlots(abilityModifier, 2) },
    spell3: { max: (baseSlots[3] || 0) + getBonusSpellSlots(abilityModifier, 3) },
    spell4: { max: (baseSlots[4] || 0) + getBonusSpellSlots(abilityModifier, 4) },
    spell5: { max: (baseSlots[5] || 0) + getBonusSpellSlots(abilityModifier, 5) },
    spell6: { max: (baseSlots[6] || 0) + getBonusSpellSlots(abilityModifier, 6) },
    spell7: { max: (baseSlots[7] || 0) + getBonusSpellSlots(abilityModifier, 7) },
    spell8: { max: (baseSlots[8] || 0) + getBonusSpellSlots(abilityModifier, 8) },
    spell9: { max: (baseSlots[9] || 0) + getBonusSpellSlots(abilityModifier, 9) }
  };
  
  return slots;
}
