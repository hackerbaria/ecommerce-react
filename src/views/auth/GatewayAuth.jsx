import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import GatewayLogin from './GatewayLogin';

const GatewayAuth = () => {
  const { pathname, state } = useLocation();
  const messages = {
    '/signup': 'Account registration is currently unavailable.',
    '/forgot_password': 'Password recovery is currently unavailable.',
    '/account/edit': 'Account editing is currently unavailable.'
  };
  if (!messages[pathname]) return <GatewayLogin />;
  return (
    <div className="auth-content">
      <p role="status">{messages[pathname]}</p>
      <Link to={{ pathname: pathname === '/account/edit' ? '/account' : '/signin', state }}>
        {pathname === '/account/edit' ? 'Back to account' : 'Back to sign in'}
      </Link>
    </div>
  );
};

export default GatewayAuth;
