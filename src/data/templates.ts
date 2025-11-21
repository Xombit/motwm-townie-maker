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
    classes: [{ name: "Fighter", level: 2 }],
    alignment: "Lawful Neutral",
    abilities: { str: 14, dex: 12, con: 13, int: 10, wis: 11, cha: 8 }
  },
  {
    id: "merchant",
    name: "Merchant",
    description: "Shopkeeper or trader",
    icon: "fas fa-store",
    race: "Human",
    classes: [{ name: "Expert", level: 3 }],
    alignment: "Neutral",
    abilities: { str: 10, dex: 10, con: 12, int: 13, wis: 12, cha: 14 }
  },
  {
    id: "tavern-keeper",
    name: "Tavern Keeper",
    description: "Inn or tavern proprietor",
    icon: "fas fa-beer",
    race: "Human",
    classes: [{ name: "Commoner", level: 4 }],
    alignment: "Neutral Good",
    abilities: { str: 12, dex: 10, con: 13, int: 10, wis: 13, cha: 14 }
  },
  {
    id: "wizard-apprentice",
    name: "Wizard Apprentice",
    description: "Young magic user",
    icon: "fas fa-hat-wizard",
    race: "Human",
    classes: [{ name: "Wizard", level: 1 }],
    alignment: "Neutral",
    abilities: { str: 8, dex: 12, con: 10, int: 16, wis: 13, cha: 10 }
  },
  {
    id: "cleric-acolyte",
    name: "Cleric Acolyte",
    description: "Temple assistant or junior priest",
    icon: "fas fa-church",
    race: "Human",
    classes: [{ name: "Cleric", level: 2 }],
    alignment: "Lawful Good",
    abilities: { str: 12, dex: 8, con: 12, int: 10, wis: 15, cha: 13 }
  },
  {
    id: "rogue-thief",
    name: "Street Thief",
    description: "Pickpocket or burglar",
    icon: "fas fa-mask",
    race: "Halfling",
    classes: [{ name: "Rogue", level: 2 }],
    alignment: "Chaotic Neutral",
    abilities: { str: 8, dex: 16, con: 10, int: 12, wis: 10, cha: 13 }
  },
  {
    id: "noble",
    name: "Noble",
    description: "Aristocrat or wealthy merchant",
    icon: "fas fa-crown",
    race: "Human",
    classes: [{ name: "Aristocrat", level: 3 }],
    alignment: "Lawful Neutral",
    abilities: { str: 10, dex: 10, con: 11, int: 13, wis: 10, cha: 15 }
  },
  {
    id: "bandit",
    name: "Bandit",
    description: "Highway robber or outlaw",
    icon: "fas fa-skull-crossbones",
    race: "Human",
    classes: [{ name: "Warrior", level: 2 }],
    alignment: "Chaotic Neutral",
    abilities: { str: 13, dex: 14, con: 12, int: 8, wis: 10, cha: 9 }
  },
  {
    id: "ranger-scout",
    name: "Ranger Scout",
    description: "Wilderness guide or tracker",
    icon: "fas fa-tree",
    race: "Elf",
    classes: [{ name: "Ranger", level: 2 }],
    alignment: "Neutral Good",
    abilities: { str: 13, dex: 15, con: 11, int: 10, wis: 14, cha: 8 }
  }
];
