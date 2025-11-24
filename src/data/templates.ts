import { TownieTemplate } from "../types";

export const TOWNIE_TEMPLATES: TownieTemplate[] = [
  {
    id: "blank",
    name: "Blank Character",
    description: "Start from scratch with no presets",
    icon: "fas fa-user",
    abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }
  },
  {
    id: "town-guard",
    name: "Town Guard",
    description: "Basic city guard or soldier",
    icon: "fas fa-shield-alt",
    race: "Human",
    classes: [{ name: "Fighter", level: 1 }],
    alignment: "Lawful Neutral",
    abilities: { str: 14, dex: 12, con: 13, int: 10, wis: 11, cha: 8 },
    primaryAbility: "str",
    skills: [
      { name: "clm", ranks: 2, priority: "medium" },  // Climb
      { name: "int", ranks: 2, priority: "medium" },  // Intimidate
      { name: "jmp", ranks: 2, priority: "medium" },  // Jump
      { name: "rid", ranks: 2, priority: "medium" },  // Ride - for mounted guards
      // Total: 8 ranks (Fighter gets 2+Int(0) = 2 per level, x4 at 1st = 8)
      // All equal priority
    ],
    feats: [
      "Power Attack", 
      "Cleave", 
      { name: "Weapon Focus (No Weapon Selected)", displayName: "Weapon Focus (Longsword)", config: { weaponGroup: "Longsword" } },
      { name: "Weapon Specialization (No Weapon Selected)", displayName: "Weapon Specialization (Longsword)", config: { weaponGroup: "Longsword" } },
      { name: "Improved Critical (No Weapon Selected)", displayName: "Improved Critical (Longsword)", config: { weaponGroup: "Longsword" } },
      { name: "Greater Weapon Focus (No Weapon Selected)", displayName: "Greater Weapon Focus (Longsword)", config: { weaponGroup: "Longsword" } },
      { name: "Greater Weapon Specialization (No Weapon Selected)", displayName: "Greater Weapon Specialization (Longsword)", config: { weaponGroup: "Longsword" } },
      "Improved Sunder"
    ]
  },
  {
    id: "merchant",
    name: "Merchant",
    description: "Shopkeeper or trader",
    icon: "fas fa-store",
    race: "Human",
    classes: [{ name: "Expert (NPC)", level: 1 }],
    alignment: "Neutral",
    abilities: { str: 10, dex: 10, con: 12, int: 13, wis: 12, cha: 14 },
    primaryAbility: "cha",
    skills: [
      { name: "apr", ranks: 5, priority: "high" },  // Appraise - PRIMARY
      { name: "dip", ranks: 5, priority: "high" },  // Diplomacy - PRIMARY
      { name: "blf", ranks: 4, priority: "medium" },  // Bluff
      { name: "sen", ranks: 4, priority: "medium" },  // Sense Motive - detecting lies
      { name: "pro1:Merchant", ranks: 4, priority: "medium" },
      { name: "gif", ranks: 3, priority: "low" },  // Gather Information
      { name: "klo", ranks: 2, priority: "low" },  // Knowledge (Local) - knowing the market
      { name: "lis", ranks: 1, priority: "low" },  // Listen
      // Total: 28 ranks (Expert gets 6+Int(1) = 7 per level, x4 at 1st = 28)
      // High: core merchant skills, Medium: social, Low: utility
    ],
    feats: [
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Appraise)", config: { skill: "apr" } },
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Diplomacy)", config: { skill: "dip" } },
      "Negotiator", 
      "Persuasive", 
      "Alertness", 
      "Deceitful", 
      "Iron Will", 
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Bluff)", config: { skill: "blf" } }
    ]
  },
  {
    id: "tavern-keeper",
    name: "Tavern Keeper",
    description: "Inn or tavern proprietor",
    icon: "fas fa-beer",
    race: "Human",
    classes: [{ name: "Commoner (NPC)", level: 1 }],
    alignment: "Neutral Good",
    abilities: { str: 12, dex: 10, con: 13, int: 10, wis: 13, cha: 14 },
    primaryAbility: "cha",
    skills: [
      { name: "pro1:Innkeeper", ranks: 5, priority: "high" },  // Primary profession
      { name: "dip", ranks: 3, priority: "medium" },  // Diplomacy - social skills
      // Total: 8 ranks (Commoner gets 2+Int(0) = 2 per level, x4 at 1st = 8)
    ],
    feats: [
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Profession)", config: { skill: "pro1:Innkeeper" } },
      "Endurance", 
      "Toughness", 
      "Alertness", 
      "Persuasive", 
      "Iron Will", 
      "Great Fortitude", 
      "Diehard"
    ]
  },
  {
    id: "blacksmith",
    name: "Blacksmith",
    description: "Skilled metalworker and craftsman",
    icon: "fas fa-hammer",
    race: "Dwarf, Mountain",
    classes: [{ name: "Expert (NPC)", level: 1 }],
    alignment: "Lawful Neutral",
    abilities: { str: 15, dex: 10, con: 14, int: 12, wis: 11, cha: 8 },
    primaryAbility: "str",
    skills: [
      { name: "crf1:Weaponsmithing", ranks: 6, priority: "high" },  // Primary craft
      { name: "crf2:Armorsmithing", ranks: 5, priority: "high" },  // Secondary craft
      { name: "apr", ranks: 4, priority: "medium" },  // Appraise - valuing goods
      { name: "pro1:Blacksmith", ranks: 4, priority: "medium" },  // Profession
      { name: "clm", ranks: 2, priority: "low" },  // Climb
      { name: "han", ranks: 2, priority: "low" },  // Handle Animal
      { name: "int", ranks: 3, priority: "low" },  // Intimidate
      { name: "kar", ranks: 2, priority: "low" },  // Knowledge (Arcana)
      // Total: 28 ranks (Expert gets 6+Int(1) = 7 per level, x4 at 1st = 28)
    ],
    feats: [
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Craft)", config: { skill: "crf1:Weaponsmithing" } },
      "Endurance", 
      "Toughness", 
      "Master Craftsman", 
      "Power Attack", 
      "Great Fortitude", 
      "Diehard", 
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Appraise)", config: { skill: "apr" } }
    ]
  },
  {
    id: "innkeeper",
    name: "Innkeeper",
    description: "Welcoming host and local gossip",
    icon: "fas fa-bed",
    race: "Halfling, Lightfoot",
    classes: [{ name: "Commoner (NPC)", level: 1 }],
    alignment: "Neutral Good",
    abilities: { str: 10, dex: 12, con: 12, int: 11, wis: 13, cha: 15 },
    primaryAbility: "cha",
    skills: [
      { name: "pro1:Innkeeper", ranks: 5, priority: "high" },  // Primary profession
      { name: "dip", ranks: 2, priority: "medium" },  // Diplomacy
      { name: "sen", ranks: 1, priority: "low" },  // Sense Motive
      // Total: 8 ranks (Commoner gets 2+Int(0) = 2 per level, x4 at 1st = 8)
    ],
    feats: [
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Profession)", config: { skill: "pro1:Innkeeper" } },
      "Persuasive", 
      "Alertness", 
      "Negotiator", 
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Sense Motive)", config: { skill: "sen" } },
      "Iron Will", 
      "Lightning Reflexes", 
      "Dodge"
    ]
  },
  {
    id: "farmer",
    name: "Farmer",
    description: "Hardworking field laborer",
    icon: "fas fa-tractor",
    race: "Human",
    classes: [{ name: "Commoner (NPC)", level: 1 }],
    alignment: "Neutral Good",
    abilities: { str: 13, dex: 10, con: 14, int: 8, wis: 12, cha: 9 },
    primaryAbility: "con",
    skills: [
      { name: "pro1:Farmer", ranks: 2, priority: "medium" },  // Simple profession
      { name: "han", ranks: 1, priority: "medium" },  // Handle Animal
      { name: "sur", ranks: 1, priority: "medium" },  // Survival
      // Total: 4 ranks (Commoner gets 2+Int(-1) = 1 per level, x4 at 1st = 4)
      // All equal medium - no prime skills for simple farmer
    ],
    feats: [
      "Endurance", 
      "Toughness", 
      "Great Fortitude", 
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Profession)", config: { skill: "pro1:Farmer" } },
      "Diehard", 
      "Athletic", 
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Handle Animal)", config: { skill: "han" } },
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Survival)", config: { skill: "sur" } }
    ]
  },
  {
    id: "street-urchin",
    name: "Street Urchin",
    description: "Poor orphan surviving by wits",
    icon: "fas fa-child",
    race: "Human",
    classes: [{ name: "Commoner (NPC)", level: 1 }],
    alignment: "Chaotic Neutral",
    abilities: { str: 8, dex: 14, con: 10, int: 10, wis: 11, cha: 12 },
    primaryAbility: "dex",
    skills: [
      { name: "hid", ranks: 3, priority: "high" },  // Hide - survival skill
      { name: "mov", ranks: 2, priority: "high" },  // Move Silently - survival skill
      { name: "slt", ranks: 2, priority: "medium" },  // Sleight of Hand - pickpocketing
      { name: "blf", ranks: 1, priority: "low" },  // Bluff
      // Total: 8 ranks (Commoner gets 2+Int(0) = 2 per level, x4 at 1st = 8)
      // High: stealth for survival, Medium: thievery, Low: social
    ],
    feats: [
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Sleight of Hand)", config: { skill: "slt" } },
      "Dodge", 
      "Lightning Reflexes", 
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Hide)", config: { skill: "hid" } },
      "Alertness", 
      "Run", 
      "Mobility", 
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Move Silently)", config: { skill: "mov" } }
    ]
  },
  {
    id: "fortune-teller",
    name: "Fortune Teller",
    description: "Mystic seer of fates and futures",
    icon: "fas fa-crystal-ball",
    race: "Half-Elf",
    classes: [{ name: "Adept (NPC)", level: 1 }],
    abilities: { str: 8, dex: 10, con: 10, int: 11, wis: 14, cha: 15 },
    primaryAbility: "cha",
    skills: [
      { name: "kar", ranks: 4, priority: "high" },  // Knowledge (Arcana) - divination magic
      { name: "coc", ranks: 2, priority: "medium" },  // Concentration - spellcasting
      { name: "sen", ranks: 2, priority: "medium" },  // Sense Motive - reading people
      // Total: 8 ranks (Adept gets 2+Int(0) = 2 per level, x4 at 1st = 8)
      // High: magical knowledge, Medium: casting + insight
    ],
    feats: [
      { name: "Spell Focus (No Spell School Selected)", displayName: "Spell Focus (Divination)", config: { spellSchool: "div" } },
      "Alertness", 
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Knowledge (arcana))", config: { skill: "kar" } },
      "Iron Will", 
      "Eschew Materials", 
      { name: "Greater Spell Focus (No Spell School Selected)", displayName: "Greater Spell Focus (Divination)", config: { spellSchool: "div" } },
      "Empower Spell", 
      "Heighten Spell"
    ]
  },
  {
    id: "cultist",
    name: "Dark Cultist",
    description: "Devotee of sinister powers",
    icon: "fas fa-book-dead",
    race: "Human",
    classes: [{ name: "Adept (NPC)", level: 1 }],
    alignment: "Neutral Evil",
    abilities: { str: 10, dex: 10, con: 11, int: 10, wis: 14, cha: 12 },
    primaryAbility: "wis",
    skills: [
      { name: "kre", ranks: 4, priority: "high" },  // Knowledge (Religion) - dark worship
      { name: "coc", ranks: 2, priority: "medium" },  // Concentration - spellcasting
      { name: "kar", ranks: 2, priority: "low" },  // Knowledge (Arcana) - dark magic lore
      // Total: 8 ranks (Adept gets 2+Int(0) = 2 per level, x4 at 1st = 8)
      // High: religious knowledge, Medium: casting, Low: arcane lore
    ],
    feats: [
      { name: "Spell Focus (No Spell School Selected)", displayName: "Spell Focus (Necromancy)", config: { spellSchool: "nec" } },
      "Iron Will", 
      "Toughness", 
      "Combat Casting", 
      { name: "Greater Spell Focus (No Spell School Selected)", displayName: "Greater Spell Focus (Necromancy)", config: { spellSchool: "nec" } },
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Knowledge (religion))", config: { skill: "kre" } },
      "Empower Spell", 
      "Spell Penetration"
    ]
  },
  {
    id: "wizard-arcanist",
    name: "Wizard",
    description: "Scholar of arcane magic",
    icon: "fas fa-hat-wizard",
    race: "Human",
    classes: [{ name: "Wizard", level: 1 }],
    alignment: "Neutral",
    abilities: { str: 8, dex: 12, con: 10, int: 16, wis: 13, cha: 10 },
    primaryAbility: "int",
    skills: [
      { name: "spl", ranks: 6, priority: "high" },  // Spellcraft - PRIMARY
      { name: "coc", ranks: 5, priority: "high" },  // Concentration - PRIMARY
      { name: "kar", ranks: 4, priority: "medium" },  // Knowledge (Arcana)
      { name: "kpl", ranks: 2, priority: "low" },  // Knowledge (Planes)
      { name: "khi", ranks: 2, priority: "low" },  // Knowledge (History)
      { name: "kre", ranks: 1, priority: "low" },  // Knowledge (Religion)
      // Total: 20 ranks (Wizard gets 2+Int(3) = 5 per level, x4 at 1st = 20)
      // High priority skills get points every level, medium most levels, low fills gaps
    ],
    feats: [
      { name: "Spell Focus (No Spell School Selected)", displayName: "Spell Focus (Evocation)", config: { spellSchool: "evo" } },
      "Improved Initiative", 
      "Combat Casting", 
      { name: "Greater Spell Focus (No Spell School Selected)", displayName: "Greater Spell Focus (Evocation)", config: { spellSchool: "evo" } },
      "Empower Spell", 
      "Maximize Spell", 
      "Quicken Spell", 
      "Spell Penetration"
    ]
  },
  {
    id: "cleric-priest",
    name: "Cleric",
    description: "Divine spellcaster and healer",
    icon: "fas fa-church",
    race: "Human",
    classes: [{ name: "Cleric", level: 1 }],
    alignment: "Lawful Good",
    abilities: { str: 12, dex: 8, con: 12, int: 10, wis: 15, cha: 13 },
    primaryAbility: "wis",
    skills: [
      { name: "coc", ranks: 4, priority: "high" },  // Concentration - PRIMARY
      { name: "kre", ranks: 4, priority: "high" },  // Knowledge (Religion) - PRIMARY
      // Total: 8 ranks (Cleric gets 2+Int(0) = 2 per level, x4 at 1st = 8)
      // Both skills are equally important, grow together
    ],
    feats: [
      "Combat Casting", 
      { name: "Spell Focus (No Spell School Selected)", displayName: "Spell Focus (Conjuration)", config: { spellSchool: "con" } },
      "Extra Turning", 
      "Empower Spell", 
      "Quicken Spell", 
      { name: "Greater Spell Focus (No Spell School Selected)", displayName: "Greater Spell Focus (Conjuration)", config: { spellSchool: "con" } },
      "Maximize Spell", 
      "Augment Summoning"
    ]
  },
  {
    id: "adept-healer",
    name: "Village Healer",
    description: "Simple divine caster (NPC class)",
    icon: "fas fa-hand-holding-medical",
    race: "Human",
    classes: [{ name: "Adept (NPC)", level: 1 }],
    abilities: { str: 10, dex: 10, con: 11, int: 10, wis: 14, cha: 12 },
    primaryAbility: "wis",
    skills: [
      { name: "hea", ranks: 4, priority: "high" },  // Heal - primary healing skill
      { name: "coc", ranks: 2, priority: "medium" },  // Concentration - spellcasting
      { name: "sur", ranks: 2, priority: "low" },  // Survival - finding herbs
      // Total: 8 ranks (Adept gets 2+Int(0) = 2 per level, x4 at 1st = 8)
      // High: healing focus, Medium: casting, Low: herbalism utility
    ],
    feats: [
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Heal)", config: { skill: "hea" } },
      "Iron Will", 
      "Toughness", 
      "Alertness", 
      "Combat Casting", 
      "Great Fortitude", 
      "Endurance", 
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Survival)", config: { skill: "sur" } }
    ]
  },
  {
    id: "rogue-thief",
    name: "Street Thief",
    description: "Pickpocket or burglar",
    icon: "fas fa-mask",
    race: "Halfling, Lightfoot",
    classes: [{ name: "Rogue", level: 1 }],
    alignment: "Chaotic Neutral",
    abilities: { str: 8, dex: 16, con: 10, int: 12, wis: 10, cha: 13 },
    primaryAbility: "dex",
    skills: [
      { name: "hid", ranks: 5, priority: "high" },  // Hide - PRIMARY
      { name: "mov", ranks: 5, priority: "high" },  // Move Silently - PRIMARY
      { name: "opl", ranks: 4, priority: "high" },  // Open Lock
      { name: "dev", ranks: 4, priority: "medium" },  // Disable Device
      { name: "slt", ranks: 4, priority: "medium" },  // Sleight of Hand
      { name: "sea", ranks: 4, priority: "medium" },  // Search
      { name: "spt", ranks: 3, priority: "low" },  // Spot
      { name: "lis", ranks: 3, priority: "low" },  // Listen
      { name: "tmb", ranks: 2, priority: "low" },  // Tumble
      { name: "clm", ranks: 1, priority: "low" },  // Climb
      { name: "esc", ranks: 1, priority: "low" },  // Escape Artist
      // Total: 36 ranks (Rogue gets 8+Int(1) = 9 per level, x4 at 1st = 36)
      // High: stealth and lockpicking, Medium: core skills, Low: utility
    ],
    feats: [
      "Dodge", 
      "Mobility", 
      "Weapon Finesse", 
      "Improved Initiative", 
      "Spring Attack", 
      "Lightning Reflexes", 
      "Improved Evasion", 
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Hide)", config: { skill: "hid" } }
    ]
  },
  {
    id: "noble",
    name: "Noble",
    description: "Aristocrat or wealthy merchant",
    icon: "fas fa-crown",
    race: "Human",
    classes: [{ name: "Aristocrat (NPC)", level: 1 }],
    alignment: "Lawful Neutral",
    abilities: { str: 10, dex: 10, con: 11, int: 13, wis: 10, cha: 15 },
    primaryAbility: "cha",
    skills: [
      { name: "dip", ranks: 5, priority: "high" },  // Diplomacy - primary social skill
      { name: "kno", ranks: 4, priority: "high" },  // Knowledge (Nobility) - important
      { name: "sen", ranks: 4, priority: "medium" },  // Sense Motive - politics
      { name: "apr", ranks: 3, priority: "medium" },  // Appraise - wealth assessment
      { name: "rid", ranks: 2, priority: "low" },  // Ride
      { name: "gif", ranks: 2, priority: "low" },  // Gather Information
      // Total: 20 ranks (Aristocrat gets 4+Int(1) = 5 per level, x4 at 1st = 20)
      // High: diplomacy + nobility, Medium: insight + appraisal, Low: utility
    ],
    feats: [
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Diplomacy)", config: { skill: "dip" } },
      "Persuasive", 
      "Negotiator", 
      "Leadership", 
      "Iron Will", 
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Knowledge (nobility))", config: { skill: "kno" } },
      "Mounted Combat", 
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Ride)", config: { skill: "rid" } }
    ]
  },
  {
    id: "bandit",
    name: "Bandit",
    description: "Highway robber or outlaw",
    icon: "fas fa-skull-crossbones",
    race: "Human",
    classes: [{ name: "Warrior (NPC)", level: 1 }],
    alignment: "Chaotic Neutral",
    abilities: { str: 13, dex: 14, con: 12, int: 8, wis: 10, cha: 9 },
    primaryAbility: "dex",
    skills: [
      { name: "hid", ranks: 2, priority: "high" },  // Hide - ambush stealth
      { name: "mov", ranks: 2, priority: "high" },  // Move Silently - ambush stealth
      // Total: 4 ranks (Warrior gets 2+Int(-1) = 1 per level, x4 at 1st = 4)
      // High: stealth for ambushing travelers
    ],
    feats: [
      "Point Blank Shot", 
      "Rapid Shot", 
      { name: "Weapon Focus (No Weapon Selected)", displayName: "Weapon Focus (Shortbow)", config: { weaponGroup: "Shortbow" } },
      "Far Shot", 
      "Manyshot", 
      { name: "Improved Critical (No Weapon Selected)", displayName: "Improved Critical (Shortbow)", config: { weaponGroup: "Shortbow" } },
      { name: "Weapon Specialization (No Weapon Selected)", displayName: "Weapon Specialization (Shortbow)", config: { weaponGroup: "Shortbow" } },
      "Precise Shot"
    ]
  },
  {
    id: "ranger-scout",
    name: "Ranger Scout",
    description: "Wilderness guide or tracker",
    icon: "fas fa-tree",
    race: "Elf, High",
    classes: [{ name: "Ranger", level: 1 }],
    alignment: "Neutral Good",
    abilities: { str: 13, dex: 15, con: 11, int: 10, wis: 14, cha: 8 },
    primaryAbility: "dex",
    skills: [
      { name: "sur", ranks: 5, priority: "high" },  // Survival - PRIMARY tracking skill
      { name: "spt", ranks: 4, priority: "high" },  // Spot
      { name: "lis", ranks: 4, priority: "high" },  // Listen
      { name: "hid", ranks: 4, priority: "medium" },  // Hide
      { name: "mov", ranks: 3, priority: "medium" },  // Move Silently
      { name: "sea", ranks: 2, priority: "low" },  // Search
      { name: "kna", ranks: 2, priority: "low" },  // Knowledge (Nature)
      // Total: 24 ranks (Ranger gets 6+Int(0) = 6 per level, x4 at 1st = 24)
      // High priority: Survival, Spot, Listen grow every level
    ],
    feats: [
      "Track", 
      "Point Blank Shot", 
      "Rapid Shot", 
      "Endurance", 
      "Manyshot", 
      { name: "Improved Critical (No Weapon Selected)", displayName: "Improved Critical (Longbow)", config: { weaponGroup: "Longbow" } },
      { name: "Greater Weapon Focus (No Weapon Selected)", displayName: "Greater Weapon Focus (Longbow)", config: { weaponGroup: "Longbow" } },
      "Precise Shot"
    ]
  },
  {
    id: "barbarian-tribal",
    name: "Tribal Warrior",
    description: "Fierce warrior from the wilderness",
    icon: "fas fa-axe-battle",
    race: "Half-Orc",
    classes: [{ name: "Barbarian", level: 1 }],
    alignment: "Chaotic Neutral",
    abilities: { str: 16, dex: 14, con: 15, int: 8, wis: 10, cha: 8 },
    primaryAbility: "str",
    skills: [
      { name: "clm", ranks: 3, priority: "medium" },  // Climb
      { name: "jmp", ranks: 3, priority: "medium" },  // Jump
      { name: "int", ranks: 3, priority: "medium" },  // Intimidate
      { name: "sur", ranks: 3, priority: "medium" },  // Survival
      // Total: 12 ranks (Barbarian gets 4+Int(-1) = 3 per level, x4 at 1st = 12)
      // All medium priority - even distribution, no prime skills
    ],
    feats: [
      "Power Attack", 
      "Cleave", 
      "Great Cleave", 
      "Improved Bull Rush", 
      "Improved Overrun", 
      { name: "Weapon Focus (No Weapon Selected)", displayName: "Weapon Focus (Greataxe)", config: { weaponGroup: "Greataxe" } },
      { name: "Improved Critical (No Weapon Selected)", displayName: "Improved Critical (Greataxe)", config: { weaponGroup: "Greataxe" } },
      "Improved Sunder"
    ]
  },
  {
    id: "bard-minstrel",
    name: "Traveling Minstrel",
    description: "Entertainer and storyteller",
    icon: "fas fa-music",
    race: "Half-Elf",
    classes: [{ name: "Bard", level: 1 }],
    alignment: "Chaotic Good",
    abilities: { str: 10, dex: 14, con: 10, int: 12, wis: 10, cha: 16 },
    primaryAbility: "cha",
    skills: [
      { name: "prf1:Sing", ranks: 6, priority: "high" },  // PRIMARY performance
      { name: "prf2:String instruments", ranks: 5, priority: "high" },  // Secondary performance
      { name: "dip", ranks: 4, priority: "medium" },  // Diplomacy
      { name: "blf", ranks: 4, priority: "medium" },  // Bluff
      { name: "sen", ranks: 3, priority: "medium" },  // Sense Motive
      { name: "gif", ranks: 3, priority: "low" },  // Gather Information
      { name: "klo", ranks: 2, priority: "low" },  // Knowledge (Local)
      { name: "khi", ranks: 1, priority: "low" },  // Knowledge (History)
      // Total: 28 ranks (Bard gets 6+Int(1) = 7 per level, x4 at 1st = 28)
      // High: Perform skills, Medium: social, Low: knowledge
    ],
    feats: [
      "Dodge", 
      { name: "Spell Focus (No Spell School Selected)", displayName: "Spell Focus (Enchantment)", config: { spellSchool: "enc" } },
      { name: "Skill Focus (undefined)", displayName: "Skill Focus (Perform)", config: { skill: "prf1:Sing" } },
      "Combat Casting", 
      "Mobility", 
      "Weapon Finesse", 
      "Improved Initiative", 
      "Lightning Reflexes"
    ]
  },
  {
    id: "druid-hermit",
    name: "Forest Hermit",
    description: "Guardian of nature and the wild",
    icon: "fas fa-leaf",
    race: "Human",
    classes: [{ name: "Druid", level: 1 }],
    alignment: "True Neutral",
    abilities: { str: 10, dex: 10, con: 13, int: 10, wis: 16, cha: 12 },
    primaryAbility: "wis",
    skills: [
      { name: "coc", ranks: 4, priority: "high" },  // Concentration - spellcasting
      { name: "kna", ranks: 5, priority: "high" },  // Knowledge (Nature) - primary skill
      { name: "sur", ranks: 3, priority: "medium" },  // Survival - wilderness
      { name: "han", ranks: 2, priority: "low" },  // Handle Animal - animal companion
      { name: "spt", ranks: 2, priority: "low" },  // Spot - awareness
      // Total: 16 ranks (Druid gets 4+Int(0) = 4 per level, x4 at 1st = 16)
      // High: nature magic, Medium: wilderness survival, Low: utility
    ],
    feats: [
      "Natural Spell", 
      "Augment Summoning", 
      { name: "Spell Focus (No Spell School Selected)", displayName: "Spell Focus (Conjuration)", config: { spellSchool: "con" } },
      "Combat Casting", 
      { name: "Greater Spell Focus (No Spell School Selected)", displayName: "Greater Spell Focus (Conjuration)", config: { spellSchool: "con" } },
      "Empower Spell", 
      "Quicken Spell", 
      "Spell Penetration"
    ]
  },
  {
    id: "monk-disciple",
    name: "Monastery Disciple",
    description: "Martial artist and ascetic",
    icon: "fas fa-om",
    race: "Human",
    classes: [{ name: "Monk", level: 1 }],
    alignment: "Lawful Neutral",
    abilities: { str: 12, dex: 16, con: 12, int: 10, wis: 14, cha: 8 },
    primaryAbility: "dex",
    skills: [
      { name: "tmb", ranks: 5, priority: "high" },  // Tumble - primary acrobatic skill
      { name: "bal", ranks: 4, priority: "high" },  // Balance - acrobatic skill
      { name: "jmp", ranks: 3, priority: "medium" },  // Jump - mobility
      { name: "mov", ranks: 2, priority: "low" },  // Move Silently - stealth
      { name: "hid", ranks: 2, priority: "low" },  // Hide - stealth
      // Total: 16 ranks (Monk gets 4+Int(0) = 4 per level, x4 at 1st = 16)
      // High: acrobatics, Medium: mobility, Low: stealth
    ],
    feats: ["Improved Unarmed Strike", "Dodge", "Improved Grapple", "Deflect Arrows", "Mobility", "Spring Attack", "Improved Initiative", "Lightning Reflexes"]
  },
  {
    id: "paladin-knight",
    name: "Holy Knight",
    description: "Righteous champion of good",
    icon: "fas fa-cross",
    race: "Human",
    classes: [{ name: "Paladin", level: 1 }],
    alignment: "Lawful Good",
    abilities: { str: 15, dex: 10, con: 13, int: 10, wis: 12, cha: 14 },
    primaryAbility: "str",
    skills: [
      { name: "rid", ranks: 5, priority: "high" },  // Ride - for their mount (signature ability)
      { name: "kre", ranks: 2, priority: "medium" },  // Knowledge (Religion) - divine connection
      { name: "dip", ranks: 1, priority: "low" },  // Diplomacy - social skill
      // Total: 8 ranks (Paladin gets 2+Int(0) = 2 per level, x4 at 1st = 8)
      // High: mounted combat, Medium: religion, Low: diplomacy
    ],
    feats: [
      "Power Attack", 
      "Cleave", 
      { name: "Weapon Focus (No Weapon Selected)", displayName: "Weapon Focus (Longsword)", config: { weaponGroup: "Longsword" } },
      "Mounted Combat", 
      "Great Cleave", 
      { name: "Weapon Specialization (No Weapon Selected)", displayName: "Weapon Specialization (Longsword)", config: { weaponGroup: "Longsword" } },
      { name: "Improved Critical (No Weapon Selected)", displayName: "Improved Critical (Longsword)", config: { weaponGroup: "Longsword" } },
      "Ride-By Attack"
    ]
  },
  {
    id: "sorcerer-bloodline",
    name: "Born Spellcaster",
    description: "Innate magic wielder",
    icon: "fas fa-dragon",
    race: "Human",
    classes: [{ name: "Sorcerer", level: 1 }],
    abilities: { str: 8, dex: 12, con: 13, int: 10, wis: 10, cha: 16 },
    primaryAbility: "cha",
    skills: [
      { name: "coc", ranks: 5, priority: "high" },  // Concentration - primary spellcasting
      { name: "blf", ranks: 2, priority: "medium" },  // Bluff - natural charisma
      { name: "kar", ranks: 1, priority: "low" },  // Knowledge (Arcana) - innate, not studied
      // Total: 8 ranks (Sorcerer gets 2+Int(0) = 2 per level, x4 at 1st = 8)
      // High: casting, Medium: social, Low: knowledge (innate magic, not studied)
    ],
    feats: [
      { name: "Spell Focus (No Spell School Selected)", displayName: "Spell Focus (Evocation)", config: { spellSchool: "evo" } },
      "Combat Casting", 
      "Improved Initiative", 
      { name: "Greater Spell Focus (No Spell School Selected)", displayName: "Greater Spell Focus (Evocation)", config: { spellSchool: "evo" } },
      "Empower Spell", 
      "Quicken Spell", 
      "Maximize Spell", 
      "Spell Penetration"
    ]
  }
];

