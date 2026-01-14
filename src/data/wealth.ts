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

/**
 * Convert gold pieces to randomized coin denominations
 * Distributes wealth across all coin types for a more realistic feel
 * PREFERS HIGHER DENOMINATIONS to reduce weight (50 cp = 1 lb)
 * @param amount Amount in gold pieces
 * @returns Object with pp, gp, sp, cp amounts
 */
export function convertToRandomizedCoins(amount: number): { pp: number; gp: number; sp: number; cp: number } {
  // Convert everything to copper pieces for easier math (1 gp = 100 cp)
  let totalCp = Math.round(amount * 100);
  
  // HIGHER DENOMINATION PREFERENCE
  // Adventurers prefer carrying platinum and gold over heavy copper/silver
  // Platinum: 40-60% of value (if amount > 10 gp)
  // Gold: 35-55% of remaining value
  // Silver: 5-15% of remaining value (just pocket change)
  // Copper: minimal remainder (a few coins at most)
  
  let pp = 0;
  let gp = 0;
  let sp = 0;
  let cp = 0;
  
  // Use platinum for amounts > 10 gp (much more aggressive than before)
  if (amount >= 10) {
    // Randomly allocate 40-60% to platinum
    const ppPercent = 0.4 + Math.random() * 0.2;
    const ppCpValue = Math.floor(totalCp * ppPercent);
    pp = Math.floor(ppCpValue / 1000); // 1 pp = 1000 cp
    totalCp -= pp * 1000;
  }
  
  // Allocate 70-90% of remaining to gold (much more than before)
  const gpPercent = 0.7 + Math.random() * 0.2;
  const gpCpValue = Math.floor(totalCp * gpPercent);
  gp = Math.floor(gpCpValue / 100); // 1 gp = 100 cp
  totalCp -= gp * 100;
  
  // Allocate 60-80% of remaining to silver (keeping copper minimal)
  const spPercent = 0.6 + Math.random() * 0.2;
  const spCpValue = Math.floor(totalCp * spPercent);
  sp = Math.floor(spCpValue / 10); // 1 sp = 10 cp
  totalCp -= sp * 10;
  
  // Rest goes to copper (should be small - just a few coins)
  cp = totalCp;
  
  return { pp, gp, sp, cp };
}
