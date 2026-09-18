import { acceptPopupSession, createPopupClient } from './keycloak';

const MESSAGE = 'shop-signin-result';
let activePopup;

export const openSignInPopup = (register = false) => {
  if (activePopup && !activePopup.closed) {
    activePopup.focus();
    return Promise.reject(new Error('Please finish sign-in in the open window.'));
  }
  const requestId = crypto.randomUUID();
  const url = new URL('/auth/popup', window.location.origin);
  url.searchParams.set('request', requestId);
  url.searchParams.set('mode', register ? 'register' : 'login');
  // Open synchronously inside the click handler to avoid popup blockers.
  const popup = window.open(url.href, 'shop-signin', 'popup=yes,width=560,height=760');
  if (!popup) return Promise.reject(new Error('Please allow popups for this shop and try again.'));
  activePopup = popup;

  return new Promise((resolve, reject) => {
    let received = false;
    const cleanup = () => {
      window.removeEventListener('message', onMessage);
      clearInterval(closedTimer);
      clearTimeout(timeout);
      if (!popup.closed) popup.close();
      activePopup = null;
    };
    const onMessage = async (event) => {
      if (received || event.origin !== window.location.origin || event.source !== popup
        || event.data?.type !== MESSAGE || event.data?.requestId !== requestId) return;
      received = true;
      clearInterval(closedTimer);
      clearTimeout(timeout);
      try {
        if (event.data.error || typeof event.data.token !== 'string'
          || typeof event.data.refreshToken !== 'string') {
          throw new Error('Sign-in was not completed. Please try again.');
        }
        await acceptPopupSession(event.data);
        cleanup();
        resolve();
      } catch (error) {
        cleanup();
        reject(new Error('Sign-in could not be completed. Please try again.'));
      }
    };
    const closedTimer = setInterval(() => {
      if (popup.closed && !received) {
        cleanup();
        reject(new Error('Sign-in window closed. You can try again.'));
      }
    }, 500);
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Sign-in timed out. Please try again.'));
    }, 5 * 60 * 1000);
    window.addEventListener('message', onMessage);
  });
};

export const runSignInPopup = async () => {
  const callback = window.location.pathname === '/auth/popup-callback';
  const requestId = callback ? sessionStorage.getItem('shop-signin-request')
    : new URLSearchParams(window.location.search).get('request');
  if (!window.opener || !requestId) throw new Error('Open sign-in from the shop to continue.');
  const client = createPopupClient();
  try {
    await client.init({ pkceMethod: 'S256', checkLoginIframe: false });
    if (!callback) {
      sessionStorage.setItem('shop-signin-request', requestId);
      const options = { redirectUri: `${window.location.origin}/auth/popup-callback` };
      const register = new URLSearchParams(window.location.search).get('mode') === 'register';
      await (register ? client.register(options) : client.login(options));
      return;
    }
    if (!client.authenticated) throw new Error('Sign-in was not completed.');
    window.opener.postMessage({
      type: MESSAGE, requestId,
      token: client.token, refreshToken: client.refreshToken, idToken: client.idToken
    }, window.location.origin);
    // The opener refreshes these tokens and closes this window after accepting them.
    sessionStorage.removeItem('shop-signin-request');
  } catch (error) {
    window.opener.postMessage({ type: MESSAGE, requestId, error: true }, window.location.origin);
    throw new Error('Sign-in was not completed. Close this window and try again from the shop.');
  }
};
