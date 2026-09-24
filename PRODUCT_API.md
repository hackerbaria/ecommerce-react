Product API configuration is selected by the Vite environment mode:

| Command | Environment file | Product API URL |
| --- | --- | --- |
| `npm run dev` | `.env.development` | `/api/product`, proxied to `http://localhost:9000` |
| `npm run build:dev` | `.env.development` | `/api/product` on the hosting origin |
| `npm run build` or `npm run build:prod` | `.env.production` | `/api/product` on the deployed website's origin |

Development serves the UI on http://localhost:5173 and proxies `/api` to the
SpringCommerce gateway on port 9000. Catalog pages require sign-in in Keycloak mode.

Development requests use Vite's same-origin proxy to avoid backend CORS rejection
when the frontend port changes. The proxy removes the browser Origin header
and preserves Authorization headers for backend authentication. Restart `yarn dev`
after updating configuration. Remove any absolute `VITE_PRODUCT_API_URL` override
in `.env.development.local` or the shell to use the proxy.

Hosting for either build mode must route `/api/product` to the backend. For a separate
production API host, create `.env.production.local` with:

```dotenv
VITE_PRODUCT_API_URL=https://your-api.example.com/api/product
```

Use `.env.development.local` for local development overrides. These local
files are ignored by Git. Mode-specific values override shared values in
`.env`; existing Firebase settings remain there. To use separate Firebase
projects, set the same `VITE_FIREBASE_*` variables in each mode's local file.
Environment variables supplied by the shell take precedence over env files.

Restart the dev server after changing configuration. Build URLs are embedded
at build time, so rebuild before deploying configuration changes.
`npm run serve` previews the last build; it does not select a new environment.
All `VITE_*` values are public browser configuration; do not put server secrets
in them.

The endpoint must return the complete product list as a JSON array or
`{ "products": [...] }`. Each product must have an `id` and the existing UI
fields, such as `name`, `description`, `price`, `brand`, and `image`.
Numeric IDs are converted to strings for routing and basket comparisons.

The shop renders 12 products initially and reveals another 12 as the user
scrolls, with a manual "Show more products" fallback. Images load lazily.
Filtering applies to the full catalog and resets the visible batch. The API
still returns the full JSON list; reducing that transfer requires server-side
pagination and a corresponding paginated frontend API integration.

Search and product detail lookup use this list. Featured and recommended
sections filter by `isFeatured` and `isRecommended` when the corresponding
boolean field is provided in the catalog. If no products provide that flag,
the section shows the first products in API order, up to its display limit.
Explicit `false` flags are respected; an all-false section stays empty.

The server must allow CORS requests from the frontend origin (normally
`http://localhost:5173`). Development authentication uses Keycloak; tokens are attached to gateway requests.
The basket remains browser-local in Keycloak mode. Production retains Firebase
unless configured otherwise (see KEYCLOAK.md). Admin product/image writes still
use Firebase and therefore do
not update this API's catalog until the backend write integration is added.
