import { UPDATE_EMAIL, UPDATE_PROFILE } from '@/constants/constants';
import { displayActionMessage } from '@/helpers/utils';
import { call, put } from 'redux-saga/effects';
import { setLoading, setRequestStatus } from '../actions/miscActions';

function* profileSaga({ type }) {
  if (![UPDATE_EMAIL, UPDATE_PROFILE].includes(type)) return;
  const message = 'Profile changes are currently unavailable. Use account settings to manage your identity.';
  yield put(setLoading(false));
  yield put(setRequestStatus(message));
  yield call(displayActionMessage, message, 'error');
}

export default profileSaga;
