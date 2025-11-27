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

// Starting equipment kit - all items listed individually
export interface StartingKit {
  weapons?: EquipmentItem[];      // Weapons (swords, bows, etc.)
  armor?: EquipmentItem;          // Single armor piece
  shield?: EquipmentItem;         // Single shield
  gear?: EquipmentItem[];         // Adventuring gear (backpack, rope, etc.)
  tools?: EquipmentItem[];        // Class-specific tools (thieves' tools, holy symbol, spellbook, etc.)
  ammo?: EquipmentItem[];         // Ammunition (arrows, bolts, sling bullets)
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
  
  // Options
  autoRollHP: boolean;
  folder?: string;
}
