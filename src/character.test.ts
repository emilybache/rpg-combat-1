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

describe('Character levels and damage modifiers', () => {
  it('when a character is created then level starts at 1', () => {
    const character = new Character();

    expect(character.level).toBe(1);
  });

  it('when target level is within 4 levels of attacker then damage is not modified', () => {
    const attacker = new Character();
    const target = new Character();

    attacker.level = 1;
    target.level = 5;

    attacker.dealDamage(target, 100);

    expect(target.health).toBe(900);
  });

  it('when target is 5 or more levels above attacker then damage is reduced by half', () => {
    const attacker = new Character();
    const target = new Character();

    attacker.level = 1;
    target.level = 6;

    attacker.dealDamage(target, 100);

    expect(target.health).toBe(950);
  });

  it('when target is 5 or more levels below attacker then damage is increased by 50 percent', () => {
    const attacker = new Character();
    const target = new Character();

    attacker.level = 6;
    target.level = 1;

    attacker.dealDamage(target, 100);

    expect(target.health).toBe(850);
  });

  it('when character level is 5 then max health remains 1000', () => {
    const character = new Character();

    character.level = 5;

    expect(character.maxHealth).toBe(1000);
  });

  it('when character level is 6 then max health increases to 1500', () => {
    const character = new Character();

    character.level = 6;

    expect(character.maxHealth).toBe(1500);
  });

  it('when a level 6 character heals then health cannot exceed 1500', () => {
    const character = new Character();

    character.level = 6;
    character.health = 1450;

    character.heal(200);

    expect(character.health).toBe(1500);
  });
});
