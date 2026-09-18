import React, { useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import keycloak from '@/services/keycloak';
import { openSignInPopup } from '@/services/authPopup';

const KeycloakAuth = () => {
  const { pathname, state } = useLocation();
  const history = useHistory();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const registration = pathname === '/signup';
  const account = pathname === '/account/edit';
  const recovery = pathname === '/forgot_password';
  const title = account ? 'Manage your account' : registration ? 'Create your account' : 'Sign in';

  const proceed = async () => {
    setBusy(true);
    setError('');
    try {
      const from = state?.from;
      const path = from?.pathname?.startsWith('/') && !from.pathname.startsWith('//')
        ? `${from.pathname}${from.search || ''}` : '/';
      if (account) {
        window.open(keycloak.createAccountUrl(), '_blank', 'noopener,noreferrer');
      } else {
        await openSignInPopup(registration);
        history.replace(path);
      }
      setBusy(false);
    } catch (e) {
      setError(e.message || 'Sign-in is unavailable. Please try again.');
      setBusy(false);
    }
  };

  return (
    <div className="auth-content">
      <div className="auth">
        <div className="auth-main">
          <h3>{title}</h3>
          <p>{recovery ? 'Choose “Forgot Password” on the sign-in page to reset your password.' : 'A secure window will open. Your shop page stays here.'}</p>
          {error && <p role="alert" className="toast-error">{error}</p>}
          <button className="button" type="button" disabled={busy} onClick={proceed}>
            {busy ? 'Waiting for sign-in...' : title}
          </button>
        </div>
      </div>
      {!account && <div className="auth-message"><Link to={registration ? '/signin' : '/signup'}>{registration ? 'Already have an account? Sign in' : 'Create an account'}</Link></div>}
    </div>
  );
};

export default KeycloakAuth;
