import type { Character } from './character.ts';

export class MagicalObject {
  readonly maxHealth: number;

  health: number;

  constructor(maxHealth: number) {
    this.maxHealth = Math.max(0, maxHealth);
    this.health = this.maxHealth;
  }

  get destroyed(): boolean {
    return this.health === 0;
  }

  receiveDamage(amount: number): void {
    if (this.destroyed || amount <= 0) {
      return;
    }

    this.health = Math.max(0, this.health - amount);
  }
}

export class HealingObject extends MagicalObject {
  drawHealth(character: Character, amount: number): number {
    if (this.destroyed || amount <= 0) {
      return 0;
    }

    const availableHealth = Math.min(amount, this.health);
    const beforeHealth = character.health;
    character.heal(availableHealth);
    const transferredHealth = character.health - beforeHealth;

    this.receiveDamage(transferredHealth);
    return transferredHealth;
  }
}

export class MagicalWeapon extends MagicalObject {
  readonly damage: number;

  constructor(maxHealth: number, damage: number) {
    super(maxHealth);
    this.damage = Math.max(0, damage);
  }

  useOn(target: Character): void {
    if (this.destroyed) {
      return;
    }

    target.receiveDamage(this.damage);
    this.receiveDamage(1);
  }
}
