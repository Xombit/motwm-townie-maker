import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const jsonOutFlagIndex = args.indexOf('--json-out');
const jsonOutPath = jsonOutFlagIndex >= 0 ? args[jsonOutFlagIndex + 1] : undefined;
const positional = args.filter((arg, index) => {
  if (arg === '--json-out') return false;
  if (jsonOutFlagIndex >= 0 && index === jsonOutFlagIndex + 1) return false;
  return true;
});

const inputPath = positional[0] || 'artifacts/scenario-run-results.json';
const resolved = path.resolve(process.cwd(), inputPath);

const CHECK_SUBSYSTEM_MAP = {
  actor_created: 'actor-pipeline',
  class_item_present: 'compendium-lookup',
  race_item_present: 'compendium-lookup',
  no_uncaught_errors: 'error-handling',
  hp_is_positive: 'health-and-hp',
  spells_configured: 'spell-system',
  budget_spend_within_bounds: 'budget-and-items',
  biography_notes_tabs_routed: 'biography-notes',
};

function classify(checkName) {
  return CHECK_SUBSYSTEM_MAP[checkName] || 'unknown';
}

function groupFailures(results) {
  const groups = new Map();

  for (const result of results) {
    const checks = Array.isArray(result.checks) ? result.checks : [];

    for (const check of checks) {
      if (check.passed) continue;
      const subsystem = classify(check.name);

      if (!groups.has(subsystem)) {
        groups.set(subsystem, { subsystem, count: 0, scenarios: [] });
      }

      const group = groups.get(subsystem);
      group.count += 1;
      group.scenarios.push({ id: result.id, version: result.version, check: check.name });
    }
  }

  return [...groups.values()].sort((a, b) => b.count - a.count || a.subsystem.localeCompare(b.subsystem));
}

if (!fs.existsSync(resolved)) {
  console.error(`Scenario report not found: ${resolved}`);
  console.error('Expected input: JSON array of scenario results with { id, version, checks[] }.');
  process.exit(1);
}

const raw = fs.readFileSync(resolved, 'utf8').replace(/^\uFEFF/, '');
const parsed = JSON.parse(raw);
const results = Array.isArray(parsed) ? parsed : parsed.results;

if (!Array.isArray(results)) {
  console.error('Invalid scenario report format. Expected an array or { results: [] }.');
  process.exit(1);
}

const groups = groupFailures(results);
const totalFailures = groups.reduce((sum, g) => sum + g.count, 0);

const triagePayload = {
  input: inputPath,
  totalFailures,
  groups,
  generatedAt: new Date().toISOString(),
};

if (jsonOutPath) {
  const resolvedJsonOut = path.resolve(process.cwd(), jsonOutPath);
  fs.mkdirSync(path.dirname(resolvedJsonOut), { recursive: true });
  fs.writeFileSync(resolvedJsonOut, JSON.stringify(triagePayload, null, 2), 'utf8');
}

console.log(`Scenario failures: ${totalFailures}`);
for (const group of groups) {
  console.log(`- ${group.subsystem}: ${group.count}`);
  for (const scenario of group.scenarios.slice(0, 10)) {
    console.log(`  - ${scenario.id} (${scenario.version}) -> ${scenario.check}`);
  }
  if (group.scenarios.length > 10) {
    console.log(`  - ... ${group.scenarios.length - 10} more`);
  }
}
