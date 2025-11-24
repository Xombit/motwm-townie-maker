# D35E Level System - Understanding and Implementation

## Key Discoveries

After analyzing test exports and comparing with blank actors, we discovered how D35E's level system actually works:

### Level 0 vs Level 1

**Level 0** (blank actor):
- `system.details.level.value: 0`
- `system.details.xp.value: 0, max: 0`
- `system.details.levelUpData: [{ level: 1, classId: null, ... }]` - ONE template entry
- No classes assigned yet

**Level 1** (first level taken):
- `system.details.level.value: 1`
- `system.details.xp.value: 0-999, max: 1000`
- `system.classes.{className}.level: 1`
- `system.details.levelUpData: [{ level: 1, classId: "...", class: "Fighter", hp: 10, ... }]` - ONE entry with class info

**Level 2** (second level taken):
- `system.details.level.value: 2`
- `system.details.xp.value: 1000-2999, max: 3000`
- `system.classes.{className}.level: 2`
- `system.details.levelUpData: [{ level: 1, ... }, { level: 2, ... }]` - TWO entries

### The levelUpData Array

This is the critical data structure that tracks character progression:

```typescript
{
  level: 1,                    // Which level this represents
  id: "_level1",               // Unique identifier
  classId: "ABC123",           // The class item's ID
  class: "Fighter",            // Class name
  classImage: "path/to/img",   // Class icon
  skills: {},                  // Skill point allocations for this level
  hp: 10,                      // HP rolled/gained at this level
  hasFeat: true,               // Whether a feat is available at this level
  hasAbility: false            // Whether ability score increase available (every 4 levels)
}
```

## Current Implementation

### What We Do (Level 1 Characters)

1. **Create actor** with default stats
2. **Add race** item from compendium
3. **Add class** item from compendium
4. **Roll HP** (max for first level)
5. **Update levelUpData** with class info and HP

The character is created at **level 1** with:
- ✅ Proper class assignment
- ✅ Max HP for first level (d10 = 10 for Fighter)
- ✅ Correct levelUpData structure
- ✅ All automatic class features (weapon proficiencies, etc.)

### What We Don't Do (Yet)

We **don't support multi-level characters** because proper level advancement requires:

1. **XP assignment** to correct thresholds
2. **Skill point allocation** (per level based on class + INT)
3. **Feat selection** (level 1, then every 3 levels)
4. **Ability score increases** (every 4 levels)
5. **Class feature choices** (specializations, domains, schools, etc.)
6. **HP rolls** for each level beyond first
7. **Spell/power selection** for casters

### Why This Matters

D35E's level-up system is **interactive** and requires player choices. Automating it fully would require:

- Pre-selecting feats (which ones?)
- Allocating skill points (which skills?)
- Making class-specific choices (fighter bonus feats, wizard school, cleric domains, etc.)

## Recommended Workflow

### For Quick NPCs (Current Support)
1. Use Townie Maker to create **level 1** characters
2. Use D35E's level-up interface if you need higher levels
3. D35E will prompt for all necessary choices

### For Future Multi-Level Support
We could add:
- Template-based feat selection (e.g., Town Guard gets Power Attack, Weapon Focus)
- Automatic skill point distribution based on templates
- Pre-configured class choices
- "Quick NPC" mode that makes reasonable default choices

## XP Thresholds (D&D 3.5e)

```
Level  XP Required  Next Level
1      0           1,000
2      1,000       3,000
3      3,000       6,000
4      6,000       10,000
5      10,000      15,000
6      15,000      21,000
7      21,000      28,000
8      28,000      36,000
9      36,000      45,000
10     45,000      55,000
...
```

## Code Example: Current Implementation

```typescript
// addClass() - Adds class at level 1 only
static async addClass(actor: Actor, className: string, level: number): Promise<void> {
  const classData = await getClassFromCompendium(className);
  await actor.createEmbeddedDocuments('Item', [classData]);
  
  if (level === 1) {
    // Level 1 works perfectly - D35E handles everything
    return;
  }
  
  // Multi-level not supported - warn user
  console.warn(`Multi-level characters require manual level-up through D35E`);
}

// rollHP() - Updates level 1 entry with HP
static async rollHP(actor: Actor): Promise<void> {
  const classItem = getFirstClass(actor);
  const hpRoll = classItem.system.hd; // Max for level 1
  
  await classItem.update({ "system.hp": hpRoll });
  
  // Update existing levelUpData entry
  const levelUpData = actor.system.details.levelUpData;
  levelUpData[0].classId = classItem.id;
  levelUpData[0].class = classItem.name;
  levelUpData[0].hp = hpRoll;
  
  await actor.update({ "system.details.levelUpData": levelUpData });
}
```

## Conclusion

The Townie Maker now correctly creates **level 1 characters** that match D35E's expectations. For higher-level NPCs, users should:

1. Create the character at level 1 with Townie Maker
2. Use D35E's built-in level-up system to advance them
3. D35E will handle all the complex choices and calculations

This approach is simpler, more reliable, and respects D35E's design philosophy of guided character advancement.
