// Type definitions for Townie Maker

// Configuration for feats that require special setup
export interface FeatConfig {
  name: string;  // The base feat name to search for
  displayName?: string;  // What to show the user
  config?: {
    spellSchool?: string;  // For Spell Focus, Greater Spell Focus: "evo", "nec", "div", "con", "enc", "ill", "abj", "trs"
    weaponGroup?: string;  // For Weapon Focus, Weapon Specialization, Improved Critical, Greater Weapon Focus, etc.
    skill?: string;  // For Skill Focus: skill ID (e.g., "dip", "hea") or "subskillId:CustomName" (e.g., "crf1:Armorsmith", "pro1:Sailor", "prf1:Sing")
  };
}

// Equipment item definition - each item listed individually for user customization
export interface EquipmentItem {
  name: string;           // Item name (must match D35E compendium name)
  cost: number;           // Cost in gold pieces
  weight?: number;        // Weight in pounds (optional, for reference)
  quantity?: number;      // How many of this item (default: 1)
  type?: "weapon" | "armor" | "shield" | "gear" | "tool" | "ammo";  // Item category for compendium lookup
}

// Level-scaled equipment option - allows items to be swapped at certain levels
export interface LevelScaledItem {
  minLevel: number;       // Minimum level to use this item
  item: EquipmentItem;    // The item to use at this level
}

// Equipment option - can be a single item, array of random choices, or level-scaled options
export type EquipmentOption = 
  | EquipmentItem 
  | EquipmentItem[]  // Random choice from array (equal probability)
  | LevelScaledItem[];  // Automatically upgrade at certain levels

// Starting equipment kit - all items listed individually
export interface StartingKit {
  weapons?: EquipmentOption[];      // Weapons (swords, bows, etc.)
  armor?: EquipmentOption;          // Single armor piece
  shield?: EquipmentOption;         // Single shield
  gear?: EquipmentOption[];         // Adventuring gear (backpack, rope, etc.)
  tools?: EquipmentOption[];        // Class-specific tools (thieves' tools, holy symbol, spellbook, etc.)
  ammo?: EquipmentOption[];         // Ammunition (arrows, bolts, sling bullets)
}

export interface TownieTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  
  // Base stats
  race?: string;
  classes?: Array<{ name: string; level: number }>;
  alignment?: string;
  primaryAbility?: "str" | "dex" | "con" | "int" | "wis" | "cha";
  
  // Ability scores (modifiers from base)
  abilities?: {
    str?: number;
    dex?: number;
    con?: number;
    int?: number;
    wis?: number;
    cha?: number;
  };
  
  // Common features
  skills?: Array<{ 
    name: string; 
    ranks: number;
    priority?: "high" | "medium" | "low";  // Distribution priority for leveling
  }>;
  feats?: Array<string | FeatConfig>;
  startingKit?: StartingKit;  // Starting equipment kit (replaces equipment)
  
  // Magic item budget overrides
  magicItemBudgets?: {
    // Armor/Shield split (what % of armor budget goes to shield vs armor)
    shieldPercent?: number;      // Default: 0.40 (levels 1-16) or 0.50 (levels 17+)
    armorPercent?: number;        // Default: 0.60 (levels 1-16) or 0.50 (levels 17+)
    // Secondary weapon budget (% of weapon budget for off-hand/ranged weapon)
    secondaryWeaponPercent?: number;  // Default: 0.50
    // Protection item split (ring vs amulet)
    ringPercent?: number;         // Default: 0.60
    amuletPercent?: number;       // Default: 0.40
  };
  
  // Budget configuration
  useStandardBudget?: boolean;  // Default: true. When false, NPC gets no magic items and only token gold.
  
  // Sheet type configuration
  usePcSheet?: boolean;  // Default: true. When false, use Simple NPC sheet.
  useMaxHpPerHD?: boolean;  // When true, use max HP per hit die instead of rolling
  
  // Ranger-specific
  rangerCombatStyle?: "archery" | "two-weapon";  // Determines Ranger combat style bonus feats
  favoredEnemies?: string[];  // Ranger favored enemies (1st, 5th, 10th, 15th, 20th)
  
  // Rogue-specific
  rogueSpecialAbilities?: string[];  // Rogue special abilities (10th, 13th, 16th, 19th)
  
  // Optional flavor
  personality?: string;
  background?: string;
}

export interface TownieFormData {
  name: string;
  template?: string;
  gender?: 'male' | 'female';  // Gender for name generation
  
  // Basic info
  race: string;
  classes: Array<{ name: string; level: number }>;
  className?: string;  // Single class name for simple input
  classLevel?: number; // Level for the class
  alignment: string;
  
  // Ability scores
  abilities: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  
  // Details
  personality?: string;
  background?: string;
  
  // Magic Item Budget Overrides (optional)
  magicItemBudgets?: {
    shieldPercent?: number;
    armorPercent?: number;
    secondaryWeaponPercent?: number;
    ringPercent?: number;
    amuletPercent?: number;
  };
  
  // Budget configuration
  useStandardBudget?: boolean;  // When false, NPC gets no magic items and only token gold
  
  // Sheet type configuration
  usePcSheet?: boolean;  // When true (default), use PC sheet; when false, use Simple NPC sheet
  useMaxHpPerHD?: boolean;  // When true, use max HP per hit die instead of rolling
  
  // Loot options
  identifyItems?: boolean;  // When true, magic items are identified; when false, they're unidentified for loot
  extraMoneyInBank?: boolean;  // When true, excess gold becomes a bank deposit slip
  bankName?: string;  // Name of the bank for deposit slips (default: "The First Bank of Lower Everbrook")
  
  // Token options
  tokenDisposition?: number;  // -1 = Hostile, 0 = Neutral, 1 = Friendly (default: 0)
  
  // Options
  autoRollHP: boolean;
  folder?: string;
}
