import { describe, expect, it } from 'vitest';
import { CORE_AUDIT_DIMENSIONS } from './matrix-dimensions';
import { generatePairwiseScenarios, scenarioPairsCoverage } from './pairwise';

describe('audit matrix pairwise generation', () => {
  it('covers 100% of core pairs', () => {
    const scenarios = generatePairwiseScenarios(CORE_AUDIT_DIMENSIONS);
    const coverage = scenarioPairsCoverage(CORE_AUDIT_DIMENSIONS, scenarios);

    expect(scenarios.length).toBeGreaterThan(0);
    expect(coverage.uncoveredPairs).toEqual([]);
    expect(coverage.coveredPairs).toBe(coverage.totalPairs);
  });

  it('produces fewer cases than full cartesian for current dimensions', () => {
    const fullCartesian = Object.values(CORE_AUDIT_DIMENSIONS).reduce(
      (acc, values) => acc * values.length,
      1
    );
    const scenarios = generatePairwiseScenarios(CORE_AUDIT_DIMENSIONS);

    expect(scenarios.length).toBeLessThan(fullCartesian);
  });
});
