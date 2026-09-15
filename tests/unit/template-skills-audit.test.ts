import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

type SkillPriority = 'high' | 'medium' | 'low';

interface TemplateSkill {
  name: string;
  priority?: SkillPriority;
}

interface TemplateClass {
  name: string;
}

interface TemplateData {
  id: string;
  classes?: TemplateClass[];
  abilities?: { int?: number };
  skills?: TemplateSkill[];
}

const BASE_SKILL_POINTS: Record<string, number> = {
  Barbarian: 4,
  Bard: 6,
  Cleric: 2,
  Druid: 4,
  Fighter: 2,
  Monk: 4,
  Paladin: 2,
  Ranger: 6,
  Rogue: 8,
  Sorcerer: 2,
  Wizard: 2,
  'Adept (NPC)': 2,
  'Aristocrat (NPC)': 4,
  'Commoner (NPC)': 2,
  'Expert (NPC)': 6,
  'Warrior (NPC)': 2,
};

function priorityCostAtLevel1(priority: SkillPriority | undefined): number {
  if (priority === 'high') return 4;
  if (priority === 'low') return 1;
  return 2;
}

describe('template skill audit', () => {
  it('keeps classed templates broad and within sane budget pressure', async () => {
    const text = await readFile(new URL('../../data/templates.json', import.meta.url), 'utf8');
    const templates = JSON.parse(text) as TemplateData[];

    const issues: string[] = [];

    for (const template of templates) {
      const className = template.classes?.[0]?.name;
      if (!className) continue;

      const skills = template.skills ?? [];
      if (skills.length < 5) {
        issues.push(`${template.id}: too few skills (${skills.length})`);
        continue;
      }

      const invalid = skills.filter((skill) => !skill.priority || !['high', 'medium', 'low'].includes(skill.priority));
      if (invalid.length > 0) {
        issues.push(`${template.id}: invalid or missing priorities`);
        continue;
      }

      const base = BASE_SKILL_POINTS[className] ?? 2;
      const intScore = template.abilities?.int ?? 10;
      const intMod = Math.floor((intScore - 10) / 2);
      const perLevel = Math.max(1, base + intMod);
      const level1Budget = perLevel * 4;

      const requestedLevel1 = skills.reduce((sum, skill) => sum + priorityCostAtLevel1(skill.priority), 0);
      const pressureRatio = requestedLevel1 / level1Budget;

      // Allow overload to support INT variance and ordered spillover,
      // but reject very narrow or extremely overloaded lists.
      if (pressureRatio < 0.7 || pressureRatio > 2.5) {
        issues.push(
          `${template.id}: level1 pressure out of range (${pressureRatio.toFixed(2)}), requested=${requestedLevel1}, budget=${level1Budget}`
        );
      }
    }

    expect(issues).toEqual([]);
  });
});
