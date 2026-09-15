export const CREATION_TABS = ['template', 'details', 'abilities', 'equipment'] as const;
export type CreationTab = typeof CREATION_TABS[number];
export type PrimaryTab = CreationTab | 'settings';

export interface WizardFooterState {
  showCancel: boolean;
  showBack: boolean;
  showCreateNow: boolean;
  showNext: boolean;
  showFinalCreate: boolean;
  showReturnToFlow: boolean;
  nextDisabled: boolean;
  returnLabel: string;
}

export function isCreationTab(value: string): value is CreationTab {
  return (CREATION_TABS as readonly string[]).includes(value);
}

export function previousCreationTab(tab: CreationTab): CreationTab | null {
  const index = CREATION_TABS.indexOf(tab);
  return index > 0 ? CREATION_TABS[index - 1] : null;
}

export function nextCreationTab(tab: CreationTab): CreationTab | null {
  const index = CREATION_TABS.indexOf(tab);
  return index >= 0 && index < CREATION_TABS.length - 1 ? CREATION_TABS[index + 1] : null;
}

export function buildWizardFooterState(
  activeTab: PrimaryTab,
  hasTemplate: boolean,
  lastCreationTab: CreationTab = 'template',
): WizardFooterState {
  if (activeTab === 'settings') {
    return {
      showCancel: false,
      showBack: false,
      showCreateNow: hasTemplate,
      showNext: false,
      showFinalCreate: false,
      showReturnToFlow: true,
      nextDisabled: false,
      returnLabel: `Return to ${labelForCreationTab(lastCreationTab)}`,
    };
  }

  const isFirst = activeTab === CREATION_TABS[0];
  const isFinal = activeTab === CREATION_TABS[CREATION_TABS.length - 1];
  return {
    showCancel: isFirst,
    showBack: !isFirst,
    showCreateNow: hasTemplate && !isFinal,
    showNext: !isFinal,
    showFinalCreate: isFinal,
    showReturnToFlow: false,
    nextDisabled: activeTab === 'template' && !hasTemplate,
    returnLabel: '',
  };
}

export function labelForCreationTab(tab: CreationTab): string {
  switch (tab) {
    case 'template': return 'Templates';
    case 'details': return 'Details';
    case 'abilities': return 'Abilities';
    case 'equipment': return 'Equipment';
  }
}