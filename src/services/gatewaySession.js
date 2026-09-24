// The gateway has a login endpoint, but no refresh or revocation endpoint yet.
const createGatewaySession = (response, createAccountUrl) => {
  let claims;
  try {
    const payload = response.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    claims = JSON.parse(decodeURIComponent(Array.from(atob(payload), (char) => (
      `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`
    )).join('')));
  } catch (error) {
    throw new Error('Sign-in returned an invalid session. Please try again.');
  }
  // Claims are for display only; the backend validates tokens for protected APIs.
  if (!claims.sub || !Number.isFinite(claims.exp) || !Number.isFinite(response.expires_in)
    || response.expires_in <= 0) {
    throw new Error('Sign-in returned an invalid session. Please try again.');
  }
  const expiresAt = Math.min(claims.exp * 1000, Date.now() + response.expires_in * 1000);
  if (expiresAt <= Date.now()) throw new Error('The session has expired. Please sign in again.');
  let timer;
  const session = {
    authenticated: true,
    token: response.access_token,
    tokenParsed: claims,
    createAccountUrl,
    clearToken() {
      clearTimeout(timer);
      const wasAuthenticated = this.authenticated;
      this.authenticated = false;
      delete this.token;
      delete this.tokenParsed;
      if (wasAuthenticated) this.onAuthLogout?.();
    },
    async updateToken() {
      if (!this.authenticated || Date.now() >= expiresAt) {
        this.clearToken();
        throw new Error('Your session expired. Please sign in again.');
      }
      return false;
    },
    async logout() {
      this.clearToken();
    }
  };
  timer = setTimeout(() => session.clearToken(), Math.min(expiresAt - Date.now(), 2147483647));
  return session;
};

export default createGatewaySession;
