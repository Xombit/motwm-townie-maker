import { describe, expect, it } from 'vitest';
import {
  ABILITY_KEYS,
  POINT_BUY_BUDGETS,
  POINT_BUY_COSTS,
  assignRollPool,
  generateAbilityScores,
  normalizeAbilityPins,
  normalizeAbilityPriority,
  scoreForPointShare,
  splitPointBuyBudget,
} from '../../src/data/ability-generation';

describe('ability generation', () => {
  it('completes a partial MAD priority without duplicates', () => {
    expect(normalizeAbilityPriority(['dex', 'wis', 'con', 'dex'])).toEqual([
      'dex', 'wis', 'con', 'str', 'int', 'cha',
    ]);
  });

  it('falls back to primary ability and then canonical order', () => {
    expect(normalizeAbilityPriority(undefined, 'int')).toEqual(['int', 'str', 'dex', 'con', 'wis', 'cha']);
  });

  it('preserves arbitrary integer pins and warns for unusual values', () => {
    const result = normalizeAbilityPins({ str: 30, int: 18, wis: 10.5 });

    expect(result.pins).toEqual({ str: 30, int: 18 });
    expect(result.warnings).toHaveLength(2);
  });

  it('implements the D&D 3.5 point cost thresholds', () => {
    expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 13, 16, 99].map(scoreForPointShare)).toEqual([
      8, 9, 10, 11, 12, 13, 14, 14, 15, 16, 17, 18, 18,
    ]);
  });

  it('allocates 15 points into focused ranks with real dump stats', () => {
    const priority = normalizeAbilityPriority(['dex', 'wis', 'con']);
    const shares = splitPointBuyBudget(15, priority);

    expect(priority.map(ability => shares[ability])).toEqual([6, 4, 3, 2, 0, 0]);
  });

  it.each(POINT_BUY_BUDGETS)('conserves the %i-point private shares', budget => {
    const shares = splitPointBuyBudget(budget, ABILITY_KEYS);
    expect(Object.values(shares).reduce((sum, value) => sum + value, 0)).toBe(budget);
  });

  it('reserves a pinned point-buy share without redistributing it', () => {
    const result = generateAbilityScores({
      method: 'pointBuy',
      pointBuyBudget: 15,
      priority: ['int', 'dex', 'con'],
      pins: { int: 18 },
    });

    expect(result.scores).toMatchObject({ int: 18, dex: 12, con: 11, str: 10, wis: 8, cha: 8 });
    expect(result.metadata.pointShares?.int).toBe(6);
  });

  it.each([
    [15, [14, 12, 11, 10, 8, 8]],
    [22, [15, 13, 12, 11, 10, 8]],
    [25, [15, 14, 13, 12, 10, 8]],
    [28, [16, 14, 13, 12, 11, 8]],
    [32, [16, 15, 14, 12, 12, 8]],
  ] as const)('produces a priority-shaped %i-point array', (budget, expected) => {
    const priority = normalizeAbilityPriority(['dex', 'wis', 'con']);
    const result = generateAbilityScores({ method: 'pointBuy', pointBuyBudget: budget, priority });

    expect(priority.map(ability => result.scores[ability])).toEqual(expected);
    expect(priority.map(ability => result.metadata.pointShares?.[ability]))
      .toEqual(expected.map(score => POINT_BUY_COSTS[score]));
  });

  it('moves the best and dump scores when priority changes', () => {
    const first = generateAbilityScores({ method: 'pointBuy', pointBuyBudget: 25, priority: ['str', 'con'] });
    const second = generateAbilityScores({ method: 'pointBuy', pointBuyBudget: 25, priority: ['int', 'dex'] });

    expect(first.scores.str).toBe(15);
    expect(first.scores.cha).toBe(8);
    expect(second.scores.int).toBe(15);
    expect(second.scores.cha).toBe(8);
  });

  it('reserves the pinned Standard Array rank', () => {
    const result = generateAbilityScores({
      method: 'standardArray',
      priority: ['dex', 'wis', 'con'],
      pins: { dex: 18 },
    });

    expect(result.scores).toEqual({ str: 12, dex: 18, con: 13, int: 10, wis: 14, cha: 8 });
  });

  it('rolls 3d6 only for unpinned abilities and assigns high to low priority', () => {
    const rolls = [0, 0, 0, 0.999, 0.999, 0.999, 0.5, 0.5, 0.5, 0.2, 0.2, 0.2, 0.7, 0.7, 0.7];
    let index = 0;
    const result = generateAbilityScores({
      method: 'roll3d6',
      priority: ['dex', 'wis', 'con'],
      pins: { dex: 18 },
      rng: () => rolls[index++],
    });

    expect(result.metadata.rollPool).toHaveLength(5);
    expect(result.scores.dex).toBe(18);
    expect(result.scores.wis).toBeGreaterThanOrEqual(result.scores.con);
    expect(result.scores.con).toBeGreaterThanOrEqual(result.scores.str);
  });

  it('drops the lowest die for 4d6 generation', () => {
    const sequence = [0, 0.2, 0.5, 0.999];
    let index = 0;
    const result = generateAbilityScores({
      method: 'roll4d6DropLowest',
      pins: { dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      rng: () => sequence[index++],
    });

    expect(result.scores.str).toBe(12);
  });

  it('reassigns an existing roll pool without rerolling', () => {
    const first = assignRollPool([18, 15, 13], ['str', 'dex', 'con'], { int: 12, wis: 11, cha: 10 });
    const reordered = assignRollPool([18, 15, 13], ['dex', 'con', 'str'], { int: 12, wis: 11, cha: 10 });

    expect(first).toMatchObject({ str: 18, dex: 15, con: 13 });
    expect(reordered).toMatchObject({ dex: 18, con: 15, str: 13 });
  });

  it('supports a fully pinned template for every method', () => {
    const pins = { str: 30, dex: 18, con: 17, int: 16, wis: 15, cha: 14 };
    const result = generateAbilityScores({ method: 'roll4d6DropLowest', pins });

    expect(result.scores).toEqual(pins);
    expect(result.metadata.rollPool).toEqual([]);
  });
});