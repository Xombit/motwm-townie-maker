import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { buildTemplateDetailView } from '../../src/ui/template-detail-view';

describe('template detail view', () => {
  it('formats priorities, pins, configured feats, and equipment alternatives', () => {
    const view = buildTemplateDetailView({
      id: 'test', name: 'Test Monk', description: 'Test', icon: 'fas fa-user',
      race: 'Human', classes: [{ name: 'Monk', level: 5 }], primaryAbility: 'dex',
      abilityPriority: ['dex', 'wis', 'con'], abilities: { dex: 18 },
      feats: [{ name: 'Weapon Focus', displayName: 'Weapon Focus (Unarmed)', config: { weaponGroup: 'Unarmed Strike' } }],
      startingKit: {
        weapons: [[
          { name: 'Club', cost: 0, type: 'weapon' },
          { name: 'Quarterstaff', cost: 0, type: 'weapon' },
        ], { name: 'Sling', cost: 0, type: 'weapon' }],
      },
    });

    const text = JSON.stringify(view);
    expect(text).toContain('Dexterity -> Wisdom -> Constitution');
    expect(text).toContain('Dexterity 18');
    expect(text).toContain('Weapon Focus (Unarmed)');
    expect(text).toContain('Random choice: Club');
    expect(text).toContain('; Sling');
  });

  it('omits empty optional sections', () => {
    const view = buildTemplateDetailView({ id: 'blank', name: 'Blank', description: 'Blank', icon: 'fas fa-user' });
    expect(view.sections.map(section => section.id)).toEqual(['abilities']);
  });

  it('builds complete detail views for every shipped template', async () => {
    const text = await readFile(new URL('../../data/templates.json', import.meta.url), 'utf8');
    const templates = JSON.parse(text);
    const views = templates.map(buildTemplateDetailView);

    expect(views).toHaveLength(templates.length);
    expect(views.every(view => view.id && view.name && view.sections.length > 0)).toBe(true);
  });
});