# Test guidance

Also follow root AGENTS.md. Use react-testing for test changes or diagnosis.

- package.json defines Jest 26, Enzyme 3, enzyme-adapter-react-16, and enzyme-to-json. jest.config.json loads test/setup.js.
- Known inspected mismatch: React is declared as 17, while test/setup.js configures the React 16 Enzyme adapter.
- test/components/App.test.js imports ../../src/client/components/App, but the application component is src/App.jsx and accepts store/persistor props.
- Treat these as existing harness issues. Do not silently replace the test framework, update snapshots, or claim tests pass without running them.
- Before testing Vite-dependent modules, inspect Babel/Jest handling of import.meta.env and the @ alias; Vite's resolution does not automatically configure Jest.
- Mock HTTP, Keycloak, Firebase, and other external services at appropriate boundaries. Tests must not sign into real accounts or mutate remote data.
- Prefer observable regression behavior over snapshots alone. Control timers and async cleanup; restore mocks between cases.
- Run focused tests first with yarn test --runInBand and appropriate Jest filters. Report setup failures separately from product regressions.
