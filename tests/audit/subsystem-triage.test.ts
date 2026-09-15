import { describe, expect, it } from 'vitest';
import { classifyCheckToSubsystem, groupScenarioFailuresBySubsystem } from './subsystem-triage';

describe('subsystem triage', () => {
  it('maps checks to expected subsystems', () => {
    expect(classifyCheckToSubsystem('spells_configured')).toBe('spell-system');
    expect(classifyCheckToSubsystem('hp_is_positive')).toBe('health-and-hp');
    expect(classifyCheckToSubsystem('unknown-check')).toBe('unknown');
  });

  it('groups failing checks by subsystem and sorts by frequency', () => {
    const groups = groupScenarioFailuresBySubsystem([
      {
        id: 's1',
        version: 'v11',
        checks: [
          { name: 'actor_created', passed: true },
          { name: 'spells_configured', passed: false },
          { name: 'no_uncaught_errors', passed: false },
        ],
      },
      {
        id: 's2',
        version: 'v14',
        checks: [
          { name: 'spells_configured', passed: false },
          { name: 'hp_is_positive', passed: false },
        ],
      },
    ]);

    expect(groups[0].subsystem).toBe('spell-system');
    expect(groups[0].count).toBe(2);
    expect(groups[1].subsystem).toBe('error-handling');
    expect(groups[1].count).toBe(1);
    expect(groups[2].subsystem).toBe('health-and-hp');
    expect(groups[2].count).toBe(1);
  });
});
