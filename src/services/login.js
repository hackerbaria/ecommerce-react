import { acceptGatewaySession } from './keycloak';

const loginWithPassword = async (username, password, signal) => {
  let response;
  try {
    response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ username, password }),
      signal,
      cache: 'no-store'
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Unable to reach sign-in. Please try again.');
  }
  if (!response.ok) {
    throw new Error(response.status === 401 ? 'Incorrect username or password.'
      : 'Sign-in is currently unavailable. Please try again.');
  }
  let tokens;
  try {
    tokens = await response.json();
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Sign-in returned an invalid response. Please try again.');
  }
  if (signal?.aborted) return;
  acceptGatewaySession(tokens);
};

export default loginWithPassword;
