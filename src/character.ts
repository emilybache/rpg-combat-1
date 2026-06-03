export class Character {
  level = 1;

  health = 1000;

  alive = true;

  readonly factions = new Set<string>();

  get maxHealth(): number {
    return this.level >= 6 ? 1500 : 1000;
  }

  dealDamage(target: Character, amount: number): void {
    if (target === this) {
      throw new Error('A character cannot deal damage to itself');
    }

    if (this.isAllyOf(target)) {
      return;
    }

    const modifiedAmount = this.getModifiedDamageAmount(target, amount);

    target.health = Math.max(0, target.health - modifiedAmount);
    target.alive = target.health > 0;
  }

  heal(amount: number): void;
  heal(target: Character, amount: number): void;
  heal(targetOrAmount: Character | number, maybeAmount?: number): void {
    if (typeof targetOrAmount === 'number') {
      this.applyHealingTo(this, targetOrAmount);
      return;
    }

    const target = targetOrAmount;
    const amount = maybeAmount ?? 0;

    if (target !== this && !this.isAllyOf(target)) {
      return;
    }

    this.applyHealingTo(target, amount);
  }

  joinFaction(faction: string): void {
    this.factions.add(faction);
  }

  leaveFaction(faction: string): void {
    this.factions.delete(faction);
  }

  private isAllyOf(other: Character): boolean {
    for (const faction of this.factions) {
      if (other.factions.has(faction)) {
        return true;
      }
    }

    return false;
  }

  private applyHealingTo(target: Character, amount: number): void {
    if (!target.alive) {
      return;
    }

    target.health = Math.min(target.maxHealth, target.health + amount);
  }

  private getModifiedDamageAmount(target: Character, amount: number): number {
    if (target.level >= this.level + 5) {
      return amount * 0.5;
    }

    if (target.level <= this.level - 5) {
      return amount * 1.5;
    }

    return amount;
  }
}
