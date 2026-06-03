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

  it('when a character attempts to damage itself then health remains unchanged', () => {
    const character = createCharacter();

    character.dealDamage(character, 100);

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

describe('Character changing level via survived damage', () => {
  it('when a level 1 character survives 1000 damage then they level up to level 2', () => {
    const character = new Character();
    character.survivedDamage = 999;

    character.receiveDamage(1);

    expect(character.level).toBe(2);
  });

  it('when damage from multiple attacks accumulates to the threshold then the character levels up', () => {
    const character = new Character();

    character.receiveDamage(500);
    character.health = 1000;

    character.receiveDamage(500);

    expect(character.level).toBe(2);
  });

  it('when surplus survived damage carries past a level threshold then it counts toward the next level', () => {
    // Character is at level 2 with 200 surplus past the level-2 threshold (1000).
    // With a per-level counter, 2000 more would be required; with cumulative tracking,
    // only 1800 more is needed to reach the level-3 threshold of 3000 total.
    const character = new Character();
    character.level = 2;
    character.survivedDamage = 1200; // 200 surplus past the level-2 threshold of 1000

    character.receiveDamage(900); // health: 100, survivedDamage: 2100
    character.health = 1000;
    character.receiveDamage(900); // health: 100, survivedDamage: 3000 → level 3

    expect(character.level).toBe(3);
  });

  it('when a character receives lethal damage then they do not level up', () => {
    const character = new Character();
    character.survivedDamage = 999;

    character.receiveDamage(1000); // kills the character

    expect(character.alive).toBe(false);
    expect(character.level).toBe(1);
  });

  it('when a level 2 character survives an additional 2000 damage then they level up to level 3', () => {
    const character = new Character();
    character.level = 2;
    character.survivedDamage = 2999; // 1 short of level-3 threshold (3000)

    character.receiveDamage(1);

    expect(character.level).toBe(3);
  });

  it('when a character at level 9 reaches the 45000 survived damage threshold then they level up to level 10 but not beyond', () => {
    const character = new Character();
    character.level = 9;
    character.survivedDamage = 44999; // 1 short of level-10 threshold (45000)

    character.receiveDamage(1); // reaches 45000 → level 10

    expect(character.level).toBe(10);

    character.receiveDamage(100); // more survived damage beyond cap

    expect(character.level).toBe(10);
  });

  it('when a character has gained a level then their level cannot decrease from taking further damage', () => {
    const character = new Character();
    character.level = 2;
    character.survivedDamage = 1000; // exactly at level-2 threshold

    character.receiveDamage(100); // survivedDamage becomes 1100, still below level-3 threshold

    expect(character.level).toBe(2);
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

describe('Character changing level via distinct factions ever joined', () => {
  it('when a level 1 character joins 3 distinct factions then they level up to level 2', () => {
    const character = createCharacter();

    character.joinFaction('Knights');
    character.joinFaction('Mages');
    character.joinFaction('Hunters');

    expect(character.level).toBe(2);
  });

  it('when a character re-joins a faction then it does not count as a new distinct faction for levelling', () => {
    const character = createCharacter();

    character.joinFaction('Knights');
    character.leaveFaction('Knights');
    character.joinFaction('Knights');
    character.joinFaction('Mages');

    expect(character.level).toBe(1);

    character.joinFaction('Hunters');

    expect(character.level).toBe(2);
  });

  it('when a character leaves factions then historical distinct faction progress is still kept', () => {
    const character = createCharacter();

    character.joinFaction('Knights');
    character.joinFaction('Mages');
    character.joinFaction('Hunters');
    character.leaveFaction('Knights');
    character.leaveFaction('Mages');
    character.leaveFaction('Hunters');
    character.joinFaction('Rangers');
    character.joinFaction('Monks');
    character.joinFaction('Bards');

    expect(character.level).toBe(3);
  });

  it('when a level 2 character has joined only 5 total distinct factions then they remain level 2 until the 6th', () => {
    const character = createCharacter();

    character.joinFaction('Knights');
    character.joinFaction('Mages');
    character.joinFaction('Hunters');
    character.joinFaction('Rangers');
    character.joinFaction('Monks');

    expect(character.level).toBe(2);

    character.joinFaction('Bards');

    expect(character.level).toBe(3);
  });

  it('when a character levels via damage first then later faction-based levelling still works', () => {
    const character = createCharacter();
    character.survivedDamage = 999;

    character.receiveDamage(1);
    character.joinFaction('Knights');
    character.joinFaction('Mages');
    character.joinFaction('Hunters');
    character.joinFaction('Rangers');
    character.joinFaction('Monks');

    expect(character.level).toBe(2);

    character.joinFaction('Bards');

    expect(character.level).toBe(3);
  });

  it('when faction-based progression reaches level 10 then additional distinct factions do not increase level beyond 10', () => {
    const character = createCharacter(1000, 9);

    for (let index = 1; index <= 27; index += 1) {
      character.joinFaction(`Faction-${index}`);
    }

    expect(character.level).toBe(10);

    character.joinFaction('Faction-28');
    character.joinFaction('Faction-29');
    character.joinFaction('Faction-30');

    expect(character.level).toBe(10);
  });
});
