import { describe, expect, it, vi } from 'vitest';
import { D35EAdapter } from '../../src/d35e-adapter';

describe('D35EAdapter.setBiography', () => {
  it('writes background to biography and personality to notes', async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    const actor = { name: 'Test Actor', update } as any;

    await D35EAdapter.setBiography(actor, {
      background: 'Raised in the borderlands.',
      personality: 'Calm, practical, and skeptical.',
    });

    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith({
      'system.details.biography.value': '<p>Raised in the borderlands.</p>',
      'system.details.notes.value': '<p>Calm, practical, and skeptical.</p>',
    });
  });

  it('does not update actor when both fields are empty', async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    const actor = { name: 'Test Actor', update } as any;

    await D35EAdapter.setBiography(actor, {
      background: '',
      personality: '',
    });

    expect(update).not.toHaveBeenCalled();
  });
});
