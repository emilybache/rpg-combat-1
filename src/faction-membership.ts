export class FactionMembership {
  readonly factions = new Set<string>();

  private readonly distinctFactionsEverJoined = new Set<string>();

  get distinctEverJoinedCount(): number {
    return this.distinctFactionsEverJoined.size;
  }

  join(faction: string): void {
    this.factions.add(faction);
    this.distinctFactionsEverJoined.add(faction);
  }

  leave(faction: string): void {
    this.factions.delete(faction);
  }

  sharesFactionWith(other: FactionMembership): boolean {
    for (const faction of this.factions) {
      if (other.factions.has(faction)) {
        return true;
      }
    }

    return false;
  }
}
