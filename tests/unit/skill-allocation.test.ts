import { describe, expect, it } from 'vitest';
import { buildSkillAllocationPlan } from '../../src/d35e-adapter';

describe('buildSkillAllocationPlan', () => {
  it('uses fixed tier schedules for high/medium/low', () => {
    const plan = buildSkillAllocationPlan(9, 20, [
      { name: 'h', ranks: 1, priority: 'high' },
      { name: 'm', ranks: 1, priority: 'medium' },
      { name: 'l', ranks: 1, priority: 'low' },
    ]);

    const alloc = (lvl: number, name: string) => plan.distributionPlan.get(lvl)?.get(name) || 0;

    expect(alloc(1, 'h')).toBe(4);
    expect(alloc(1, 'm')).toBe(2);
    expect(alloc(1, 'l')).toBe(1);

    expect(alloc(2, 'h')).toBe(1);
    expect(alloc(2, 'm')).toBe(0);
    expect(alloc(2, 'l')).toBe(0);

    expect(alloc(3, 'h')).toBe(1);
    expect(alloc(3, 'm')).toBe(1);
    expect(alloc(3, 'l')).toBe(0);

    expect(alloc(5, 'm')).toBe(1);
    expect(alloc(5, 'l')).toBe(1);

    expect(alloc(9, 'm')).toBe(1);
    expect(alloc(9, 'l')).toBe(1);
  });

  it('persists round-robin cursor across levels within a tier', () => {
    const plan = buildSkillAllocationPlan(9, 2, [
      { name: 'h1', ranks: 1, priority: 'high' },
      { name: 'h2', ranks: 1, priority: 'high' },
      { name: 'h3', ranks: 1, priority: 'high' },
    ]);

    const level2 = plan.distributionPlan.get(2) || new Map<string, number>();
    const level3 = plan.distributionPlan.get(3) || new Map<string, number>();
    const level4 = plan.distributionPlan.get(4) || new Map<string, number>();
    const totals = ['h1', 'h2', 'h3'].map((name) => plan.totalRanksBySkill.get(name) || 0);

    // L1 spends on the first two high skills; L2 should resume at h3 first.
    expect(level2.get('h3')).toBe(1);
    expect(level2.get('h1')).toBe(1);
    expect(level3.get('h2')).toBe(1);
    expect(level3.get('h3')).toBe(1);
    expect(level4.get('h1')).toBe(1);
    expect(level4.get('h2')).toBe(1);

    // Even with L1 front-loading, contention should remain bounded over time.
    expect(Math.max(...totals) - Math.min(...totals)).toBeLessThanOrEqual(3);
  });

  it('spills extra INT-driven points down the ordered list and never exceeds legal per-skill caps', () => {
    const plan = buildSkillAllocationPlan(1, 6, [
      { name: 'h1', ranks: 1, priority: 'high' },
      { name: 'h2', ranks: 1, priority: 'high' },
      { name: 'h3', ranks: 1, priority: 'high' },
      { name: 'm1', ranks: 1, priority: 'medium' },
      { name: 'm2', ranks: 1, priority: 'medium' },
      { name: 'l1', ranks: 1, priority: 'low' },
      { name: 'l2', ranks: 1, priority: 'low' },
    ]);

    const level1 = plan.distributionPlan.get(1) || new Map<string, number>();
    const totalSpent = Array.from(level1.values()).reduce((sum, value) => sum + value, 0);

    // Level 1 can leave budget unspent if no skill can legally take more ranks.
    expect(totalSpent).toBeLessThanOrEqual(plan.skillPointsAtLevel1);
    expect(level1.get('h1')).toBe(4);
    expect(level1.get('h2')).toBe(4);
    expect(level1.get('h3')).toBe(4);
    expect(level1.get('m1')).toBe(2);
    expect(level1.get('m2')).toBe(2);
    expect(level1.get('l1')).toBe(1);
    expect(level1.get('l2')).toBe(1);
  });

  it('never allocates less than one point per level even with negative INT', () => {
    const plan = buildSkillAllocationPlan(3, -2, [
      { name: 'h', ranks: 1, priority: 'high' },
      { name: 'm', ranks: 1, priority: 'medium' },
      { name: 'l', ranks: 1, priority: 'low' },
    ]);

    expect(plan.skillPointsPerLevel).toBe(1);
    expect(plan.skillPointsAtLevel1).toBe(4);
    expect(plan.totalRanksBySkill.get('h')).toBeGreaterThan(0);
  });
});
