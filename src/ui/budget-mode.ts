export type BudgetMode = 'standardBudget' | 'npcWealth' | 'noBudget';

export interface BudgetFlags {
  useStandardBudget: boolean;
  useNpcWealth: boolean;
}

export function normalizeBudgetMode(value: string | null | undefined, fallback: BudgetMode = 'standardBudget'): BudgetMode {
  if (value === 'standardBudget' || value === 'npcWealth' || value === 'noBudget') {
    return value;
  }

  return fallback;
}

export function deriveBudgetModeFromFlags(
  useStandardBudget?: boolean,
  useNpcWealth?: boolean
): BudgetMode {
  if (useNpcWealth === true) {
    return 'npcWealth';
  }

  if (useStandardBudget === false) {
    return 'noBudget';
  }

  return 'standardBudget';
}

export function budgetModeToFlags(mode: BudgetMode): BudgetFlags {
  switch (mode) {
    case 'npcWealth':
      return { useStandardBudget: true, useNpcWealth: true };
    case 'noBudget':
      return { useStandardBudget: false, useNpcWealth: false };
    case 'standardBudget':
    default:
      return { useStandardBudget: true, useNpcWealth: false };
  }
}