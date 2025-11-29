import { EquipmentItem, EquipmentOption, LevelScaledItem } from "../types";

/**
 * Equipment Resolution System
 * 
 * Handles three types of equipment specifications:
 * 1. Single item: { name: "Longsword", cost: 15, ... }
 * 2. Random choice: [{ name: "Longsword", ... }, { name: "Shortsword", ... }]
 * 3. Level-scaled: [{ minLevel: 1, item: {...} }, { minLevel: 10, item: {...} }]
 */

/**
 * Check if an option is a level-scaled array
 */
function isLevelScaledArray(option: any): option is LevelScaledItem[] {
  return Array.isArray(option) && 
         option.length > 0 && 
         'minLevel' in option[0] && 
         'item' in option[0];
}

/**
 * Check if an option is a random choice array
 */
function isRandomChoiceArray(option: any): option is EquipmentItem[] {
  return Array.isArray(option) && 
         option.length > 0 && 
         'name' in option[0] && 
         !('minLevel' in option[0]);
}

/**
 * Resolve a single equipment option based on character level
 * 
 * @param option - The equipment option (single item, array of choices, or level-scaled)
 * @param characterLevel - The character's current level
 * @returns The resolved equipment item
 */
export function resolveEquipmentOption(
  option: EquipmentOption, 
  characterLevel: number
): EquipmentItem {
  // Case 1: Level-scaled equipment
  if (isLevelScaledArray(option)) {
    // Find the highest minLevel that doesn't exceed characterLevel
    const applicable = option
      .filter(scaled => scaled.minLevel <= characterLevel)
      .sort((a, b) => b.minLevel - a.minLevel);
    
    if (applicable.length === 0) {
      console.warn(`No level-scaled option available for level ${characterLevel}, using first option`);
      return option[0].item;
    }
    
    const selected = applicable[0];
    console.log(`Level-scaled equipment: Using ${selected.item.name} (minLevel: ${selected.minLevel}) for level ${characterLevel}`);
    return selected.item;
  }
  
  // Case 2: Random choice from array
  if (isRandomChoiceArray(option)) {
    const randomIndex = Math.floor(Math.random() * option.length);
    const selected = option[randomIndex];
    console.log(`Random equipment choice: Selected ${selected.name} (${randomIndex + 1}/${option.length} options)`);
    return selected;
  }
  
  // Case 3: Single item
  return option as EquipmentItem;
}

/**
 * Resolve an array of equipment options
 * 
 * @param options - Array of equipment options
 * @param characterLevel - The character's current level
 * @returns Array of resolved equipment items
 */
export function resolveEquipmentArray(
  options: EquipmentOption[] | undefined,
  characterLevel: number
): EquipmentItem[] {
  if (!options) return [];
  
  return options.map(option => resolveEquipmentOption(option, characterLevel));
}

/**
 * Calculate total cost of equipment after resolving options
 * 
 * @param kit - The starting kit with equipment options
 * @param characterLevel - The character's current level
 * @returns Total cost in gold pieces
 */
export function calculateKitCost(
  kit: {
    weapons?: EquipmentOption[];
    armor?: EquipmentOption;
    shield?: EquipmentOption;
    gear?: EquipmentOption[];
    tools?: EquipmentOption[];
    ammo?: EquipmentOption[];
  },
  characterLevel: number
): number {
  let total = 0;
  
  // Weapons
  if (kit.weapons) {
    const weapons = resolveEquipmentArray(kit.weapons, characterLevel);
    total += weapons.reduce((sum, w) => sum + (w.cost * (w.quantity || 1)), 0);
  }
  
  // Armor
  if (kit.armor) {
    const armor = resolveEquipmentOption(kit.armor, characterLevel);
    total += armor.cost * (armor.quantity || 1);
  }
  
  // Shield
  if (kit.shield) {
    const shield = resolveEquipmentOption(kit.shield, characterLevel);
    total += shield.cost * (shield.quantity || 1);
  }
  
  // Gear
  if (kit.gear) {
    const gear = resolveEquipmentArray(kit.gear, characterLevel);
    total += gear.reduce((sum, g) => sum + (g.cost * (g.quantity || 1)), 0);
  }
  
  // Tools
  if (kit.tools) {
    const tools = resolveEquipmentArray(kit.tools, characterLevel);
    total += tools.reduce((sum, t) => sum + (t.cost * (t.quantity || 1)), 0);
  }
  
  // Ammo
  if (kit.ammo) {
    const ammo = resolveEquipmentArray(kit.ammo, characterLevel);
    total += ammo.reduce((sum, a) => sum + (a.cost * (a.quantity || 1)), 0);
  }
  
  return total;
}
