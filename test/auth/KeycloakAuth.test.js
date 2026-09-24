import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import KeycloakAuth from '@/views/auth/KeycloakAuth';
import { openSignInPopup } from '@/services/authPopup';
import loginWithPassword from '@/services/login';

jest.mock('@/services/keycloak', () => ({ __esModule: true, default: {} }));
jest.mock('@/services/authPopup', () => ({ openSignInPopup: jest.fn() }));
jest.mock('@/services/login', () => ({ __esModule: true, default: jest.fn() }));
let container;
const destination = { pathname: '/shop', search: '?brand=demo', hash: '#products' };

const mount = (pathname = '/signin') => {
  const history = createMemoryHistory({ initialEntries: [{ pathname, state: { from: destination } }] });
  act(() => { ReactDOM.render(<Router history={history}><KeycloakAuth /></Router>, container); });
  return history;
};

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  openSignInPopup.mockReset();
  loginWithPassword.mockReset();
});
afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
});

const submitCredentials = async () => {
  await act(async () => {
    Simulate.change(container.querySelector('[name="username"]'), { target: { name: 'username', value: 'testuser1' } });
    Simulate.change(container.querySelector('[name="password"]'), { target: { name: 'password', value: 'test-password' } });
  });
  await act(async () => { Simulate.submit(container.querySelector('form')); });
};

test('successful form login returns to the original path, query and fragment', async () => {
  loginWithPassword.mockResolvedValue();
  const history = mount();
  await submitCredentials();
  expect(loginWithPassword).toHaveBeenCalledWith('testuser1', 'test-password', expect.any(AbortSignal));
  expect(openSignInPopup).not.toHaveBeenCalled();
  expect(history.location).toMatchObject(destination);
});

test('invalid credentials remain on the login page and allow retry', async () => {
  loginWithPassword.mockRejectedValue(new Error('Incorrect username or password.'));
  const history = mount();
  await submitCredentials();
  expect(history.location.pathname).toBe('/signin');
  expect(container.querySelector('[role="alert"]').textContent).toBe('Incorrect username or password.');
  expect(container.querySelector('[name="password"]').value).toBe('');
  expect(container.querySelector('button').disabled).toBe(false);
});

test('switching to registration preserves the requested destination', () => {
  const history = mount();
  act(() => { Simulate.click(container.querySelector('a[href="/signup"]'), { button: 0 }); });
  expect(history.location.pathname).toBe('/signup');
  expect(history.location.state.from).toEqual(destination);
});

test('empty credentials do not call the login API', async () => {
  mount();
  await act(async () => { Simulate.submit(container.querySelector('form')); });
  expect(loginWithPassword).not.toHaveBeenCalled();
  expect(container.textContent).toContain('Username is required.');
});

test('registration still opens the hosted registration form', async () => {
  openSignInPopup.mockResolvedValue();
  mount('/signup');
  await act(async () => { Simulate.click(container.querySelector('button')); });
  expect(openSignInPopup).toHaveBeenCalledWith(true);
});
