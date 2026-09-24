import Preloader from '@/components/common/Preloader';
import 'normalize.css/normalize.css';
import React from 'react';
import { render } from 'react-dom';
import 'react-phone-input-2/lib/style.css';
import '@/styles/style.scss';
import WebFont from 'webfontloader';
import { getSession } from '@/services/authSession';
import { syncAuthSession, clearAuthSession } from '@/services/syncAuthSession';

WebFont.load({
  google: {
    families: ['Tajawal']
  }
});

const root = document.getElementById('app');
render(<Preloader />, root);

const start = async () => {
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
  syncAuthSession(store);
  window.addEventListener('shop-auth-changed', () => {
    if (getSession()?.authenticated) syncAuthSession(store);
    else clearAuthSession(store);
  });
  render(<App store={store} persistor={persistor} />, root);
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
