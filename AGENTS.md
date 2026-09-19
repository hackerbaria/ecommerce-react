# Ecommerce React guidance

## Project context
- This is an existing JavaScript/JSX application. package.json declares React 17, Vite 3, React Router 5, Redux 4, React Redux 7, Redux Saga, Redux Persist, Formik/Yup, Firebase 8, and Keycloak JS.
- Inspect package.json and yarn.lock before selecting APIs. Preserve installed versions and JavaScript; framework or TypeScript migrations require task scope.
- Read src/AGENTS.md for application edits and test/AGENTS.md for tests, including when working from the root.
- Preserve user edits, API contracts, auth behavior, and current architecture. Do not modify dist or node_modules as source.
- Keep environment secrets and access tokens out of logs and committed files. Browser-exposed Vite variables must not contain private credentials.

## Skills
- react-development: component, hook, routing, Redux, and service work for this application.
- react-testing: focused tests and diagnosis of the existing Jest/Enzyme harness.
- refactor: focused restructuring while preserving behavior.
- Skills live in .agents/skills; select only those relevant to the task.

## Commands
- Preserve yarn.lock and the established Yarn workflow; do not introduce another lockfile incidentally.
- Existing scripts: yarn dev, yarn build:dev, yarn build:prod, yarn serve, yarn test --runInBand.
- Build scripts write dist and copy index.html to 404.html. Do not hand-edit build output.
- No lint or type-check script is defined. ESLint configuration exists; use a locally installed executable for targeted checks if needed.
- These commands were inspected, not executed during guidance setup. See test/AGENTS.md for known harness mismatches before claiming test coverage.
- For code changes, run applicable checks and report actual outcomes and limitations. Configuration-only Markdown edits do not require an application rebuild.
- The functions directory has a separate package.json; inspect it before changing server-side code. Do not apply browser assumptions there.
