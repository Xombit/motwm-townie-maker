/**
 * Hardcoded Compendium IDs for Classes and Races
 * 
 * These IDs are extracted from the D35E compendiums for fast direct lookup.
 * Only includes classes/races that we have artwork for.
 * 
 * To regenerate: Run dumpForTownieMaker() in Foundry console
 * (paste scripts/dump-compendium.js first)
 */

// =============================================================================
// CLASS IDS - from D35E.classes
// =============================================================================

export const CLASS_IDS: Record<string, string> = {
  // Core Classes (we have artwork for)
  'Barbarian': 'ynBCeSzLGXnQIREO',
  'Bard': 'WRPq41FTQocsxxBU',
  'Cleric': 'qaM4mLNombMrdL2M',
  'Druid': '49GnJA0FkMKKYKqQ',
  'Fighter': 'sgwZt7dg1ZHXQlrW',
  'Monk': 'JzrAdWAh2ucGpgFa',
  'Paladin': 'i8FlSB5c6b5TlXHc',
  'Ranger': 'u7dga44lYsIPLYvV',
  'Rogue': 'Peiv9Y6pDYt6hR5v',
  'Sorcerer': 'u0ULzrnt9daT9Ygq',
  'Wizard': 'VwVlbNYqDgMBIWhQ',
  
  // NPC Classes
  'Adept (NPC)': 'EoAqjgPyHTk4VNjT',
  'Aristocrat (NPC)': 'aetXvUcGSSjSobA8',
  'Commoner (NPC)': '8dgdyFktroivgOhu',
  'Expert (NPC)': 'f32v5loYmGGwICM5',
  'Warrior (NPC)': '3KKfyU5yuoqamNLP',
} as const;

// =============================================================================
// RACE IDS - from D35E.racialfeatures
// =============================================================================

export const RACE_IDS: Record<string, string> = {
  // Humans
  'Human': 'mq9ljMCrgJj0bGVO',
  
  // Elves (must use subrace)
  'Elf, High': 'z5p39RR9V7lNlTK0',
  'Elf, Wood': '3xT0FULa0G2ZiEzC',
  'Elf, Drow': 'f37AMzIFaNCuqkaH',
  
  // Dwarves (must use subrace)
  'Dwarf, Hill': 'y3DlwbBPoGw8HB5K',
  'Dwarf, Mountain': 'E1X86T7BGl8yFnJg',
  
  // Gnomes (must use subrace)
  'Gnome, Rock': 'LeayY5R2LchomfQK',
  
  // Halflings (must use subrace)
  'Halfling, Lightfoot': 'qsyFLCfGAvOtLHKe',
  
  // Half-breeds
  'Half-Elf': 'Dara3i7zKRK5lEbX',
  'Half-Orc': 'pfVI9yVWD2uoVXna',
  
  // Planetouched
  'Aasimar': 'bkWS7c4djqGoEAn6',
  'Tiefling': 'peReBZyG5Qkt3tkW',
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get class compendium ID by name
 * @returns The compendium ID or undefined if not found
 */
export function getClassId(className: string): string | undefined {
  return CLASS_IDS[className];
}

/**
 * Get race compendium ID by name
 * @returns The compendium ID or undefined if not found
 */
export function getRaceId(raceName: string): string | undefined {
  return RACE_IDS[raceName];
}

/**
 * Check if a class name is supported (has hardcoded ID)
 */
export function isClassSupported(className: string): boolean {
  return className in CLASS_IDS;
}

/**
 * Check if a race name is supported (has hardcoded ID)
 */
export function isRaceSupported(raceName: string): boolean {
  return raceName in RACE_IDS;
}

/**
 * Get list of all supported class names
 */
export function getSupportedClasses(): string[] {
  return Object.keys(CLASS_IDS);
}

/**
 * Get list of all supported race names
 */
export function getSupportedRaces(): string[] {
  return Object.keys(RACE_IDS);
}
