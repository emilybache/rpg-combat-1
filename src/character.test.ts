import { describe, expect, it } from 'vitest';

import { Character } from './character.ts';

describe('Character damage and health', () => {
  it('new character has 1000 health and is alive', () => {
    const character = new Character();

    expect(character.health).toBe(1000);
    expect(character.alive).toBe(true);
  });

  it('dealing damage reduces target health', () => {
    const attacker = new Character();
    const target = new Character();

    attacker.dealDamage(target, 100);

    expect(target.health).toBe(900);
  });

  it('health does not go below 0', () => {
    const attacker = new Character();
    const target = new Character();

    target.health = 50;

    attacker.dealDamage(target, 200);

    expect(target.health).toBe(0);
  });

  it('target dies when health reaches 0', () => {
    const attacker = new Character();
    const target = new Character();

    target.health = 100;

    attacker.dealDamage(target, 100);

    expect(target.alive).toBe(false);
  });

  it('character cannot deal damage to itself', () => {
    const character = new Character();

    expect(() => character.dealDamage(character, 100)).toThrowError(
      'A character cannot deal damage to itself',
    );
    expect(character.health).toBe(1000);
    expect(character.alive).toBe(true);
  });

  it('when a living character heals after taking damage then health is restored by the healed amount', () => {
    const character = new Character();

    character.health = 700;

    character.heal(200);

    expect(character.health).toBe(900);
    expect(character.alive).toBe(true);
  });

  it('when a living character heals beyond max health then health is capped at 1000', () => {
    const character = new Character();

    character.health = 950;

    character.heal(200);

    expect(character.health).toBe(1000);
  });

  it('when a dead character attempts to heal then health remains unchanged', () => {
    const character = new Character();

    character.health = 0;
    character.alive = false;

    character.heal(200);

    expect(character.health).toBe(0);
    expect(character.alive).toBe(false);
  });
});
