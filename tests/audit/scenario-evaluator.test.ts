import { describe, expect, it } from 'vitest';
import { evaluateSmokeScenario } from './scenario-evaluator';
import { SMOKE_SCENARIOS } from './smoke-scenarios';

describe('scenario evaluator', () => {
  it('marks a healthy caster scenario as passing key checks', () => {
    const scenario = SMOKE_SCENARIOS.find((s) => s.id === 'v14_sorcerer_l10_pc_standard');
    if (!scenario) throw new Error('missing fixture scenario');

    const result = evaluateSmokeScenario(scenario, {
      actorCreated: true,
      classItemPresent: true,
      raceItemPresent: true,
      uncaughtErrors: [],
      hpValue: 42,
      spellCount: 12,
      budgetSpentRatio: 0.96,
      biographyPresent: true,
      notesPresent: true,
    });

    expect(result.checks.every((check) => check.passed)).toBe(true);
  });

  it('detects spell and error failures for caster scenarios', () => {
    const scenario = SMOKE_SCENARIOS.find((s) => s.id === 'v11_wizard_l10_pc_standard');
    if (!scenario) throw new Error('missing fixture scenario');

    const result = evaluateSmokeScenario(scenario, {
      actorCreated: true,
      classItemPresent: true,
      raceItemPresent: true,
      uncaughtErrors: ['TypeError: failed lookup'],
      hpValue: 0,
      spellCount: 0,
      budgetSpentRatio: 1.35,
      biographyPresent: true,
      notesPresent: false,
    });

    const failed = result.checks.filter((check) => !check.passed).map((check) => check.name);
    expect(failed).toContain('no_uncaught_errors');
    expect(failed).toContain('hp_is_positive');
    expect(failed).toContain('spells_configured');
    expect(failed).toContain('budget_spend_within_bounds');
    expect(failed).toContain('biography_notes_tabs_routed');
  });
});
