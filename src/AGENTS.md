# React application guidance

Also follow root AGENTS.md.

- Reuse components/common, feature components, hooks, views, routers, services, and existing SCSS organization. The @ alias points to src through Vite.
- Preserve React 17 hooks and PropTypes conventions. Do not introduce React 18/19-only APIs or change Router 5 contracts incidentally.
- Trace Redux actions through sagas/reducers/selectors and persistence before changing state. Keep side effects out of reducers and preserve persisted data compatibility.
- Reuse Formik/Yup field components and validation patterns.
- Read PRODUCT_API.md and services/products.js for product integration. Preserve accepted response shapes, string ID normalization, authorization headers, and timeout/error handling.
- Read KEYCLOAK.md and existing auth/session services before changing authentication. Preserve route guards and inspect Firebase consumers before changing that integration.
- Preserve hook ordering, effect cleanup, list keys, and component identity. Handle loading, empty, failure, and success states for changed UI flows.
- Keep controls keyboard-accessible, forms labeled, and modal focus behavior intact.
- Verify behavior relevant to the change and document any test-harness blockers.
