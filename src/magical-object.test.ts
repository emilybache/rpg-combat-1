import { describe, expect, it } from 'vitest';

import { HealingObject, MagicalObject, MagicalWeapon } from './magical-object.ts';
import { createCharacter } from './test-fixtures.ts';

class TestMagicalObject extends MagicalObject {}

describe('MagicalObject', () => {
  it('when a magical object is created then it starts at its maximum health', () => {
    const object = new TestMagicalObject(20);

    expect(object.maxHealth).toBe(20);
    expect(object.health).toBe(20);
    expect(object.destroyed).toBe(false);
  });

  it('when magical object health reaches zero then it is destroyed', () => {
    const object = new TestMagicalObject(20);

    object.receiveDamage(20);

    expect(object.health).toBe(0);
    expect(object.destroyed).toBe(true);
  });
});

describe('HealingObject', () => {
  it('when drawing health for a character then healing is capped at the character maximum', () => {
    const object = new HealingObject(300);
    const character = createCharacter(900);

    const transferred = object.drawHealth(character, 200);

    expect(transferred).toBe(100);
    expect(character.health).toBe(1000);
  });

  it("when drawing health exceeds the object's remaining health then transfer is capped by object health", () => {
    const object = new HealingObject(50);
    const character = createCharacter(700);

    const transferred = object.drawHealth(character, 200);

    expect(transferred).toBe(50);
    expect(character.health).toBe(750);
  });

  it('when a healing object transfers health then its health is reduced by the transferred amount', () => {
    const object = new HealingObject(200);
    const character = createCharacter(900);

    const transferred = object.drawHealth(character, 200);

    expect(transferred).toBe(100);
    expect(object.health).toBe(100);
  });
});

describe('MagicalWeapon', () => {
  it('when a magical weapon is used then it deals its fixed damage to a character target', () => {
    const weapon = new MagicalWeapon(10, 75);
    const target = createCharacter();

    weapon.useOn(target);

    expect(target.health).toBe(925);
    expect(target.alive).toBe(true);
  });

  it('when a magical weapon is used then it loses one health per use', () => {
    const weapon = new MagicalWeapon(10, 75);
    const target = createCharacter();

    weapon.useOn(target);

    expect(weapon.health).toBe(9);
  });

  it('when a magical weapon is destroyed then using it again has no effect', () => {
    const weapon = new MagicalWeapon(1, 75);
    const target = createCharacter();

    weapon.useOn(target);
    weapon.useOn(target);

    expect(weapon.destroyed).toBe(true);
    expect(weapon.health).toBe(0);
    expect(target.health).toBe(925);
  });
});

describe('Character interactions with magical objects', () => {
  it('when a character attempts to heal a magical object then the object health remains unchanged', () => {
    const healer = createCharacter();
    const object = new HealingObject(100);

    // @ts-expect-error Intentionally passing a non-character to verify runtime no-op behavior.
    healer.heal(object, 20);

    expect(object.health).toBe(100);
  });
});
