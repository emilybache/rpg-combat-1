---
name: unit-test-design
description: Design unit tests for new functionality.
---

- When you are using this skill, stack replies with this emoji: ✅
- Structure tests with Arrange - Act - Assert. Leave one blank line either side of the Act step, do not use comments.
- Test names should describe what is important about this particular test, including the scenario title and expected outcome
- Some duplication between test cases is ok, I want test cases to be easy to read and understand when they fail. If there is a lot of duplication in setup code and it starts to harm readability, consider options:
  - use a factory method to set up a whole object state in one go
  - use a shared 'beforeEach' method to create objects that are needed for all test cases
