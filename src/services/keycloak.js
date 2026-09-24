import Keycloak from 'keycloak-js';
import createGatewaySession from './gatewaySession';

const configuration = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
};
let keycloak = new Keycloak(configuration);

let initialization;
export const initializeKeycloak = () => {
  if (!initialization) {
    initialization = keycloak.init({
      pkceMethod: 'S256',
      // Visiting the storefront does not authenticate the visitor.
      checkLoginIframe: false
    });
  }
  return initialization;
};

export const getAuthorizationHeaders = async () => {
  if (!keycloak?.authenticated) return {};
  try {
    await keycloak.updateToken(30);
    return { Authorization: `Bearer ${keycloak.token}` };
  } catch (error) {
    keycloak.clearToken();
    throw new Error('Your session expired. Please sign in again.');
  }
};

const replaceSession = (next) => {
  const previous = keycloak;
  const callbacks = ['onAuthLogout', 'onAuthRefreshSuccess', 'onTokenExpired'];
  const session = next;
  callbacks.forEach((name) => { session[name] = previous[name]; previous[name] = undefined; });
  previous.clearToken();
  keycloak = next;
  initialization = Promise.resolve(true);
  window.dispatchEvent(new Event('shop-auth-changed'));
};

export const acceptGatewaySession = (tokens) => {
  const createAccountUrl = keycloak.createAccountUrl.bind(keycloak);
  replaceSession(createGatewaySession(tokens, createAccountUrl));
};

export const acceptPopupSession = async (tokens) => {
  const next = new Keycloak(configuration);
  const authenticated = await next.init({
    pkceMethod: 'S256',
    checkLoginIframe: false,
    token: tokens.token,
    refreshToken: tokens.refreshToken,
    idToken: tokens.idToken
  });
  if (!authenticated) throw new Error('Sign-in could not be completed. Please try again.');
  replaceSession(next);
};

export const createPopupClient = () => new Keycloak(configuration);
export { keycloak as default };
