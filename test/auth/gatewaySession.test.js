import createGatewaySession from '@/services/gatewaySession';

const response = () => ({
  access_token: `header.${btoa(JSON.stringify({ sub: 'user-1', exp: Math.floor(Date.now() / 1000) + 60 }))}.signature`,
  expires_in: 60
});
beforeEach(() => jest.useFakeTimers());
afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });

test('installs a session and clears credentials on logout', async () => {
  const session = createGatewaySession(response(), jest.fn());
  session.onAuthLogout = jest.fn();
  expect(session.authenticated).toBe(true);
  expect(session.tokenParsed.sub).toBe('user-1');
  await expect(session.updateToken()).resolves.toBe(false);
  await session.logout();
  expect(session.authenticated).toBe(false);
  expect(session.token).toBeUndefined();
  expect(session.onAuthLogout).toHaveBeenCalledTimes(1);
  await expect(session.updateToken()).rejects.toThrow('session expired');
});

test('access token expiry clears the session', () => {
  const session = createGatewaySession(response(), jest.fn());
  session.onAuthLogout = jest.fn();
  jest.advanceTimersByTime(60000);
  expect(session.authenticated).toBe(false);
  expect(session.onAuthLogout).toHaveBeenCalledTimes(1);
});

test('malformed tokens cannot establish a session', () => {
  expect(() => createGatewaySession({ access_token: 'invalid' })).toThrow('invalid session');
});
