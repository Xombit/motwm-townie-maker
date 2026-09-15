import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

describe('audit scenario pipeline script', () => {
  it('generates machine-readable scenario results artifact', () => {
    const outFile = path.resolve(process.cwd(), 'artifacts', 'scenario-run-results.json');
    const summaryFile = path.resolve(process.cwd(), 'artifacts', 'scenario-summary.json');
    const triageFile = path.resolve(process.cwd(), 'artifacts', 'subsystem-triage.json');

    execSync('tsx ./scripts/generate-scenario-results.ts artifacts/scenario-run-results.json', {
      cwd: process.cwd(),
      stdio: 'pipe',
    });

    expect(fs.existsSync(outFile)).toBe(true);
    expect(fs.existsSync(summaryFile)).toBe(true);
    expect(fs.existsSync(triageFile)).toBe(true);

    const raw = fs.readFileSync(outFile, 'utf8').replace(/^\uFEFF/, '');
    const parsed = JSON.parse(raw);
    const smokeSource = fs.readFileSync(path.resolve(process.cwd(), 'tests', 'audit', 'smoke-scenarios.ts'), 'utf8');
    const expectedScenarioCount = [...smokeSource.matchAll(/id:\s*'([^']+)'/g)].length;

    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBe(expectedScenarioCount);

    const first = parsed[0];
    expect(typeof first.id).toBe('string');
    expect(first.version === 'v11' || first.version === 'v14').toBe(true);
    expect(Array.isArray(first.checks)).toBe(true);
    expect(Array.isArray(first.telemetry.callTrace)).toBe(true);
    expect(first.telemetry.callTrace.length).toBeGreaterThan(0);
    expect(typeof first.telemetry.budgetPath).toBe('string');
      expect(Array.isArray(first.telemetry.specialFeatureBranches)).toBe(true);

    const summaryRaw = fs.readFileSync(summaryFile, 'utf8').replace(/^\uFEFF/, '');
    const summary = JSON.parse(summaryRaw);
    expect(summary.totalScenarios).toBe(expectedScenarioCount);

    const triageRaw = fs.readFileSync(triageFile, 'utf8').replace(/^\uFEFF/, '');
    const triage = JSON.parse(triageRaw);
    expect(Array.isArray(triage.groups)).toBe(true);
  });
});
