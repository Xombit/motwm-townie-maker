import { describe, expect, it } from 'vitest';
import { summarizeScenarioResults } from './scenario-reporting';

describe('audit scenario reporting', () => {
  it('summarizes mixed pass/fail scenario outcomes', () => {
    const summary = summarizeScenarioResults([
      {
        id: 'v11_martial_smoke',
        version: 'v11',
        checks: [
          { name: 'actor_created', passed: true },
          { name: 'class_item_present', passed: true },
        ],
      },
      {
        id: 'v14_caster_smoke',
        version: 'v14',
        checks: [
          { name: 'actor_created', passed: true },
          { name: 'spells_configured', passed: false, details: 'expected > 0 spells' },
          { name: 'no_uncaught_errors', passed: false },
        ],
      },
    ]);

    expect(summary.totalScenarios).toBe(2);
    expect(summary.passedScenarios).toBe(1);
    expect(summary.failedScenarios).toBe(1);
    expect(summary.totalChecks).toBe(5);
    expect(summary.passedChecks).toBe(3);
    expect(summary.failedChecks).toBe(2);
    expect(summary.failureRate).toBe(0.4);
    expect(summary.failuresByVersion.v11).toBe(0);
    expect(summary.failuresByVersion.v14).toBe(1);
    expect(summary.failingScenarios).toHaveLength(1);
    expect(summary.failingScenarios[0].failedChecks).toEqual(['spells_configured', 'no_uncaught_errors']);
  });
});
