import keycloak from './keycloak';
import { signInSuccess, signOutSuccess } from '@/redux/actions/authActions';
import { setProfile, clearProfile } from '@/redux/actions/profileActions';
import { clearBasket } from '@/redux/actions/basketActions';
import { resetCheckout } from '@/redux/actions/checkoutActions';
import defaultAvatar from '@/images/defaultAvatar.jpg';
import defaultBanner from '@/images/defaultBanner.jpg';

export const clearKeycloakSession = (store) => {
  store.dispatch(signOutSuccess());
  store.dispatch(clearProfile());
  store.dispatch(clearBasket());
  store.dispatch(resetCheckout());
};

export const syncKeycloakSession = (store) => {
  if (!keycloak.authenticated) {
    store.dispatch(signOutSuccess());
    store.dispatch(clearProfile());
    return;
  }
  const claims = keycloak.tokenParsed;
  // Admin product writes still require Firebase; Keycloak users use the storefront.
  store.dispatch(setProfile({
    fullname: claims.name || claims.preferred_username || 'User',
    email: claims.email || '',
    avatar: defaultAvatar,
    banner: defaultBanner,
    address: '',
    mobile: { data: {} },
    role: 'USER',
    dateJoined: null
  }));
  store.dispatch(signInSuccess({ id: claims.sub, role: 'USER', provider: 'keycloak' }));
};
