import { describe, expect, it } from 'vitest';
import {
  BASIS_POINTS_TOTAL,
  SPENDING_CATEGORIES,
  SPENDING_SPLIT_GROUPS,
  allocateGpByBasisPoints,
  clampSplitGroupEdit,
  detectBudgetProfile,
  executeSpendingPlan,
  normalizeBasisPointShares,
  resolveSpendingPlan,
  resolveSpendingReport,
} from '../../src/data/spending-plan';

describe('spending plan', () => {
  it('detects class and build-specific profiles', () => {
    expect(detectBudgetProfile('Fighter', true)).toBe('martial');
    expect(detectBudgetProfile('Wizard', false)).toBe('pureCaster');
    expect(detectBudgetProfile('Cleric', true)).toBe('clericMelee');
    expect(detectBudgetProfile('Cleric', false)).toBe('clericCaster');
    expect(detectBudgetProfile('Druid', true)).toBe('druidWildshape');
    expect(detectBudgetProfile('Monk', false)).toBe('monk');
  });

  it('keeps early martial recommendations at exactly 100 percent', () => {
    for (const level of [3, 4, 5, 6, 7]) {
      const plan = resolveSpendingPlan({
        level,
        className: 'Fighter',
        hasShield: true,
        totalWealthGp: 10_000,
        mundaneCostGp: 0,
      });
      const total = SPENDING_CATEGORIES.reduce(
        (sum, category) => sum + plan.categories[category].shareBasisPoints,
        0,
      );

      expect(total).toBe(BASIS_POINTS_TOTAL);
      expect(plan.categories.weapon.shareBasisPoints).toBe(4500);
      expect(plan.categories.consumables.shareBasisPoints).toBe(0);
    }
  });

  it('allocates every integer GP using stable largest remainders', () => {
    const shares = normalizeBasisPointShares({ weapon: 1, armor: 1, abilityItem: 1 }, [
      'weapon',
      'armor',
      'abilityItem',
    ]);
    const allocations = allocateGpByBasisPoints(10, shares);

    expect(Object.values(allocations).reduce((sum, value) => sum + value, 0)).toBe(10);
    expect(allocations.weapon).toBe(4);
    expect(allocations.armor).toBe(3);
    expect(allocations.abilityItem).toBe(3);
  });

  it('accounts for wealth multiplier, mundane equipment, and reserve before allocation', () => {
    const plan = resolveSpendingPlan({
      level: 10,
      className: 'Fighter',
      hasShield: true,
      totalWealthGp: 49_000,
      mundaneCostGp: 1_000,
      config: {
        wealth: {
          mode: 'standardBudget',
          multiplierPercent: 80,
          reservePercent: 25,
        },
      },
    });

    expect(plan.totalWealthGp).toBe(39_200);
    expect(plan.grossMagicBudgetGp).toBe(38_200);
    expect(plan.reservedGp).toBe(9_550);
    expect(plan.spendableGp).toBe(28_650);
    expect(SPENDING_CATEGORIES.reduce(
      (sum, category) => sum + plan.categories[category].allocatedGp,
      0,
    )).toBe(plan.spendableGp);
  });

  it('normalizes malformed legacy complementary splits and reports the migration', () => {
    const plan = resolveSpendingPlan({
      level: 10,
      className: 'Fighter',
      hasShield: true,
      totalWealthGp: 49_000,
      mundaneCostGp: 1_000,
      legacyMagicItemBudgets: {
        shieldPercent: 0.7,
        armorPercent: 0.7,
        ringPercent: 0.2,
        amuletPercent: 0.3,
      },
    });

    expect(plan.splits.shieldBasisPoints).toBe(5000);
    expect(plan.splits.ringBasisPoints).toBe(4000);
    expect(plan.warnings).toHaveLength(2);
  });

  it('normalizes configured wand and scroll shares to a valid consumable split', () => {
    const plan = resolveSpendingPlan({
      level: 10,
      className: 'Wizard',
      hasShield: false,
      totalWealthGp: 49_000,
      mundaneCostGp: 0,
      config: {
        splits: { wandsBasisPoints: 8000, scrollsBasisPoints: 8000 },
      },
    });

    expect(plan.splits.wandsBasisPoints + plan.splits.scrollsBasisPoints).toBe(BASIS_POINTS_TOTAL);
    expect(plan.warnings).toContain('Consumables mix totaled 160%; it was normalized to 100%.');
  });

  it('resolves every nested split group to exactly 100 percent', () => {
    const plan = resolveSpendingPlan({
      level: 10,
      className: 'Wizard',
      hasShield: false,
      totalWealthGp: 49_000,
      mundaneCostGp: 0,
      config: {
        splits: {
          secondaryWeaponBasisPoints: 2000,
          shieldBasisPoints: 3500,
          ringBasisPoints: 7000,
          wandsBasisPoints: 4000,
          scrollsBasisPoints: 3000,
        },
      },
    });

    for (const keys of Object.values(SPENDING_SPLIT_GROUPS)) {
      expect(keys.reduce((sum, key) => sum + plan.splits[key], 0)).toBe(BASIS_POINTS_TOTAL);
    }
    expect(plan.splits.primaryWeaponBasisPoints).toBe(8000);
    expect(plan.splits.armorBasisPoints).toBe(6500);
    expect(plan.splits.otherProtectionBasisPoints).toBe(3000);
    expect(plan.splits.potionsBasisPoints).toBe(3000);
  });

  it('clamps only the edited split member to remaining group capacity', () => {
    const current = {
      primaryWeaponBasisPoints: 5000,
      secondaryWeaponBasisPoints: 5000,
      armorBasisPoints: 6000,
      shieldBasisPoints: 4000,
      ringBasisPoints: 6000,
      otherProtectionBasisPoints: 4000,
      wandsBasisPoints: 6000,
      scrollsBasisPoints: 2500,
      potionsBasisPoints: 1500,
    };
    const result = clampSplitGroupEdit(current, 'consumables', 'potionsBasisPoints', 3000);

    expect(result.acceptedBasisPoints).toBe(1500);
    expect(result.maximumBasisPoints).toBe(1500);
    expect(result.clamped).toBe(true);
    expect(result.values.wandsBasisPoints).toBe(6000);
    expect(result.values.scrollsBasisPoints).toBe(2500);
  });

  it('gives caster-focused profiles backup weapons and larger caster-implement budgets', () => {
    const cases = [
      ['Wizard', false, 500, 2900],
      ['Cleric', false, 500, 1800],
      ['Druid', false, 500, 1900],
    ] as const;

    for (const [className, hasShield, weapon, rodsStaves] of cases) {
      const plan = resolveSpendingPlan({ level: 15, className, hasShield, totalWealthGp: 100_000, mundaneCostGp: 0 });
      expect(plan.categories.weapon.enabled).toBe(true);
      expect(plan.categories.weapon.shareBasisPoints).toBe(weapon);
      expect(plan.categories.rodsStaves.shareBasisPoints).toBe(rodsStaves);
      expect(SPENDING_CATEGORIES.reduce((sum, key) => sum + plan.categories[key].shareBasisPoints, 0)).toBe(BASIS_POINTS_TOTAL);
    }
  });

  it('uses intentional profile-aware Spellcaster preset shares', () => {
    const wizard = resolveSpendingPlan({
      level: 15, className: 'Wizard', hasShield: false, totalWealthGp: 100_000, mundaneCostGp: 0,
      config: { preset: 'spellcaster' },
    });
    const cleric = resolveSpendingPlan({
      level: 15, className: 'Cleric', hasShield: false, totalWealthGp: 100_000, mundaneCostGp: 0,
      config: { preset: 'spellcaster' },
    });
    const bard = resolveSpendingPlan({
      level: 15, className: 'Bard', hasShield: false, totalWealthGp: 100_000, mundaneCostGp: 0,
      config: { preset: 'spellcaster' },
    });

    expect([wizard.categories.weapon.shareBasisPoints, wizard.categories.rodsStaves.shareBasisPoints]).toEqual([500, 2900]);
    expect([cleric.categories.weapon.shareBasisPoints, cleric.categories.armor.shareBasisPoints, cleric.categories.rodsStaves.shareBasisPoints]).toEqual([500, 2000, 2000]);
    expect([bard.categories.weapon.shareBasisPoints, bard.categories.armor.shareBasisPoints, bard.categories.consumables.shareBasisPoints]).toEqual([1500, 1500, 2500]);
  });

  it('uses one backup weapon and class-capable consumable defaults', () => {
    const wizard = resolveSpendingPlan({ level: 10, className: 'Wizard', hasShield: false, totalWealthGp: 49_000, mundaneCostGp: 0 });
    const ranger = resolveSpendingPlan({ level: 10, className: 'Ranger', hasShield: false, totalWealthGp: 49_000, mundaneCostGp: 0 });
    const fighter = resolveSpendingPlan({ level: 10, className: 'Fighter', hasShield: false, totalWealthGp: 49_000, mundaneCostGp: 0 });

    expect([wizard.splits.primaryWeaponBasisPoints, wizard.splits.secondaryWeaponBasisPoints]).toEqual([10_000, 0]);
    expect([wizard.splits.wandsBasisPoints, wizard.splits.scrollsBasisPoints, wizard.splits.potionsBasisPoints]).toEqual([6000, 2500, 1500]);
    expect([ranger.splits.wandsBasisPoints, ranger.splits.scrollsBasisPoints, ranger.splits.potionsBasisPoints]).toEqual([4000, 1500, 4500]);
    expect([fighter.splits.wandsBasisPoints, fighter.splits.scrollsBasisPoints, fighter.splits.potionsBasisPoints]).toEqual([0, 0, 10_000]);
  });

  it('disables inapplicable categories and keeps custom plans normalized', () => {
    const plan = resolveSpendingPlan({
      level: 12,
      className: 'Wizard',
      hasShield: false,
      totalWealthGp: 88_000,
      mundaneCostGp: 100,
      config: {
        preset: 'frontlineOffense',
        categories: {
          weapon: { shareBasisPoints: 9000 },
          rodsStaves: { shareBasisPoints: 1000 },
        },
      },
    });

    expect(plan.categories.weapon.enabled).toBe(true);
    expect(plan.categories.weapon.allocatedGp).toBeGreaterThan(0);
    expect(plan.categories.rodsStaves.enabled).toBe(true);
    expect(SPENDING_CATEGORIES.reduce(
      (sum, category) => sum + plan.categories[category].shareBasisPoints,
      0,
    )).toBe(BASIS_POINTS_TOTAL);
  });

  it('makes no automatic gear budget in no-budget mode', () => {
    const plan = resolveSpendingPlan({
      level: 20,
      className: 'Fighter',
      hasShield: true,
      totalWealthGp: 760_000,
      mundaneCostGp: 1_500,
      config: { wealth: { mode: 'noBudget', multiplierPercent: 100, reservePercent: 0 } },
    });

    expect(plan.totalWealthGp).toBe(0);
    expect(plan.spendableGp).toBe(0);
  });

  it('rolls underspend forward in priority order without exceeding category caps', () => {
    const plan = resolveSpendingPlan({
      level: 10,
      className: 'Fighter',
      hasShield: true,
      totalWealthGp: 10_000,
      mundaneCostGp: 0,
      config: {
        categories: {
          weapon: { priority: 0, maxShareBasisPoints: 4000 },
          armor: { priority: 1, maxShareBasisPoints: 4000 },
          abilityItem: { priority: 2, maxShareBasisPoints: 3000 },
        },
      },
    });
    const report = resolveSpendingReport(plan, {
      weapon: 1000,
      armor: 4000,
      abilityItem: 3000,
      resistance: 0,
      protection: 0,
      consumables: 0,
    });

    expect(report.stages[0]).toMatchObject({ category: 'weapon', spentGp: 1000, rolloverSentGp: 3000 });
    expect(report.stages[1]).toMatchObject({ category: 'armor', rolloverReceivedGp: 700, availableGp: 4000 });
    expect(report.totalSpentGp + report.finalCashGp).toBe(report.spendableGp);
  });

  it('clamps category requests to available funds and reports the limit', () => {
    const plan = resolveSpendingPlan({
      level: 5,
      className: 'Fighter',
      hasShield: true,
      totalWealthGp: 1000,
      mundaneCostGp: 0,
    });
    const report = resolveSpendingReport(plan, { weapon: 10_000 });

    expect(report.totalSpentGp).toBeLessThanOrEqual(plan.spendableGp);
    expect(report.warnings).toHaveLength(1);
    expect(report.totalSpentGp + report.finalCashGp).toBe(report.spendableGp);
  });

  it('executes selectors in custom priority and gives them capped rollover before selection', async () => {
    const plan = resolveSpendingPlan({
      level: 10,
      className: 'Fighter',
      hasShield: true,
      totalWealthGp: 10_000,
      mundaneCostGp: 0,
      config: {
        categories: {
          weapon: { priority: 1, maxShareBasisPoints: 5000 },
          armor: { priority: 0, maxShareBasisPoints: 3500 },
          abilityItem: { priority: 2, maxShareBasisPoints: 3000 },
        },
      },
    });
    const availableBudgets: Array<[string, number]> = [];
    const execution = await executeSpendingPlan(plan, {
      armor: availableGp => {
        availableBudgets.push(['armor', availableGp]);
        return { value: 'armor', spentGp: 1000 };
      },
      weapon: availableGp => {
        availableBudgets.push(['weapon', availableGp]);
        return { value: 'weapon', spentGp: availableGp };
      },
      abilityItem: availableGp => ({ value: 'ability', spentGp: availableGp }),
      resistance: availableGp => ({ value: null, spentGp: availableGp }),
      protection: availableGp => ({ value: null, spentGp: availableGp }),
      consumables: availableGp => ({ value: null, spentGp: availableGp }),
    });

    expect(availableBudgets[0]).toEqual(['armor', 3300]);
    expect(availableBudgets[1]).toEqual(['weapon', 5000]);
    expect(execution.report.totalSpentGp + execution.report.finalCashGp).toBe(10_000);
  });

  it('rejects a category selector that spends above its available budget', async () => {
    const plan = resolveSpendingPlan({
      level: 5,
      className: 'Fighter',
      hasShield: true,
      totalWealthGp: 1000,
      mundaneCostGp: 0,
    });

    await expect(executeSpendingPlan(plan, {
      weapon: availableGp => ({ value: null, spentGp: availableGp + 1 }),
    })).rejects.toThrow('weapon selector spent');
  });
});