export interface SmokeScenario {
  id: string;
  foundryVersion: 'v11' | 'v14';
  className: string;
  level: number;
  sheetType: 'pc' | 'npc';
  useStandardBudget: boolean;
  useNpcWealth: boolean;
  autoRollHp: boolean;
  notes: string;
  background?: string;
  personality?: string;
}

export const SMOKE_SCENARIOS: SmokeScenario[] = [
  {
    id: 'v11_fighter_l1_pc_standard',
    foundryVersion: 'v11',
    className: 'Fighter',
    level: 1,
    sheetType: 'pc',
    useStandardBudget: true,
    useNpcWealth: false,
    autoRollHp: true,
    notes: 'Baseline martial pipeline including class/race/attacks and HP.',
    background: 'Village guard who learned to fight from local militias.',
    personality: 'Practical, stubborn, and protective.',
  },
  {
    id: 'v11_wizard_l10_pc_standard',
    foundryVersion: 'v11',
    className: 'Wizard',
    level: 10,
    sheetType: 'pc',
    useStandardBudget: true,
    useNpcWealth: false,
    autoRollHp: true,
    notes: 'Arcane caster path including spell configuration and consumables.',
    background: 'Scholar trained in a provincial academy of magic.',
    personality: 'Curious, exacting, and patient.',
  },
  {
    id: 'v11_ranger_l11_pc_standard',
    foundryVersion: 'v11',
    className: 'Ranger',
    level: 11,
    sheetType: 'pc',
    useStandardBudget: true,
    useNpcWealth: false,
    autoRollHp: true,
    notes: 'Ranger style branches and favored enemy scaling.',
  },
  {
    id: 'v11_cleric_l12_npc_npcwealth',
    foundryVersion: 'v11',
    className: 'Cleric',
    level: 12,
    sheetType: 'npc',
    useStandardBudget: true,
    useNpcWealth: true,
    autoRollHp: false,
    notes: 'Simple NPC sheet with divine branch and NPC wealth.',
  },
  {
    id: 'v14_fighter_l1_pc_standard',
    foundryVersion: 'v14',
    className: 'Fighter',
    level: 1,
    sheetType: 'pc',
    useStandardBudget: true,
    useNpcWealth: false,
    autoRollHp: true,
    notes: 'v14 baseline parity case.',
  },
  {
    id: 'v14_sorcerer_l10_pc_standard',
    foundryVersion: 'v14',
    className: 'Sorcerer',
    level: 10,
    sheetType: 'pc',
    useStandardBudget: true,
    useNpcWealth: false,
    autoRollHp: true,
    notes: 'Pure caster budget and spontaneous spell path on v14.',
  },
  {
    id: 'v14_rogue_l16_pc_standard',
    foundryVersion: 'v14',
    className: 'Rogue',
    level: 16,
    sheetType: 'pc',
    useStandardBudget: true,
    useNpcWealth: false,
    autoRollHp: true,
    notes: 'High-level feat allocation and rogue special abilities.',
  },
  {
    id: 'v14_fighter_l8_npc_no_budget',
    foundryVersion: 'v14',
    className: 'Fighter',
    level: 8,
    sheetType: 'npc',
    useStandardBudget: false,
    useNpcWealth: true,
    autoRollHp: false,
    notes: 'No standard budget branch and token-gold fallback path.',
  },
  {
    id: 'v14_adept_l8_npc_standard',
    foundryVersion: 'v14',
    className: 'Adept (NPC)',
    level: 8,
    sheetType: 'npc',
    useStandardBudget: true,
    useNpcWealth: true,
    autoRollHp: false,
    notes: 'NPC caster class branch with spell setup and NPC wealth routing.',
    background: 'Village hedge mage with practical divine rites.',
    personality: 'Quiet, observant, and wary of strangers.',
  },
];
