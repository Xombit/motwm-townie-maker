import { describe, expect, it } from 'vitest';
import { CONSUMABLE_SPLITS, MAGIC_ITEM_BUDGET_ALLOCATION, getClassType, selectMagicItems } from '../../src/data/magic-item-system';
import type { SpendingPlanConfig } from '../../src/data/spending-plan';

describe('magic item system', () => {
  it('classifies class types correctly for consumable allocation', () => {
    expect(getClassType('wizard')).toBe('fullCaster');
    expect(getClassType('Cleric')).toBe('fullCaster');
    expect(getClassType('Adept (NPC)')).toBe('fullCaster');
    expect(getClassType('bard')).toBe('partialCaster');
    expect(getClassType('RANGER')).toBe('partialCaster');
    expect(getClassType('fighter')).toBe('martial');
    expect(getClassType('Warrior (NPC)')).toBe('martial');
  });

  it('budget allocations stay normalized to 100%', () => {
    for (const allocation of Object.values(MAGIC_ITEM_BUDGET_ALLOCATION)) {
      const total = Object.values(allocation).reduce((sum, value) => sum + value, 0);
      expect(total).toBeCloseTo(1, 6);
    }
  });

  it('consumable split variants stay normalized to 100%', () => {
    for (const split of Object.values(CONSUMABLE_SPLITS)) {
      const total = Object.values(split).reduce((sum, value) => sum + value, 0);
      expect(total).toBeCloseTo(1, 6);
    }
  });

  it('rolls weapon underspend into armor before armor selection', async () => {
    const plan: SpendingPlanConfig = {
      version: 1,
      preset: 'classRecommended',
      wealth: { mode: 'standardBudget', multiplierPercent: 100, reservePercent: 0 },
      categories: {
        weapon: { enabled: true, shareBasisPoints: 1000, maxShareBasisPoints: 1000, priority: 0 },
        armor: { enabled: true, shareBasisPoints: 9000, maxShareBasisPoints: 10000, priority: 1 },
        abilityItem: { enabled: false },
        resistance: { enabled: false },
        protection: { enabled: false },
        consumables: { enabled: false },
      },
    };
    const result = await selectMagicItems(10, 'Fighter', 49_000, undefined, 14, true, plan);
    const report = result.spendingReport!;

    expect(report.stages.map(stage => stage.category)).toEqual(['weapon', 'armor']);
    expect(report.stages[1].rolloverReceivedGp).toBeGreaterThan(0);
    expect(result.totalCost).toBe(report.totalSpentGp);
    expect(report.totalSpentGp + report.finalCashGp).toBe(49_000);
  });

  it('executes a custom category priority', async () => {
    const plan: SpendingPlanConfig = {
      version: 1,
      preset: 'classRecommended',
      wealth: { mode: 'standardBudget', multiplierPercent: 100, reservePercent: 0 },
      categories: {
        weapon: { enabled: true, shareBasisPoints: 5000, maxShareBasisPoints: 10000, priority: 1 },
        armor: { enabled: true, shareBasisPoints: 5000, maxShareBasisPoints: 5000, priority: 0 },
        abilityItem: { enabled: false },
        resistance: { enabled: false },
        protection: { enabled: false },
        consumables: { enabled: false },
      },
    };
    const result = await selectMagicItems(10, 'Fighter', 49_000, undefined, 14, true, plan);

    expect(result.spendingReport?.stages.map(stage => stage.category)).toEqual(['armor', 'weapon']);
  });

  it('enforces a consumable item limit and conserves the full budget', async () => {
    const plan: SpendingPlanConfig = {
      version: 1,
      preset: 'support',
      wealth: { mode: 'standardBudget', multiplierPercent: 100, reservePercent: 0 },
      categories: {
        weapon: { enabled: false },
        armor: { enabled: false },
        abilityItem: { enabled: false },
        resistance: { enabled: false },
        protection: { enabled: false },
        consumables: { enabled: true, shareBasisPoints: 10000, maxShareBasisPoints: 10000, priority: 0, itemLimit: 2 },
        rodsStaves: { enabled: false },
      },
      splits: { wandsBasisPoints: 5000, scrollsBasisPoints: 2500 },
    };
    const result = await selectMagicItems(10, 'Wizard', 49_000, undefined, 10, false, plan);
    const consumableUnits = result.wands.length + result.scrolls.length
      + result.potions.reduce((sum, potion) => sum + potion.quantity, 0);

    expect(consumableUnits).toBeLessThanOrEqual(2);
    expect(result.spendingReport!.totalSpentGp + result.spendingReport!.finalCashGp).toBe(49_000);
  });

  it('respects shared shoulder slots when resistance precedes a charisma item', async () => {
    const plan: SpendingPlanConfig = {
      version: 1,
      preset: 'classRecommended',
      wealth: { mode: 'standardBudget', multiplierPercent: 100, reservePercent: 0 },
      categories: {
        abilityItem: { enabled: true, shareBasisPoints: 5000, maxShareBasisPoints: 10000, priority: 1 },
        resistance: { enabled: true, shareBasisPoints: 5000, maxShareBasisPoints: 5000, priority: 0 },
        protection: { enabled: false },
        consumables: { enabled: false },
        rodsStaves: { enabled: false },
      },
    };
    const result = await selectMagicItems(12, 'Sorcerer', 88_000, undefined, 10, false, plan);
    const shoulderItems = result.wondrousItems.filter(item => item.slot === 'shoulders');
    const abilityStage = result.spendingReport!.stages.find(stage => stage.category === 'abilityItem');

    expect(shoulderItems).toHaveLength(1);
    expect(shoulderItems[0].name).toContain('Cloak of Resistance');
    expect(abilityStage?.spentGp).toBe(0);
  });

  it('does not select a shield enhancement when the template has no shield', async () => {
    const plan: SpendingPlanConfig = {
      version: 1,
      preset: 'defensive',
      wealth: { mode: 'standardBudget', multiplierPercent: 100, reservePercent: 0 },
      categories: {
        weapon: { enabled: false },
        armor: { enabled: true, shareBasisPoints: 10000, maxShareBasisPoints: 10000, priority: 0 },
        abilityItem: { enabled: false },
        resistance: { enabled: false },
        protection: { enabled: false },
        consumables: { enabled: false },
      },
      splits: { shieldBasisPoints: 9000 },
    };
    const result = await selectMagicItems(10, 'Fighter', 49_000, undefined, 14, false, plan);

    expect(result.shieldEnhancement).toBeNull();
    expect(result.spendingReport!.totalSpentGp + result.spendingReport!.finalCashGp).toBe(49_000);
  });

  it('uses the configured ring share for pure-caster protection', async () => {
    const plan: SpendingPlanConfig = {
      version: 1,
      preset: 'spellcaster',
      wealth: { mode: 'standardBudget', multiplierPercent: 100, reservePercent: 0 },
      categories: {
        abilityItem: { enabled: false },
        resistance: { enabled: false },
        protection: { enabled: true, shareBasisPoints: 10000, maxShareBasisPoints: 10000, priority: 0, itemLimit: 1 },
        consumables: { enabled: false },
        rodsStaves: { enabled: false },
      },
      splits: { ringBasisPoints: 10000 },
    };
    const result = await selectMagicItems(12, 'Wizard', 88_000, undefined, 10, false, plan);

    expect(result.wondrousItems).toHaveLength(1);
    expect(result.wondrousItems[0].name).toContain('Ring of Protection');
  });

  it('gives a pure caster both a simple backup weapon and caster implements', async () => {
    const plan: SpendingPlanConfig = {
      version: 1,
      preset: 'classRecommended',
      wealth: { mode: 'standardBudget', multiplierPercent: 100, reservePercent: 0 },
    };
    const result = await selectMagicItems(15, 'Wizard', 200_000, undefined, 10, false, plan, true);

    expect(result.weaponEnhancement).not.toBeNull();
    expect(result.weaponEnhancement?.abilities).toEqual([]);
    expect(result.rods.length + (result.staff ? 1 : 0)).toBeGreaterThan(0);
    expect(result.spendingReport!.totalSpentGp + result.spendingReport!.finalCashGp).toBe(200_000);
  });

  it('rolls a caster backup allocation forward when no mundane weapon exists', async () => {
    const plan: SpendingPlanConfig = {
      version: 1,
      preset: 'classRecommended',
      wealth: { mode: 'standardBudget', multiplierPercent: 100, reservePercent: 0 },
    };
    const result = await selectMagicItems(15, 'Wizard', 200_000, undefined, 10, false, plan, false);
    const weaponStage = result.spendingReport!.stages.find(stage => stage.category === 'weapon');
    const followingStage = result.spendingReport!.stages[1];

    expect(result.weaponEnhancement).toBeNull();
    expect(weaponStage).toMatchObject({ spentGp: 0 });
    expect(weaponStage!.rolloverSentGp).toBeGreaterThan(0);
    expect(followingStage.rolloverReceivedGp).toBeGreaterThan(0);
    expect(result.spendingReport!.totalSpentGp + result.spendingReport!.finalCashGp).toBe(200_000);
  });
});
