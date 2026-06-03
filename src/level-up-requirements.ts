/**
 * Evaluates whether a character has met the requirements to level up.
 * A character can level up by meeting EITHER the damage requirement OR the faction requirement.
 */
export class LevelUpRequirements {
  /**
   * Checks if a character should level up based on their current progress.
   * Levels cap at 10.
   */
  shouldLevelUp(
    currentLevel: number,
    survivedDamage: number,
    distinctFactionsJoined: number,
  ): boolean {
    if (currentLevel >= 10) {
      return false;
    }

    const damageThreshold = this.getDamageThresholdForLevel(currentLevel);
    const factionThreshold = this.getFactionThresholdForLevel(currentLevel);

    const meetssDamageRequirement = survivedDamage >= damageThreshold;
    const meetsFactionRequirement = distinctFactionsJoined >= factionThreshold;

    return meetssDamageRequirement || meetsFactionRequirement;
  }

  /**
   * Calculates the cumulative damage threshold required to reach the next level from the given level.
   * Formula: level * (level + 1) / 2 * 1000
   * Examples:
   *   - Level 1→2: 1000 total damage
   *   - Level 2→3: 3000 total damage
   *   - Level 9→10: 45000 total damage
   */
  private getDamageThresholdForLevel(level: number): number {
    return (level * (level + 1) * 1000) / 2;
  }

  /**
   * Calculates the distinct faction threshold required to reach the next level from the given level.
   * Formula: level * 3
   * Examples:
   *   - Level 1→2: 3 distinct factions
   *   - Level 2→3: 6 distinct factions
   *   - Level 3→4: 9 distinct factions
   */
  private getFactionThresholdForLevel(level: number): number {
    return level * 3;
  }
}
