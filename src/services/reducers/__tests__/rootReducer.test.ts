import { rootReducer } from '../index';
import burgerReducer from '../burgerReducer';
import authReducer from '../authReducer';
import feedReducer from '../feedReducer';
import ingredientsReducer from '../ingredientsReducer';

jest.mock('../orderReducer', () => ({
  __esModule: true,
  default: (state = {}, action: any) => state,
}));

describe('rootReducer', () => {
  it('должен возвращать комбинированный initialState', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({
      auth: authReducer(undefined, { type: '@@INIT' }),
      burger: burgerReducer(undefined, { type: '@@INIT' }),
      feed: feedReducer(undefined, { type: '@@INIT' }),
      ingredients: ingredientsReducer(undefined, { type: '@@INIT' }),
      order: {},
    });
  });
});
