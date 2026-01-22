# D35E System Structure - Research Notes

## Purpose
This document tracks what we learn about the D35E system's data structure for creating complete, functional actors.

---

## Compendium Discovery

### How to Inspect
Run these commands in Foundry's console (F12):
```javascript
// List all available compendium packs
MOTWM_TOWNIE.debugCompendiums()

// Inspect a specific pack in detail
MOTWM_TOWNIE.debugPack('pack-id-here')
```

### Compendiums Found
<!-- Fill this in after running debugCompendiums() -->
```
📦 D35E
main.ts:90   D35E.classes
main.ts:91     Label: Classes
main.ts:92     Type: Item
main.ts:93     System: D35E
Promise {<pending>}
foundry.js:16235 Foundry VTT | Constructed index of D35E.classes Compendium containing 33 entries
main.ts:98     Items: 33
main.ts:90   D35E.minion-classes
main.ts:91     Label: Minion Classes
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.minion-classes Compendium containing 4 entries
main.ts:98     Items: 4
main.ts:90   D35E.commonbuffs
main.ts:91     Label: Common Buffs
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.commonbuffs Compendium containing 197 entries
main.ts:98     Items: 197
main.ts:90   D35E.spell-items
main.ts:91     Label: Spell Items
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.spell-items Compendium containing 4 entries
main.ts:98     Items: 4
main.ts:90   D35E.common-auras
main.ts:91     Label: Common Auras
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.common-auras Compendium containing 7 entries
main.ts:98     Items: 7
main.ts:90   D35E.item-buffs
main.ts:91     Label: Item Buffs
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.item-buffs Compendium containing 1 entries
main.ts:98     Items: 1
main.ts:90   D35E.magicitems
main.ts:91     Label: Magic Items
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.magicitems Compendium containing 636 entries
main.ts:98     Items: 636
main.ts:90   D35E.racialfeatures
main.ts:91     Label: Races
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.racialfeatures Compendium containing 32 entries
main.ts:98     Items: 32
main.ts:90   D35E.racial-abilities
main.ts:91     Label: Racial Abilities
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.racial-abilities Compendium containing 41 entries
main.ts:98     Items: 41
main.ts:90   D35E.natural-attacks
main.ts:91     Label: Natural Attacks
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.natural-attacks Compendium containing 14 entries
main.ts:98     Items: 14
main.ts:90   D35E.class-abilities
main.ts:91     Label: Class Abilities
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.class-abilities Compendium containing 130 entries
main.ts:98     Items: 130
main.ts:90   D35E.spelllike
main.ts:91     Label: Spell-Like Abilities
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.spelllike Compendium containing 62 entries
main.ts:98     Items: 62
main.ts:90   D35E.spells
main.ts:91     Label: Spells
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.spells Compendium containing 674 entries
main.ts:98     Items: 674
main.ts:90   D35E.spell-schools-domains
main.ts:91     Label: Spell Schools and Domains
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.spell-schools-domains Compendium containing 43 entries
main.ts:98     Items: 43
main.ts:90   D35E.templates
main.ts:91     Label: Templates
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.templates Compendium containing 11 entries
main.ts:98     Items: 11
main.ts:90   D35E.powers
main.ts:91     Label: Powers
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.powers Compendium containing 441 entries
main.ts:98     Items: 441
main.ts:90   D35E.feats
main.ts:91     Label: Feats
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.feats Compendium containing 388 entries
main.ts:98     Items: 388
main.ts:90   D35E.items
main.ts:91     Label: Items
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.items Compendium containing 129 entries
main.ts:98     Items: 129
main.ts:90   D35E.armors-and-shields
main.ts:91     Label: Armor and Shields
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.armors-and-shields Compendium containing 18 entries
main.ts:98     Items: 18
main.ts:90   D35E.enhancements
main.ts:91     Label: Enhancements
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.enhancements Compendium containing 88 entries
main.ts:98     Items: 88
main.ts:90   D35E.weapons-and-ammo
main.ts:91     Label: Weapons and Ammo
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.weapons-and-ammo Compendium containing 85 entries
main.ts:98     Items: 85
main.ts:90   D35E.racialhd
main.ts:91     Label: Racial HD
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.racialhd Compendium containing 15 entries
main.ts:98     Items: 15
main.ts:90   D35E.materials
main.ts:91     Label: Materials
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.materials Compendium containing 17 entries
main.ts:98     Items: 17
main.ts:90   D35E.damage-types
main.ts:91     Label: Damage Types
main.ts:92     Type: Item
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.damage-types Compendium containing 22 entries
main.ts:98     Items: 22
main.ts:90   D35E.srd-rules
main.ts:91     Label: SRD Rules Extended Descriptions
main.ts:92     Type: JournalEntry
main.ts:93     System: D35E
main.ts:98     Items: 4
main.ts:90   D35E.sample-macros
main.ts:91     Label: Sample Macros
main.ts:92     Type: Macro
main.ts:93     System: D35E
main.ts:98     Items: 2
main.ts:90   D35E.roll-tables
main.ts:91     Label: Roll Tables
main.ts:92     Type: RollTable
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.roll-tables Compendium containing 47 entries
main.ts:98     Items: 47
main.ts:90   D35E.item-roll-tables
main.ts:91     Label: Item Roll Tables
main.ts:92     Type: RollTable
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.item-roll-tables Compendium containing 4 entries
main.ts:98     Items: 4
main.ts:90   D35E.summoning-roll-tables
main.ts:91     Label: Summoning Roll Tables
main.ts:92     Type: RollTable
main.ts:93     System: D35E
foundry.js:16235 Foundry VTT | Constructed index of D35E.summoning-roll-tables Compendium containing 46 entries
main.ts:98     Items: 46
main.ts:90   D35E.bestiary
main.ts:91     Label: Bestiary
main.ts:92     Type: Actor
main.ts:93     System: D35E
main.ts:98     Items: 645
main.ts:90   D35E.minion
main.ts:91     Label: Minions (Familiars, Animal Companions)
main.ts:92     Type: Actor
main.ts:93     System: D35E
main.ts:98     Items: 12
main.ts:90   D35E.sample-chars
main.ts:91     Label: Sample Characters
main.ts:92     Type: Actor
main.ts:93     System: D35E
main.ts:98     Items: 11
main.ts:90   D35E.summon
main.ts:91     Label: Summoned Bestiary
main.ts:92     Type: Actor
main.ts:93     System: D35E
main.ts:98     Items: 224
main.ts:90   D35E.traps
main.ts:91     Label: Traps
main.ts:92     Type: Actor
main.ts:93     System: D35E
main.ts:98     Items: 1
main.ts:90   D35E.conditions
main.ts:91     Label: Conditions
main.ts:92     Type: JournalEntry
main.ts:93     System: D35E
main.ts:98     Items: 38
main.ts:90   D35E.docs
main.ts:91     Label: Documentation
main.ts:92     Type: JournalEntry
main.ts:93     System: D35E
main.ts:98     Items: 3
main.ts:90   D35E.scenes
main.ts:91     Label: Scenes
main.ts:92     Type: Scene
main.ts:93     System: D35E
main.ts:98     Items: 1
```

---

## Detailed Compendium Inspection

### D35E.racialfeatures (Races - 32 entries)
Run: `MOTWM_TOWNIE.debugPack('D35E.racialfeatures')`

```javascript
Document Keys:
[
    "name",
    "type",
    "img",
    "system",
    "sort",
    "ownership",
    "flags",
    "_stats",
    "custom",
    "labels",
    "extensionMap",
    "rolls",
    "charge",
    "uses",
    "combatChanges"
]
System Data Keys:
[
    "originVersion",
    "originPack",
    "originId",
    "possibleUpdate",
    "description",
    "epic",
    "psionic",
    "nameFormula",
    "nameFromFormula",
    "tags",
    "uniqueId",
    "addedLevel",
    "linkId",
    "linkSourceId",
    "linkImported",
    "linkSourceName",
    "source",
    "classSource",
    "userNonRemovable",
    "customAttributes",
    "customAttributesLocked",
    "customTag",
    "createdBy",
    "changes",
    "changeFlags",
    "conditionFlags",
    "combatChanges",
    "combatChangesRange",
    "combatChangesAdditionalRanges",
    "combatChangesUsesCost",
    "combatChangesApplySpecialActionsOnce",
    "combatChangeCustomDisplayName",
    "combatChangeCustomReferenceName",
    "sizeOverride",
    "counterName",
    "resistances",
    "damageReduction",
    "requirements",
    "creationChanges",
    "contextNotes",
    "links",
    "creatureType",
    "la",
    "subTypes",
    "addedAbilities",
    "disabledAbilities",
    "damage",
    "index"
]
Full Sample:
{
    "_id": "31Soj8n1GtpbeaES",
    "name": "Dromite",
    "type": "race",
    "img": "systems/D35E/icons/races/dromite.png",
    "effects": [],
    "folder": null,
    "sort": 0,
    "flags": {
        "core": {
            "sourceId": "Compendium.D35E.racialfeatures.31Soj8n1GtpbeaES"
        }
    },
    "system": {
        "originVersion": 99,
        "originPack": "",
        "originId": "",
        "possibleUpdate": false,
        "description": {
            "value": "<p>Dromites stand about 3 feet tall and usually weigh slightly more than 30 pounds. They have iridescent compound eyes. Dromites wear heavy boots and light clothing, and are sometimes content with just a sturdy harness.</p>\n<ul>\n<li>+2 Charisma, –2 Strength, –2 Wisdom</li>\n<li>Level Adjustment: +1.</li>\n<li>Monstrous Humanoid (Psionic): Dromites are not subject to spells or effects that affect humanoids only, such as charm person or dominate person.</li>\n<li>Small: As a Small creature, a dromite gains a +1 size bonus to Armor Class, a +1 size bonus on attack rolls, and a +4 size bonus on Hide checks, but it uses smaller weapons than humans use, and its lifting and carrying limits are three-quarters of those of a Medium character.</li>\n<li>Dromite base land speed is 20 feet.</li>\n<li>Weapon and Armor Proficiency: A dromite is automatically proficient with the longsword, all simple weapons, light armor, and shields.</li>\n<li>Chitin: A dromite’s skin is hardened, almost like an exoskeleton, and grants the character a +3 natural armor bonus to AC and one of the following kinds of resistance to energy: cold 5, electricity 5, fire 5, or sonic 5. The player chooses what type of energy resistance is gained when the character is created. (This choice also dictates which caste the dromite belongs to.) This natural energy resistance stacks with any future energy resistance gained through other effects.</li>\n<li>Naturally Psionic: Dromites gain 1 bonus power point at 1st level. This benefit does not grant them the ability to manifest powers unless they gain that ability through another source, such as levels in a psionic class.</li>\n<li>Psi-Like Ability: 1/day—energy ray. A dromite always deals the kind of energy damage that its chitin has resistance to (for example, a dromite who has resistance to cold 5 deals cold damage with its energy ray). Manifester level is equal to 1/2 Hit Dice (minimum 1st). The save DC is Charisma-based.</li>\n<li>Scent: Its antennae give a dromite the scent ability. A dromite can detect opponents by scent within 30 feet. If the opponent is upwind, the range increases to 60 feet; if downwind, it drops to 15 feet. Strong scents, such as smoke or rotting garbage, can be detected at twice the ranges noted above. Overpowering scents, such as skunk musk or troglodyte stench, can be detected at triple normal range. When a dromite detects a scent, the exact location of the source is not revealed—only its presence somewhere within range. The dromite can take a move action to note the direction of the scent. Whenever the dromite comes within 5 feet of the source, the dromite pinpoints the source’s location.</li>\n<li>Blind-Fight: Its antennae also give a dromite Blind-Fight as a bonus feat.</li>\n<li>Compound Eyes: This feature of its anatomy gives a dromite a +2 racial bonus on Spot checks.</li>\n<li>Automatic Language: Common. Bonus Languages: Dwarven, Gnome, Goblin, Terran.</li>\n<li>Favored Class: Wilder.</li>\n</ul>",
            "chat": "",
            "unidentified": ""
        },
        "epic": "",
        "psionic": "",
        "nameFormula": "",
        "nameFromFormula": false,
        "tags": [],
        "uniqueId": "",
        "addedLevel": 0,
        "linkId": "",
        "linkSourceId": "",
        "linkImported": false,
        "linkSourceName": "",
        "source": "",
        "classSource": "",
        "userNonRemovable": false,
        "customAttributes": {},
        "customAttributesLocked": false,
        "customTag": "",
        "createdBy": "",
        "changes": [
            [
                "2",
                "ability",
                "cha",
                "racial"
            ],
            [
                "-2",
                "ability",
                "str",
                "racial"
            ],
            [
                "-2",
                "ability",
                "wis",
                "racial"
            ],
            [
                "1",
                "psionic",
                "powerPoints",
                "racial"
            ],
            [
                "2",
                "skill",
                "skill.spt",
                "racial"
            ]
        ],
        "changeFlags": {
            "loseDexToAC": false,
            "noStr": false,
            "noDex": false,
            "noInt": false,
            "noCon": false,
            "oneInt": false,
            "oneWis": false,
            "oneCha": false,
            "noEncumbrance": false,
            "mediumArmorFullSpeed": false,
            "heavyArmorFullSpeed": false,
            "multiAttack": false,
            "multiweaponAttack": false,
            "uncannyDodge": false
        },
        "conditionFlags": {
            "dazzled": false,
            "wildshaped": false,
            "polymorphed": false
        },
        "combatChanges": [],
        "combatChangesRange": {
            "maxFormula": "",
            "max": 0
        },
        "combatChangesAdditionalRanges": {
            "hasAdditionalRanges": false,
            "slider1": {
                "maxFormula": "",
                "max": 0,
                "name": ""
            },
            "slider2": {
                "maxFormula": "",
                "max": 0,
                "name": ""
            },
            "slider3": {
                "maxFormula": "",
                "max": 0,
                "name": ""
            }
        },
        "combatChangesUsesCost": "chargesPerUse",
        "combatChangesApplySpecialActionsOnce": true,
        "combatChangeCustomDisplayName": "",
        "combatChangeCustomReferenceName": "",
        "sizeOverride": "",
        "counterName": "",
        "resistances": [],
        "damageReduction": [],
        "requirements": [],
        "creationChanges": [],
        "contextNotes": [],
        "links": {
            "children": []
        },
        "creatureType": "monstrousHumanoid",
        "la": 1,
        "subTypes": [
            [
                "Psionic"
            ]
        ],
        "addedAbilities": [
            {
                "uid": "swp",
                "level": 0
            },
            {
                "uid": "ap-light",
                "level": 0
            },
            {
                "uid": "shp",
                "level": 0
            }
        ],
        "disabledAbilities": [],
        "damage": {
            "parts": []
        },
        "index": {
            "subType": null,
            "uniqueId": ""
        }
    },
    "ownership": {
        "default": 0,
        "wbFPpmVfPG23MbMC": 3
    },
    "_stats": {
        "systemId": "D35E",
        "systemVersion": "2.1.3",
        "coreVersion": "10.291",
        "createdTime": null,
        "modifiedTime": 1678394273675,
        "lastModifiedBy": "cB3ob9BYxSFYX7sd"
    }
}
```

**Key Information Needed:**
- Item type field
- How ability modifiers are stored
- Size, speed, vision properties
- Which racial traits come automatically vs need to be added separately

---

### D35E.classes (Classes - 33 entries)
Run: `MOTWM_TOWNIE.debugPack('D35E.classes')`

```javascript
Document Keys:
[
    "name",
    "type",
    "img",
    "system",
    "sort",
    "ownership",
    "flags",
    "_stats",
    "custom",
    "labels",
    "extensionMap",
    "rolls",
    "charge",
    "uses",
    "combatChanges"
]
System Data Keys:
[
    "originVersion",
    "originPack",
    "originId",
    "possibleUpdate",
    "description",
    "epic",
    "psionic",
    "nameFormula",
    "nameFromFormula",
    "tags",
    "uniqueId",
    "addedLevel",
    "linkId",
    "linkSourceId",
    "linkImported",
    "linkSourceName",
    "source",
    "classSource",
    "userNonRemovable",
    "customAttributes",
    "customAttributesLocked",
    "customTag",
    "createdBy",
    "changes",
    "changeFlags",
    "conditionFlags",
    "combatChanges",
    "combatChangesRange",
    "combatChangesAdditionalRanges",
    "combatChangesUsesCost",
    "combatChangesApplySpecialActionsOnce",
    "combatChangeCustomDisplayName",
    "combatChangeCustomReferenceName",
    "sizeOverride",
    "counterName",
    "resistances",
    "damageReduction",
    "requirements",
    "creationChanges",
    "classType",
    "levels",
    "maxLevel",
    "prestigeLevels",
    "la",
    "crPerHD",
    "hdReplace",
    "hdReplaceRacialOnly",
    "addedAbilities",
    "disabledAbilities",
    "turnUndeadLevelFormula",
    "sneakAttackGroup",
    "automaticFeatures",
    "sneakAttackFormula",
    "minionGroup",
    "minionLevelFormula",
    "deckHandSizeFormula",
    "knownCardsSizeFormula",
    "deckPrestigeClass",
    "spellcastingType",
    "spellcastingSpontaneus",
    "spellsPerLevel",
    "spellsKnownPerLevel",
    "hasSpellbook",
    "hasLimitedSpellbook",
    "spellbook",
    "spellcastingDescription",
    "spellcastingSpellname",
    "spellcastingSpellnamePl",
    "hasSpecialSlot",
    "spellPointGroup",
    "spellcastingAbility",
    "spellslotAbility",
    "spellPointBonusFormula",
    "spellPointTable",
    "powerPointBonusBaseAbility",
    "powerPointTable",
    "powersKnown",
    "powersMaxLevel",
    "hd",
    "hp",
    "bab",
    "skillsPerLevel",
    "allSpellsKnown",
    "halfCasterLevel",
    "creatureType",
    "savingThrows",
    "fc",
    "classSkills",
    "nonActiveClassAbilities",
    "damage",
    "preparation",
    "weaponData",
    "index"
]
Full Sample:
{
    "_id": "3KKfyU5yuoqamNLP",
    "name": "Warrior (NPC)",
    "type": "class",
    "img": "systems/D35E/icons/class/warrior.png",
    "effects": [],
    "folder": null,
    "sort": 0,
    "flags": {
        "core": {
            "sourceId": "Compendium.D35E.classes.3KKfyU5yuoqamNLP"
        }
    },
    "system": {
        "originVersion": 100,
        "originPack": "",
        "originId": "",
        "possibleUpdate": false,
        "description": {
            "value": "<p class=\"p1\"><strong>Hit Die:</strong> d8.</p>\n<h2 class=\"p1\">Class Skills</h2>\n<p class=\"p1\">The warrior’s class skills (and the key ability for each skill) are Climb (Str), Handle Animal (Cha), Intimidate (Cha), Jump (Str), Ride (Dex), and Swim (Str).</p>\n<p class=\"p1\"><strong>Skill Points at 1st Level: </strong>(2 + Int modifier) x4.</p>\n<p class=\"p1\"><strong>Skill Points at Each Additional Level: </strong>2 + Int modifier.</p>",
            "chat": "",
            "unidentified": ""
        },
        "epic": "",
        "psionic": "",
        "nameFormula": "",
        "nameFromFormula": false,
        "tags": [],
        "uniqueId": "",
        "addedLevel": 0,
        "linkId": "",
        "linkSourceId": "",
        "linkImported": false,
        "linkSourceName": "",
        "source": "",
        "classSource": "",
        "userNonRemovable": false,
        "customAttributes": {},
        "customAttributesLocked": false,
        "customTag": "",
        "createdBy": "",
        "changes": [],
        "changeFlags": {
            "loseDexToAC": false,
            "noStr": false,
            "noDex": false,
            "noInt": false,
            "noCon": false,
            "oneInt": false,
            "oneWis": false,
            "oneCha": false,
            "noEncumbrance": false,
            "mediumArmorFullSpeed": false,
            "heavyArmorFullSpeed": false,
            "multiAttack": false,
            "multiweaponAttack": false,
            "uncannyDodge": false
        },
        "conditionFlags": {
            "dazzled": false,
            "wildshaped": false,
            "polymorphed": false
        },
        "combatChanges": [],
        "combatChangesRange": {
            "maxFormula": "",
            "max": 0
        },
        "combatChangesAdditionalRanges": {
            "hasAdditionalRanges": false,
            "slider1": {
                "maxFormula": "",
                "max": 0,
                "name": ""
            },
            "slider2": {
                "maxFormula": "",
                "max": 0,
                "name": ""
            },
            "slider3": {
                "maxFormula": "",
                "max": 0,
                "name": ""
            }
        },
        "combatChangesUsesCost": "chargesPerUse",
        "combatChangesApplySpecialActionsOnce": true,
        "combatChangeCustomDisplayName": "",
        "combatChangeCustomReferenceName": "",
        "sizeOverride": "",
        "counterName": "",
        "resistances": [],
        "damageReduction": [],
        "requirements": [],
        "creationChanges": [],
        "classType": "base",
        "levels": 0,
        "maxLevel": 20,
        "prestigeLevels": 0,
        "la": 0,
        "crPerHD": 4,
        "hdReplace": "",
        "hdReplaceRacialOnly": false,
        "addedAbilities": [],
        "disabledAbilities": [],
        "turnUndeadLevelFormula": "0",
        "sneakAttackGroup": "none",
        "automaticFeatures": true,
        "sneakAttackFormula": "0",
        "minionGroup": "none",
        "minionLevelFormula": "0",
        "deckHandSizeFormula": "0",
        "knownCardsSizeFormula": "0",
        "deckPrestigeClass": false,
        "spellcastingType": "none",
        "spellcastingSpontaneus": false,
        "spellsPerLevel": [],
        "spellsKnownPerLevel": [],
        "hasSpellbook": false,
        "hasLimitedSpellbook": false,
        "spellbook": [],
        "spellcastingDescription": "None",
        "spellcastingSpellname": "Spell",
        "spellcastingSpellnamePl": "Spells",
        "hasSpecialSlot": false,
        "spellPointGroup": "wizard",
        "spellcastingAbility": "int",
        "spellslotAbility": "",
        "spellPointBonusFormula": "0",
        "spellPointTable": {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 0,
            "8": 0,
            "9": 0,
            "10": 0,
            "11": 0,
            "12": 0,
            "13": 0,
            "14": 0,
            "15": 0,
            "16": 0,
            "17": 0,
            "18": 0,
            "19": 0,
            "20": 0
        },
        "powerPointBonusBaseAbility": "",
        "powerPointTable": {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 0,
            "8": 0,
            "9": 0,
            "10": 0,
            "11": 0,
            "12": 0,
            "13": 0,
            "14": 0,
            "15": 0,
            "16": 0,
            "17": 0,
            "18": 0,
            "19": 0,
            "20": 0
        },
        "powersKnown": {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 0,
            "8": 0,
            "9": 0,
            "10": 0,
            "11": 0,
            "12": 0,
            "13": 0,
            "14": 0,
            "15": 0,
            "16": 0,
            "17": 0,
            "18": 0,
            "19": 0,
            "20": 0
        },
        "powersMaxLevel": {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 0,
            "8": 0,
            "9": 0,
            "10": 0,
            "11": 0,
            "12": 0,
            "13": 0,
            "14": 0,
            "15": 0,
            "16": 0,
            "17": 0,
            "18": 0,
            "19": 0,
            "20": 0
        },
        "hd": 8,
        "hp": 0,
        "bab": "high",
        "skillsPerLevel": 2,
        "allSpellsKnown": false,
        "halfCasterLevel": false,
        "creatureType": "humanoid",
        "savingThrows": {
            "fort": {
                "value": "high"
            },
            "ref": {
                "value": "low"
            },
            "will": {
                "value": "low"
            }
        },
        "fc": {
            "hp": {
                "value": 0
            },
            "skill": {
                "value": 0
            },
            "alt": {
                "value": 0
            }
        },
        "classSkills": {
            "clm": true,
            "acr": false,
            "apr": false,
            "art": false,
            "blf": false,
            "crf": false,
            "dip": false,
            "dev": false,
            "dis": false,
            "esc": false,
            "fly": false,
            "han": true,
            "hea": false,
            "int": true,
            "kar": false,
            "kdu": false,
            "ken": false,
            "kge": false,
            "khi": false,
            "klo": false,
            "kna": false,
            "kno": false,
            "kpl": false,
            "kre": false,
            "lin": false,
            "lor": false,
            "per": false,
            "prf": false,
            "pro": false,
            "rid": true,
            "sen": false,
            "slt": false,
            "spl": false,
            "ste": false,
            "sur": false,
            "swm": true,
            "umd": false,
            "blc": false,
            "coc": false,
            "dsc": false,
            "fog": false,
            "gif": false,
            "hid": false,
            "jmp": true,
            "lis": false,
            "mos": false,
            "opl": false,
            "src": false,
            "spt": false,
            "tmb": false,
            "uro": false,
            "kps": false,
            "aut": false,
            "psi": false,
            "upd": false
        },
        "nonActiveClassAbilities": [],
        "damage": {
            "parts": []
        },
        "preparation": {
            "maxAmount": 0
        },
        "weaponData": {
            "critRange": 20,
            "critMult": 2
        },
        "index": {
            "subType": null,
            "uniqueId": ""
        }
    },
    "ownership": {
        "default": 0,
        "kowljhpAAAuoOaJG": 3
    },
    "_stats": {
        "systemId": "D35E",
        "systemVersion": "2.1.3",
        "coreVersion": "10.291",
        "createdTime": null,
        "modifiedTime": 1678394272338,
        "lastModifiedBy": "cB3ob9BYxSFYX7sd"
    }
}

```

**Key Information Needed:**
- How to set class level
- Hit die size (d6, d8, d10, d12)
- BAB progression
- Save progressions
- Skills per level
- How class features are linked

---

### D35E.class-abilities (Class Abilities - 130 entries)
Run: `MOTWM_TOWNIE.debugPack('D35E.class-abilities')`

```javascript
Document Keys:
[
    "name",
    "type",
    "img",
    "system",
    "sort",
    "ownership",
    "flags",
    "_stats",
    "custom",
    "labels",
    "extensionMap",
    "rolls",
    "charge",
    "uses",
    "combatChanges"
]
System Data Keys:
[
    "originVersion",
    "originPack",
    "originId",
    "possibleUpdate",
    "description",
    "epic",
    "psionic",
    "nameFormula",
    "nameFromFormula",
    "tags",
    "uniqueId",
    "addedLevel",
    "linkId",
    "linkSourceId",
    "linkImported",
    "linkSourceName",
    "source",
    "classSource",
    "userNonRemovable",
    "customAttributes",
    "customAttributesLocked",
    "customTag",
    "createdBy",
    "activation",
    "duration",
    "target",
    "range",
    "recharge",
    "uses",
    "requiresPsionicFocus",
    "linkedChargeItem",
    "measureTemplate",
    "actionType",
    "attackBonus",
    "critConfirmBonus",
    "damage",
    "summon",
    "attackParts",
    "autoscaleAttackParts",
    "formula",
    "attackCountFormula",
    "maxDamageDice",
    "maxDamageDiceFormula",
    "ability",
    "save",
    "baseCl",
    "sr",
    "pr",
    "metamagicFeats",
    "effectNotes",
    "attackNotes",
    "specialActions",
    "favorite",
    "rollTableDraw",
    "changes",
    "changeFlags",
    "conditionFlags",
    "combatChanges",
    "combatChangesRange",
    "combatChangesAdditionalRanges",
    "combatChangesUsesCost",
    "combatChangesApplySpecialActionsOnce",
    "combatChangeCustomDisplayName",
    "combatChangeCustomReferenceName",
    "sizeOverride",
    "counterName",
    "resistances",
    "damageReduction",
    "requirements",
    "creationChanges",
    "contextNotes",
    "featType",
    "abilityType",
    "associations",
    "crOffset",
    "spellSpecializationName",
    "spellSpecializationForbiddenNames",
    "linkedItems",
    "metamagic",
    "spellSpecialization",
    "showInQuickbar",
    "links",
    "attack",
    "index"
]
Full Sample:
{
    "_id": "0Di5nopOi1uOL054",
    "name": "Flurry of Blows",
    "type": "feat",
    "img": "systems/D35E/icons/classfeatures/flurry-of-blows.png",
    "effects": [],
    "folder": null,
    "sort": 0,
    "flags": {
        "core": {
            "sourceId": "Compendium.D35E.class-abilities.0Di5nopOi1uOL054"
        }
    },
    "system": {
        "originVersion": 99,
        "originPack": "",
        "originId": "",
        "possibleUpdate": false,
        "description": {
            "value": "<p>When unarmored, a monk may strike with a flurry of blows at the expense of accuracy. When doing so, she may make one extra attack in a round at her highest base attack bonus, but this attack takes a –2 penalty, as does each other attack made that round. The resulting modified base attack bonuses are shown in the Flurry of Blows Attack Bonus column on Table: The Monk. This penalty applies for 1 round, so it also affects attacks of opportunity the monk might make before her next action. When a monk reaches 5th level, the penalty lessens to –1, and at 9th level it disappears. A monk must use a full attack action to strike with a flurry of blows.</p>\n<p>When using flurry of blows, a monk may attack only with unarmed strikes or with special monk weapons (kama, nunchaku, quarterstaff, sai, shuriken, and siangham). She may attack with unarmed strikes and special monk weapons interchangeably as desired. When using weapons as part of a flurry of blows, a monk applies her Strength bonus (not Str bonus x1-1/2 or x1/2) to her damage rolls for all successful attacks, whether she wields a weapon in one or both hands. The monk can’t use any weapon other than a special monk weapon as part of a flurry of blows.</p>\n<p>In the case of the quarterstaff, each end counts as a separate weapon for the purpose of using the flurry of blows ability. Even though the quarterstaff requires two hands to use, a monk may still intersperse unarmed strikes with quarterstaff strikes, assuming that she has enough attacks in her flurry of blows routine to do so.&nbsp;</p>\n<p>When a monk reaches 11th level, her flurry of blows ability improves. In addition to the standard single extra attack she gets from flurry of blows, she gets a second extra attack at her full base attack bonus.</p>",
            "chat": "",
            "unidentified": ""
        },
        "epic": "",
        "psionic": "",
        "nameFormula": "",
        "nameFromFormula": false,
        "tags": [],
        "uniqueId": "mnk-flr-blows",
        "addedLevel": 0,
        "linkId": "",
        "linkSourceId": "",
        "linkImported": false,
        "linkSourceName": "",
        "source": "",
        "classSource": "",
        "userNonRemovable": false,
        "customAttributes": {},
        "customAttributesLocked": false,
        "customTag": "flurryOfBlows",
        "createdBy": "",
        "activation": {
            "cost": 1,
            "type": ""
        },
        "duration": {
            "value": null,
            "units": ""
        },
        "target": {
            "value": ""
        },
        "range": {
            "value": null,
            "units": "",
            "long": null
        },
        "recharge": {
            "enabled": false,
            "formula": "",
            "current": 0,
            "value": null,
            "charged": false,
            "_deprecated": true
        },
        "uses": {
            "value": 0,
            "max": 0,
            "per": null,
            "autoDeductCharges": true,
            "allowMultipleUses": false,
            "chargesPerUse": 1,
            "maxPerUse": null,
            "maxPerUseFormula": "",
            "maxFormula": "",
            "rechargeFormula": null,
            "isResource": false,
            "canBeLinked": false
        },
        "requiresPsionicFocus": false,
        "linkedChargeItem": {
            "id": null,
            "img": null,
            "name": null
        },
        "measureTemplate": {
            "type": "",
            "size": 0,
            "overrideColor": false,
            "customColor": "",
            "overrideTexture": false,
            "customTexture": ""
        },
        "actionType": "",
        "attackBonus": "",
        "critConfirmBonus": "",
        "damage": {
            "parts": [],
            "alternativeParts": []
        },
        "summon": [],
        "attackParts": [],
        "autoscaleAttackParts": "",
        "formula": "",
        "attackCountFormula": "",
        "maxDamageDice": 0,
        "maxDamageDiceFormula": "",
        "ability": {
            "attack": null,
            "damage": null,
            "damageMult": 1,
            "critRange": 20,
            "critMult": 2,
            "twoHandedOnly": false,
            "vsTouchAc": false
        },
        "save": {
            "dc": 0,
            "description": "",
            "ability": "",
            "type": "",
            "dcAutoType": "",
            "dcAutoAbility": "",
            "originVersion": 97
        },
        "baseCl": "0",
        "sr": false,
        "pr": false,
        "metamagicFeats": {
            "maximized": false,
            "empowered": false,
            "enlarged": false,
            "intensified": false,
            "enhanced": false,
            "enhancedHalf": false,
            "widened": false
        },
        "effectNotes": "",
        "attackNotes": "",
        "specialActions": [],
        "favorite": false,
        "rollTableDraw": {
            "formula": "",
            "name": "",
            "pack": "",
            "id": ""
        },
        "changes": [],
        "changeFlags": {
            "loseDexToAC": false,
            "noStr": false,
            "noDex": false,
            "noInt": false,
            "noCon": false,
            "oneInt": false,
            "oneWis": false,
            "oneCha": false,
            "noEncumbrance": false,
            "mediumArmorFullSpeed": false,
            "heavyArmorFullSpeed": false,
            "multiAttack": false,
            "multiweaponAttack": false,
            "uncannyDodge": false,
            "hasted": false
        },
        "conditionFlags": {
            "dazzled": false,
            "wildshaped": false,
            "polymorphed": false
        },
        "combatChanges": [],
        "combatChangesRange": {
            "maxFormula": "",
            "max": 0
        },
        "combatChangesAdditionalRanges": {
            "hasAdditionalRanges": false,
            "slider1": {
                "maxFormula": "",
                "max": 0,
                "name": ""
            },
            "slider2": {
                "maxFormula": "",
                "max": 0,
                "name": ""
            },
            "slider3": {
                "maxFormula": "",
                "max": 0,
                "name": ""
            }
        },
        "combatChangesUsesCost": "chargesPerUse",
        "combatChangesApplySpecialActionsOnce": true,
        "combatChangeCustomDisplayName": "",
        "combatChangeCustomReferenceName": "",
        "sizeOverride": "",
        "counterName": "",
        "resistances": [],
        "damageReduction": [],
        "requirements": [],
        "creationChanges": [],
        "contextNotes": [],
        "featType": "classFeat",
        "abilityType": "",
        "associations": {
            "classes": [
                [
                    "Monk",
                    1
                ]
            ]
        },
        "crOffset": "",
        "spellSpecializationName": "",
        "spellSpecializationForbiddenNames": "",
        "linkedItems": [],
        "metamagic": {
            "enabled": false,
            "shortDesc": "",
            "code": ""
        },
        "spellSpecialization": {
            "isDomain": false,
            "spells": {
                "level1": {
                    "level": 1,
                    "name": "",
                    "img": "",
                    "pack": null,
                    "id": null
                },
                "level2": {
                    "level": 2,
                    "name": "",
                    "img": "",
                    "pack": null,
                    "id": null
                },
                "level3": {
                    "level": 3,
                    "name": "",
                    "img": "",
                    "pack": null,
                    "id": null
                },
                "level4": {
                    "level": 4,
                    "name": "",
                    "img": "",
                    "pack": null,
                    "id": null
                },
                "level5": {
                    "level": 5,
                    "name": "",
                    "img": "",
                    "pack": null,
                    "id": null
                },
                "level6": {
                    "level": 6,
                    "name": "",
                    "img": "",
                    "pack": null,
                    "id": null
                },
                "level7": {
                    "level": 7,
                    "name": "",
                    "img": "",
                    "pack": null,
                    "id": null
                },
                "level8": {
                    "level": 8,
                    "name": "",
                    "img": "",
                    "pack": null,
                    "id": null
                },
                "level9": {
                    "level": 9,
                    "name": "",
                    "img": "",
                    "pack": null,
                    "id": null
                }
            }
        },
        "showInQuickbar": false,
        "links": {
            "charges": []
        },
        "attack": {
            "parts": []
        },
        "index": {
            "subType": "classFeat",
            "uniqueId": "mnk-flr-blows"
        }
    },
    "ownership": {
        "default": 0,
        "z68FsxziQNbZVumc": 3
    },
    "_stats": {
        "systemId": "D35E",
        "systemVersion": "2.1.3",
        "coreVersion": "10.291",
        "createdTime": null,
        "modifiedTime": 1678394275065,
        "lastModifiedBy": "cB3ob9BYxSFYX7sd"
    }
}
```

**Key Information Needed:**
- How abilities link to specific classes/levels
- Are these automatically granted or manually added?

---

### D35E.feats (Feats - 388 entries)
Run: `MOTWM_TOWNIE.debugPack('D35E.feats')`

```javascript
Document Keys:
[
    "name",
    "type",
    "img",
    "system",
    "sort",
    "ownership",
    "flags",
    "_stats",
    "custom",
    "labels",
    "extensionMap",
    "rolls",
    "charge",
    "uses",
    "combatChanges"
]
System Data Keys:
[
    "originVersion",
    "originPack",
    "originId",
    "possibleUpdate",
    "description",
    "epic",
    "psionic",
    "nameFormula",
    "nameFromFormula",
    "tags",
    "uniqueId",
    "addedLevel",
    "linkId",
    "linkSourceId",
    "linkImported",
    "linkSourceName",
    "source",
    "classSource",
    "userNonRemovable",
    "customAttributes",
    "customAttributesLocked",
    "customTag",
    "createdBy",
    "activation",
    "duration",
    "target",
    "range",
    "recharge",
    "uses",
    "requiresPsionicFocus",
    "linkedChargeItem",
    "measureTemplate",
    "actionType",
    "attackBonus",
    "critConfirmBonus",
    "damage",
    "summon",
    "attackParts",
    "autoscaleAttackParts",
    "formula",
    "attackCountFormula",
    "maxDamageDice",
    "maxDamageDiceFormula",
    "ability",
    "save",
    "baseCl",
    "sr",
    "pr",
    "metamagicFeats",
    "effectNotes",
    "attackNotes",
    "specialActions",
    "favorite",
    "rollTableDraw",
    "changes",
    "changeFlags",
    "conditionFlags",
    "combatChanges",
    "combatChangesRange",
    "combatChangesAdditionalRanges",
    "combatChangesUsesCost",
    "combatChangesApplySpecialActionsOnce",
    "combatChangeCustomDisplayName",
    "combatChangeCustomReferenceName",
    "sizeOverride",
    "counterName",
    "resistances",
    "damageReduction",
    "requirements",
    "creationChanges",
    "contextNotes",
    "featType",
    "abilityType",
    "associations",
    "crOffset",
    "spellSpecializationName",
    "spellSpecializationForbiddenNames",
    "linkedItems",
    "metamagic",
    "spellSpecialization",
    "showInQuickbar",
    "links",
    "time",
    "damageType",
    "attack",
    "index",
    "bookSource"
]
Full Sample:
```

**Key Information Needed:**
- Prerequisites structure
- How feat bonuses/effects are applied
- Categories/types of feats

---

### D35E.weapons-and-ammo (Weapons - 85 entries)
Run: `MOTWM_TOWNIE.debugPack('D35E.weapons-and-ammo')`

```javascript
Document Keys:
[
    "name",
    "type",
    "img",
    "system",
    "sort",
    "ownership",
    "flags",
    "_stats",
    "custom",
    "labels",
    "extensionMap",
    "rolls",
    "charge",
    "uses",
    "combatChanges"
]
System Data Keys:
[
    "originVersion",
    "originPack",
    "originId",
    "possibleUpdate",
    "description",
    "epic",
    "psionic",
    "nameFormula",
    "nameFromFormula",
    "tags",
    "uniqueId",
    "addedLevel",
    "linkId",
    "linkSourceId",
    "linkImported",
    "linkSourceName",
    "source",
    "classSource",
    "userNonRemovable",
    "customAttributes",
    "customAttributesLocked",
    "customTag",
    "createdBy",
    "quantity",
    "weight",
    "constantWeight",
    "price",
    "resalePrice",
    "brokenResalePrice",
    "fullResalePrice",
    "identified",
    "identifiedCurse",
    "cursed",
    "curseActive",
    "hp",
    "hardness",
    "carried",
    "unidentified",
    "identifiedName",
    "container",
    "containerId",
    "containerWeightless",
    "equippedWeightless",
    "changes",
    "changeFlags",
    "conditionFlags",
    "combatChanges",
    "combatChangesRange",
    "combatChangesAdditionalRanges",
    "combatChangesUsesCost",
    "combatChangesApplySpecialActionsOnce",
    "combatChangeCustomDisplayName",
    "combatChangeCustomReferenceName",
    "sizeOverride",
    "counterName",
    "resistances",
    "damageReduction",
    "requirements",
    "creationChanges",
    "contextNotes",
    "enhancements",
    "light",
    "material",
    "equipped",
    "masterwork",
    "weaponType",
    "weaponSubtype",
    "weaponBaseType",
    "properties",
    "linkedItems",
    "enh",
    "melded",
    "weaponData",
    "attackNotes",
    "effectNotes",
    "bonus",
    "damageType",
    "damage2",
    "damage2Type",
    "damage",
    "attackParts",
    "specialActions",
    "index",
    "baseWeaponType"
]
Full Sample:
{
    "_id": "05NnBuNnkMsaNoXf",
    "name": "Punching Dagger",
    "type": "weapon",
    "flags": {},
    "img": "systems/D35E/icons/items/weapons/BrassKnuckles_v2_10.png",
    "system": {
        "originVersion": 100,
        "originPack": "",
        "originId": "",
        "possibleUpdate": false,
        "description": {
            "value": "<p>This dagger puts more force from your punch behind it, making it capable of deadly strikes.</p>",
            "chat": "",
            "unidentified": ""
        },
        "epic": "",
        "psionic": "",
        "nameFormula": "",
        "nameFromFormula": false,
        "tags": [],
        "uniqueId": "",
        "addedLevel": 0,
        "linkId": "",
        "linkSourceId": "",
        "linkImported": false,
        "linkSourceName": "",
        "source": "",
        "classSource": "",
        "userNonRemovable": false,
        "customAttributes": {},
        "customAttributesLocked": false,
        "customTag": "",
        "createdBy": "",
        "quantity": 1,
        "weight": 1,
        "constantWeight": false,
        "price": 2,
        "resalePrice": "",
        "brokenResalePrice": "",
        "fullResalePrice": false,
        "identified": true,
        "identifiedCurse": false,
        "cursed": false,
        "curseActive": false,
        "hp": {
            "max": 2,
            "value": 2
        },
        "hardness": 10,
        "carried": true,
        "unidentified": {
            "price": 0,
            "name": ""
        },
        "identifiedName": "Punching Dagger",
        "container": "",
        "containerId": "",
        "containerWeightless": false,
        "equippedWeightless": false,
        "changes": [],
        "changeFlags": {
            "loseDexToAC": false,
            "noStr": false,
            "noDex": false,
            "noInt": false,
            "noCon": false,
            "oneInt": false,
            "oneWis": false,
            "oneCha": false,
            "noEncumbrance": false,
            "mediumArmorFullSpeed": false,
            "heavyArmorFullSpeed": false,
            "multiAttack": false,
            "multiweaponAttack": false,
            "uncannyDodge": false
        },
        "conditionFlags": {
            "dazzled": false,
            "wildshaped": false,
            "polymorphed": false
        },
        "combatChanges": [],
        "combatChangesRange": {
            "maxFormula": "",
            "max": 0
        },
        "combatChangesAdditionalRanges": {
            "hasAdditionalRanges": false,
            "slider1": {
                "maxFormula": "",
                "max": 0,
                "name": ""
            },
            "slider2": {
                "maxFormula": "",
                "max": 0,
                "name": ""
            },
            "slider3": {
                "maxFormula": "",
                "max": 0,
                "name": ""
            }
        },
        "combatChangesUsesCost": "chargesPerUse",
        "combatChangesApplySpecialActionsOnce": true,
        "combatChangeCustomDisplayName": "",
        "combatChangeCustomReferenceName": "",
        "sizeOverride": "",
        "counterName": "",
        "resistances": [],
        "damageReduction": [],
        "requirements": [],
        "creationChanges": [],
        "contextNotes": [],
        "enhancements": {
            "uses": {
                "value": 0,
                "max": 0,
                "per": null,
                "rechargeFormula": null,
                "autoDeductCharges": true,
                "allowMultipleUses": false,
                "commonPool": false
            },
            "automation": {
                "updateName": false,
                "updatePrice": false
            },
            "clFormula": "",
            "spellcastingAbility": "",
            "items": []
        },
        "light": {
            "color": "",
            "radius": 0,
            "opacity": 0,
            "alpha": 0.5,
            "lightAngle": 360,
            "type": "",
            "animationSpeed": "",
            "animationIntensity": "",
            "dimRadius": "",
            "emitLight": false
        },
        "material": {
            "data": null
        },
        "equipped": true,
        "masterwork": false,
        "weaponType": "simple",
        "weaponSubtype": "light",
        "weaponBaseType": "",
        "properties": {
            "blc": false,
            "brc": false,
            "dbl": false,
            "dis": false,
            "fin": false,
            "frg": false,
            "imp": false,
            "mnk": false,
            "nnl": false,
            "prf": false,
            "rch": false,
            "thr": false,
            "trp": false,
            "grp": false,
            "snd": false
        },
        "linkedItems": [],
        "enh": null,
        "melded": false,
        "weaponData": {
            "damageRoll": "1d4",
            "damageType": "P",
            "damageTypeId": "",
            "critRange": "20",
            "critMult": "3",
            "range": null,
            "attackFormula": "",
            "damageFormula": "",
            "size": "med",
            "alignment": {
                "good": false,
                "evil": false,
                "lawful": false,
                "chaotic": false
            }
        },
        "attackNotes": "",
        "effectNotes": "",
        "bonus": {
            "value": 0,
            "_deprecated": true
        },
        "damageType": {
            "value": "",
            "_deprecated": true
        },
        "damage2": {
            "value": "",
            "_deprecated": true
        },
        "damage2Type": {
            "value": "",
            "_deprecated": true
        },
        "damage": {
            "parts": []
        },
        "attackParts": [],
        "specialActions": [],
        "index": {
            "uniqueId": "",
            "subType": "simple"
        },
        "baseWeaponType": "Punching Dagger"
    },
    "ownership": {
        "default": 0,
        "3kN9BoRjo6UlMT5m": 3
    },
    "effects": [],
    "folder": null,
    "sort": 0,
    "_stats": {
        "systemId": "D35E",
        "systemVersion": "2.2.0",
        "coreVersion": "10.291",
        "createdTime": null,
        "modifiedTime": 1680105235590,
        "lastModifiedBy": "cB3ob9BYxSFYX7sd"
    }
}
```

**Key Information Needed:**
- Damage, critical, weight properties
- How items are "equipped" vs just in inventory

---

### D35E.armors-and-shields (Armor - 18 entries)
Run: `MOTWM_TOWNIE.debugPack('D35E.armors-and-shields')`

```javascript
Document Keys:
[
    "name",
    "type",
    "img",
    "system",
    "sort",
    "ownership",
    "flags",
    "_stats",
    "custom",
    "labels",
    "extensionMap",
    "rolls",
    "charge",
    "uses",
    "combatChanges"
]
System Data Keys:
[
    "originVersion",
    "originPack",
    "originId",
    "possibleUpdate",
    "description",
    "epic",
    "psionic",
    "nameFormula",
    "nameFromFormula",
    "tags",
    "uniqueId",
    "addedLevel",
    "linkId",
    "linkSourceId",
    "linkImported",
    "linkSourceName",
    "source",
    "classSource",
    "userNonRemovable",
    "customAttributes",
    "customAttributesLocked",
    "customTag",
    "createdBy",
    "quantity",
    "weight",
    "constantWeight",
    "price",
    "resalePrice",
    "brokenResalePrice",
    "fullResalePrice",
    "identified",
    "identifiedCurse",
    "cursed",
    "curseActive",
    "hp",
    "hardness",
    "carried",
    "unidentified",
    "identifiedName",
    "container",
    "containerId",
    "containerWeightless",
    "equippedWeightless",
    "changes",
    "changeFlags",
    "conditionFlags",
    "combatChanges",
    "combatChangesRange",
    "combatChangesAdditionalRanges",
    "combatChangesUsesCost",
    "combatChangesApplySpecialActionsOnce",
    "combatChangeCustomDisplayName",
    "combatChangeCustomReferenceName",
    "sizeOverride",
    "counterName",
    "resistances",
    "damageReduction",
    "requirements",
    "creationChanges",
    "measureTemplate",
    "actionType",
    "attackBonus",
    "critConfirmBonus",
    "damage",
    "summon",
    "attackParts",
    "autoscaleAttackParts",
    "formula",
    "attackCountFormula",
    "maxDamageDice",
    "maxDamageDiceFormula",
    "ability",
    "save",
    "baseCl",
    "sr",
    "pr",
    "metamagicFeats",
    "effectNotes",
    "attackNotes",
    "specialActions",
    "favorite",
    "rollTableDraw",
    "contextNotes",
    "enhancements",
    "light",
    "material",
    "equipped",
    "equipmentType",
    "equipmentSubtype",
    "armor",
    "masterwork",
    "melded",
    "linkedItems",
    "armorType",
    "spellFailure",
    "slot",
    "activation",
    "attack",
    "target",
    "range",
    "duration",
    "uses",
    "index"
]
Full Sample:
{
    "_id": "2fK608aSYU9QDmzw",
    "name": "Heavy Steel Shield",
    "type": "equipment",
    "flags": {
        "core": {
            "sourceId": "Compendium.D35E.armors-and-shields.2fK608aSYU9QDmzw"
        }
    },
    "img": "systems/D35E/icons/items/armor/shield_34.png",
    "system": {
        "originVersion": 100,
        "originPack": "",
        "originId": "",
        "possibleUpdate": false,
        "description": {
            "value": "<p>You strap a shield to your forearm and grip it with your hand. A heavy shield is so heavy that you can’t use your shield hand for anything else.</p>\n<p><strong>Wooden or Steel:</strong> Wooden and steel shields offer the same basic protection, though they respond differently to special attacks (such as warp wood and heat metal).</p>\n<p><strong>Shield Bash Attacks:</strong> You can bash an opponent with a heavy shield, using it as an off-hand weapon. See Table 7–5: Weapons for the damage dealt by a shield bash. Used this way, a heavy shield is a martial bludgeoning weapon. For the purpose of penalties on attack rolls, treat a heavy shield as a one-handed weapon. If you use your shield as a weapon, you lose its AC bonus until your next action (usually until the next round). An enhancement bonus on a shield does not improve the effectiveness of a shield bash made with it, but the shield can be made into a magic weapon in its own right.</p>",
            "chat": "",
            "unidentified": ""
        },
        "epic": "",
        "psionic": "",
        "nameFormula": "",
        "nameFromFormula": false,
        "tags": [],
        "uniqueId": "",
        "addedLevel": 0,
        "linkId": "",
        "linkSourceId": "",
        "linkImported": false,
        "linkSourceName": "",
        "source": "",
        "classSource": "",
        "userNonRemovable": false,
        "customAttributes": {},
        "customAttributesLocked": false,
        "customTag": "",
        "createdBy": "",
        "quantity": 1,
        "weight": 15,
        "constantWeight": false,
        "price": 20,
        "resalePrice": "",
        "brokenResalePrice": "",
        "fullResalePrice": false,
        "identified": true,
        "identifiedCurse": false,
        "cursed": false,
        "curseActive": false,
        "hp": {
            "max": 20,
            "value": 20
        },
        "hardness": 10,
        "carried": true,
        "unidentified": {
            "price": 0,
            "name": ""
        },
        "identifiedName": "Heavy Steel Shield",
        "container": "",
        "containerId": "",
        "containerWeightless": false,
        "equippedWeightless": false,
        "changes": [],
        "changeFlags": {
            "loseDexToAC": false,
            "noStr": false,
            "noDex": false,
            "noInt": false,
            "noCon": false,
            "oneInt": false,
            "oneWis": false,
            "oneCha": false,
            "noEncumbrance": false,
            "mediumArmorFullSpeed": false,
            "heavyArmorFullSpeed": false,
            "multiAttack": false,
            "multiweaponAttack": false,
            "uncannyDodge": false
        },
        "conditionFlags": {
            "dazzled": false,
            "wildshaped": false,
            "polymorphed": false
        },
        "combatChanges": [],
        "combatChangesRange": {
            "maxFormula": "",
            "max": 0
        },
        "combatChangesAdditionalRanges": {
            "hasAdditionalRanges": false,
            "slider1": {
                "maxFormula": "",
                "max": 0,
                "name": ""
            },
            "slider2": {
                "maxFormula": "",
                "max": 0,
                "name": ""
            },
            "slider3": {
                "maxFormula": "",
                "max": 0,
                "name": ""
            }
        },
        "combatChangesUsesCost": "chargesPerUse",
        "combatChangesApplySpecialActionsOnce": true,
        "combatChangeCustomDisplayName": "",
        "combatChangeCustomReferenceName": "",
        "sizeOverride": "",
        "counterName": "",
        "resistances": [],
        "damageReduction": [],
        "requirements": [],
        "creationChanges": [],
        "measureTemplate": {
            "type": "",
            "size": "",
            "overrideColor": false,
            "customColor": "",
            "overrideTexture": false,
            "customTexture": ""
        },
        "actionType": "",
        "attackBonus": "",
        "critConfirmBonus": "",
        "damage": {
            "parts": [],
            "alternativeParts": []
        },
        "summon": [],
        "attackParts": [],
        "autoscaleAttackParts": "",
        "formula": "",
        "attackCountFormula": "",
        "maxDamageDice": 0,
        "maxDamageDiceFormula": "",
        "ability": {
            "attack": null,
            "damage": null,
            "damageMult": 1,
            "critRange": "20",
            "critMult": 2,
            "twoHandedOnly": false,
            "vsTouchAc": false
        },
        "save": {
            "dc": 0,
            "description": "",
            "ability": "",
            "type": "",
            "dcAutoType": "",
            "dcAutoAbility": ""
        },
        "baseCl": "0",
        "sr": false,
        "pr": false,
        "metamagicFeats": {
            "maximized": false,
            "empowered": false,
            "enlarged": false,
            "intensified": false,
            "enhanced": false,
            "enhancedHalf": false,
            "widened": false
        },
        "effectNotes": "",
        "attackNotes": "",
        "specialActions": [],
        "favorite": false,
        "rollTableDraw": {
            "formula": "",
            "name": "",
            "pack": "",
            "id": ""
        },
        "contextNotes": [],
        "enhancements": {
            "uses": {
                "value": 0,
                "max": 0,
                "per": null,
                "rechargeFormula": null,
                "autoDeductCharges": true,
                "allowMultipleUses": false,
                "commonPool": false
            },
            "automation": {
                "updateName": false,
                "updatePrice": false
            },
            "clFormula": "",
            "spellcastingAbility": "",
            "items": []
        },
        "light": {
            "color": "",
            "radius": 0,
            "opacity": 0,
            "alpha": 0.5,
            "lightAngle": 360,
            "type": "",
            "animationSpeed": "",
            "animationIntensity": "",
            "dimRadius": "",
            "emitLight": false
        },
        "material": {
            "data": null
        },
        "equipped": true,
        "equipmentType": "shield",
        "equipmentSubtype": "heavyShield",
        "armor": {
            "value": 2,
            "dex": "",
            "acp": 2,
            "enh": 0
        },
        "masterwork": false,
        "melded": false,
        "linkedItems": [],
        "armorType": {
            "value": "",
            "_deprecated": true
        },
        "spellFailure": 15,
        "slot": "shield",
        "activation": {
            "cost": 1,
            "type": "move"
        },
        "attack": {
            "parts": []
        },
        "target": {
            "value": "Self"
        },
        "range": {
            "units": "personal"
        },
        "duration": {
            "units": ""
        },
        "uses": {
            "per": "",
            "autoDeductCharges": false,
            "allowMultipleUses": false
        },
        "index": {
            "subType": null,
            "uniqueId": ""
        }
    },
    "ownership": {
        "default": 0,
        "3kN9BoRjo6UlMT5m": 3
    },
    "effects": [],
    "folder": null,
    "sort": 0,
    "_stats": {
        "systemId": "D35E",
        "systemVersion": "2.1.3",
        "coreVersion": "10.291",
        "createdTime": 1671133599088,
        "modifiedTime": 1678394277722,
        "lastModifiedBy": "cB3ob9BYxSFYX7sd"
    }
}
```

**Key Information Needed:**
- AC bonus structure
- How armor is equipped/active
- Max DEX bonus, armor check penalty

---

### D35E.sample-chars (Sample Characters - 11 entries)
Run: `MOTWM_TOWNIE.debugPack('D35E.sample-chars')`

```javascript
Document Keys:
[
    "name",
    "type",
    "img",
    "system",
    "prototypeToken",
    "sort",
    "ownership",
    "flags",
    "_stats",
    "statuses",
    "overrides",
    "_cachedRollData",
    "combatChangeItems",
    "_tokenImages",
    "_lastWildcard",
    "API_URI",
    "socketRoomConnected",
    "socket",
    "_runningFunctions",
    "_cachedAuras",
    "conditions",
    "buffs",
    "crHelper"
]
System Data Keys:
[
    "shapechangeImg",
    "tokenImg",
    "companionUuid",
    "companionPublicId",
    "companionUsePersonalKey",
    "companionAutosync",
    "companionLockGM",
    "abilities",
    "resources",
    "attributes",
    "details",
    "skills",
    "customSkills",
    "traits",
    "currency",
    "altCurrency",
    "customCurrency",
    "noLightOverride",
    "noTokenOverride",
    "noSkillSynergy",
    "noBuffDisplay",
    "lockEditingByPlayers",
    "showCardSheet",
    "showSpellcastingSheet",
    "staticBonus",
    "isPartyMember",
    "displayNonRTSkills",
    "jumpSkillAdjust",
    "noVisionOverride",
    "counters",
    "classes",
    "totalNonEclLevels",
    "damage",
    "naturalAttackCount",
    "classLevels",
    "combinedResistances",
    "combinedDR",
    "shieldType",
    "senses",
    "canLevelUp"
]
Full Sample:
{
    "name": "Aya the Ranger",
    "type": "character",
    "_id": "3HwYDeTOXA3am6kV",
    "img": "icons/svg/mystery-man.svg",
    "system": {
        "shapechangeImg": "icons/svg/mystery-man.svg",
        "tokenImg": "icons/svg/mystery-man.svg",
        "companionUuid": "",
        "companionPublicId": "",
        "companionUsePersonalKey": false,
        "companionAutosync": false,
        "companionLockGM": false,
        "abilities": {
            "str": {
                "total": 10,
                "mod": 0,
                "value": 10,
                "carryBonus": 0,
                "carryMultiplier": 1,
                "checkMod": 0,
                "damage": 0,
                "drain": 0,
                "penalty": 0,
                "userPenalty": 0,
                "origMod": 0,
                "origTotal": 10,
                "isZero": false
            },
            "dex": {
                "total": 10,
                "mod": 0,
                "value": 10,
                "checkMod": 0,
                "damage": 0,
                "drain": 0,
                "penalty": 0,
                "userPenalty": 0,
                "origMod": 0,
                "origTotal": 10,
                "isZero": false
            },
            "con": {
                "total": 10,
                "mod": 0,
                "value": 10,
                "checkMod": 0,
                "damage": 0,
                "drain": 0,
                "penalty": 0,
                "userPenalty": 0,
                "origMod": 0,
                "origTotal": 10,
                "isZero": false
            },
            "int": {
                "total": 10,
                "mod": 0,
                "value": 10,
                "checkMod": 0,
                "damage": 0,
                "drain": 0,
                "penalty": 0,
                "userPenalty": 0,
                "origMod": 0,
                "origTotal": 10,
                "isZero": false
            },
            "wis": {
                "total": 10,
                "mod": 0,
                "value": 10,
                "checkMod": 0,
                "damage": 0,
                "drain": 0,
                "penalty": 0,
                "userPenalty": 0,
                "origMod": 0,
                "origTotal": 10,
                "isZero": false
            },
            "cha": {
                "total": 10,
                "mod": 0,
                "value": 10,
                "checkMod": 0,
                "damage": 0,
                "drain": 0,
                "penalty": 0,
                "userPenalty": 0,
                "origMod": 0,
                "origTotal": 10,
                "isZero": false
            }
        },
        "resources": {},
        "attributes": {
            "encumbrance": {
                "level": 0,
                "levels": {
                    "light": 33,
                    "medium": 66,
                    "heavy": 100,
                    "carry": 200,
                    "drag": 500
                },
                "carriedWeight": 0
            },
            "senses": {
                "darkvision": 0,
                "blindsight": 0,
                "tremorsense": 0,
                "truesight": 0,
                "lowLight": false,
                "lowLightMultiplier": 2,
                "special": ""
            },
            "hd": {
                "base": {
                    "_deprecated": true,
                    "value": 0
                },
                "total": 0,
                "max": {
                    "_deprecated": true,
                    "value": 0
                },
                "racialClass": 0
            },
            "naturalAC": 0,
            "naturalACTotal": 0,
            "fortification": {
                "value": 0,
                "total": 0
            },
            "ac": {
                "normal": {
                    "value": 0,
                    "total": 10
                },
                "touch": {
                    "value": 0,
                    "total": 10
                },
                "flatFooted": {
                    "value": 0,
                    "total": 10
                }
            },
            "concealment": {
                "value": 0,
                "total": 0
            },
            "bab": {
                "value": 0,
                "total": 0,
                "base": 0
            },
            "cmd": {
                "value": 0,
                "total": 10,
                "flatFootedTotal": 10
            },
            "cmb": {
                "value": 0,
                "total": 0
            },
            "sr": {
                "formula": "",
                "total": 0
            },
            "pr": {
                "formula": "",
                "total": 0
            },
            "hardness": {
                "formula": "",
                "total": 0
            },
            "cmbNotes": "",
            "saveNotes": "",
            "acNotes": "",
            "cmdNotes": "",
            "srNotes": "",
            "attack": {
                "general": 0,
                "melee": 0,
                "ranged": 0,
                "sunder": 0,
                "bullrush": 0
            },
            "damage": {
                "general": 0,
                "weapon": 0,
                "spell": 0
            },
            "maxDexBonus": 999,
            "maxDex": {
                "gear": null,
                "encumbrance": null,
                "total": 999
            },
            "acp": {
                "gear": 0,
                "encumbrance": 0,
                "total": 0
            },
            "energyDrain": 0,
            "quadruped": false,
            "savingThrows": {
                "fort": {
                    "total": 0,
                    "base": 0
                },
                "ref": {
                    "total": 0,
                    "base": 0
                },
                "will": {
                    "total": 0,
                    "base": 0
                }
            },
            "hp": {
                "value": 0,
                "min": -100,
                "base": 0,
                "max": 0,
                "temp": 0,
                "nonlethal": 0
            },
            "turnUndeadHdTotal": 0,
            "turnUndeadUsesBonusFormula": "",
            "turnUndeadUses": 0,
            "prestigeCl": {
                "psionic": {
                    "max": 0,
                    "value": 0,
                    "total": 0
                },
                "arcane": {
                    "max": 0,
                    "value": 0,
                    "total": 0
                },
                "divine": {
                    "max": 0,
                    "value": 0,
                    "total": 0
                },
                "cards": {
                    "max": 0,
                    "value": 0
                }
            },
            "turnUndeadUsesTotal": 0,
            "sneakAttackDiceTotal": 0,
            "minionClassLevels": {},
            "minionDistance": {},
            "spellPointsTotal": [],
            "powerPointsTotal": 0,
            "arcaneSpellFailure": 0,
            "psionicFocus": false,
            "wounds": {
                "min": 0,
                "value": 20,
                "max": 20
            },
            "vigor": {
                "min": 0,
                "value": 0,
                "temp": 0,
                "max": 0
            },
            "init": {
                "value": 0,
                "bonus": 0,
                "total": 0
            },
            "prof": 2,
            "speed": {
                "land": {
                    "base": 30,
                    "total": 30,
                    "run": 120
                },
                "climb": {
                    "base": 0,
                    "total": 0,
                    "run": 0
                },
                "swim": {
                    "base": 0,
                    "total": 0,
                    "run": 0
                },
                "burrow": {
                    "base": 0,
                    "total": 0,
                    "run": 0
                },
                "fly": {
                    "base": 0,
                    "total": 0,
                    "run": 0,
                    "maneuverability": "average"
                }
            },
            "conditions": {
                "blind": false,
                "dazzled": false,
                "deaf": false,
                "entangled": false,
                "fatigued": false,
                "exhausted": false,
                "grappled": false,
                "helpless": false,
                "paralyzed": false,
                "pinned": false,
                "fear": false,
                "sickened": false,
                "stunned": false,
                "shaken": false,
                "polymorphed": false,
                "wildshaped": false,
                "prone": false,
                "dead": false,
                "dying": false,
                "disabled": false,
                "stable": false,
                "unconscious": false,
                "staggered": false,
                "invisible": false,
                "banished": false
            },
            "spells": {
                "concentration": {
                    "bonus": 0,
                    "context": ""
                },
                "spellbooks": {
                    "primary": {
                        "name": "Primary",
                        "class": "",
                        "cl": {
                            "base": 0,
                            "value": 0,
                            "total": 0,
                            "formula": ""
                        },
                        "concentration": 0,
                        "bonusPrestigeCl": 0,
                        "concentrationFormula": "",
                        "concentrationNotes": "",
                        "clNotes": "",
                        "ability": "int",
                        "spellslotAbility": "",
                        "autoSpellLevels": true,
                        "usePowerPoints": false,
                        "autoSetup": true,
                        "spellcastingType": null,
                        "powerPointsFormula": "",
                        "dailyPowerPointsFormula": "",
                        "powerPoints": 0,
                        "powerPointsTotal": 0,
                        "maximumPowerPointLimit": "@cl",
                        "arcaneSpellFailure": true,
                        "baseDCFormula": "10 + @sl + @ablMod",
                        "spontaneous": false,
                        "hasSpecialSlot": false,
                        "showOnlyPrepared": false,
                        "specialSlots": {
                            "level1": null,
                            "level2": null,
                            "level3": null,
                            "level4": null,
                            "level5": null,
                            "level6": null,
                            "level7": null,
                            "level8": null,
                            "level9": null
                        },
                        "maxPrestigeCl": 0,
                        "allSpellsKnown": false,
                        "hasPrestigeCl": false,
                        "canAddPrestigeCl": false,
                        "canRemovePrestigeCl": false,
                        "powersKnown": 0,
                        "powersMaxLevel": 0,
                        "powerPointsValue": {
                            "max": 0,
                            "value": 0
                        },
                        "spells": {
                            "spell0": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell1": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell2": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell3": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell4": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell5": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell6": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell7": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell8": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell9": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            }
                        },
                        "spellcastingAbilityBonus": 0
                    },
                    "secondary": {
                        "name": "Secondary",
                        "class": "",
                        "cl": {
                            "base": 0,
                            "value": 0,
                            "total": 0,
                            "formula": ""
                        },
                        "concentration": 0,
                        "bonusPrestigeCl": 0,
                        "concentrationFormula": "",
                        "concentrationNotes": "",
                        "clNotes": "",
                        "ability": "int",
                        "spellslotAbility": "",
                        "autoSpellLevels": true,
                        "usePowerPoints": false,
                        "autoSetup": true,
                        "spellcastingType": null,
                        "powerPointsFormula": "",
                        "powerPoints": 0,
                        "powerPointsTotal": 0,
                        "maximumPowerPointLimit": "@cl",
                        "dailyPowerPointsFormula": "",
                        "arcaneSpellFailure": true,
                        "baseDCFormula": "10 + @sl + @ablMod",
                        "spontaneous": false,
                        "hasSpecialSlot": false,
                        "showOnlyPrepared": false,
                        "specialSlots": {
                            "level1": null,
                            "level2": null,
                            "level3": null,
                            "level4": null,
                            "level5": null,
                            "level6": null,
                            "level7": null,
                            "level8": null,
                            "level9": null
                        },
                        "maxPrestigeCl": 0,
                        "allSpellsKnown": false,
                        "hasPrestigeCl": false,
                        "canAddPrestigeCl": false,
                        "canRemovePrestigeCl": false,
                        "powersKnown": 0,
                        "powersMaxLevel": 0,
                        "powerPointsValue": {
                            "max": 0,
                            "value": 0
                        },
                        "spells": {
                            "spell0": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell1": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell2": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell3": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell4": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell5": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell6": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell7": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell8": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell9": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            }
                        },
                        "spellcastingAbilityBonus": 0
                    },
                    "tertiary": {
                        "name": "Tertiary",
                        "class": "",
                        "cl": {
                            "base": 0,
                            "value": 0,
                            "total": 0,
                            "formula": ""
                        },
                        "concentration": 0,
                        "bonusPrestigeCl": 0,
                        "concentrationFormula": "",
                        "concentrationNotes": "",
                        "clNotes": "",
                        "ability": "int",
                        "spellslotAbility": "",
                        "autoSpellLevels": true,
                        "usePowerPoints": false,
                        "autoSetup": true,
                        "spellcastingType": null,
                        "powerPointsFormula": "",
                        "powerPoints": 0,
                        "powerPointsTotal": 0,
                        "maximumPowerPointLimit": "@cl",
                        "dailyPowerPointsFormula": "",
                        "arcaneSpellFailure": true,
                        "baseDCFormula": "10 + @sl + @ablMod",
                        "spontaneous": false,
                        "hasSpecialSlot": false,
                        "showOnlyPrepared": false,
                        "specialSlots": {
                            "level1": null,
                            "level2": null,
                            "level3": null,
                            "level4": null,
                            "level5": null,
                            "level6": null,
                            "level7": null,
                            "level8": null,
                            "level9": null
                        },
                        "maxPrestigeCl": 0,
                        "allSpellsKnown": false,
                        "hasPrestigeCl": false,
                        "canAddPrestigeCl": false,
                        "canRemovePrestigeCl": false,
                        "powersKnown": 0,
                        "powersMaxLevel": 0,
                        "powerPointsValue": {
                            "max": 0,
                            "value": 0
                        },
                        "spells": {
                            "spell0": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell1": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell2": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell3": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell4": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell5": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell6": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell7": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell8": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell9": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            }
                        },
                        "spellcastingAbilityBonus": 0
                    },
                    "spelllike": {
                        "name": "Spell-likes",
                        "class": "_hd",
                        "cl": {
                            "base": 0,
                            "value": 0,
                            "total": 1,
                            "formula": ""
                        },
                        "concentration": 0,
                        "bonusPrestigeCl": 0,
                        "concentrationFormula": "",
                        "concentrationNotes": "",
                        "clNotes": "",
                        "ability": "cha",
                        "spellslotAbility": "",
                        "autoSpellLevels": true,
                        "usePowerPoints": false,
                        "autoSetup": false,
                        "spellcastingType": "None",
                        "powerPointsFormula": "",
                        "powerPoints": 0,
                        "powerPointsTotal": 0,
                        "maximumPowerPointLimit": "@cl",
                        "dailyPowerPointsFormula": "",
                        "arcaneSpellFailure": true,
                        "baseDCFormula": "10 + @sl + @ablMod",
                        "spontaneous": false,
                        "hasSpecialSlot": false,
                        "showOnlyPrepared": false,
                        "specialSlots": {
                            "level1": null,
                            "level2": null,
                            "level3": null,
                            "level4": null,
                            "level5": null,
                            "level6": null,
                            "level7": null,
                            "level8": null,
                            "level9": null
                        },
                        "maxPrestigeCl": 0,
                        "allSpellsKnown": false,
                        "hasPrestigeCl": false,
                        "canAddPrestigeCl": false,
                        "canRemovePrestigeCl": false,
                        "powersKnown": 0,
                        "powersMaxLevel": 0,
                        "powerPointsValue": {
                            "max": 0,
                            "value": 0
                        },
                        "spells": {
                            "spell0": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell1": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell2": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell3": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell4": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell5": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell6": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell7": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell8": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            },
                            "spell9": {
                                "value": 0,
                                "max": 0,
                                "base": 0,
                                "known": 0,
                                "maxKnown": 0,
                                "bonus": 0,
                                "classBase": 0
                            }
                        },
                        "spellcastingAbilityBonus": 0
                    }
                }
            },
            "cards": {
                "concentration": {
                    "bonus": 0,
                    "context": ""
                },
                "decks": {
                    "primary": {
                        "name": "Primary",
                        "class": "",
                        "cl": {
                            "base": null,
                            "value": 0,
                            "total": 0,
                            "formula": ""
                        },
                        "autoHandSize": false,
                        "handSize": {
                            "base": 0,
                            "value": 0,
                            "total": 0,
                            "formula": ""
                        },
                        "drawRandom": false,
                        "deckSize": {
                            "base": 0,
                            "value": 0,
                            "total": 0,
                            "formula": ""
                        },
                        "clNotes": "",
                        "ability": "int",
                        "spellslotAbility": "",
                        "addHalfOtherLevels": false,
                        "autoSetup": true,
                        "baseDCFormula": "10 + @sl + @ablMod",
                        "maxPrestigeCl": 0,
                        "hasPrestigeCl": false,
                        "canAddPrestigeCl": false,
                        "canRemovePrestigeCl": false
                    },
                    "secondary": {
                        "name": "Secondary",
                        "class": "",
                        "cl": {
                            "base": null,
                            "value": 0,
                            "total": 0,
                            "formula": ""
                        },
                        "autoHandSize": false,
                        "handSize": {
                            "base": 0,
                            "value": 0,
                            "total": 0,
                            "formula": ""
                        },
                        "drawRandom": false,
                        "deckSize": {
                            "base": 0,
                            "value": 0,
                            "total": 0,
                            "formula": ""
                        },
                        "clNotes": "",
                        "ability": "int",
                        "spellslotAbility": "",
                        "addHalfOtherLevels": false,
                        "autoSetup": true,
                        "baseDCFormula": "10 + @sl + @ablMod",
                        "maxPrestigeCl": 0,
                        "hasPrestigeCl": false,
                        "canAddPrestigeCl": false,
                        "canRemovePrestigeCl": false
                    }
                }
            },
            "spellcasting": {
                "_deprecated": true
            },
            "spelldc": {
                "_deprecated": true
            },
            "damageReduction": {
                "any": 0,
                "types": []
            },
            "energyResistance": [],
            "mods": {
                "skills": {}
            },
            "runSpeedMultiplierModifier": 0,
            "speedMultiplier": 0
        },
        "details": {
            "level": {
                "value": 0,
                "min": 0,
                "max": 40,
                "available": 1
            },
            "breakDC": {
                "base": 0,
                "total": 0
            },
            "levelUpData": [
                {
                    "level": 1,
                    "id": "_level1",
                    "classId": null,
                    "class": null,
                    "classImage": null,
                    "skills": {},
                    "hp": 0,
                    "hasFeat": true,
                    "hasAbility": false
                }
            ],
            "alignment": "",
            "biography": {
                "value": "",
                "public": ""
            },
            "notes": {
                "value": "",
                "public": ""
            },
            "bonusSkillRankFormula": "",
            "xp": {
                "value": 0,
                "min": 0,
                "max": 0,
                "pct": 0
            },
            "height": "",
            "weight": "",
            "gender": "",
            "deity": "",
            "age": "",
            "levelUpProgression": true,
            "cr": "0.00",
            "totalCr": "0.00"
        },
        "skills": {
            "apr": {
                "value": 0,
                "ability": "int",
                "rt": false,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "blc": {
                "value": 0,
                "ability": "dex",
                "rt": false,
                "acp": true,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "blf": {
                "value": 0,
                "ability": "cha",
                "rt": false,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "clm": {
                "value": 0,
                "ability": "str",
                "rt": false,
                "acp": true,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "coc": {
                "value": 0,
                "ability": "con",
                "rt": false,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "crf": {
                "value": 0,
                "ability": "int",
                "rt": false,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "subSkills": {},
                "namedSubSkills": {},
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "dsc": {
                "value": 0,
                "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "dip": {
                "value": 0,
                "ability": "cha",
                "rt": false,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "dev": {
                "value": 0,
                "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "dis": {
                "value": 0,
                "ability": "cha",
                "rt": false,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "esc": {
                "value": 0,
                "ability": "dex",
                "rt": false,
                "acp": true,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "fog": {
                "value": 0,
                "ability": "int",
                "rt": false,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "gif": {
                "value": 0,
                "ability": "cha",
                "rt": false,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "han": {
                "value": 0,
                "ability": "cha",
                "rt": true,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "hea": {
                "value": 0,
                "ability": "wis",
                "rt": false,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "hid": {
                "value": 0,
                "ability": "dex",
                "rt": false,
                "acp": true,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "int": {
                "value": 0,
                "ability": "cha",
                "rt": false,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "jmp": {
                "value": 0,
                "ability": "str",
                "rt": false,
                "acp": true,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "kar": {
                "value": 0,
                "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "kdu": {
                "value": 0,
                "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "ken": {
                "value": 0,
                "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "kge": {
                "value": 0,
                "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "khi": {
                "value": 0,
                "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "klo": {
                "value": 0,
                "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "kna": {
                "value": 0,
                "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "kno": {
                "value": 0,
                "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": true,
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "kpl": {
                "value": 0,
                "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "kre": {
                "value": 0,
                "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "lis": {
                "value": 0,
                "ability": "wis",
                "rt": false,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "mos": {
                "value": 0,
                "ability": "dex",
                "rt": false,
                "acp": true,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "opl": {
                "value": 0,
                "ability": "dex",
                "rt": true,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "prf": {
                "value": 0,
                "ability": "cha",
                "rt": false,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "subSkills": {},
                "namedSubSkills": {},
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "pro": {
                "value": 0,
                "ability": "wis",
                "rt": true,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "subSkills": {},
                "namedSubSkills": {},
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "rid": {
                "value": 0,
                "ability": "dex",
                "rt": false,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "src": {
                "value": 0,
                "ability": "int",
                "rt": false,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "sen": {
                "value": 0,
                "ability": "wis",
                "rt": false,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "slt": {
                "value": 0,
                "ability": "dex",
                "rt": true,
                "acp": true,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "spk": {
                "value": 0,
                "ability": "",
                "rt": true,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "spl": {
                "value": 0,
                "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "spt": {
                "value": 0,
                "ability": "wis",
                "rt": false,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "sur": {
                "value": 0,
                "ability": "wis",
                "rt": false,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "swm": {
                "value": 0,
                "ability": "str",
                "rt": false,
                "acp": true,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "tmb": {
                "value": 0,
                "ability": "dex",
                "rt": true,
                "acp": true,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "umd": {
                "value": 0,
                "ability": "cha",
                "rt": true,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "uro": {
                "value": 0,
                "ability": "dex",
                "rt": false,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "kps": {
                "value": 0,
                "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "aut": {
                "value": 0,
                "ability": "wis",
                "rt": true,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "psi": {
                "value": 0,
                "ability": "int",
                "rt": true,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "upd": {
                "value": 0,
                "ability": "cha",
                "rt": true,
                "acp": false,
                "rank": 0,
                "notes": "",
                "mod": null,
                "background": false,
                "visibility": "default",
                "cs": false,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            },
            "aSkill": {
                "name": "A Skill",
                "ability": "str",
                "rank": 0,
                "notes": "",
                "mod": null,
                "rt": true,
                "cs": false,
                "acp": false,
                "background": false,
                "custom": true,
                "worldCustom": true,
                "acpPenalty": 0,
                "energyDrainPenalty": 0,
                "abilityModifier": 0
            }
        },
        "customSkills": {},
        "traits": {
            "size": "med",
            "tokensize": "actor",
            "senses": "",
            "dr": "",
            "incorporeal": false,
            "eres": "",
            "cres": "",
            "languages": {
                "value": [],
                "custom": ""
            },
            "di": {
                "value": [],
                "custom": ""
            },
            "dv": {
                "value": [],
                "custom": ""
            },
            "ci": {
                "value": [],
                "custom": ""
            },
            "perception": {
                "_deprecated": true
            },
            "weaponProf": {
                "value": [],
                "custom": ""
            },
            "armorProf": {
                "value": [],
                "custom": ""
            },
            "actualSize": "med"
        },
        "currency": {
            "pp": 0,
            "gp": 0,
            "sp": 0,
            "cp": 0
        },
        "altCurrency": {
            "pp": 0,
            "gp": 0,
            "sp": 0,
            "cp": 0
        },
        "customCurrency": {},
        "noLightOverride": false,
        "noTokenOverride": false,
        "noSkillSynergy": false,
        "noBuffDisplay": false,
        "lockEditingByPlayers": false,
        "showCardSheet": false,
        "showSpellcastingSheet": true,
        "staticBonus": {
            "hp": 0,
            "ac": 0
        },
        "isPartyMember": false,
        "displayNonRTSkills": false,
        "jumpSkillAdjust": true,
        "noVisionOverride": false,
        "counters": {
            "feat": {
                "base": {
                    "value": 1,
                    "counted": 0
                }
            }
        },
        "classes": {},
        "totalNonEclLevels": 0,
        "damage": {
            "nonlethal": {
                "value": 0,
                "max": 0
            }
        },
        "naturalAttackCount": 0,
        "classLevels": 0,
        "combinedResistances": [],
        "combinedDR": [],
        "shieldType": "none",
        "senses": {
            "darkvision": 0,
            "blindsight": 0,
            "tremorsense": 0,
            "truesight": 0,
            "lowLight": false,
            "lowLightMultiplier": 2,
            "special": "",
            "modified": {}
        },
        "canLevelUp": false
    },
    "prototypeToken": {
        "name": "Aya the Ranger",
        "displayName": 0,
        "actorLink": true,
        "appendNumber": false,
        "prependAdjective": false,
        "texture": {
            "src": "icons/svg/mystery-man.svg",
            "scaleX": 1,
            "scaleY": 1,
            "offsetX": 0,
            "offsetY": 0,
            "rotation": 0
        },
        "width": 1,
        "height": 1,
        "lockRotation": false,
        "rotation": 0,
        "alpha": 1,
        "disposition": -1,
        "displayBars": 0,
        "bar1": {
            "attribute": "attributes.hp"
        },
        "bar2": {
            "attribute": null
        },
        "light": {
            "alpha": 0.5,
            "angle": 360,
            "bright": 0,
            "coloration": 1,
            "dim": 0,
            "attenuation": 0.5,
            "luminosity": 0.5,
            "saturation": 0,
            "contrast": 0,
            "shadows": 0,
            "animation": {
                "type": null,
                "speed": 5,
                "intensity": 5,
                "reverse": false
            },
            "darkness": {
                "min": 0,
                "max": 1
            }
        },
        "sight": {
            "enabled": true,
            "range": 0,
            "angle": 360,
            "visionMode": "basic",
            "attenuation": 0.1,
            "brightness": 0,
            "saturation": 0,
            "contrast": 0
        },
        "detectionModes": [],
        "flags": {},
        "randomImg": false
    },
    "items": [],
    "effects": [],
    "folder": null,
    "sort": 0,
    "ownership": {
        "default": 0,
        "cB3ob9BYxSFYX7sd": 3
    },
    "flags": {
        "D35E": {
            "naturalAttackCount": 0
        }
    },
    "_stats": {
        "systemId": "D35E",
        "systemVersion": "2.3.0",
        "coreVersion": "11.299",
        "createdTime": 1687094623350,
        "modifiedTime": 1687094623468,
        "lastModifiedBy": "cB3ob9BYxSFYX7sd"
    }
}
```

**Key Information Needed:**
- Complete actor structure
- How items are attached to actors
- System data fields for attributes, HP, AC, saves, BAB
- This is critical - shows us a working example!

---

## Actor Structure

### Basic Actor Properties
```typescript
Actor.create({
  name: string,
  type: "character" | "npc",
  img: string,
  folder: string,
  system: {
    abilities: {
      str: { value: number },
      dex: { value: number },
      con: { value: number },
      int: { value: number },
      wis: { value: number },
      cha: { value: number }
    },
    // ... other system data
  }
})
```

### Items Needed on Actor
1. **Race Item** - Defines racial traits, size, speed, abilities
2. **Class Item(s)** - Each class with levels
3. **Feature Items** - Class features, racial traits
4. **Feat Items** - Feats granted by class, race, or chosen
5. **Equipment Items** - Armor, weapons, gear
6. **Spell Items** - For casters

---

## Race Data Structure
<!-- Fill in after inspecting race compendium -->
```javascript
{
  name: "Human",
  type: "race",
  system: {
    // Racial traits
    // Ability modifiers
    // Size
    // Speed
    // Special abilities
  }
}
```

---

## Class Data Structure
<!-- Fill in after inspecting class compendium -->
```javascript
{
  name: "Fighter",
  type: "class",
  system: {
    level: number,
    hd: number,  // Hit die (d10, d8, etc.)
    bab: "high" | "medium" | "low",
    savingThrows: {
      fort: "high" | "low",
      ref: "high" | "low",
      will: "high" | "low"
    },
    skillsPerLevel: number,
    classSkills: string[],
    // Class features per level
  }
}
```

---

## Hit Points Calculation
```
HP per level = Hit Die roll + CON modifier
- First level: Max hit die
- Subsequent levels: Roll or take average
- Minimum 1 HP per level regardless of CON penalty
```

---

## Derived Stats Calculation

### Armor Class
```
AC = 10 + Armor bonus + Shield bonus + DEX modifier + Size modifier + Natural armor + Deflection + Misc
```

### Base Attack Bonus
```
High: +1 per level (Fighter, Barbarian, Paladin, Ranger)
Medium: +3/4 per level (Cleric, Druid, Monk, Rogue)
Low: +1/2 per level (Wizard, Sorcerer)
```

### Saving Throws
```
Good save: 2 + (level / 2)
Poor save: (level / 3)
```

---

## Implementation Strategy

### Step 1: Create Bare Actor ✅
- Name
- Type (character/npc)
- Ability scores

### Step 2: Add Race ⏳
- Find race in compendium
- Add race item to actor
- Apply racial modifiers

### Step 3: Add Class(es) ⏳
- Find class in compendium
- Create class item with level
- Add to actor
- Apply class features

### Step 4: Calculate HP ⏳
- Roll hit die for each class level
- Add CON modifier
- Update actor HP

### Step 5: Apply Features ⏳
- Add starting feats
- Add class features
- Add racial traits

### Step 6: Add Equipment ⏳
- Add items from template
- Equip items
- Calculate AC from armor

### Step 7: Handle Spells ⏳
- For caster classes
- Add known/prepared spells
- Set spell slots

---

## Questions to Answer
1. ⏳ What are the exact compendium IDs for D35E system?
2. ⏳ How does D35E structure race items?
3. ⏳ How does D35E structure class items?
4. ⏳ How do you add an item from a compendium to an actor?
5. ⏳ How does D35E calculate derived stats?
6. ⏳ Does D35E auto-calculate BAB, saves, AC?
7. ⏳ How are class features applied?
8. ⏳ How are feats stored and applied?

---

## Research Session Notes

### Session 1: 2025-11-21 - Initial Discovery
✅ Found all D35E compendiums using `debugCompendiums()`

**Key Compendiums Identified:**
- `D35E.racialfeatures` - Races (32)
- `D35E.classes` - Classes (33)
- `D35E.class-abilities` - Class Abilities (130)
- `D35E.feats` - Feats (388)
- `D35E.weapons-and-ammo` - Weapons (85)
- `D35E.armors-and-shields` - Armor (18)
- `D35E.sample-chars` - Sample Characters (11) ⭐ **Use these as reference!**
- `D35E.bestiary` - Bestiary (645) - May have useful examples

**Next Steps:**
1. Inspect each key compendium with `debugPack()`
2. Look at sample characters to see complete actor structure
3. Optionally: Inspect an actor from your game world

---

### Session 2: [Pending] - Structure Analysis
<!-- Paste detailed compendium outputs in sections above -->

---

## Analyzing Live Actors (Advanced)

If you want to see the structure of an actual actor in your world, run this in console:

```javascript
// Get first actor from world
const actor = game.actors.contents[0];
console.log("Actor structure:", actor);
console.log("Actor data:", actor.toObject());
console.log("Actor items:", actor.items.map(i => ({ name: i.name, type: i.type })));
console.log("System data:", actor.system);
```

Or inspect a specific actor by name:
```javascript
const actor = game.actors.getName("Character Name Here");
console.log("Full actor export:", actor.toObject());
```

**Paste results here:**
```javascript
// Actor analysis
```

---

## Implementation Notes

### How to Add Items from Compendium to Actor

Based on research, the pattern should be:
```javascript
// 1. Get the compendium
const pack = game.packs.get('D35E.classes');

// 2. Get the item from compendium
const item = await pack.getDocument(itemId);

// 3. Create a copy on the actor
await actor.createEmbeddedDocuments('Item', [item.toObject()]);

// OR import directly
await actor.importItemFromCollection(pack.collection, itemId);
```

### Adding Items with Modifications
```javascript
// If we need to modify before adding (like setting class level)
const itemData = item.toObject();
itemData.system.level = 2;  // Adjust as needed
await actor.createEmbeddedDocuments('Item', [itemData]);
```

---

