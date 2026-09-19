---
name: react-development
description: Implement or review components, hooks, routing, Redux flows, and API integration in ecommerce-react. Use for this React application's JavaScript code, not unrelated server-side work.
---

# React development

Read root and src/AGENTS.md, package.json, and the nearest comparable implementation. Work with the current React 17, Router 5, JavaScript, SCSS, and Redux/Saga architecture.

1. Trace the affected UI through hooks, state, and service calls. Establish the observable behavior and contracts to preserve.
2. Reuse existing components, Formik fields, selectors, and API/auth clients. Add abstractions only when they simplify this task.
3. Preserve hook order, effect cleanup, stable keys, and state ownership. Consider stale responses and cleanup for asynchronous requests.
4. Match existing loading/error states, accessible controls, and responsive styles.
5. For product or authentication changes, consult PRODUCT_API.md or KEYCLOAK.md and inspect the actual services. Preserve ID normalization, token handling, and route guards.
6. Verify changed behavior with available checks. Consult test/AGENTS.md before relying on the legacy test harness.

Report changes, validation results, and limitations. Do not bundle framework, router, or state-library migrations into ordinary component work.

Project-specific skill authored from the inspected repository conventions.
