import { describe, expect, it } from 'vitest';

import * as magicalObjectModule from './magical-object.ts';

describe('magical object module skeleton', () => {
  it('is loadable during iteration 0', () => {
    expect(magicalObjectModule).toBeDefined();
  });
});
