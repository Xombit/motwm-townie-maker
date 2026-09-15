import { shouldConfigureSpells } from '../data/spell-gating';

export interface CreationPipelinePlanInput {
  className?: string;
  classLevel: number;
  usePcSheet: boolean;
  autoRollHP: boolean;
}

export interface CreationPipelinePlan {
  actorType: 'character' | 'npc';
  hasClassSelection: boolean;
  usePcSheet: boolean;
  shouldRollHpOnPcPath: boolean;
  shouldCalculateNpcHp: boolean;
  shouldConfigureSpells: boolean;
}

export function buildCreationPipelinePlan(input: CreationPipelinePlanInput): CreationPipelinePlan {
  const className = input.className?.trim() ?? '';
  const hasClassSelection = className.length > 0;

  return {
    actorType: input.usePcSheet ? 'character' : 'npc',
    hasClassSelection,
    usePcSheet: input.usePcSheet,
    shouldRollHpOnPcPath: input.usePcSheet && input.autoRollHP,
    shouldCalculateNpcHp: !input.usePcSheet && input.autoRollHP,
    shouldConfigureSpells: hasClassSelection && shouldConfigureSpells(className, input.classLevel).shouldConfigure,
  };
}
