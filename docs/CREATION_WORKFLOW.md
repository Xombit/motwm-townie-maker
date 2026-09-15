# Creation Workflow and Ability Profiles

Townie Maker supports both guided creation and direct editing. The numbered path is:

1. Templates
2. Details
3. Abilities
4. Equipment
5. Create Townie

Every tab remains directly accessible. Settings is outside the required path and contains sheet, hit-point, and token defaults. Equipment contains wealth, loot, banking, and spending controls.

Intermediate creation steps provide Back, Create Now, and Next. On Equipment, Next becomes the only Create Townie button. Settings can return to the last creation step.

## Template Preview

Gallery cards intentionally show only icon, name, and description. Selecting a card immediately applies it to the draft and opens an inline detail view. The view includes all populated character, ability, skill, feat, equipment, spending, class-specific, and flavor fields.

Back to Templates returns to the gallery without undoing the applied draft. The selected card remains highlighted.

## Ability Priorities

Templates normally describe ability needs with `abilityPriority`. The first entry has the highest priority. Missing abilities are appended in STR, DEX, CON, INT, WIS, CHA order.

```json
{
  "abilityPriority": ["dex", "wis", "con"]
}
```

This Monk-style profile assigns the best available score to DEX, then WIS, then CON. STR, INT, and CHA follow.

For compatibility, a template without `abilityPriority` uses `primaryAbility` first and appends the remaining abilities. `primaryAbility` still controls existing HP and level behavior.

## Pinned Scores

The optional `abilities` object contains exact pinned scores. It is not a complete generated array unless all six values are deliberately provided.

```json
{
  "abilityPriority": ["int", "dex", "con", "wis"],
  "abilities": {
    "int": 18
  }
}
```

Pinned values remain fixed when Standard Array, Auto Buy, 3d6, or 4d6 Drop Lowest is generated. Any finite integer is accepted. Values outside the ordinary range are shown with a warning but are not rejected.

Editing a pinned score changes the pin for the current draft only. Unpin for Draft allows later generation to replace it. Neither action modifies `data/templates.json`.

Templates do not select an ability-generation method. The method is a user or world preference.

## Generation Methods

**Manual** keeps the current editable values.

**Standard Array** assigns 15, 14, 13, 12, 10, and 8 by priority. A pinned ability keeps its value and reserves its ranked array position.

**3d6** rolls three six-sided dice once for every unpinned ability. Totals are sorted highest first and assigned by priority.

**4d6 Drop Lowest** rolls four six-sided dice for every unpinned ability, discards the lowest die, sorts the totals, and assigns them by priority.

Changing priority after a dice roll reassigns the existing roll pool. It does not reroll. Reroll is always explicit.

## Simplified Auto Buy

The score costs use the D&D 3.5 Dungeon Master's Guide point-buy table:

| Score | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Cost | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 13 | 16 |

Townie Maker is not a full interactive point-buy editor. It uses tuned, exact-cost score packages and assigns them from highest to lowest priority. The packages follow common 3.5 character-building practice: invest strongly in defining abilities, maintain useful secondary scores, and leave one or two genuine dump stats instead of clustering everything around 10-12.

| Budget | Priority-ordered scores |
|---:|---|
| 15 | 14, 12, 11, 10, 8, 8 |
| 22 | 15, 13, 12, 11, 10, 8 |
| 25 | 15, 14, 13, 12, 10, 8 |
| 28 | 16, 14, 13, 12, 11, 8 |
| 32 | 16, 15, 14, 12, 12, 8 |

The default is 15, which retains an average score of 10.5 while still making the character's role visible. A 25-point character receives the familiar 15/14/13/12/10/8 array, assigned according to the template or draft priority.

A pinned ability reserves the score and point cost at its ranked position. That allocation is discarded rather than redistributed. This keeps template exceptions from strengthening all remaining scores.