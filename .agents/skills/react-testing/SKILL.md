---
name: react-testing
description: Add regression coverage or diagnose Jest and Enzyme failures in ecommerce-react, including its React 17 and legacy adapter setup. Use for test work, not automatic testing-framework migration.
---

# React testing

Read test/AGENTS.md, jest.config.json, test/setup.js, Babel settings, package.json, and the affected source before writing tests.

- Distinguish harness failures from behavior regressions. The installed configuration declares React 17 alongside a React 16 adapter and contains an outdated App import; confirm current files before acting.
- Inspect alias resolution, import.meta.env transformation, provider requirements, and async dependencies when selecting a test boundary.
- Prefer behavior assertions for the reported bug. Pure helpers and reducers may be testable independently of component-adapter issues.
- Isolate external HTTP, Firebase, and Keycloak interactions; use deterministic data and restore mocks and timers.
- Do not blindly update snapshots or suppress a failing test to obtain a green run. Repair only harness issues necessary and authorized for the task; explain wider blockers.
- Run focused Jest checks, then applicable broader checks. Report exact commands and whether failures occurred before tests could execute.

Do not add React Testing Library, Vitest, or upgrade React solely because this skill was selected. A framework migration needs its own scope.

Project-specific skill authored from the inspected repository conventions.
