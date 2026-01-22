# Skill Priority System Analysis

## Proposed System
- **High priority**: 1 point every level
- **Medium priority**: 1 point every 2 levels
- **Low priority**: 1 point every 4 levels

## At Level 9:
- **High**: 9 ranks (levels 1-9)
- **Medium**: 5 ranks (levels 1, 3, 5, 7, 9)
- **Low**: 3 ranks (levels 1, 5, 9)

## Class Analysis

### Paladin (2+Int = 2 per level)
**Total points at level 9**: 24 (8 at L1 + 16 for L2-9)

**Current template** (uses proportional weights):
- Ride: 5 ranks (high) → wants ~15 points (62.5% of 24)
- Knowledge (Religion): 2 ranks (medium) → wants ~6 points (25% of 24)
- Diplomacy: 1 rank (low) → wants ~3 points (12.5% of 24)

**With new system**:
Option A: 1 high, 1 medium, 1 low = 17 points (UNDER by 7)
Option B: 2 high, 1 medium = 23 points (close!)
- Ride: 9 ranks (high)
- Knowledge (Religion): 9 ranks (high)
- Diplomacy: 5 ranks (medium)
- **Total**: 23 ranks ✓

Option C: 1 high, 2 medium, 1 low = 22 points
- Ride: 9 ranks (high)
- Knowledge (Religion): 5 ranks (medium)
- Diplomacy: 5 ranks (medium)
- Concentration: 3 ranks (low)
- **Total**: 22 ranks ✓

### Ranger (6+Int = 6 per level)
**Total points at level 9**: 78 (24 at L1 + 54 for L2-9)

**Current template**:
- Survival: 5 ranks (high)
- Spot: 4 ranks (high)
- Listen: 4 ranks (high)
- Hide: 4 ranks (medium)
- Move Silently: 3 ranks (medium)
- Search: 2 ranks (low)
- Knowledge (Nature): 2 ranks (low)
**Total**: 24 ranks at L1

**With new system** (needs ~78 ranks):
- 8 high skills: 8 × 9 = 72 ranks
- 8 high + 1 medium: 72 + 5 = 77 ranks ✓
- 7 high + 3 medium: 63 + 15 = 78 ranks ✓

Suggested:
- Survival: 9 (high)
- Spot: 9 (high)
- Listen: 9 (high)
- Hide: 9 (high)
- Move Silently: 9 (high)
- Search: 9 (high)
- Knowledge (Nature): 9 (high)
- Climb: 5 (medium) or Jump: 5 (medium) or Use Rope: 5 (medium)

### Rogue (8+Int(1) = 9 per level)
**Total points at level 9**: 117 (36 at L1 + 81 for L2-9)

**Current template** (11 skills totaling 36 ranks at L1):
- Hide: 5 (high)
- Move Silently: 5 (high)
- Open Lock: 4 (high)
- Disable Device: 4 (medium)
- Sleight of Hand: 4 (medium)
- Search: 4 (medium)
- Spot: 3 (low)
- Listen: 3 (low)
- Tumble: 2 (low)
- Climb: 1 (low)
- Escape Artist: 1 (low)

**With new system** (needs ~117 ranks):
- 13 high skills: 13 × 9 = 117 ranks ✓

Suggested: Make all the core rogue skills high priority!
- Hide: 9 (high)
- Move Silently: 9 (high)
- Open Lock: 9 (high)
- Disable Device: 9 (high)
- Sleight of Hand: 9 (high)
- Search: 9 (high)
- Spot: 9 (high)
- Listen: 9 (high)
- Tumble: 9 (high)
- Climb: 9 (high)
- Escape Artist: 9 (high)
- Use Magic Device: 9 (high)
- Bluff: 9 (high)
**Total**: 117 ranks ✓

### Fighter (2+Int = 2 per level)
**Total points at level 9**: 24

**Current template** (all medium priority, 2 each for 4 skills = 8 ranks at L1):
- Climb: 2 (medium)
- Intimidate: 2 (medium)
- Jump: 2 (medium)
- Ride: 2 (medium)

**With new system**:
Option: 2 high, 1 medium = 23 ranks
- Intimidate: 9 (high)
- Ride: 9 (high)
- Jump: 5 (medium)

Or: 1 high, 3 medium = 24 ranks ✓
- Intimidate: 9 (high)
- Climb: 5 (medium)
- Jump: 5 (medium)
- Ride: 5 (medium)

## Formula for Templates

For a character at level `L` with `P` skill points per level:

**Total skill points**: `4P + (L-1)P = P(L+3)`

**At level 9**: `P × 12`

**Ranks by priority**:
- High: `L` ranks (every level)
- Medium: `ceil(L/2)` ranks (every 2 levels)
- Low: `ceil(L/4)` ranks (every 4 levels)

**At level 9**:
- High: 9 ranks
- Medium: 5 ranks
- Low: 3 ranks

**To fill `P × 12` points, solve**:
`9H + 5M + 3L = P × 12`

Where H = # high skills, M = # medium skills, L = # low skills

## Recommended Approach

Instead of trying to hit exactly P×12, we should:

1. **Aim for slightly under** to avoid rounding issues
2. **Favor high-priority skills** for core class abilities
3. **Accept 1-2 unused points** rather than add unnecessary skills

### Templates to Update:

**Paladin** (24 points):
- Option A: 2H + 1M = 23 ✓ (1 unused)
- Option B: 1H + 3M = 24 ✓ (perfect)

**Fighter** (24 points):
- 1H + 3M = 24 ✓

**Ranger** (78 points):
- 7H + 3M = 78 ✓
- 8H + 1M = 77 ✓

**Rogue** (117 points):
- 13H = 117 ✓

**Wizard** (2 points/level = 24 total):
- 2H + 1M = 23 ✓
- 1H + 3M = 24 ✓

**Cleric** (2 points/level = 24 total):
- 2H + 1M = 23 ✓

**Sorcerer** (2 points/level = 24 total):
- 2H + 1M = 23 ✓

**Barbarian** (4-1=3 points/level = 36 total):
- 4H = 36 ✓
- 3H + 2M = 37 (1 over, but close)

**Bard** (6+Int(1)=7 points/level = 84 total):
- 9H + 1M = 86 (2 over)
- 9H = 81 (3 under) ✓

**Druid** (4 points/level = 48 total):
- 5H + 1M = 50 (2 over)
- 5H = 45 (3 under) ✓

**Monk** (4 points/level = 48 total):
- 5H + 1M = 50 (2 over)
- 5H = 45 (3 under) ✓
