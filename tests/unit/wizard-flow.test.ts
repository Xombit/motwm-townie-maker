import { describe, expect, it } from 'vitest';
import { buildWizardFooterState, nextCreationTab, previousCreationTab } from '../../src/ui/wizard-flow';

describe('wizard flow', () => {
  it('walks the creation steps without including settings', () => {
    expect(nextCreationTab('template')).toBe('details');
    expect(nextCreationTab('details')).toBe('abilities');
    expect(nextCreationTab('abilities')).toBe('equipment');
    expect(nextCreationTab('equipment')).toBeNull();
    expect(previousCreationTab('template')).toBeNull();
    expect(previousCreationTab('equipment')).toBe('abilities');
  });

  it('shows cancel and a disabled next before template selection', () => {
    expect(buildWizardFooterState('template', false)).toMatchObject({
      showCancel: true,
      showBack: false,
      showCreateNow: false,
      showNext: true,
      nextDisabled: true,
    });
  });

  it('shows only back and final create on equipment', () => {
    expect(buildWizardFooterState('equipment', true)).toMatchObject({
      showBack: true,
      showCreateNow: false,
      showNext: false,
      showFinalCreate: true,
    });
  });

  it('returns from settings to the last creation step', () => {
    expect(buildWizardFooterState('settings', true, 'abilities')).toMatchObject({
      showReturnToFlow: true,
      returnLabel: 'Return to Abilities',
    });
  });
});