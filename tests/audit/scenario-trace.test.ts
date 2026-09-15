import { describe, expect, it } from 'vitest';
import { buildScenarioCallTrace } from './scenario-trace';
import { SMOKE_SCENARIOS } from './smoke-scenarios';

describe('scenario call trace', () => {
  it('records pc vs npc branch calls', () => {
    const pcScenario = SMOKE_SCENARIOS.find((scenario) => scenario.id === 'v11_fighter_l1_pc_standard');
    const npcScenario = SMOKE_SCENARIOS.find((scenario) => scenario.id === 'v11_cleric_l12_npc_npcwealth');

    if (!pcScenario || !npcScenario) throw new Error('missing scenarios');

    const pcTrace = buildScenarioCallTrace(pcScenario);
    const npcTrace = buildScenarioCallTrace(npcScenario);

    expect(pcTrace.steps.some((step) => step.call === 'addClass')).toBe(true);
    expect(pcTrace.steps.some((step) => step.call === 'rollHP')).toBe(true);
    expect(pcTrace.steps.some((step) => step.call === 'addNpcClass')).toBe(false);

    expect(npcTrace.steps.some((step) => step.call === 'addNpcClass')).toBe(true);
    expect(npcTrace.steps.some((step) => step.call === 'calculateAndSetNpcHP')).toBe(false);
  });

  it('includes spell calls only when the plan allows them', () => {
    const wizard = SMOKE_SCENARIOS.find((scenario) => scenario.id === 'v14_sorcerer_l10_pc_standard');
    const fighter = SMOKE_SCENARIOS.find((scenario) => scenario.id === 'v14_fighter_l1_pc_standard');

    if (!wizard || !fighter) throw new Error('missing scenarios');

    const wizardTrace = buildScenarioCallTrace(wizard);
    const fighterTrace = buildScenarioCallTrace(fighter);

    expect(wizardTrace.steps.some((step) => step.call === 'addSpells')).toBe(true);
    expect(fighterTrace.steps.some((step) => step.call === 'addSpells')).toBe(false);
  });

  it('tags equipment branches with the expected budget strategy', () => {
    const standard = SMOKE_SCENARIOS.find((scenario) => scenario.id === 'v11_fighter_l1_pc_standard');
    const fallback = SMOKE_SCENARIOS.find((scenario) => scenario.id === 'v14_fighter_l8_npc_no_budget');

    if (!standard || !fallback) throw new Error('missing scenarios');

    const standardTrace = buildScenarioCallTrace(standard);
    const fallbackTrace = buildScenarioCallTrace(fallback);

    expect(standardTrace.steps.find((step) => step.call === 'addEquipment')?.equipmentStrategy).toBe('standard');
    expect(fallbackTrace.steps.find((step) => step.call === 'addEquipment')?.equipmentStrategy).toBe('npc-wealth');
  });

  it('adds biography routing when the fixture carries background or personality text', () => {
    const scenario = SMOKE_SCENARIOS.find((entry) => entry.id === 'v11_wizard_l10_pc_standard');
    if (!scenario) throw new Error('missing scenario');

    const trace = buildScenarioCallTrace(scenario);

    expect(trace.steps.some((step) => step.call === 'setBiography')).toBe(true);
  });

  it('records special feature branches for ranger and rogue smoke scenarios', () => {
    const ranger = SMOKE_SCENARIOS.find((entry) => entry.id === 'v11_ranger_l11_pc_standard');
    const rogue = SMOKE_SCENARIOS.find((entry) => entry.id === 'v14_rogue_l16_pc_standard');

    if (!ranger || !rogue) throw new Error('missing scenarios');

    const rangerTrace = buildScenarioCallTrace(ranger);
    const rogueTrace = buildScenarioCallTrace(rogue);

    expect(rangerTrace.specialFeatureBranches).toContain('favored-enemies');
    expect(rogueTrace.specialFeatureBranches).toContain('rogue-special-abilities');
  });
});
