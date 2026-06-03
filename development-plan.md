# Development Plan — RPG Combat

## Overview

We implement the RPG Combat rules engine in TypeScript using **TDD** (test-first, then refactor).
Each iteration delivers one vertical slice of the user-stories, always leaving the build green.

---

## Tech Stack

| Concern | Tool |
|---|---|
| Language | TypeScript (ESM) |
| Unit tests | Vitest |
| Linting | ESLint + typescript-eslint |
| Formatting | Prettier |
| Type-checking | tsc |
| Pre-commit gate | `npm run checks` |

---

## Iteration 0 — Project skeleton (no production code yet)

**Goal:** agree on the module structure before writing any logic.

### Proposed source layout

```
src/
  character.ts          # Character entity
  magical-object.ts     # MagicalObject base / subtypes
  index.ts              # barrel export
test/
  character.test.ts
  magical-object.test.ts
```

**Done when:** `npm run checks` passes with an empty (but valid) source tree.

---

## Iteration 1 — Damage and Health

Covers **user story: Damage and Health**.

### Rules
- Characters start with Health = 1000 and status = Alive.
- `dealDamage(target, amount)` subtracts `amount` from target's health.
- Health never goes below 0; reaching 0 sets status to Dead.
- A Character cannot deal damage to itself.

### TDD cycles

| # | Test name | Arrange | Act | Assert |
|---|---|---|---|---|
| 1 | `new character has 1000 health and is alive` | — | `new Character()` | health=1000, alive=true |
| 2 | `dealing damage reduces target health` | attacker & target at 1000 hp | `attacker.dealDamage(target, 100)` | target.health = 900 |
| 3 | `health does not go below 0` | target at 50 hp | `attacker.dealDamage(target, 200)` | target.health = 0 |
| 4 | `target dies when health reaches 0` | target at 100 hp | `attacker.dealDamage(target, 100)` | target.alive = false |
| 5 | `character cannot deal damage to itself` | one character | `char.dealDamage(char, 100)` | throws / no-op (health unchanged) |

### Production code
- `Character` class with `health`, `alive`, `dealDamage(target, amount)`.

---

## Iteration 2 — Healing

Covers **user story: Damage and Health §3**.

### Rules
- `heal(amount)` restores health up to the character's maximum (1000 at levels 1-5, 1500 at level ≥ 6).
- Dead characters cannot heal.

### TDD cycles

| # | Test name |
|---|---|
| 1 | `healing restores health` |
| 2 | `healing does not exceed max health (1000)` |
| 3 | `dead character cannot heal` |

---

## Iteration 3 — Levels & damage modifiers

Covers **user story: Levels**.

### Rules
- Characters start at level 1.
- Max health cap is 1000 (levels 1-5) / 1500 (level ≥ 6).
- Damage modifier when `dealDamage` is called:
  - target ≥ attacker + 5 → damage × 0.5
  - target ≤ attacker − 5 → damage × 1.5

### TDD cycles

| # | Test name |
|---|---|
| 1 | `new character is level 1` |
| 2 | `no modifier when levels are within 4 of each other` |
| 3 | `damage is halved when target is 5+ levels above attacker` |
| 4 | `damage is increased 50% when target is 5+ levels below attacker` |
| 5 | `max health is 1000 at level 5` |
| 6 | `max health increases to 1500 at level 6` |
| 7 | `healing cannot exceed new max health at level 6` |

---

## Iteration 4 — Factions

Covers **user story: Factions**.

### Rules
- Characters start with no factions.
- `joinFaction(faction)` / `leaveFaction(faction)`.
- Two characters sharing ≥ 1 faction are Allies.
- Allies cannot deal damage to each other.
- Only Allies (or the character themselves, for self-heal) can heal a character.

### TDD cycles

| # | Test name |
|---|---|
| 1 | `new character belongs to no factions` |
| 2 | `character can join a faction` |
| 3 | `character can leave a faction` |
| 4 | `allies cannot deal damage to each other` |
| 5 | `non-allies can deal damage to each other` |
| 6 | `ally can heal another ally` |
| 7 | `non-ally cannot heal another character` |
| 8 | `character in multiple factions is ally of each faction's members` |

---

## Iteration 5 — Magical Objects

Covers **user story: Magical Objects §1-3**.

### Rules
- `MagicalObject` has a fixed maximum health set at creation; starts at that maximum.
- Reduced to 0 → Destroyed.
- Two subtypes:
  - `HealingObject`: characters can draw health from it (up to their max and the object's remaining health); cannot deal damage.
  - `MagicalWeapon`: deals a fixed amount of damage; health −1 each use; cannot give health.
- Magical Objects do not belong to factions.
- Characters cannot heal a Magical Object.

### TDD cycles

| # | Test name |
|---|---|
| 1 | `magical object starts at its maximum health` |
| 2 | `magical object is destroyed when health reaches 0` |
| 3 | `healing object restores character health up to character max` |
| 4 | `healing object restores character health up to object's remaining health` |
| 5 | `healing object cannot deal damage` |
| 6 | `magical weapon deals fixed damage` |
| 7 | `magical weapon loses 1 health each use` |
| 8 | `magical weapon cannot give health to a character` |
| 9 | `character cannot heal a magical object` |

---

## Iteration 6 — Changing Level (damage-based)

Covers **user story: Changing Level §1 and §3**.

### Rules
- Level 1 needs 1 000 survived damage to level up; Level N needs N × 1 000 extra damage.
- Levelling happens after damage is received (not during), only if the character is still alive.
- Maximum level is 10; no level is ever lost.

### TDD cycles

| # | Test name |
|---|---|
| 1 | `character levels up after surviving required damage` |
| 2 | `damage can accumulate across multiple attacks` |
| 3 | `dead character does not level up` |
| 4 | `level 2 character needs 2000 more damage to reach level 3` |
| 5 | `character cannot exceed level 10` |
| 6 | `level cannot decrease` |

---

## Iteration 7 — Changing Level (faction-based)

Covers **user story: Changing Level §2**.

### Rules
- Level 1 needs 3 distinct factions joined (ever) to level up; Level N needs N × 3 additional distinct factions.
- Maximum level still 10.

### TDD cycles

| # | Test name |
|---|---|
| 1 | `character levels up after joining 3 distinct factions` |
| 2 | `re-joining a faction does not count as a new distinct faction` |
| 3 | `level 2 character needs 6 total distinct factions to reach level 3` |
| 4 | `faction-based level gain respects level 10 cap` |
| 5 | `damage-based and faction-based level gains are independent and cumulative` |

---

## Cross-cutting concerns & refactoring checkpoints

After each iteration:

1. Run `npm run checks` — fix any lint, format, type or test failure before moving on.
2. Refactor mercilessly while tests are green.
3. Keep `Character` and `MagicalObject` cohesive; extract helpers if they grow large.

---

## Definition of Done

- All Vitest tests pass.
- No TypeScript errors (`npm run typecheck`).
- No ESLint warnings (`npm run lint:fix`).
- Prettier reports no diffs (`npm run format:fix`).
- Every rule from `user-stories.md` is covered by at least one test.

