import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('template data', () => {
  it('gives the adept healer a starting kit', async () => {
    const text = await readFile(new URL('../../data/templates.json', import.meta.url), 'utf8');
    const templates = JSON.parse(text) as Array<{ id: string; startingKit?: unknown }>;
    const adeptHealer = templates.find((template) => template.id === 'adept-healer');

    expect(adeptHealer).toBeTruthy();
    expect(adeptHealer?.startingKit).toBeTruthy();
  });

  it('gives every classed template a starting kit', async () => {
    const text = await readFile(new URL('../../data/templates.json', import.meta.url), 'utf8');
    const templates = JSON.parse(text) as Array<{ id: string; classes?: unknown[]; startingKit?: unknown }>;
    const missing = templates
      .filter((template) => (template.classes?.length ?? 0) > 0)
      .filter((template) => !template.startingKit)
      .map((template) => template.id);

    expect(missing).toEqual([]);
  });
});
