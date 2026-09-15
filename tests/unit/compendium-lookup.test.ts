import { describe, expect, it } from 'vitest';
import { findCompendiumEntryByName } from '../../src/d35e-adapter';

describe('findCompendiumEntryByName', () => {
  const index = [
    { name: 'Human', id: 'r1' },
    { name: 'Elf, High', id: 'r2' },
    { name: 'Fighter (NPC)', id: 'c1' },
  ];

  it('matches exact names', () => {
    const entry = findCompendiumEntryByName(index, 'Human');
    expect(entry?.id).toBe('r1');
  });

  it('matches case-insensitive names', () => {
    const entry = findCompendiumEntryByName(index, 'human');
    expect(entry?.id).toBe('r1');
  });

  it('matches punctuation-insensitive names', () => {
    const entry = findCompendiumEntryByName(index, 'Elf High');
    expect(entry?.id).toBe('r2');
  });

  it('matches reordered item names', () => {
    const reordered = [
      { name: 'Pouch, Spell Component', id: 'i1' },
      { name: 'Holy symbol, wooden', id: 'i2' },
    ];

    expect(findCompendiumEntryByName(reordered, 'Spell Component Pouch')?.id).toBe('i1');
    expect(findCompendiumEntryByName(reordered, 'Wooden Holy Symbol')?.id).toBe('i2');
  });

  it('returns null when no entry can be resolved', () => {
    const entry = findCompendiumEntryByName(index, 'Dragonborn');
    expect(entry).toBeNull();
  });
});
