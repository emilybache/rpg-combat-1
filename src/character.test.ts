import { describe, expect, it } from 'vitest';

import * as characterModule from './character.ts';

describe('character module skeleton', () => {
  it('is loadable during iteration 0', () => {
    expect(characterModule).toBeDefined();
  });
});
