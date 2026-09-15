import { describe, expect, it } from 'vitest';
import { D35EAdapter } from '../../src/d35e-adapter';

describe('D35EAdapter.addSpells gating', () => {
  const actor = { name: 'Test Actor' } as any;
  const abilities = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };

  it('returns safely for non-caster classes without requiring spell configuration runtime', async () => {
    await expect(D35EAdapter.addSpells(actor, 'fighter', 10, abilities)).resolves.toBeUndefined();
  });

  it('returns safely for low-level partial casters below spell threshold', async () => {
    await expect(D35EAdapter.addSpells(actor, 'paladin', 3, abilities)).resolves.toBeUndefined();
    await expect(D35EAdapter.addSpells(actor, 'ranger', 1, abilities)).resolves.toBeUndefined();
  });
});
