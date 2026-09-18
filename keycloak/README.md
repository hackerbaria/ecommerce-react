# Salinaka login theme

The `salinaka` theme matches the React shop's logo, Tajawal typography, neutral
backgrounds, square fields and black buttons. It extends the built-in `keycloak`
login theme, retaining the server's login, registration, recovery, validation,
social provider and MFA templates. Assets and fonts are served locally by Keycloak.
Tajawal's license is included in `resources/fonts/OFL.txt`.

## Local Docker installation

From this repository:

```powershell
docker cp keycloak/themes/salinaka keycloak:/opt/keycloak/themes/salinaka
```

In `http://localhost:8181/admin/`, select **springcommerce**, then **Realm settings
→ Themes → Login theme → salinaka**, and save. If the frontend client has a Login
theme override under Clients → springcommerce-web, clear it or select salinaka.
Open signup/signin from the shop to see the theme. User registration must be enabled
under Realm settings → Login for the signup form to appear.

Copying into a running container survives a restart, but not container recreation.
For persistence, add this volume to your existing Keycloak Compose service:

```yaml
services:
  keycloak:
    volumes:
      - "C:/working/ecommerce-react/keycloak/themes/salinaka:/opt/keycloak/themes/salinaka:ro"
```

Keep all existing service configuration, ports and database volumes. Recreate the
Keycloak service through your existing Compose project after adding the mount.
For deployment, copy the theme into the same path in your existing Keycloak image.

The local server was identified as Keycloak 24.0.1. No custom FreeMarker templates
or password handlers are required. Recheck styling after a Keycloak upgrade.
Theme resources may be cached; restart Keycloak and hard-refresh after updates.

## Verification after activation

- Login: logo, fonts, fields, primary button, error messages and password visibility.
- Signup: all configured profile fields and validation remain visible.
- Recovery and MFA: native controls and keyboard focus remain usable.
- Mobile: form fits narrow viewports without horizontal scrolling.

Changing this theme does not remove the redirect; the form is still hosted by
Keycloak. The account console is a separate theme and remains unchanged.

Reference: https://www.keycloak.org/ui-customization/themes
