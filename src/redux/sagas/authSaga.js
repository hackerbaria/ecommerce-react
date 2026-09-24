import {
  ON_AUTHSTATE_CHANGED, ON_AUTHSTATE_FAIL, ON_AUTHSTATE_SUCCESS,
  RESET_PASSWORD, SET_AUTH_PERSISTENCE, SIGNIN, SIGNIN_WITH_FACEBOOK,
  SIGNIN_WITH_GITHUB, SIGNIN_WITH_GOOGLE, SIGNOUT, SIGNUP
} from '@/constants/constants';
import { FORGOT_PASSWORD, SIGNIN as ROUTE_SIGNIN } from '@/constants/routes';
import { call, put } from 'redux-saga/effects';
import { signOutSuccess } from '@/redux/actions/authActions';
import { clearBasket } from '@/redux/actions/basketActions';
import { resetCheckout } from '@/redux/actions/checkoutActions';
import { resetFilter } from '@/redux/actions/filterActions';
import { setAuthenticating, setAuthStatus } from '@/redux/actions/miscActions';
import { clearProfile } from '@/redux/actions/profileActions';
import { history } from '@/routers/AppRouter';
import { logout } from '@/services/authSession';
import loginWithPassword from '@/services/login';

function* authSaga({ type, payload }) {
  // Session events now come from the gateway session bridge. Tokens
  // remain in memory; legacy persistence and provider-specific user events are ignored.
  if ([ON_AUTHSTATE_CHANGED, ON_AUTHSTATE_SUCCESS, SET_AUTH_PERSISTENCE].includes(type)) return;
  if (type === ON_AUTHSTATE_FAIL) {
    yield put(clearProfile());
    yield put(signOutSuccess());
    return;
  }
  if (![SIGNIN, SIGNUP, SIGNOUT, RESET_PASSWORD, SIGNIN_WITH_GOOGLE,
    SIGNIN_WITH_FACEBOOK, SIGNIN_WITH_GITHUB].includes(type)) return;

  const controller = new AbortController();
  let timeout;
  yield put(setAuthenticating(true));
  yield put(setAuthStatus(null));
  try {
    switch (type) {
      case SIGNIN:
        if (!(payload?.username || payload?.email)?.trim() || !payload?.password) {
          throw new Error('Username and password are required.');
        }
        timeout = setTimeout(() => controller.abort(), 15000);
        yield call(
          loginWithPassword, (payload.username || payload.email).trim(),
          payload.password, controller.signal
        );
        yield put(setAuthStatus({
          success: true, type: 'auth', isError: false, message: 'Successfully signed in.'
        }));
        break;
      case SIGNUP:
        throw new Error('Account registration is currently unavailable.');
      case SIGNOUT:
        // Clear local state even if the provider logout request fails.
        yield put(clearBasket());
        yield put(clearProfile());
        yield put(resetFilter());
        yield put(resetCheckout());
        yield put(signOutSuccess());
        yield call(logout);
        yield call([history, history.push], ROUTE_SIGNIN);
        break;
      case RESET_PASSWORD:
        yield call([history, history.push], FORGOT_PASSWORD);
        break;
      default:
        throw new Error('Use your username and password to sign in.');
    }
  } catch (error) {
    yield put(setAuthStatus({
      success: false,
      type: 'auth',
      isError: true,
      message: error.name === 'AbortError' ? 'Sign-in timed out. Please try again.'
        : error.message || 'Authentication is unavailable. Please try again.'
    }));
  } finally {
    clearTimeout(timeout);
    controller.abort();
    yield put(setAuthenticating(false));
  }
}

export default authSaga;
