// Type definitions for Townie Maker
export interface TownieTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  
  // Base stats
  race?: string;
  classes?: Array<{ name: string; level: number }>;
  alignment?: string;
  
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
  skills?: Array<{ name: string; ranks: number }>;
  feats?: string[];
  equipment?: string[];
  
  // Optional flavor
  personality?: string;
  background?: string;
}

export interface TownieFormData {
  name: string;
  template?: string;
  
  // Basic info
  race: string;
  classes: Array<{ name: string; level: number }>;
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
