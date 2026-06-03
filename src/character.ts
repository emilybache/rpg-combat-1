import { FactionMembership } from './faction-membership.ts';
import { LevelUpRequirements } from './level-up-requirements.ts';

export class Character {
  level = 1;

  health = 1000;

  alive = true;

  survivedDamage = 0;

  private readonly factionMembership = new FactionMembership();

  private readonly levelUpRequirements = new LevelUpRequirements();

  readonly factions = this.factionMembership.factions;

  get maxHealth(): number {
    return this.level >= 6 ? 1500 : 1000;
  }

  dealDamage(target: Character, amount: number): void {
    if (target === this || this.isAllyOf(target)) {
      return;
    }

    const modifiedAmount = this.getModifiedDamageAmount(target, amount);
    target.receiveDamage(modifiedAmount);
  }

  receiveDamage(amount: number): void {
    if (amount <= 0 || !this.alive) {
      return;
    }

    this.health = Math.max(0, this.health - amount);
    this.alive = this.health > 0;

    if (this.alive) {
      this.survivedDamage += amount;
      this.levelUpIfEarned();
    }
  }

  heal(amount: number): void;
  heal(target: Character, amount: number): void;
  heal(targetOrAmount: Character | number, maybeAmount?: number): void {
    if (typeof targetOrAmount === 'number') {
      this.healTarget(this, targetOrAmount);
      return;
    }

    this.healTarget(targetOrAmount, maybeAmount ?? 0);
  }

  joinFaction(faction: string): void {
    this.factionMembership.join(faction);
    this.levelUpIfEarned();
  }

  leaveFaction(faction: string): void {
    this.factionMembership.leave(faction);
  }

  private isAllyOf(other: Character): boolean {
    return this.factionMembership.sharesFactionWith(other.factionMembership);
  }

  private canHeal(target: Character): boolean {
    return target === this || this.isAllyOf(target);
  }

  private healTarget(target: Character, amount: number): void {
    if (!this.canHeal(target)) {
      return;
    }

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

  private levelUpIfEarned(): void {
    while (
      this.levelUpRequirements.shouldLevelUp(
        this.level,
        this.survivedDamage,
        this.factionMembership.distinctEverJoinedCount,
      )
    ) {
      this.level += 1;
    }
  }
}
