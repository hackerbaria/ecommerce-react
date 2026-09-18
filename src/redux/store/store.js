import {
  applyMiddleware,
  compose, createStore
} from 'redux';
import { persistCombineReducers, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers';
import rootSaga from '../sagas/rootSaga';
import { usesKeycloak } from '@/services/keycloak';

const sagaMiddleware = createSagaMiddleware();
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const authPersistConfig = {
  key: usesKeycloak ? 'keycloak-shop' : 'root',
  storage,
  whitelist: usesKeycloak ? ['basket'] : ['auth', 'profile', 'basket', 'checkout']
};

export default () => {
  const store = createStore(
    persistCombineReducers(authPersistConfig, rootReducer),
    composeEnhancer(applyMiddleware(sagaMiddleware))
  );
  const persistor = persistStore(store);
  sagaMiddleware.run(rootSaga);
  return { store, persistor };
};
