# Multi-Level Character Support

## Changes Made

### GUI Updates
- Added **Class** input field on Details tab
- Added **Level (1-20)** numeric input on Details tab
- Templates now auto-fill class and level fields

### Backend Implementation

#### addClass() Method
- Now handles levels 1-20
- Sets proper XP thresholds for each level
- Updates actor level immediately

#### rollHP() Method
- Rolls HP for each level (1 through requested level)
- First level: max HP (e.g., d10 = 10 for Fighter)
- Subsequent levels: random roll (1 to max die size)
- Creates complete levelUpData array with entries for each level
- Each level includes:
  - HP roll for that level
  - Class information
  - Feat availability (level 1, then every 3 levels)
  - Ability score increase availability (every 4 levels)

### How It Works

When you create a character at level 5:

1. **XP is set** to 10,000 (level 5 threshold)
2. **Actor level** set to 5
3. **levelUpData** populated with 5 entries:
   - Level 1: Max HP, has feat
   - Level 2: Rolled HP
   - Level 3: Rolled HP
   - Level 4: Rolled HP, has feat, has ability increase
   - Level 5: Rolled HP

4. **D35E automatically**:
   - Syncs class level to 5
   - Calculates BAB, saves, skills based on level
   - Adds all class features up to level 5
   - Calculates total HP (base + CON modifier × level)

### Known Limitations

**Skill Points**: Not allocated automatically (skills object is empty)
- D35E shows available skill points
- User can allocate them manually through character sheet

**Feats**: Tracked but not selected automatically
- hasFeat flag set correctly (levels 1, 4, 7, 10, etc.)
- User must select feats manually

**Ability Score Increases**: Tracked but not applied automatically
- hasAbility flag set correctly (levels 4, 8, 12, etc.)
- User must apply increases manually

**Class Features**: Some require choices (domains, schools, etc.)
- D35E adds automatic features
- User must make interactive choices manually

### Testing

Create a level 5 Fighter:
1. Open Townie Maker
2. Select "Town Guard" template (or blank)
3. Go to Details tab
4. Set Class: "Fighter"
5. Set Level: 5
6. Fill in name and abilities
7. Click Create NPC

Expected Result:
- Level 5 Fighter
- Approximately 10 + 4d10 + (CON × 5) HP
- BAB +5
- Fort +4, Ref +1, Will +1
- All Fighter proficiencies and features
- 20 unallocated skill points (4 per level × 5 levels)
- 2 unselected feats (level 1 and level 4)

### XP Thresholds Reference

```
Level  XP Required
1      0
2      1,000
3      3,000
4      6,000
5      10,000
6      15,000
7      21,000
8      28000
9      36,000
10     45,000
11     55,000
12     66,000
13     78,000
14     91,000
15     105,000
16     120,000
17     136,000
18     153,000
19     171,000
20     190,000
```
