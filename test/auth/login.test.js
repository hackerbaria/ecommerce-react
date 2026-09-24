import loginWithPassword from '@/services/login';
import { acceptGatewaySession } from '@/services/keycloak';

jest.mock('@/services/keycloak', () => ({ acceptGatewaySession: jest.fn() }));
const originalFetch = global.fetch;
beforeEach(() => { global.fetch = jest.fn(); acceptGatewaySession.mockReset(); });
afterEach(() => { global.fetch = originalFetch; });

test('posts credentials as JSON and accepts the gateway token response', async () => {
  const tokens = { access_token: 'test-token', expires_in: 300 };
  global.fetch.mockResolvedValue({ ok: true, json: async () => tokens });
  await loginWithPassword('demo', ' p&ss=+word ');
  expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
    method: 'POST', body: JSON.stringify({ username: 'demo', password: ' p&ss=+word ' }),
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
  }));
  expect(acceptGatewaySession).toHaveBeenCalledWith(tokens);
});

test.each([401, 500, 503])('HTTP %s does not install a session', async (status) => {
  global.fetch.mockResolvedValue({ ok: false, status });
  await expect(loginWithPassword('demo', 'wrong')).rejects.toThrow(
    status === 401 ? 'Incorrect username or password.' : 'Sign-in is currently unavailable.'
  );
  expect(acceptGatewaySession).not.toHaveBeenCalled();
});

test('a cancelled request does not install its late response', async () => {
  const controller = new AbortController();
  controller.abort();
  global.fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
  await loginWithPassword('demo', 'password', controller.signal);
  expect(acceptGatewaySession).not.toHaveBeenCalled();
});
