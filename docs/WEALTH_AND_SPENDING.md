# Wealth and Spending Plans

Townie Maker separates how much wealth a character receives from how that wealth is spent.

## Rules Provenance

- Adventurer Wealth by Level and NPC Gear Value are guidance from the D&D 3.5 Dungeon Master's Guide. They are not tables from the Open Game Content SRD.
- The SRD provides class starting wealth, magic-item body-slot rules, and item pricing rules.
- Weapon enhancement prices use equivalent bonus squared times 2,000 gp. Armor and shield enhancement prices use equivalent bonus squared times 1,000 gp.
- D&D 3.5 does not define an official percentage split between weapons, armor, ability items, defenses, and consumables.

The built-in spending presets are Townie Maker recommendations informed by common 3.5 play patterns. They are not official D&D rules.

## Wealth Controls

**Adventurer Wealth** uses the higher PC wealth-by-level table. It suits adventurers, companions, and major opponents intended to resemble PCs.

**NPC Gear Value** uses the lower NPC equipment-value table. It suits guards, professionals, and other settled NPCs.

**No Budget** skips automatic magic equipment and gives only the existing token-gold behavior.

The wealth multiplier scales the selected table from 0% to 200%. Reserve removes a percentage of the post-mundane budget before magic-item selection and leaves it available as coins or a bank deposit.

The Equipment screen uses three separate percentage levels:

1. **Wealth Scale** changes the total amount of wealth. It is not an allocation and does not belong in a 100% sum.
2. **Overall Magic Budget** divides all spendable magic-item wealth among categories and totals 100%.
3. **Item Mixes** divide one parent category. Each Weapon, Armor, Protection, or Consumables mix independently totals 100%.

Percentages from different levels or different item mixes should not be added together.

## Spending Presets

- **Class Recommended** selects a profile from the class and build. A shield distinguishes melee and caster clerics, and wild-shape and caster druids.
- **Frontline Offense** favors weapons and armor.
- **Defensive** favors armor, saving throws, and AC protection.
- **Spellcaster** favors ability items, rods, staves, and consumables.
- **Consumables & Support** favors wands, scrolls, and potions.

Advanced controls expose all categories applicable to the selected class. Category shares are normalized to exactly 100%, and integer GP allocation uses stable largest-remainder rounding so no gold disappears.

Every nested member is editable, including Potions. If an entered value exceeds the capacity left by its siblings, Townie Maker clamps only that field to the maximum, marks it red, and explains the accepted value. Lower another member first to create room for a larger value.

Lowering a member temporarily shows an unassigned percentage. Assign that remainder to another member before creation; Townie Maker blocks creation while any visible item mix is below 100% so the generated plan never differs from the displayed values.

The complete mixes are:

- Primary Weapon + Secondary Weapon
- Armor + Shield
- Ring + Other Protection
- Wands + Scrolls + Potions

Other Protection means an amulet on armored builds, bracers on Monks, or an amulet/bracers mix on unarmored arcane casters.

## Caster Offense

Caster-focused builds distinguish two kinds of equipment:

- **Backup Weapon** is a conventional carried weapon such as a dagger, crossbow, or quarterstaff. It receives a small budget for a plain enhancement.
- **Caster Implements** are charged magic staffs and metamagic rods. They remain the caster's larger and more important offensive equipment allocation.

Pure arcane and caster-focused divine profiles reserve 5% for a Backup Weapon and 18-29% for Caster Implements. If the starting kit has no weapon, the Backup Weapon stage buys nothing and its money rolls forward. A D&D 3.5 magic staff remains a charged spell-trigger item; it is not treated as an ordinary enhanced quarterstaff.

Automatic item spending is strict. Selected magic items cannot exceed the post-reserve magic budget. Categories execute in their configured priority order. Unused money moves to the next category, which can accept it up to its rollover cap; rejected rollover continues down the order and any final remainder becomes cash.

Item limits apply to the selected category. Consumable limits count individual wands and scrolls plus potion quantities. Shared body-slot state follows category order, so an earlier Cloak of Resistance can prevent a later Charisma cloak, and an earlier neck item can prevent a conflicting amulet or periapt.

Complete spending plans use deterministic rod and staff recommendations. Identical character and plan inputs therefore produce the same spending ledger.

## Template Configuration

Templates can save a complete `spendingPlan`. Generated GP totals and selected items must not be stored because they depend on level and class.

```json
{
  "spendingPlan": {
    "version": 1,
    "preset": "defensive",
    "wealth": {
      "mode": "npcWealth",
      "multiplierPercent": 100,
      "reservePercent": 5
    },
    "categories": {
      "weapon": {
        "enabled": true,
        "shareBasisPoints": 1800,
        "maxShareBasisPoints": 3000,
        "priority": 2
      }
    },
    "splits": {
      "primaryWeaponBasisPoints": 8000,
      "secondaryWeaponBasisPoints": 2000,
      "armorBasisPoints": 5000,
      "shieldBasisPoints": 5000,
      "ringBasisPoints": 6000,
      "otherProtectionBasisPoints": 4000,
      "wandsBasisPoints": 0,
      "scrollsBasisPoints": 0,
      "potionsBasisPoints": 10000
    }
  }
}
```

Percentages are stored as basis points: 10,000 is 100%, 1,800 is 18%, and 50 is 0.5%. Complete shipped plans should list all categories so their behavior does not change when preset defaults evolve.

Older plans may omit complementary split members. Townie Maker derives and normalizes them when loading, so the additive fields do not require a schema-version change.

Legacy `budgetMode`, `useStandardBudget`, `useNpcWealth`, `reserveGoldPercent`, and `magicItemBudgets` fields remain readable. A complete `spendingPlan` takes precedence.