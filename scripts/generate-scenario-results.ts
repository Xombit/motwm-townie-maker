import fs from 'node:fs';
import path from 'node:path';

import { evaluateSmokeScenario, type ScenarioObservedState } from '../tests/audit/scenario-evaluator';
import { SMOKE_SCENARIOS } from '../tests/audit/smoke-scenarios';
import { summarizeScenarioResults } from '../tests/audit/scenario-reporting';
import { groupScenarioFailuresBySubsystem } from '../tests/audit/subsystem-triage';
import { buildScenarioCallTrace } from '../tests/audit/scenario-trace';
import { selectSpells } from '../src/data/spell-selection';

interface MockHarnessTelemetry {
  actorType: 'character' | 'npc';
  className: string;
  classLevel: number;
  branch: 'pc' | 'npc';
  spellPathEnabled: boolean;
  hpPath: 'pc-roll' | 'npc-calc' | 'none';
  budgetPath: 'standard' | 'npc-wealth' | 'fallback';
  biographyPath: 'routed' | 'not-routed';
  specialFeatureBranches: Array<'favored-enemies' | 'rogue-special-abilities'>;
  selectedSpellCount: number;
  callTrace: string[];
}

function getSpellAbilityScores(className: string): { int: number; wis: number; cha: number } {
  const classLower = className.toLowerCase();

  if (classLower === 'wizard') return { int: 18, wis: 10, cha: 8 };
  if (classLower === 'sorcerer') return { int: 10, wis: 10, cha: 18 };
  if (classLower === 'cleric' || classLower === 'druid' || classLower === 'ranger' || classLower === 'paladin' || classLower === 'adept (npc)') {
    return { int: 10, wis: 18, cha: classLower === 'paladin' ? 16 : 10 };
  }

  return { int: 10, wis: 10, cha: 10 };
}

async function buildObservedStateFromMockHarness(scenario: typeof SMOKE_SCENARIOS[number]): Promise<{
  observed: ScenarioObservedState;
  telemetry: MockHarnessTelemetry;
}> {
  const className = scenario.className;
  const classLevel = scenario.level;
  const usePcSheet = scenario.sheetType === 'pc';
  const trace = buildScenarioCallTrace(scenario);
  const uncaughtErrors: string[] = [];

  const hpPath = trace.steps.some((step) => step.call === 'rollHP')
    ? 'pc-roll'
    : trace.steps.some((step) => step.call === 'calculateAndSetNpcHP')
      ? 'npc-calc'
      : 'none';

  const spellPathEnabled = trace.steps.some((step) => step.call === 'addSpells');
  const budgetPath = trace.steps.find((step) => step.call === 'addEquipment')?.equipmentStrategy ?? 'fallback';
  const biographyPath = trace.steps.some((step) => step.call === 'setBiography') ? 'routed' : 'not-routed';
  const selectedSpells = spellPathEnabled
    ? await selectSpells(className as Parameters<typeof selectSpells>[0], classLevel, getSpellAbilityScores(className))
    : null;

  const hpValue = hpPath !== 'none'
    ? Math.max(1, classLevel * (usePcSheet ? 5 : 4))
    : undefined;

  const spellCount = selectedSpells?.spells.length;

  const budgetSpentRatio = budgetPath === 'standard'
    ? 0.95
    : budgetPath === 'npc-wealth'
      ? 0.72
      : scenario.useStandardBudget
        ? 0.95
        : scenario.useNpcWealth
          ? 0.72
          : undefined;

  const observed: ScenarioObservedState = {
    actorCreated: true,
    classItemPresent: trace.plan.hasClassSelection,
    raceItemPresent: true,
    uncaughtErrors,
    hpValue,
    spellCount,
    budgetSpentRatio,
    biographyPresent: biographyPath === 'routed',
    notesPresent: biographyPath === 'routed',
  };

  return {
    observed,
    telemetry: {
      actorType: trace.plan.actorType,
      className,
      classLevel,
      branch: usePcSheet ? 'pc' : 'npc',
      spellPathEnabled,
      hpPath,
      budgetPath,
      biographyPath,
      specialFeatureBranches: trace.specialFeatureBranches,
      selectedSpellCount: selectedSpells?.spells.length ?? 0,
      callTrace: trace.steps.map((step) => step.call),
    },
  };
}

const outPathArg = process.argv[2] || 'artifacts/scenario-run-results.json';
const outPath = path.resolve(process.cwd(), outPathArg);
const artifactsDir = path.dirname(outPath);
const summaryPath = path.resolve(artifactsDir, 'scenario-summary.json');
const triagePath = path.resolve(artifactsDir, 'subsystem-triage.json');

const scenarioResults = await Promise.all(SMOKE_SCENARIOS.map(async (scenario) => {
  const started = Date.now();
  const { observed, telemetry } = await buildObservedStateFromMockHarness(scenario);
  const result = evaluateSmokeScenario(scenario, observed);
  const durationMs = Date.now() - started;

  return {
    ...result,
    durationMs,
    telemetry,
    observed,
  };
}));

const summary = summarizeScenarioResults(scenarioResults);
const triageGroups = groupScenarioFailuresBySubsystem(scenarioResults);

fs.mkdirSync(artifactsDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(scenarioResults, null, 2), 'utf8');
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
fs.writeFileSync(
  triagePath,
  JSON.stringify(
    {
      totalFailures: triageGroups.reduce((sum, group) => sum + group.count, 0),
      groups: triageGroups,
    },
    null,
    2
  ),
  'utf8'
);

console.log(`Generated scenario results: ${outPath}`);
console.log(`Generated scenario summary: ${summaryPath}`);
console.log(`Generated subsystem triage: ${triagePath}`);
console.log(`Scenario count: ${scenarioResults.length}`);
