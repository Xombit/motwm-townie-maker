import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('Townie Maker workflow markup', () => {
  it('contains the four creation steps plus separate settings', async () => {
    const markup = await readFile(new URL('../../templates/townie-maker.hbs', import.meta.url), 'utf8');
    for (const tab of ['template', 'details', 'abilities', 'equipment', 'settings']) {
      expect(markup).toContain(`data-tab="${tab}"`);
    }
    expect(markup).not.toContain('data-tab="config"');
  });

  it('keeps technical settings outside equipment controls', async () => {
    const markup = await readFile(new URL('../../templates/townie-maker.hbs', import.meta.url), 'utf8');
    const settingsStart = markup.indexOf('data-tab="settings"');
    const equipmentStart = markup.indexOf('data-tab="equipment"', settingsStart);
    const footerStart = markup.indexOf('<footer class="wizard-footer">');
    const settings = markup.slice(settingsStart, equipmentStart);
    const equipment = markup.slice(equipmentStart, footerStart);

    expect(settings).toContain('data-field="usePcSheet"');
    expect(settings).toContain('data-field="useMaxHpPerHD"');
    expect(settings).toContain('data-field="tokenDisposition"');
    expect(settings).not.toContain('data-field="budgetMode"');
    expect(equipment).toContain('data-field="budgetMode"');
    expect(equipment).toContain('data-field="identifyItems"');
    expect(equipment).toContain('data-action="select-spending-preset"');
  });

  it('renders template drill-in and all wizard footer actions', async () => {
    const markup = await readFile(new URL('../../templates/townie-maker.hbs', import.meta.url), 'utf8');
    expect(markup).toContain('{{#if showTemplateDetail}}');
    expect(markup).toContain('data-action="template-gallery-back"');
    expect(markup).toContain('data-action="wizard-back"');
    expect(markup).toContain('data-action="wizard-next"');
    expect(markup).toContain('data-footer-action="finalCreate"');
    expect(markup).toContain('data-action="return-to-flow"');
  });

  it('separates wealth scale, nested item mixes, and overall category shares', async () => {
    const markup = await readFile(new URL('../../templates/townie-maker.hbs', import.meta.url), 'utf8');

    expect(markup).toContain('Wealth Scale');
    expect(markup).toContain('It is not part of a 100% mix');
    expect(markup).toContain('Each group independently divides one parent category');
    expect(markup).toContain('{{budgetInfo.categoryHeading}}');
    expect(markup).toContain('All enabled category shares total {{budgetInfo.overallCategoryTotal}}%');
  });

  it('renders every split member as an editable input including Potions', async () => {
    const markup = await readFile(new URL('../../templates/townie-maker.hbs', import.meta.url), 'utf8');

    expect(markup).toContain('data-spending-split="{{key}}"');
    expect(markup).toContain('data-spending-group="{{../key}}"');
    expect(markup).toContain('{{#if invalid}}aria-invalid="true"{{/if}}');
    expect(markup).not.toContain('budget-derived-value');
  });
});