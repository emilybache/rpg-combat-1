export class Character {
  level = 1;

  health = 1000;

  alive = true;

  get maxHealth(): number {
    return this.level >= 6 ? 1500 : 1000;
  }

  dealDamage(target: Character, amount: number): void {
    if (target === this) {
      throw new Error('A character cannot deal damage to itself');
    }

    target.health = Math.max(0, target.health - amount);
    target.alive = target.health > 0;
  }

  heal(amount: number): void {
    if (!this.alive) {
      return;
    }

    this.health = Math.min(this.maxHealth, this.health + amount);
  }
}
