import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import KeycloakAuth from '@/views/auth/KeycloakAuth';
import { openSignInPopup } from '@/services/authPopup';

jest.mock('@/services/keycloak', () => ({ __esModule: true, default: {} }));
jest.mock('@/services/authPopup', () => ({ openSignInPopup: jest.fn() }));
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
});
afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
});

test('successful popup login returns to the original path, query and fragment', async () => {
  openSignInPopup.mockResolvedValue();
  const history = mount();
  await act(async () => { Simulate.click(container.querySelector('button')); });
  expect(openSignInPopup).toHaveBeenCalledWith(false);
  expect(history.location).toMatchObject(destination);
});

test('popup failures remain on the login page and allow retry', async () => {
  openSignInPopup.mockRejectedValue(new Error('Please allow popups.'));
  const history = mount();
  await act(async () => { Simulate.click(container.querySelector('button')); });
  expect(history.location.pathname).toBe('/signin');
  expect(container.querySelector('[role="alert"]').textContent).toBe('Please allow popups.');
  expect(container.querySelector('button').disabled).toBe(false);
});

test('switching to registration preserves the requested destination', () => {
  const history = mount();
  act(() => { Simulate.click(container.querySelector('a'), { button: 0 }); });
  expect(history.location.pathname).toBe('/signup');
  expect(history.location.state.from).toEqual(destination);
});
