import { Character } from './character.ts';

export const createCharacter = (health = 1000, level = 1, alive = health > 0): Character => {
  const character = new Character();
  character.level = level;
  character.health = health;
  character.alive = alive;
  return character;
};
