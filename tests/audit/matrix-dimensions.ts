import type { DimensionMap } from './pairwise';

export const CORE_AUDIT_DIMENSIONS: DimensionMap = {
  foundryVersion: ['v11', 'v14'],
  sheetType: ['pc', 'npc'],
  classType: ['martial', 'fullCaster', 'partialCaster'],
  levelBucket: ['low_1_3', 'mid_8_12', 'high_16_20'],
  budgetMode: ['standardBudget', 'noStandardBudget'],
  hpMode: ['autoRoll', 'manualHp'],
};

export const CONDITIONAL_DIMENSIONS: DimensionMap = {
  rangerStyle: ['archery', 'two_weapon'],
  identifyItems: ['on', 'off'],
  useNpcWealth: ['on', 'off'],
  biographyNotes: ['empty', 'filled'],
};
