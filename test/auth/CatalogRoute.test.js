import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CatalogRoute from '@/routers/CatalogRoute';
import * as authConfig from '@/services/keycloak';

jest.mock('@/services/keycloak', () => ({ __esModule: true, usesKeycloak: true }));

let container;
let mounts;
const ProductPage = () => { mounts(); return <div>Products</div>; };

const renderRoute = (auth) => {
  const history = createMemoryHistory({ initialEntries: ['/shop?brand=demo#products'] });
  const store = createStore((state = { auth }, action) => (
    action.type === 'logout' ? { auth: null } : state
  ));
  act(() => {
    ReactDOM.render(
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <CatalogRoute path="/shop" component={ProductPage} />
            <Route path="/signin" render={() => <div>Sign in</div>} />
          </Switch>
        </Router>
      </Provider>, container
    );
  });
  return { history, store };
};

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  mounts = jest.fn();
  authConfig.usesKeycloak = true;
});

afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
});

test('signed-out users reach login without mounting protected API consumers', () => {
  const { history } = renderRoute(null);
  expect(container.textContent).toBe('Sign in');
  expect(mounts).not.toHaveBeenCalled();
  expect(history.location.state.from).toMatchObject({
    pathname: '/shop', search: '?brand=demo', hash: '#products'
  });
});

test('signed-in users can browse and logout protects the page immediately', () => {
  const { store, history } = renderRoute({ id: 'user-1', role: 'USER' });
  expect(container.textContent).toBe('Products');
  act(() => { store.dispatch({ type: 'logout' }); });
  expect(container.textContent).toBe('Sign in');
  expect(history.location.pathname).toBe('/signin');
});

test('Firebase mode preserves public catalog browsing', () => {
  authConfig.usesKeycloak = false;
  renderRoute(null);
  expect(container.textContent).toBe('Products');
});
