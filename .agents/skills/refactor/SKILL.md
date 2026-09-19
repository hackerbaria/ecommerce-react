---
name: refactor
description: Restructure existing Java, JavaScript, or TypeScript code to improve maintainability while preserving behavior. Use for focused refactoring, not framework migrations or new features.
license: MIT
---

# Focused refactoring

Read applicable project guidance, callers, and tests. Identify the concrete maintenance problem and the behavior that must remain stable.

1. Inspect the current diff and preserve unrelated work.
2. Establish relevant checks. Add characterization coverage when important existing behavior lacks protection.
3. Make small, coherent structural changes. Avoid speculative abstractions and unrelated dependency upgrades.
4. Preserve public APIs, error semantics, side-effect order, and asynchronous behavior. For Spring, inspect proxy and transaction boundaries; for UI code, preserve state, subscriptions, and effect cleanup.
5. Run relevant checks and inspect the final diff for accidental behavior changes.

Do not impose new architecture, automatic commits, or arbitrary function-length limits. If a defect is discovered, distinguish its behavioral fix from the requested structural change.

Report the improvement, evidence of preserved behavior, and verification limitations.

Adapted from [awesome-copilot/refactor](https://github.com/github/awesome-copilot/tree/main/skills/refactor). See the repository's THIRD_PARTY_NOTICES.md for attribution.
