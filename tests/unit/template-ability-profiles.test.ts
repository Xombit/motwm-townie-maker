import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { ABILITY_KEYS, isAbilityKey } from '../../src/data/ability-generation';

interface TemplateAbilityProfile {
  id: string;
  abilityPriority?: string[];
  abilities?: Record<string, number>;
}

describe('template ability profiles', () => {
  it('uses complete unique priorities and only intentional pins', async () => {
    const text = await readFile(new URL('../../data/templates.json', import.meta.url), 'utf8');
    const templates = JSON.parse(text) as TemplateAbilityProfile[];
    const issues: string[] = [];
    const pinnedTemplates: Record<string, Record<string, number>> = {};

    for (const template of templates) {
      const priority = template.abilityPriority ?? [];
      if (priority.length !== ABILITY_KEYS.length
        || new Set(priority).size !== ABILITY_KEYS.length
        || priority.some(value => !isAbilityKey(value))) {
        issues.push(`${template.id}: invalid ability priority`);
      }
      if (template.abilities && Object.keys(template.abilities).length > 0) {
        pinnedTemplates[template.id] = template.abilities;
      }
    }

    expect(issues).toEqual([]);
    expect(pinnedTemplates).toEqual({
      blacksmith: { str: 18 },
      'wizard-arcanist': { int: 18 },
    });
  });
});