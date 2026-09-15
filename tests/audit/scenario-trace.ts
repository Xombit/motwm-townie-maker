import type { SmokeScenario } from './smoke-scenarios';
import { buildCreationPipelinePlan } from '../../src/ui/pipeline-plan';

export type ScenarioCallName =
  | 'createActor'
  | 'setAbilityScores'
  | 'addRace'
  | 'addClass'
  | 'addNpcClass'
  | 'rollHP'
  | 'calculateAndSetNpcHP'
  | 'addSkills'
  | 'addNpcSkills'
  | 'addFeats'
  | 'addFavoredEnemies'
  | 'addRogueSpecialAbilities'
  | 'addSpells'
  | 'addEquipment'
  | 'completePendingContainerMoves'
  | 'setActorCR'
  | 'setBiography'
  | 'openSheet';

export interface ScenarioCallTraceStep {
  call: ScenarioCallName;
  branch?: 'pc' | 'npc';
  reason?: string;
  equipmentStrategy?: 'standard' | 'npc-wealth' | 'fallback';
}

export interface ScenarioTraceResult {
  plan: ReturnType<typeof buildCreationPipelinePlan>;
  steps: ScenarioCallTraceStep[];
  specialFeatureBranches: Array<'favored-enemies' | 'rogue-special-abilities'>;
}

export function buildScenarioCallTrace(scenario: SmokeScenario): ScenarioTraceResult {
  const usePcSheet = scenario.sheetType === 'pc';
  const plan = buildCreationPipelinePlan({
    className: scenario.className,
    classLevel: scenario.level,
    usePcSheet,
    autoRollHP: scenario.autoRollHp,
  });

  const steps: ScenarioCallTraceStep[] = [
    { call: 'createActor' },
    { call: 'setAbilityScores' },
    { call: 'addRace' },
  ];
  const specialFeatureBranches: Array<'favored-enemies' | 'rogue-special-abilities'> = [];

  if (usePcSheet) {
    if (plan.hasClassSelection) steps.push({ call: 'addClass', branch: 'pc' });
    if (plan.shouldRollHpOnPcPath) steps.push({ call: 'rollHP', branch: 'pc', reason: 'pc sheet HP roll' });
    if (scenario.className.toLowerCase() === 'ranger' && scenario.level >= 1) {
      steps.push({ call: 'addFavoredEnemies', branch: 'pc' });
      specialFeatureBranches.push('favored-enemies');
    }
    if (scenario.className.toLowerCase() === 'rogue' && scenario.level >= 10) {
      steps.push({ call: 'addRogueSpecialAbilities', branch: 'pc' });
      specialFeatureBranches.push('rogue-special-abilities');
    }
    if (plan.shouldConfigureSpells) {
      steps.push({ call: 'addSpells', branch: 'pc' });
    }
  } else {
    if (plan.hasClassSelection) steps.push({ call: 'addNpcClass', branch: 'npc' });
    if (plan.shouldCalculateNpcHp) steps.push({ call: 'calculateAndSetNpcHP', branch: 'npc', reason: 'npc sheet HP calc' });
    if (scenario.level >= 1) steps.push({ call: 'addNpcSkills', branch: 'npc' });
    if (plan.shouldConfigureSpells) {
      steps.push({ call: 'addSpells', branch: 'npc' });
    }
  }

  steps.push({ call: 'addFeats' });
  steps.push({
    call: 'addEquipment',
    equipmentStrategy: scenario.useStandardBudget
      ? 'standard'
      : scenario.useNpcWealth
        ? 'npc-wealth'
        : 'fallback',
  });
  steps.push({ call: 'completePendingContainerMoves' });
  steps.push({ call: 'setActorCR' });
  if (scenario.background || scenario.personality) {
    steps.push({ call: 'setBiography', reason: 'late biography/notes update' });
  }
  steps.push({ call: 'openSheet' });

  return { plan, steps, specialFeatureBranches };
}
