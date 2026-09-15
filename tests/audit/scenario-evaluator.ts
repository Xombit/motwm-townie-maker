import type { SmokeScenario } from './smoke-scenarios';

export interface ScenarioObservedState {
  actorCreated: boolean;
  classItemPresent: boolean;
  raceItemPresent: boolean;
  uncaughtErrors: string[];
  hpValue?: number;
  spellCount?: number;
  budgetSpentRatio?: number;
  biographyPresent?: boolean;
  notesPresent?: boolean;
}

export interface ScenarioOracleResult {
  id: string;
  version: 'v11' | 'v14';
  checks: Array<{ name: string; passed: boolean; details?: string }>;
}

export function evaluateSmokeScenario(
  scenario: SmokeScenario,
  observed: ScenarioObservedState
): ScenarioOracleResult {
  const checks: ScenarioOracleResult['checks'] = [];

  checks.push({ name: 'actor_created', passed: observed.actorCreated });
  checks.push({ name: 'class_item_present', passed: observed.classItemPresent });
  checks.push({ name: 'race_item_present', passed: observed.raceItemPresent });
  checks.push({ name: 'no_uncaught_errors', passed: observed.uncaughtErrors.length === 0, details: observed.uncaughtErrors.join('\n') });

  if (scenario.autoRollHp) {
    checks.push({
      name: 'hp_is_positive',
      passed: typeof observed.hpValue === 'number' && observed.hpValue > 0,
      details: `hpValue=${observed.hpValue}`,
    });
  }

  const classLower = scenario.className.toLowerCase();
  const shouldHaveSpells = ['wizard', 'sorcerer', 'cleric', 'druid', 'bard', 'adept (npc)'].includes(classLower)
    || ((classLower === 'paladin' || classLower === 'ranger') && scenario.level >= 4);

  if (shouldHaveSpells) {
    checks.push({
      name: 'spells_configured',
      passed: typeof observed.spellCount === 'number' && observed.spellCount > 0,
      details: `spellCount=${observed.spellCount}`,
    });
  }

  if (scenario.useStandardBudget) {
    checks.push({
      name: 'budget_spend_within_bounds',
      passed: typeof observed.budgetSpentRatio === 'number' && observed.budgetSpentRatio >= 0 && observed.budgetSpentRatio <= 1.2,
      details: `budgetSpentRatio=${observed.budgetSpentRatio}`,
    });
  }

  checks.push({
    name: 'biography_notes_tabs_routed',
    passed: (observed.biographyPresent ?? false) === (observed.notesPresent ?? false) || !(observed.biographyPresent || observed.notesPresent),
    details: `biography=${observed.biographyPresent} notes=${observed.notesPresent}`,
  });

  return {
    id: scenario.id,
    version: scenario.foundryVersion,
    checks,
  };
}
