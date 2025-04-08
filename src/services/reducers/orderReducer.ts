import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api'; 
import { TOrder } from '../../utils/types';

interface OrderState {
  order: TOrder | null;
  isLoading: boolean;
  error: string | undefined;
}

// Начальное состояние
const initialState: OrderState = {
  order: null,
  isLoading: false,
  error: undefined,
};

// Thunk для загрузки заказа по id
export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const data = await getOrderByNumberApi(Number(orderId));
      return data.orders[0];
    } catch (error) {
      return rejectWithValue('Ошибка загрузки заказа');
    }
  }
);

// Slice для обработки состояния
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.order = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;
