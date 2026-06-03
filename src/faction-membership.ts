export class FactionMembership {
  readonly factions = new Set<string>();

  join(faction: string): void {
    this.factions.add(faction);
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
