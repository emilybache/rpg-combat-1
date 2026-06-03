export class Character {
  health = 1000;

  alive = true;

  dealDamage(target: Character, amount: number): void {
    if (target === this) {
      throw new Error('A character cannot deal damage to itself');
    }

    target.health = Math.max(0, target.health - amount);
    target.alive = target.health > 0;
  }
}
