import {
  createSlice,
  createAsyncThunk,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import {
  getFeedsApi,
  orderBurgerApi,
  refreshToken
} from '../../utils/burger-api';
import type { TIngredient, TOrder } from '../../utils/types';

interface IMovePayload {
  index: number;
}

interface IConstructorItems {
  bun: any | null;
  ingredients: any[];
}

interface IInitialState {
  constructorItems: IConstructorItems;
  orderRequest: boolean;
  orderModalData: any | null;
  orderNumber: number | null;
}

const initialState: IInitialState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  orderNumber: null
};

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { rejectWithValue }) => {
    console.log('Попытка обновления токена');
    try {
      const data = await refreshToken();
      console.log('Токен обновлён:', data);
      return data;
    } catch (error) {
      console.log('Ошибка обновления токена');
      return rejectWithValue('Ошибка обновления токена');
    }
  }
);

// Асинхронный Thunk для получения заказов
export const fetchOrders = createAsyncThunk(
  'burger/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Ошибка при загрузке заказов');
    }
  }
);

// Асинхронное оформление заказа
export const makeOrder = createAsyncThunk<
  any,
  string[],
  { rejectValue: string }
>('burger/makeOrder', async (ingredientIds, { rejectWithValue, dispatch }) => {
  const token = localStorage.getItem('accessToken');
  try {
    const data = await orderBurgerApi(ingredientIds);
    return data.order;
  } catch (error: any) {
    if (error.message === 'jwt expired') {
      const refreshResult = await dispatch(refreshAccessToken());

      if (refreshAccessToken.fulfilled.match(refreshResult)) {
        const newToken = refreshResult.payload.accessToken;
        localStorage.setItem('accessToken', newToken);

        const retryData = await orderBurgerApi(ingredientIds);
        return retryData.order;
      } else {
        return rejectWithValue('Ошибка авторизации');
      }
    }
    return rejectWithValue('Ошибка оформления заказа');
  }
});

// Редюсер с логикой для обработки действий
const burgerReducer = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    addBurgerIngredient: {
      reducer: (
        state,
        action: PayloadAction<TIngredient & { uniqueId: string }>
      ) => {
        const ingredient = action.payload;
        if (ingredient.type === 'bun') {
          state.constructorItems.bun = ingredient;
        } else {
          state.constructorItems.ingredients.push(ingredient);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          uniqueId: nanoid()
        }
      })
    },
    removeBurgerIngredient: (state, action) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (_, index) => index !== action.payload
        );
    },
    moveIngredientUp: (state, action: PayloadAction<IMovePayload>) => {
      const { index } = action.payload;
      if (index > 0) {
        const items = state.constructorItems.ingredients;
        [items[index - 1], items[index]] = [items[index], items[index - 1]];
      }
    },
    moveIngredientDown: (state, action: PayloadAction<IMovePayload>) => {
      const { index } = action.payload;
      const items = state.constructorItems.ingredients;
      if (index < items.length - 1) {
        [items[index + 1], items[index]] = [items[index], items[index + 1]];
      }
    },
    setOrderData: (state, action) => {
      state.orderModalData = action.payload;
    },
    setOrderNumber: (state, action) => {
      state.orderNumber = action.payload;
    },
    clearConstructorItems: (state) => {
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = null;
        console.error('Ошибка:', action.payload);
      })
      .addCase(makeOrder.fulfilled, (state) => {
        state.constructorItems = {
          bun: null,
          ingredients: []
        };
      });
  }
});

export const {
  addBurgerIngredient,
  removeBurgerIngredient,
  moveIngredientUp,
  moveIngredientDown,
  setOrderData,
  setOrderNumber,
  clearConstructorItems
} = burgerReducer.actions;
export default burgerReducer.reducer;
