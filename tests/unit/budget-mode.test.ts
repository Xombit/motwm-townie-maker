import { describe, expect, it } from 'vitest';
import {
  budgetModeToFlags,
  deriveBudgetModeFromFlags,
  normalizeBudgetMode,
} from '../../src/ui/budget-mode';

describe('budget mode helpers', () => {
  it('normalizes invalid values to the fallback mode', () => {
    expect(normalizeBudgetMode(undefined)).toBe('standardBudget');
    expect(normalizeBudgetMode('not-a-mode')).toBe('standardBudget');
    expect(normalizeBudgetMode('not-a-mode', 'npcWealth')).toBe('npcWealth');
  });

  it('derives a single canonical mode from legacy flags', () => {
    expect(deriveBudgetModeFromFlags(true, false)).toBe('standardBudget');
    expect(deriveBudgetModeFromFlags(true, true)).toBe('npcWealth');
    expect(deriveBudgetModeFromFlags(false, false)).toBe('noBudget');
  });

  it('maps each mode back to exclusive flags', () => {
    expect(budgetModeToFlags('standardBudget')).toEqual({ useStandardBudget: true, useNpcWealth: false });
    expect(budgetModeToFlags('npcWealth')).toEqual({ useStandardBudget: true, useNpcWealth: true });
    expect(budgetModeToFlags('noBudget')).toEqual({ useStandardBudget: false, useNpcWealth: false });
  });
});
