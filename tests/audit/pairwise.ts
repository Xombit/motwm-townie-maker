export type DimensionMap = Record<string, string[]>;
export type Scenario = Record<string, string>;

function cartesianProduct(dimensions: DimensionMap): Scenario[] {
  const keys = Object.keys(dimensions);
  if (keys.length === 0) return [];

  return keys.reduce<Scenario[]>((acc, key) => {
    const values = dimensions[key];
    if (acc.length === 0) {
      return values.map((value) => ({ [key]: value }));
    }

    const next: Scenario[] = [];
    for (const existing of acc) {
      for (const value of values) {
        next.push({ ...existing, [key]: value });
      }
    }
    return next;
  }, []);
}

function buildPairUniverse(dimensions: DimensionMap): Set<string> {
  const keys = Object.keys(dimensions);
  const pairUniverse = new Set<string>();

  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const left = keys[i];
      const right = keys[j];

      for (const leftValue of dimensions[left]) {
        for (const rightValue of dimensions[right]) {
          pairUniverse.add(`${left}=${leftValue}|${right}=${rightValue}`);
        }
      }
    }
  }

  return pairUniverse;
}

function pairsCoveredByScenario(scenario: Scenario): Set<string> {
  const keys = Object.keys(scenario);
  const covered = new Set<string>();

  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const left = keys[i];
      const right = keys[j];
      covered.add(`${left}=${scenario[left]}|${right}=${scenario[right]}`);
    }
  }

  return covered;
}

export function generatePairwiseScenarios(dimensions: DimensionMap): Scenario[] {
  const candidates = cartesianProduct(dimensions);
  const requiredPairs = buildPairUniverse(dimensions);
  const selected: Scenario[] = [];

  while (requiredPairs.size > 0) {
    let bestCandidate: Scenario | null = null;
    let bestCoverage = -1;

    for (const candidate of candidates) {
      const covered = pairsCoveredByScenario(candidate);
      let score = 0;
      for (const pair of covered) {
        if (requiredPairs.has(pair)) score += 1;
      }

      if (score > bestCoverage) {
        bestCoverage = score;
        bestCandidate = candidate;
      }
    }

    if (!bestCandidate || bestCoverage <= 0) {
      break;
    }

    selected.push(bestCandidate);
    const newlyCovered = pairsCoveredByScenario(bestCandidate);
    for (const pair of newlyCovered) {
      requiredPairs.delete(pair);
    }
  }

  return selected;
}

export function scenarioPairsCoverage(dimensions: DimensionMap, scenarios: Scenario[]): {
  totalPairs: number;
  coveredPairs: number;
  uncoveredPairs: string[];
} {
  const requiredPairs = buildPairUniverse(dimensions);
  for (const scenario of scenarios) {
    const covered = pairsCoveredByScenario(scenario);
    for (const pair of covered) {
      requiredPairs.delete(pair);
    }
  }

  const totalPairs = buildPairUniverse(dimensions).size;
  const uncoveredPairs = Array.from(requiredPairs.values());
  return {
    totalPairs,
    coveredPairs: totalPairs - uncoveredPairs.length,
    uncoveredPairs,
  };
}
