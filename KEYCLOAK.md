# Keycloak authentication

The shop-styled login theme is in `keycloak/themes/salinaka`. See
[theme installation](keycloak/README.md) for Docker installation and activation.

Development uses `http://localhost:8181`, realm `springcommerce`, and public
client `springcommerce-web`. Restart `yarn dev` after changing env files.

Configure this client in the Keycloak admin console:

- Client authentication: Off (public client; no secret in React).
- Standard flow: On; PKCE method: S256.
- Valid redirect URIs: `http://localhost:5173/auth/popup-callback` and
  `http://localhost:5173/silent-check-sso.html`.
- Valid post logout redirect URIs: `http://localhost:5173`.
- Web origins: `http://localhost:5173`.
- Realm settings → Login → User registration: On.
- Enable Forgot password and configure SMTP if password recovery is needed.

Signup and login open the shop-styled hosted forms in a popup. The shop tab stays
in place. Add `http://localhost:5173/auth/popup-callback` to valid redirect URIs
(included in the supplied client import). Production hosting must
serve the React app for `/auth/popup` and `/auth/popup-callback`.
The popup completes Authorization Code + PKCE and passes its session to the opener
using an exact-origin message. The opener checks the popup reference and a unique
request ID, refreshes the session, then closes the popup. Tokens are never saved
to local/session storage. Only the popup correlation ID is stored in sessionStorage.
Do not configure Cross-Origin-Opener-Policy headers that sever this popup's opener;
verify the flow against your deployed headers.

Startup initializes the client without checking SSO or opening a login redirect.
The landing page and product catalog are public, including featured and recommended
products. Users click Sign In to authenticate in a popup.
Reloading starts signed out until the user signs in again; an existing Keycloak
server session may complete the popup without asking for credentials. Popups
must be allowed for the shop. Account settings open in a separate tab; logout
still uses the normal server logout redirect. Session expiry is detected during
token refresh. Public product reads do not send an Authorization header.
The Spring backend must
validate issuer/audience and authorize protected requests; frontend route checks
are only for navigation. The development proxy forwards `/api` to the gateway on port 9000.
For a separate API origin in production, configure gateway CORS for the exact
frontend origin and Authorization header.

The login theme removes visible provider branding, but the popup address bar still
shows the server hostname. For a branded production experience, deploy the identity
server on a domain such as `auth.yourshop.com`, configure its public hostname and
TLS, and set `VITE_KEYCLOAK_URL` accordingly. The backend issuer must match this
public URL. Frontend code cannot hide the identity provider from network inspection.

The account page displays identity claims; Edit Account opens Keycloak's account
console. Keycloak does not supply the old Firebase account creation date, shipping
profile, or product administration data. Keycloak users receive storefront access
only until backend authorization and admin write endpoints are integrated.
Basket data is stored in this browser, not Firebase; logout clears it and checkout
state. No server profile/basket synchronization is implemented.

Production keeps the existing Firebase mode until deployment configuration is
provided. To enable Keycloak in production, add `.env.production.local`:

```dotenv
VITE_AUTH_PROVIDER=keycloak
VITE_KEYCLOAK_URL=https://your-keycloak.example.com
VITE_KEYCLOAK_REALM=springcommerce
VITE_KEYCLOAK_CLIENT_ID=springcommerce-web
```

Register the production frontend redirect, logout, and origin URLs in Keycloak
and rebuild. Never use localhost as the production identity server URL.

Verification: open `/signup`, create a test account on Keycloak, confirm the app
shows the signed-in user, reload to verify the public landing page, then sign out and confirm protected
routes require login. Also try signing in from checkout to check the return path.

Reference: https://www.keycloak.org/securing-apps/javascript-adapter

## SpringCommerce workspace setup

Run the backend with `./start.ps1` from the parent SpringCommerce directory.
Then run `yarn dev` here and open **http://localhost:5173**. Grafana keeps port 3000.
Vite uses strictPort so it fails clearly rather than changing the OAuth origin.

For a **new** Keycloak database, the parent realm import creates the public
`springcommerce-web` client, requires PKCE S256, enables signup, and selects
this shop's login theme. Docker Compose mounts the theme from this project.

For an **existing** realm, startup import does not update it. In the Keycloak
admin console, select `springcommerce`, then Clients > Import client and choose
`keycloak/springcommerce-web.json`. If that client already exists, update its
redirect URLs, web origins, logout URL, PKCE and login theme to match this file.
Enable User registration in Realm settings > Login to use signup. Recreate the
Keycloak service with `docker compose up -d keycloak` from the parent directory
to apply the theme mount. Preserve its database; no reset is needed.

Catalog pages allow guest browsing in both authentication modes. The gateway must
permit anonymous GET requests to `/api/product` and `/api/product/**`, while
keeping product writes and other protected APIs authenticated.

Verify: open `/shop` while signed out and check `/api/product` succeeds through
the gateway. Refresh and verify products remain visible without signing in.
Account and checkout pages still require login. Registration uses Keycloak's
hosted form. Password recovery additionally needs realm SMTP configuration.

## Focused checks

Run `yarn test:auth` for route protection, login return paths, registration
navigation and popup failure regression tests. This uses React DOM and the
existing Jest installation, without the legacy React 16 Enzyme adapter.
Run `yarn build:dev` and `yarn build:prod` to verify both environment modes.
Production authentication remains deployment-configured as described above.
