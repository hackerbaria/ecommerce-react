# Keycloak authentication

The shop-styled login theme is in `keycloak/themes/salinaka`. See
[theme installation](keycloak/README.md) for Docker installation and activation.

Development uses `http://localhost:8181`, realm `springcommerce`, and public
client `springcommerce-web`. Restart `npm run dev` after changing env files.

Configure this client in the Keycloak admin console:

- Client authentication: Off (public client; no secret in React).
- Standard flow: On; PKCE method: S256.
- Valid redirect URIs: `http://localhost:3000/*` for local development.
- Valid post logout redirect URIs: `http://localhost:3000`.
- Web origins: `http://localhost:3000`.
- Realm settings → Login → User registration: On.
- Enable Forgot password and configure SMTP if password recovery is needed.

Signup and login open the shop-styled hosted forms in a popup. The shop tab stays
in place. Add `http://localhost:3000/auth/popup-callback` to valid redirect URIs
(the existing development wildcard already covers it). Production hosting must
serve the React app for `/auth/popup` and `/auth/popup-callback`.
The popup completes Authorization Code + PKCE and passes its session to the opener
using an exact-origin message. The opener checks the popup reference and a unique
request ID, refreshes the session, then closes the popup. Tokens are never saved
to local/session storage. Only the popup correlation ID is stored in sessionStorage.
Do not configure Cross-Origin-Opener-Policy headers that sever this popup's opener;
verify the flow against your deployed headers.

Startup attempts silent SSO without a top-level redirect. If the browser blocks
silent SSO, users can click Sign In to restore their session in the popup. Popups
must be allowed for the shop. Account settings open in a separate tab; logout
still uses the normal server logout redirect. Session expiry is detected during
token refresh. Product requests refresh the access token
before attaching an Authorization bearer header. The Spring backend must
validate issuer/audience and authorize protected requests; frontend route checks
are only for navigation. CORS must allow the Authorization header.

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
shows the signed-in user, reload to verify SSO, then sign out and confirm protected
routes require login. Also try signing in from checkout to check the return path.

Reference: https://www.keycloak.org/securing-apps/javascript-adapter
