# API authentication

The frontend signs in through POST /api/auth/login with a JSON body containing
username and password. Development proxies /api to the gateway on port 9000.
Production hosting must also forward /api to the gateway.

The response must contain access_token (a JWT with sub and exp claims) and
expires_in (seconds). The token stays in memory. Reload and expiry require
sign-in again. Sign Out clears the local session, profile, basket, and checkout;
it does not revoke the server token. No refresh or revocation API is configured.
Decoded claims populate the UI only; protected APIs must validate authorization.

The frontend does not initialize a Keycloak client, contact Keycloak, or open
hosted authentication popups. Any identity-provider configuration and client
secrets belong in the backend. VITE_KEYCLOAK_* settings are not used.

Registration, password recovery, and account editing display an unavailable
message until corresponding API endpoints are provided. Account and checkout
routes still require login. Catalog browsing remains public.

The existing basket persistence key is retained for browser data compatibility.
Authentication and tokens are not persisted.

Run yarn test:auth and yarn build:dev to verify the frontend integration.
