import { acceptGatewaySession, getSession, getAuthorizationHeaders, logout } from '@/services/authSession';

const tokens = (sub) => ({
  access_token: `header.${btoa(JSON.stringify({ sub, exp: Math.floor(Date.now() / 1000) + 60 }))}.signature`,
  expires_in: 60
});

beforeEach(() => jest.useFakeTimers());
afterEach(() => { logout(); jest.clearAllTimers(); jest.useRealTimers(); });

test('login exposes the API token and logout removes authorization', async () => {
  const response = tokens('customer');
  acceptGatewaySession(response);
  expect(getSession().tokenParsed.sub).toBe('customer');
  await expect(getAuthorizationHeaders()).resolves.toEqual({ Authorization: `Bearer ${response.access_token}` });
  logout();
  await expect(getAuthorizationHeaders()).resolves.toEqual({});
});

test('replacing a session cancels the old expiry and notifies on the new expiry', () => {
  const changed = jest.fn();
  window.addEventListener('shop-auth-changed', changed);
  try {
    acceptGatewaySession(tokens('first'));
    jest.advanceTimersByTime(30000);
    acceptGatewaySession(tokens('second'));
    changed.mockClear();
    jest.advanceTimersByTime(30000);
    expect(getSession().authenticated).toBe(true);
    expect(changed).not.toHaveBeenCalled();
    jest.advanceTimersByTime(30000);
    expect(getSession().authenticated).toBe(false);
    expect(changed).toHaveBeenCalledTimes(1);
  } finally {
    window.removeEventListener('shop-auth-changed', changed);
  }
});

test('an invalid login response preserves the current session', () => {
  acceptGatewaySession(tokens('customer'));
  expect(() => acceptGatewaySession({ access_token: 'invalid' })).toThrow('invalid session');
  expect(getSession().tokenParsed.sub).toBe('customer');
});
