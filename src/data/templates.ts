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
      { name: "clm", ranks: 2 },  // Climb
      { name: "int", ranks: 2 },  // Intimidate
      { name: "jmp", ranks: 2 },  // Jump
      { name: "rid", ranks: 2 },  // Ride - for mounted guards
      // Total: 8 ranks (Fighter gets 2+Int(0) = 2 per level, x4 at 1st = 8)
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
      { name: "apr", ranks: 4 },  // Appraise
      { name: "dip", ranks: 4 },  // Diplomacy
      { name: "blf", ranks: 4 },  // Bluff
      { name: "sen", ranks: 4 },  // Sense Motive - detecting lies
      { name: "pro1:Merchant", ranks: 4 },
      { name: "gif", ranks: 4 },  // Gather Information
      { name: "klo", ranks: 2 },  // Knowledge (Local) - knowing the market
      { name: "lis", ranks: 2 },  // Listen
      // Total: 28 ranks (Expert gets 6+Int(1) = 7 per level, x4 at 1st = 28)
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
      { name: "pro1:Innkeeper", ranks: 4 },
      { name: "dip", ranks: 4 },  // Diplomacy
      // Total: 8 ranks (Commoner gets 2+Int(0) = 2 per level, x4 at 1st = 8)
      // With 18 Int: 2+4 = 6, x4 = 24 ranks available
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
      { name: "crf1:Weaponsmithing", ranks: 4 },
      { name: "crf2:Armorsmithing", ranks: 4 },
      { name: "apr", ranks: 4 },  // Appraise - for valuing goods
      { name: "pro1:Blacksmith", ranks: 4 },
      { name: "clm", ranks: 2 },  // Climb
      { name: "han", ranks: 2 },  // Handle Animal - for working with horses
      { name: "int", ranks: 2 },  // Intimidate
      { name: "kar", ranks: 2 },  // Knowledge (Arcana) - for magical items
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
      { name: "pro1:Innkeeper", ranks: 4 },
      { name: "dip", ranks: 2 },  // Diplomacy
      { name: "sen", ranks: 2 },  // Sense Motive
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
      { name: "pro1:Farmer", ranks: 2 },
      { name: "han", ranks: 1 },  // Handle Animal
      { name: "sur", ranks: 1 },  // Survival
      // Total: 4 ranks (Commoner gets 2+Int(-1) = 1 per level, x4 at 1st = 4)
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
      { name: "hid", ranks: 2 },  // Hide
      { name: "mov", ranks: 2 },  // Move Silently
      { name: "slt", ranks: 2 },  // Sleight of Hand
      { name: "blf", ranks: 2 },  // Bluff
      // Total: 8 ranks (Commoner gets 2+Int(0) = 2 per level, x4 at 1st = 8)
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
    alignment: "Chaotic Neutral",
    abilities: { str: 8, dex: 10, con: 10, int: 11, wis: 14, cha: 15 },
    primaryAbility: "cha",
    skills: [
      { name: "kar", ranks: 4 },  // Knowledge (Arcana) - divination magic
      { name: "coc", ranks: 2 },  // Concentration
      { name: "sen", ranks: 2 },  // Sense Motive - reading people
      // Total: 8 ranks (Adept gets 2+Int(0) = 2 per level, x4 at 1st = 8)
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
      { name: "kre", ranks: 4 },  // Knowledge (Religion) - dark worship
      { name: "coc", ranks: 2 },  // Concentration
      { name: "kar", ranks: 2 },  // Knowledge (Arcana) - dark magic
      // Total: 8 ranks (Adept gets 2+Int(0) = 2 per level, x4 at 1st = 8)
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
      { name: "spl", ranks: 4 },  // Spellcraft
      { name: "kar", ranks: 4 },  // Knowledge (Arcana)
      { name: "khi", ranks: 2 },  // Knowledge (History)
      { name: "kpl", ranks: 2 },  // Knowledge (Planes)
      { name: "kre", ranks: 2 },  // Knowledge (Religion)
      { name: "coc", ranks: 4 },  // Concentration
      { name: "kdu", ranks: 2 },  // Knowledge (Dungeoneering)
      // Total: 20 ranks (Wizard gets 2+Int(3) = 5 per level, x4 at 1st = 20)
      // With 18 Int: 2+4 = 6, x4 = 24 ranks available
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
      { name: "coc", ranks: 4 },  // Concentration
      { name: "kre", ranks: 4 },  // Knowledge (Religion)
      // Total: 8 ranks (Cleric gets 2+Int(0) = 2 per level, x4 at 1st = 8)
      // With 18 Int: 2+4 = 6, x4 = 24 ranks available
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
    alignment: "Neutral Good",
    abilities: { str: 10, dex: 10, con: 11, int: 10, wis: 14, cha: 12 },
    primaryAbility: "wis",
    skills: [
      { name: "hea", ranks: 4 },  // Heal - primary healing skill
      { name: "coc", ranks: 2 },  // Concentration
      { name: "sur", ranks: 2 },  // Survival - finding herbs
      // Total: 8 ranks (Adept gets 2+Int(0) = 2 per level, x4 at 1st = 8)
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
      { name: "hid", ranks: 4 },  // Hide
      { name: "mov", ranks: 4 },  // Move Silently
      { name: "slt", ranks: 4 },  // Sleight of Hand
      { name: "opl", ranks: 4 },  // Open Lock
      { name: "dev", ranks: 4 },  // Disable Device
      { name: "sea", ranks: 4 },  // Search
      { name: "spt", ranks: 2 },  // Spot
      { name: "lis", ranks: 2 },  // Listen
      { name: "clm", ranks: 2 },  // Climb
      { name: "tmb", ranks: 2 },  // Tumble
      { name: "esc", ranks: 2 },  // Escape Artist
      { name: "blf", ranks: 2 },  // Bluff
      // Total: 36 ranks (Rogue gets 8+Int(1) = 9 per level, x4 at 1st = 36)
      // With 18 Int: 8+4 = 12, x4 = 48 ranks available
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
      { name: "dip", ranks: 4 },  // Diplomacy
      { name: "kno", ranks: 4 },  // Knowledge (Nobility)
      { name: "rid", ranks: 4 },  // Ride
      { name: "sen", ranks: 4 },  // Sense Motive - politics
      { name: "apr", ranks: 2 },  // Appraise - wealth assessment
      { name: "gif", ranks: 2 },  // Gather Information
      // Total: 20 ranks (Aristocrat gets 4+Int(1) = 5 per level, x4 at 1st = 20)
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
      { name: "hid", ranks: 2 },  // Hide
      { name: "mov", ranks: 2 },  // Move Silently
      // Total: 4 ranks (Warrior gets 2+Int(-1) = 1 per level, x4 at 1st = 4)
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
      { name: "sur", ranks: 4 },  // Survival - tracking and wilderness
      { name: "spt", ranks: 4 },  // Spot
      { name: "lis", ranks: 4 },  // Listen
      { name: "hid", ranks: 4 },  // Hide
      { name: "mov", ranks: 4 },  // Move Silently
      { name: "sea", ranks: 2 },  // Search
      { name: "kna", ranks: 2 },  // Knowledge (Nature)
      // Total: 24 ranks (Ranger gets 6+Int(0) = 6 per level, x4 at 1st = 24)
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
      { name: "clm", ranks: 4 },  // Climb
      { name: "jmp", ranks: 4 },  // Jump
      { name: "int", ranks: 2 },  // Intimidate
      { name: "sur", ranks: 2 },  // Survival
      // Total: 12 ranks (Barbarian gets 4+Int(-1) = 3 per level, x4 at 1st = 12)
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
      { name: "prf1:Sing", ranks: 4 },
      { name: "prf2:String instruments", ranks: 4 },
      { name: "dip", ranks: 4 },  // Diplomacy
      { name: "blf", ranks: 4 },  // Bluff
      { name: "sen", ranks: 4 },  // Sense Motive
      { name: "gif", ranks: 4 },  // Gather Information
      { name: "klo", ranks: 2 },  // Knowledge (Local)
      { name: "khi", ranks: 2 },  // Knowledge (History)
      // Total: 28 ranks (Bard gets 6+Int(1) = 7 per level, x4 at 1st = 28)
      // With 18 Int: 6+4 = 10, x4 = 40 ranks available
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
      { name: "coc", ranks: 4 },  // Concentration
      { name: "kna", ranks: 4 },  // Knowledge (Nature)
      { name: "sur", ranks: 4 },  // Survival
      { name: "han", ranks: 2 },  // Handle Animal
      { name: "spt", ranks: 2 },  // Spot
      // Total: 16 ranks (Druid gets 4+Int(0) = 4 per level, x4 at 1st = 16)
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
      { name: "tmb", ranks: 4 },  // Tumble
      { name: "bal", ranks: 4 },  // Balance
      { name: "jmp", ranks: 4 },  // Jump
      { name: "mov", ranks: 2 },  // Move Silently
      { name: "hid", ranks: 2 },  // Hide
      // Total: 16 ranks (Monk gets 4+Int(0) = 4 per level, x4 at 1st = 16)
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
      { name: "rid", ranks: 4 },  // Ride - for their mount
      { name: "kre", ranks: 2 },  // Knowledge (Religion)
      { name: "dip", ranks: 2 },  // Diplomacy
      // Total: 8 ranks (Paladin gets 2+Int(0) = 2 per level, x4 at 1st = 8)
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
    alignment: "Chaotic Neutral",
    abilities: { str: 8, dex: 12, con: 13, int: 10, wis: 10, cha: 16 },
    primaryAbility: "cha",
    skills: [
      { name: "coc", ranks: 4 },  // Concentration
      { name: "blf", ranks: 2 },  // Bluff - natural charisma
      { name: "kar", ranks: 2 },  // Knowledge (Arcana)
      // Total: 8 ranks (Sorcerer gets 2+Int(0) = 2 per level, x4 at 1st = 8)
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

