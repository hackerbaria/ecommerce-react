import createGatewaySession from './gatewaySession';

let session;
const notifySessionChanged = () => window.dispatchEvent(new Event('shop-auth-changed'));

export const getSession = () => session;

export const acceptGatewaySession = (tokens) => {
  const next = createGatewaySession(tokens);
  if (session) {
    session.onAuthLogout = undefined;
    session.clearToken();
  }
  session = next;
  session.onAuthLogout = notifySessionChanged;
  notifySessionChanged();
};

export const logout = () => {
  if (session) session.clearToken();
};

export const getAuthorizationHeaders = async () => {
  if (!session?.authenticated) return {};
  await session.updateToken();
  return { Authorization: `Bearer ${session.token}` };
};
