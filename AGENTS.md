**ALWAYS** start replies with ⚔️.

## What this project is

An implementation of the RPG Combat rules engine. There are six user stories described in [user-stories.md](user-stories.md)

## Development Policies

* We have a zero defects policy, so never continue when there are errors, warnings or test failures, even when they are pre-existing. ALWAYS report these to the user and discuss an action plan with root cause analysis. (see TDD below).
* ALWAYS ask the user for permission when you want to add a fallback, or are unsure something work. The user can perform exploratory testing.
* Always fix failing tests, credo issues and format isseus.
* When developing new features, we apply TDD. Work Test-First, and Refactor when all tests are passing.
* If you believe an issue is pre-existing, stop work, and have a conversation with the user on how to address the pre-existing issue, as well as how to prevent this in the future.

## Build and Test Scripts

- `npm test`: runs unit tests using vitest
- `npm run lint:fix`: runs eslint with autofix
- `npm run format:fix`: runs prettier with autofix
- `npm run typecheck`: runs tsc without emit
- `npm run checks`: runs the pre-commit gate (format:fix, lint:fix, typecheck, test)

## Skills

* When designing unit test cases: .agents/skills/unit-test-design/SKILL.md
