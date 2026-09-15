export type CoreClassKey =
  | 'fighter'
  | 'barbarian'
  | 'paladin'
  | 'ranger'
  | 'rogue'
  | 'monk'
  | 'wizard'
  | 'sorcerer'
  | 'cleric'
  | 'druid'
  | 'bard';

const CLASS_ALIAS_MAP: Record<string, CoreClassKey> = {
  fighter: 'fighter',
  barbarian: 'barbarian',
  paladin: 'paladin',
  ranger: 'ranger',
  rogue: 'rogue',
  monk: 'monk',
  wizard: 'wizard',
  sorcerer: 'sorcerer',
  cleric: 'cleric',
  druid: 'druid',
  bard: 'bard',

  // NPC class mappings.
  // Adept is a divine spellcaster; map to cleric-style behavior for item routing.
  adept: 'cleric',
  // Martial-leaning NPC classes map to fighter behaviors.
  aristocrat: 'fighter',
  commoner: 'fighter',
  warrior: 'fighter',
  // Expert maps better to rogue-style utility tendencies.
  expert: 'rogue',
};

export function normalizeClassLabel(rawClassName: string | null | undefined): string {
  if (!rawClassName) return '';
  return rawClassName
    .toLowerCase()
    .replace(/\(npc\)/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .join(' ');
}

export function getPrimaryClassToken(rawClassName: string | null | undefined): string {
  const normalized = normalizeClassLabel(rawClassName);
  if (!normalized) return '';
  const [firstToken] = normalized.split(' ');
  return firstToken || '';
}

export function toCoreClassKey(rawClassName: string | null | undefined): CoreClassKey {
  const token = getPrimaryClassToken(rawClassName);
  return CLASS_ALIAS_MAP[token] ?? 'fighter';
}

export function isDivineClass(rawClassName: string | null | undefined): boolean {
  const token = getPrimaryClassToken(rawClassName);
  return token === 'cleric' || token === 'druid' || token === 'adept';
}

export function isPureArcaneClass(rawClassName: string | null | undefined): boolean {
  const token = getPrimaryClassToken(rawClassName);
  return token === 'wizard' || token === 'sorcerer';
}

export function isPartialCasterClass(rawClassName: string | null | undefined): boolean {
  const token = getPrimaryClassToken(rawClassName);
  return token === 'bard' || token === 'paladin' || token === 'ranger';
}
