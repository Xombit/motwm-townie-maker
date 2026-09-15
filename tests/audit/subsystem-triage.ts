import type { ScenarioRunResult } from './scenario-reporting';

export type AuditSubsystem =
  | 'actor-pipeline'
  | 'compendium-lookup'
  | 'error-handling'
  | 'health-and-hp'
  | 'spell-system'
  | 'budget-and-items'
  | 'biography-notes'
  | 'unknown';

const CHECK_SUBSYSTEM_MAP: Record<string, AuditSubsystem> = {
  actor_created: 'actor-pipeline',
  class_item_present: 'compendium-lookup',
  race_item_present: 'compendium-lookup',
  no_uncaught_errors: 'error-handling',
  hp_is_positive: 'health-and-hp',
  spells_configured: 'spell-system',
  budget_spend_within_bounds: 'budget-and-items',
  biography_notes_tabs_routed: 'biography-notes',
};

export interface SubsystemFailureGroup {
  subsystem: AuditSubsystem;
  count: number;
  scenarios: Array<{ id: string; version: 'v11' | 'v14'; check: string }>;
}

export function classifyCheckToSubsystem(checkName: string): AuditSubsystem {
  return CHECK_SUBSYSTEM_MAP[checkName] ?? 'unknown';
}

export function groupScenarioFailuresBySubsystem(results: ScenarioRunResult[]): SubsystemFailureGroup[] {
  const groups = new Map<AuditSubsystem, SubsystemFailureGroup>();

  for (const result of results) {
    for (const check of result.checks) {
      if (check.passed) continue;

      const subsystem = classifyCheckToSubsystem(check.name);
      if (!groups.has(subsystem)) {
        groups.set(subsystem, {
          subsystem,
          count: 0,
          scenarios: [],
        });
      }

      const group = groups.get(subsystem)!;
      group.count += 1;
      group.scenarios.push({
        id: result.id,
        version: result.version,
        check: check.name,
      });
    }
  }

  return Array.from(groups.values()).sort((a, b) => b.count - a.count || a.subsystem.localeCompare(b.subsystem));
}
