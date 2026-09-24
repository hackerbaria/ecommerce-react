import { runSaga } from 'redux-saga';
import productSaga from '@/redux/sagas/productSaga';
import profileSaga from '@/redux/sagas/profileSaga';
import * as types from '@/constants/constants';
import { displayActionMessage } from '@/helpers/utils';
import productsApi from '@/services/products';

jest.mock('@/helpers/utils', () => ({ displayActionMessage: jest.fn() }));
jest.mock('@/services/products', () => ({ __esModule: true, default: { getProducts: jest.fn() } }));
beforeEach(() => jest.clearAllMocks());

test.each([types.ADD_PRODUCT, types.EDIT_PRODUCT, types.REMOVE_PRODUCT, types.UPDATE_EMAIL, types.UPDATE_PROFILE])(
  '%s reports unavailable without dispatching write success', async (type) => {
    const actions = [];
    const saga = [types.UPDATE_EMAIL, types.UPDATE_PROFILE].includes(type) ? profileSaga : productSaga;
    await runSaga({ dispatch: (a) => actions.push(a) }, saga, { type }).toPromise();
    expect(actions.some(a => a.type.endsWith('_SUCCESS'))).toBe(false);
    expect(actions).toContainEqual({ type: types.LOADING, payload: false });
    expect(displayActionMessage).toHaveBeenCalledWith(expect.stringContaining('unavailable'), 'error');
  }
);

test('product reads still load from the product API', async () => {
  const result = { products: [{ id: '1' }], total: 1, lastKey: null };
  productsApi.getProducts.mockResolvedValue(result);
  const actions = [];
  await runSaga({ dispatch: (a) => actions.push(a) }, productSaga, { type: types.GET_PRODUCTS }).toPromise();
  expect(actions).toContainEqual({ type: types.GET_PRODUCTS_SUCCESS, payload: result });
});
