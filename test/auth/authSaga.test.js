import { runSaga } from 'redux-saga';
import authSaga from '@/redux/sagas/authSaga';
import * as types from '@/constants/constants';
import loginWithPassword from '@/services/login';
import keycloak from '@/services/keycloak';
import { openSignInPopup } from '@/services/authPopup';
import { history } from '@/routers/AppRouter';

jest.mock('@/services/login', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('@/services/keycloak', () => ({ __esModule: true, default: { logout: jest.fn() } }));
jest.mock('@/services/authPopup', () => ({ openSignInPopup: jest.fn() }));
jest.mock('@/routers/AppRouter', () => ({ history: { push: jest.fn() } }));
beforeEach(() => jest.clearAllMocks());

const run = async (action) => {
  const dispatched = [];
  await runSaga({ dispatch: (a) => dispatched.push(a) }, authSaga, action).toPromise();
  return dispatched;
};

test('password sign-in calls the gateway and resets the loading state', async () => {
  loginWithPassword.mockResolvedValue();
  const actions = await run({ type: types.SIGNIN, payload: { username: ' demo ', password: 'pass' } });
  expect(loginWithPassword).toHaveBeenCalledWith('demo', 'pass', expect.any(AbortSignal));
  expect(openSignInPopup).not.toHaveBeenCalled();
  expect(actions).toContainEqual(expect.objectContaining({ type: types.SET_AUTH_STATUS, payload: expect.objectContaining({ success: true }) }));
  expect(actions[actions.length - 1]).toEqual({ type: types.IS_AUTHENTICATING, payload: false });
});

test('gateway errors are shown without leaving authentication pending', async () => {
  loginWithPassword.mockRejectedValue(new Error('Incorrect username or password.'));
  const actions = await run({ type: types.SIGNIN, payload: { email: 'demo', password: 'wrong' } });
  expect(actions).toContainEqual({ type: types.SET_AUTH_STATUS, payload: {
    success: false, type: 'auth', isError: true, message: 'Incorrect username or password.'
  } });
  expect(actions[actions.length - 1].payload).toBe(false);
});

test('cancelling an in-flight sign-in aborts the request', async () => {
  loginWithPassword.mockImplementation(() => new Promise(() => {}));
  const task = runSaga({ dispatch: jest.fn() }, authSaga, {
    type: types.SIGNIN, payload: { username: 'demo', password: 'pass' }
  });
  const signal = loginWithPassword.mock.calls[0][2];
  task.cancel();
  await task.toPromise();
  expect(signal.aborted).toBe(true);
});

test('sign-out clears customer data and logs out the current session', async () => {
  keycloak.logout.mockResolvedValue();
  const actions = await run({ type: types.SIGNOUT });
  for (const type of [types.CLEAR_BASKET, types.CLEAR_PROFILE, types.RESET_CHECKOUT, types.SIGNOUT_SUCCESS]) {
    expect(actions).toContainEqual(expect.objectContaining({ type }));
  }
  expect(keycloak.logout).toHaveBeenCalled();
  expect(history.push).toHaveBeenCalledWith('/signin');
});

test('registration and recovery use the supported hosted flows', async () => {
  await run({ type: types.SIGNUP });
  expect(openSignInPopup).toHaveBeenCalledWith(true);
  await run({ type: types.RESET_PASSWORD });
  expect(history.push).toHaveBeenCalledWith('/forgot_password');
});

test('legacy persistence does not persist an authentication session', async () => {
  expect(await run({ type: types.SET_AUTH_PERSISTENCE })).toEqual([]);
});
