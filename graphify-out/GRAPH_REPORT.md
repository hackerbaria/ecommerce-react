# Graph Report - ecommerce-react  (2026-09-19)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 745 nodes · 1279 edges · 33 communities (28 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a9defa96`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 31

## God Nodes (most connected - your core abstractions)
1. `react` - 93 edges
2. `prop-types` - 56 edges
3. `rules` - 38 edges
4. `react-redux` - 34 edges
5. `react-router-dom` - 34 edges
6. `Firebase` - 30 edges
7. `redux` - 28 edges
8. `@ant-design/icons` - 27 edges
9. `formik` - 16 edges
10. `productSaga()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `rootSaga()` --indirect_call--> `authSaga()`  [INFERRED]
  src/redux/sagas/rootSaga.js → src/redux/sagas/authSaga.js
- `rootSaga()` --indirect_call--> `productSaga()`  [INFERRED]
  src/redux/sagas/rootSaga.js → src/redux/sagas/productSaga.js
- `rootSaga()` --indirect_call--> `profileSaga()`  [INFERRED]
  src/redux/sagas/rootSaga.js → src/redux/sagas/profileSaga.js
- `profileSaga()` --calls--> `setLoading()`  [EXTRACTED]
  src/redux/sagas/profileSaga.js → src/redux/actions/miscActions.js
- `productSaga()` --calls--> `addProductSuccess()`  [EXTRACTED]
  src/redux/sagas/productSaga.js → src/redux/actions/productActions.js

## Import Cycles
- None detected.

## Communities (33 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (30): ref_constants, redux-persist, redux-saga, ref_routers, ref_services, start(), setLoading(), addProductSuccess() (+22 more)

### Community 1 - "Community 1"
Cohesion: 0.03
Nodes (58): ADD_PRODUCT, ADD_PRODUCT_SUCCESS, ADD_QTY_ITEM, ADD_TO_BASKET, ADD_USER, APPLY_FILTER, CANCEL_GET_PRODUCTS, CLEAR_BASKET (+50 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (20): ref_components, formik, ref_helpers, ref_hooks, ref_images, yup, ConfirmModal(), EditForm() (+12 more)

### Community 3 - "Community 3"
Cohesion: 0.04
Nodes (8): authActions, basketActions, checkoutActions, filterActions, miscActions, productActions, profileActions, userActions

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (43): extends, parserOptions, ecmaVersion, plugins, rules, array-callback-return, callback-return, consistent-return (+35 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (39): author, keywords, license, main, name, version, babel-eslint, copy-webpack-plugin (+31 more)

### Community 6 - "Community 6"
Cohesion: 0.06
Nodes (36): devDependencies, babel-eslint, copy-webpack-plugin, cross-env, css-loader, dotenv, enzyme, enzyme-adapter-react-16 (+28 more)

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (4): firebase, firebaseConfig, Firebase, firebaseInstance

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (27): admin, functions, dependencies, firebase-admin, firebase-functions, description, devDependencies, eslint (+19 more)

### Community 9 - "Community 9"
Cohesion: 0.08
Nodes (25): dependencies, @ant-design/icons, firebase, formik, history, keycloak-js, moment, normalize.css (+17 more)

### Community 11 - "Community 11"
Cohesion: 0.08
Nodes (22): actionType, route, ACCOUNT, ACCOUNT_EDIT, ADD_PRODUCT, ADMIN_DASHBOARD, ADMIN_PRODUCTS, ADMIN_USERS (+14 more)

### Community 12 - "Community 12"
Cohesion: 0.09
Nodes (22): jsx, env, browser, es2021, extends, node, extensions, paths (+14 more)

### Community 13 - "Community 13"
Cohesion: 0.15
Nodes (4): @ant-design/icons, react-redux, redux, SignInSchema

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (15): keycloak-js, openSignInPopup(), runSignInPopup(), acceptPopupSession(), configuration, createPopupClient(), getAuthorizationHeaders(), usesKeycloak (+7 more)

### Community 15 - "Community 15"
Cohesion: 0.19
Nodes (7): ref_views, BasketToggle(), Badge(), FiltersToggle(), Navigation(), Modal(), SearchBar()

### Community 17 - "Community 17"
Cohesion: 0.13
Nodes (3): history, react-router-dom, history

### Community 18 - "Community 18"
Cohesion: 0.14
Nodes (9): react-compound-slider, Handle, PriceRange(), sliderStyle, railInnerStyle, railOuterStyle, SliderRail(), Tick() (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.21
Nodes (3): prop-types, react-loading-skeleton, ProductItem()

### Community 20 - "Community 20"
Cohesion: 0.19
Nodes (4): UserTab(), UserAccountTab, UserOrdersTab, UserWishListTab

### Community 21 - "Community 21"
Cohesion: 0.18
Nodes (6): normalize.css, react-dom, react-phone-input-2, ref_styles, webfontloader, root

### Community 22 - "Community 22"
Cohesion: 0.27
Nodes (5): ref_selectors, src_views_admin_components_index_productitem, src_views_admin_components_index_productsnavbar, ProductsNavbar(), ProductsTable()

### Community 23 - "Community 23"
Cohesion: 0.24
Nodes (4): ProductForm, brandOptions, FormSchema, ProductForm

### Community 24 - "Community 24"
Cohesion: 0.22
Nodes (3): railCenterStyle, railStyle, TooltipRail

### Community 25 - "Community 25"
Cohesion: 0.29
Nodes (6): compilerOptions, baseUrl, jsx, noUnusedLocals, noUnusedParameters, include

### Community 26 - "Community 26"
Cohesion: 0.29
Nodes (7): scripts, build, build:dev, build:prod, dev, serve, test

### Community 27 - "Community 27"
Cohesion: 0.29
Nodes (6): ref_workbox_core, ref_workbox_expiration, ref_workbox_precaching, ref_workbox_routing, ref_workbox_strategies, currentCacheNames

### Community 28 - "Community 28"
Cohesion: 0.33
Nodes (4): dotenv, enzyme, enzyme-adapter-react-16, ref_src_client_components_app

### Community 31 - "Community 31"
Cohesion: 0.50
Nodes (3): ref_path, vite, @vitejs/plugin-react

## Knowledge Gaps
- **294 isolated node(s):** `defaultState`, `initState`, `initState`, `initState`, `authPersistConfig` (+289 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 475 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Community 10` to `Community 0`, `Community 2`, `Community 5`, `Community 13`, `Community 15`, `Community 16`, `Community 17`, `Community 18`, `Community 19`, `Community 20`, `Community 21`, `Community 22`, `Community 23`, `Community 24`, `Community 28`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 6` to `Community 5`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Why does `firebase` connect `Community 7` to `Community 5`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **What connects `defaultState`, `initState`, `initState` to the rest of the system?**
  _294 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05803571428571429 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.03389830508474576 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07467532467532467 - nodes in this community are weakly interconnected._