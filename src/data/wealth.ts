/**
 * Character Wealth by Level
 * Source: D&D 3.5e SRD - Experience and Level-Dependent Benefits
 */

// Character wealth by level (in gold pieces)
export const WEALTH_BY_LEVEL: Record<number, number> = {
  1: 0,        // Calculated from class starting wealth
  2: 900,
  3: 2700,
  4: 5400,
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
};

// Starting wealth by class (average of dice roll × 10 gp)
// Used for level 1 characters only
export const CLASS_STARTING_WEALTH: Record<string, number> = {
  // Core classes
  "Barbarian": 100,      // 4d4×10 gp (average: 100)
  "Bard": 100,           // 4d4×10 gp (average: 100)
  "Cleric": 125,         // 5d4×10 gp (average: 125)
  "Druid": 50,           // 2d4×10 gp (average: 50)
  "Fighter": 150,        // 6d4×10 gp (average: 150)
  "Monk": 25,            // 1d4×10 gp (average: 25)
  "Paladin": 150,        // 6d4×10 gp (average: 150)
  "Ranger": 150,         // 6d4×10 gp (average: 150)
  "Rogue": 125,          // 5d4×10 gp (average: 125)
  "Sorcerer": 75,        // 3d4×10 gp (average: 75)
  "Wizard": 75,          // 3d4×10 gp (average: 75)
  
  // NPC classes
  "Adept (NPC)": 50,
  "Aristocrat (NPC)": 150,
  "Commoner (NPC)": 25,
  "Expert (NPC)": 100,
  "Warrior (NPC)": 100
};

/**
 * Get total wealth for a character at a given level
 * @param level Character level (1-20)
 * @param className Primary class name
 * @returns Total wealth in gold pieces
 */
export function getWealthForLevel(level: number, className: string): number {
  if (level === 1) {
    return CLASS_STARTING_WEALTH[className] || 100;
  }
  return WEALTH_BY_LEVEL[level] || 0;
}

/**
 * Convert gold pieces to coin denominations
 * @param amount Amount in gold pieces
 * @returns Object with pp, gp, sp, cp amounts
 */
export function convertToCoins(amount: number): { pp: number; gp: number; sp: number; cp: number } {
  let remaining = amount;
  
  // Platinum (10 gp each) - only use for large amounts
  const pp = remaining >= 100 ? Math.floor(remaining / 10) : 0;
  remaining -= pp * 10;
  
  // Gold (1 gp each)
  const gp = Math.floor(remaining);
  remaining -= gp;
  
  // Silver (0.1 gp each)
  const sp = Math.floor(remaining * 10);
  remaining -= sp / 10;
  
  // Copper (0.01 gp each)
  const cp = Math.round(remaining * 100);
  
  return { pp, gp, sp, cp };
}
