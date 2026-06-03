import { describe, expect, it } from 'vitest';

import { Character } from './character.ts';

const createCharacter = (health = 1000, level = 1, alive = health > 0): Character => {
  const character = new Character();
  character.level = level;
  character.health = health;
  character.alive = alive;
  return character;
};

describe('Character damage and health', () => {
  it('new character has 1000 health and is alive', () => {
    const character = createCharacter();

    expect(character.health).toBe(1000);
    expect(character.alive).toBe(true);
  });

  it('dealing damage reduces target health', () => {
    const attacker = createCharacter();
    const target = createCharacter();

    attacker.dealDamage(target, 100);

    expect(target.health).toBe(900);
  });

  it('health does not go below 0', () => {
    const attacker = createCharacter();
    const target = createCharacter(50);

    attacker.dealDamage(target, 200);

    expect(target.health).toBe(0);
  });

  it('target dies when health reaches 0', () => {
    const attacker = createCharacter();
    const target = createCharacter(100);

    attacker.dealDamage(target, 100);

    expect(target.alive).toBe(false);
  });

  it('character cannot deal damage to itself', () => {
    const character = createCharacter();

    expect(() => character.dealDamage(character, 100)).toThrowError(
      'A character cannot deal damage to itself',
    );
    expect(character.health).toBe(1000);
    expect(character.alive).toBe(true);
  });

  it('when a living character heals after taking damage then health is restored by the healed amount', () => {
    const character = createCharacter(700);

    character.heal(200);

    expect(character.health).toBe(900);
    expect(character.alive).toBe(true);
  });

  it('when a living character heals beyond max health then health is capped at 1000', () => {
    const character = createCharacter(950);

    character.heal(200);

    expect(character.health).toBe(1000);
  });

  it('when a dead character attempts to heal then health remains unchanged', () => {
    const character = createCharacter(0, 1, false);

    character.heal(200);

    expect(character.health).toBe(0);
    expect(character.alive).toBe(false);
  });
});

describe('Character levels and damage modifiers', () => {
  it('when a character is created then level starts at 1', () => {
    const character = createCharacter();

    expect(character.level).toBe(1);
  });

  it('when target level is within 4 levels of attacker then damage is not modified', () => {
    const attacker = createCharacter(1000, 1);
    const target = createCharacter(1000, 5);

    attacker.dealDamage(target, 100);

    expect(target.health).toBe(900);
  });

  it('when target is 5 or more levels above attacker then damage is reduced by half', () => {
    const attacker = createCharacter(1000, 1);
    const target = createCharacter(1000, 6);

    attacker.dealDamage(target, 100);

    expect(target.health).toBe(950);
  });

  it('when target is 5 or more levels below attacker then damage is increased by 50 percent', () => {
    const attacker = createCharacter(1000, 6);
    const target = createCharacter(1000, 1);

    attacker.dealDamage(target, 100);

    expect(target.health).toBe(850);
  });

  it('when character level is 5 then max health remains 1000', () => {
    const character = createCharacter(1000, 5);

    expect(character.maxHealth).toBe(1000);
  });

  it('when character level is 6 then max health increases to 1500', () => {
    const character = createCharacter(1000, 6);

    expect(character.maxHealth).toBe(1500);
  });

  it('when a level 6 character heals then health cannot exceed 1500', () => {
    const character = createCharacter(1450, 6);

    character.heal(200);

    expect(character.health).toBe(1500);
  });
});

describe('Character factions', () => {
  it('when a character is created then it belongs to no factions', () => {
    const character = createCharacter();

    expect(character.factions.size).toBe(0);
  });

  it('when a character joins a faction then that faction is added', () => {
    const character = createCharacter();

    character.joinFaction('Knights');

    expect(character.factions.has('Knights')).toBe(true);
  });

  it('when a character leaves a faction then that faction is removed', () => {
    const character = createCharacter();
    character.joinFaction('Knights');

    character.leaveFaction('Knights');

    expect(character.factions.has('Knights')).toBe(false);
  });

  it('when two allied characters attempt damage then target health does not change', () => {
    const attacker = createCharacter();
    const target = createCharacter();
    attacker.joinFaction('Knights');
    target.joinFaction('Knights');

    attacker.dealDamage(target, 100);

    expect(target.health).toBe(1000);
  });

  it('when two non-allied characters deal damage then target health is reduced', () => {
    const attacker = createCharacter();
    const target = createCharacter();
    attacker.joinFaction('Knights');
    target.joinFaction('Mages');

    attacker.dealDamage(target, 100);

    expect(target.health).toBe(900);
  });

  it('when an ally heals another ally then target health increases up to max health', () => {
    const healer = createCharacter();
    const target = createCharacter(700);
    healer.joinFaction('Knights');
    target.joinFaction('Knights');

    healer.heal(target, 200);

    expect(target.health).toBe(900);
  });

  it('when a non-ally heals another character then target health remains unchanged', () => {
    const healer = createCharacter();
    const target = createCharacter(700);
    healer.joinFaction('Knights');
    target.joinFaction('Mages');

    healer.heal(target, 200);

    expect(target.health).toBe(700);
  });

  it('when a character shares any faction then they are allies and cannot damage each other', () => {
    const attacker = createCharacter();
    const target = createCharacter();
    attacker.joinFaction('Knights');
    attacker.joinFaction('Hunters');
    target.joinFaction('Mages');
    target.joinFaction('Hunters');

    attacker.dealDamage(target, 100);

    expect(target.health).toBe(1000);
  });
});

