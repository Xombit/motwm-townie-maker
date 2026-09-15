export interface ScenarioCheck {
  name: string;
  passed: boolean;
  details?: string;
}

export interface ScenarioRunResult {
  id: string;
  version: 'v11' | 'v14';
  checks: ScenarioCheck[];
  durationMs?: number;
}

export interface AuditSummary {
  totalScenarios: number;
  passedScenarios: number;
  failedScenarios: number;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  failureRate: number;
  failuresByVersion: Record<'v11' | 'v14', number>;
  failingScenarios: Array<{ id: string; version: 'v11' | 'v14'; failedChecks: string[] }>;
}

export function summarizeScenarioResults(results: ScenarioRunResult[]): AuditSummary {
  const summary: AuditSummary = {
    totalScenarios: results.length,
    passedScenarios: 0,
    failedScenarios: 0,
    totalChecks: 0,
    passedChecks: 0,
    failedChecks: 0,
    failureRate: 0,
    failuresByVersion: { v11: 0, v14: 0 },
    failingScenarios: [],
  };

  for (const result of results) {
    const failedChecks = result.checks.filter((check) => !check.passed);
    const passedChecks = result.checks.length - failedChecks.length;

    summary.totalChecks += result.checks.length;
    summary.passedChecks += passedChecks;
    summary.failedChecks += failedChecks.length;

    if (failedChecks.length === 0) {
      summary.passedScenarios += 1;
    } else {
      summary.failedScenarios += 1;
      summary.failuresByVersion[result.version] += 1;
      summary.failingScenarios.push({
        id: result.id,
        version: result.version,
        failedChecks: failedChecks.map((check) => check.name),
      });
    }
  }

  summary.failureRate = summary.totalChecks === 0 ? 0 : Number((summary.failedChecks / summary.totalChecks).toFixed(4));
  return summary;
}
