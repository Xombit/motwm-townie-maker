import { describe, expect, it } from 'vitest';
import { SMOKE_SCENARIOS } from './smoke-scenarios';

describe('smoke scenario catalog', () => {
  it('contains scenarios for both Foundry versions', () => {
    const versions = new Set(SMOKE_SCENARIOS.map((scenario) => scenario.foundryVersion));
    expect(versions).toEqual(new Set(['v11', 'v14']));
  });

  it('covers core archetypes (martial, full caster, partial caster)', () => {
    const classNames = new Set(SMOKE_SCENARIOS.map((scenario) => scenario.className.toLowerCase()));
    const martialCovered = classNames.has('fighter') || classNames.has('barbarian') || classNames.has('rogue');
    const fullCasterCovered = classNames.has('wizard') || classNames.has('sorcerer') || classNames.has('cleric') || classNames.has('druid');
    const partialCasterCovered = classNames.has('ranger') || classNames.has('paladin') || classNames.has('bard');

    expect(martialCovered).toBe(true);
    expect(fullCasterCovered).toBe(true);
    expect(partialCasterCovered).toBe(true);
  });

  it('ensures each scenario has unique id and bounded level', () => {
    const ids = SMOKE_SCENARIOS.map((scenario) => scenario.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const scenario of SMOKE_SCENARIOS) {
      expect(scenario.level).toBeGreaterThanOrEqual(1);
      expect(scenario.level).toBeLessThanOrEqual(20);
    }
  });
});
