import type { EquipmentItem, EquipmentOption, FeatConfig, TownieTemplate } from '../types';
import { normalizeAbilityPriority, type AbilityKey } from '../data/ability-generation';

export interface TemplateDetailRow {
  label: string;
  value: string;
}

export interface TemplateDetailSection {
  id: string;
  title: string;
  rows?: TemplateDetailRow[];
  items?: string[];
}

export interface TemplateDetailView {
  id: string;
  name: string;
  description: string;
  icon: string;
  sections: TemplateDetailSection[];
}

const ABILITY_LABELS: Record<AbilityKey, string> = {
  str: 'Strength', dex: 'Dexterity', con: 'Constitution',
  int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma',
};

function formatFeat(feat: string | FeatConfig): string {
  if (typeof feat === 'string') return feat;
  const details = [
    feat.config?.spellSchool ? `school: ${feat.config.spellSchool}` : '',
    feat.config?.weaponGroup ? `weapon: ${feat.config.weaponGroup}` : '',
    feat.config?.skill ? `skill: ${feat.config.skill}` : '',
  ].filter(Boolean);
  return `${feat.displayName || feat.name}${details.length ? ` (${details.join(', ')})` : ''}`;
}

function formatEquipmentItem(item: EquipmentItem): string {
  const quantity = item.quantity && item.quantity !== 1 ? `${item.quantity}x ` : '';
  const details = [`${item.cost} gp`];
  if (item.weight !== undefined) details.push(`${item.weight} lb`);
  return `${quantity}${item.name} (${details.join(', ')})`;
}

function isLevelScaledOption(option: EquipmentOption): option is Array<{ minLevel: number; item: EquipmentItem }> {
  return Array.isArray(option) && option.length > 0 && 'minLevel' in option[0];
}

function formatEquipmentOption(option: EquipmentOption): string {
  if (!Array.isArray(option)) return formatEquipmentItem(option);
  if (isLevelScaledOption(option)) {
    return option.map(entry => `Level ${entry.minLevel}+: ${formatEquipmentItem(entry.item)}`).join(' | ');
  }
  return `Random choice: ${option.map(formatEquipmentItem).join(' / ')}`;
}

function pushSection(sections: TemplateDetailSection[], section: TemplateDetailSection): void {
  if ((section.rows?.length ?? 0) > 0 || (section.items?.length ?? 0) > 0) sections.push(section);
}

export function buildTemplateDetailView(template: TownieTemplate): TemplateDetailView {
  const sections: TemplateDetailSection[] = [];
  const identityRows: TemplateDetailRow[] = [];
  if (template.race) identityRows.push({ label: 'Race', value: template.race });
  if (template.classes?.length) identityRows.push({
    label: 'Classes',
    value: template.classes.map(entry => `${entry.name} ${entry.level}`).join(', '),
  });
  if (template.alignment) identityRows.push({ label: 'Alignment', value: template.alignment });
  if (template.primaryAbility) identityRows.push({ label: 'Primary Ability', value: ABILITY_LABELS[template.primaryAbility] });
  pushSection(sections, { id: 'identity', title: 'Character', rows: identityRows });

  const priority = normalizeAbilityPriority(template.abilityPriority, template.primaryAbility);
  const abilityRows: TemplateDetailRow[] = [{
    label: 'Priority',
    value: priority.map(ability => ABILITY_LABELS[ability]).join(' -> '),
  }];
  const pins = Object.entries(template.abilities ?? {});
  if (pins.length) abilityRows.push({
    label: 'Pinned Scores',
    value: pins.map(([key, value]) => `${ABILITY_LABELS[key as AbilityKey]} ${value}`).join(', '),
  });
  pushSection(sections, { id: 'abilities', title: 'Ability Profile', rows: abilityRows });

  pushSection(sections, {
    id: 'skills',
    title: 'Skills',
    items: template.skills?.map(skill => `${skill.name}: ${skill.ranks} ranks${skill.priority ? ` (${skill.priority})` : ''}`),
  });
  pushSection(sections, { id: 'feats', title: 'Feats', items: template.feats?.map(formatFeat) });

  const equipmentRows: TemplateDetailRow[] = [];
  const kit = template.startingKit;
  if (kit) {
    const categories: Array<[string, EquipmentOption | EquipmentOption[] | undefined, boolean]> = [
      ['Weapons', kit.weapons, true], ['Armor', kit.armor, false], ['Shield', kit.shield, false],
      ['Gear', kit.gear, true], ['Tools', kit.tools, true], ['Ammunition', kit.ammo, true],
    ];
    for (const [label, value, isOptionList] of categories) {
      if (!value) continue;
      const options = isOptionList ? value as EquipmentOption[] : [value as EquipmentOption];
      equipmentRows.push({ label, value: options.map(formatEquipmentOption).join('; ') });
    }
  }
  pushSection(sections, { id: 'equipment', title: 'Starting Equipment', rows: equipmentRows });

  const plan = template.spendingPlan;
  const spendingRows: TemplateDetailRow[] = [];
  if (plan) {
    spendingRows.push({ label: 'Preset', value: plan.preset });
    spendingRows.push({ label: 'Wealth', value: `${plan.wealth.mode}, ${plan.wealth.multiplierPercent}%, ${plan.wealth.reservePercent}% reserved` });
    const categorySummary = Object.entries(plan.categories ?? {})
      .sort(([, left], [, right]) => (left.priority ?? 99) - (right.priority ?? 99))
      .map(([key, rule]) => {
        if (rule.enabled === false) return `${key}: disabled`;
        const details = [`${((rule.shareBasisPoints ?? 0) / 100).toFixed(0)}%`];
        if (rule.priority !== undefined) details.push(`priority ${rule.priority + 1}`);
        if (rule.maxShareBasisPoints !== undefined) details.push(`cap ${rule.maxShareBasisPoints / 100}%`);
        if (rule.itemLimit !== undefined) details.push(`limit ${rule.itemLimit}`);
        return `${key}: ${details.join(', ')}`;
      });
    if (categorySummary.length) spendingRows.push({ label: 'Categories', value: categorySummary.join(', ') });
    const splitSummary = Object.entries(plan.splits ?? {})
      .map(([key, value]) => `${key.replace(/BasisPoints$/, '')}: ${value / 100}%`);
    if (splitSummary.length) spendingRows.push({ label: 'Nested Splits', value: splitSummary.join(', ') });
  } else if (template.budgetMode) {
    spendingRows.push({ label: 'Wealth', value: template.budgetMode });
  } else if (template.useStandardBudget !== undefined) {
    spendingRows.push({ label: 'Automatic Equipment', value: template.useStandardBudget ? 'Enabled' : 'Disabled' });
  }
  if (template.magicItemBudgets) {
    spendingRows.push({
      label: 'Legacy Splits',
      value: Object.entries(template.magicItemBudgets).map(([key, value]) => `${key}: ${Number(value) * 100}%`).join(', '),
    });
  }
  pushSection(sections, { id: 'spending', title: 'Wealth and Spending', rows: spendingRows });

  const options: TemplateDetailRow[] = [];
  if (template.usePcSheet !== undefined) options.push({ label: 'Sheet', value: template.usePcSheet ? 'PC style' : 'Simple NPC' });
  if (template.useMaxHpPerHD !== undefined) options.push({ label: 'Hit Points', value: template.useMaxHpPerHD ? 'Maximum per Hit Die' : 'Rolled' });
  if (template.rangerCombatStyle) options.push({ label: 'Ranger Style', value: template.rangerCombatStyle });
  if (template.favoredEnemies?.length) options.push({ label: 'Favored Enemies', value: template.favoredEnemies.join(', ') });
  if (template.rogueSpecialAbilities?.length) options.push({ label: 'Rogue Abilities', value: template.rogueSpecialAbilities.join(', ') });
  pushSection(sections, { id: 'options', title: 'Class and Sheet Options', rows: options });

  const flavor: TemplateDetailRow[] = [];
  if (template.personality) flavor.push({ label: 'Personality', value: template.personality });
  if (template.background) flavor.push({ label: 'Background', value: template.background });
  pushSection(sections, { id: 'flavor', title: 'Character Notes', rows: flavor });

  return { id: template.id, name: template.name, description: template.description, icon: template.icon, sections };
}