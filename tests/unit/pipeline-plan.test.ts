import { describe, expect, it } from 'vitest';
import { buildCreationPipelinePlan } from '../../src/ui/pipeline-plan';

describe('buildCreationPipelinePlan', () => {
  it('selects PC path and actor type correctly', () => {
    const plan = buildCreationPipelinePlan({
      className: 'Fighter',
      classLevel: 5,
      usePcSheet: true,
      autoRollHP: true,
    });

    expect(plan.actorType).toBe('character');
    expect(plan.usePcSheet).toBe(true);
    expect(plan.shouldRollHpOnPcPath).toBe(true);
    expect(plan.shouldCalculateNpcHp).toBe(false);
    expect(plan.shouldConfigureSpells).toBe(false);
  });

  it('selects NPC path and hp calculation correctly', () => {
    const plan = buildCreationPipelinePlan({
      className: 'Wizard',
      classLevel: 10,
      usePcSheet: false,
      autoRollHP: true,
    });

    expect(plan.actorType).toBe('npc');
    expect(plan.usePcSheet).toBe(false);
    expect(plan.shouldRollHpOnPcPath).toBe(false);
    expect(plan.shouldCalculateNpcHp).toBe(true);
    expect(plan.shouldConfigureSpells).toBe(true);
  });

  it('gates low-level partial casters from spell configuration', () => {
    const plan = buildCreationPipelinePlan({
      className: 'Paladin',
      classLevel: 3,
      usePcSheet: true,
      autoRollHP: true,
    });

    expect(plan.shouldConfigureSpells).toBe(false);
  });

  it('handles missing class selection safely', () => {
    const plan = buildCreationPipelinePlan({
      className: '   ',
      classLevel: 1,
      usePcSheet: true,
      autoRollHP: false,
    });

    expect(plan.hasClassSelection).toBe(false);
    expect(plan.shouldConfigureSpells).toBe(false);
  });

  it('enables spell configuration for adept NPC labels', () => {
    const plan = buildCreationPipelinePlan({
      className: 'Adept (NPC)',
      classLevel: 8,
      usePcSheet: false,
      autoRollHP: false,
    });

    expect(plan.actorType).toBe('npc');
    expect(plan.shouldConfigureSpells).toBe(true);
  });
});
