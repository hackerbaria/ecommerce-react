import Preloader from '@/components/common/Preloader';
import 'normalize.css/normalize.css';
import React from 'react';
import { render } from 'react-dom';
import 'react-phone-input-2/lib/style.css';
import '@/styles/style.scss';
import WebFont from 'webfontloader';
import keycloak, { initializeKeycloak } from '@/services/keycloak';
import { runSignInPopup } from '@/services/authPopup';
import { syncKeycloakSession, clearKeycloakSession } from '@/services/keycloakSession';

WebFont.load({
  google: {
    families: ['Tajawal']
  }
});

const root = document.getElementById('app');
render(<Preloader />, root);

const start = async () => {
  if (['/auth/popup', '/auth/popup-callback'].includes(window.location.pathname)) {
    document.title = 'Sign in | Salinaka';
    try {
      await runSignInPopup();
      render(
        <div className="auth-content">
          <h3>Completing sign-in...</h3>
          <p>You can return to the shop.</p>
        </div>, root
      );
    } catch (error) {
      render(<div role="alert">{error.message}</div>, root);
    }
    return;
  }
  let authError;
  try {
    await initializeKeycloak();
  } catch (error) {
    authError = error;
  }
  const [{ default: configureStore }, { default: App }] = await Promise.all([
    import('@/redux/store/store'), import('./App')
  ]);
  const { store, persistor } = configureStore();
  // Wait for persisted basket data before applying the current session.
  await new Promise((resolve) => {
    if (persistor.getState().bootstrapped) { resolve(); return; }
    const unsubscribe = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) { unsubscribe(); resolve(); }
    });
  });
  syncKeycloakSession(store);
  window.addEventListener('shop-auth-changed', () => syncKeycloakSession(store));
  keycloak.onAuthLogout = () => clearKeycloakSession(store);
  keycloak.onAuthRefreshSuccess = () => syncKeycloakSession(store);
  keycloak.onTokenExpired = () => {
    keycloak.updateToken(30).catch(() => keycloak.clearToken());
  };
  render(
    <>
      {authError && <div role="alert">Sign-in is currently unavailable. Reload to retry.</div>}
      <App store={store} persistor={persistor} />
    </>, root
  );
};
start().catch(() => {
  render(<div role="alert">Unable to start the shop. Please reload and try again.</div>, root);
});

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('SW registered: ', registration);
    }).catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
