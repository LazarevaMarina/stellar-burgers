import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '@utils-types';

// Асинхронный thunk для загрузки данных
export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    const data = await getIngredientsApi();
    return data;
  } catch (error: any) {
    console.error('Fetch error:', error);
    return rejectWithValue(error.message || 'Ошибка загрузки ингредиентов');
  }
});

// Начальное состояние
interface IngredientState {
  data: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IngredientState = {
  data: [] as TIngredient[],
  isLoading: false,
  error: null
};

// Слайс для обработки состояния ингредиентов
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload; // Записываем данные в стейт
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Произошла ошибка'; // Обрабатываем ошибку
      });
  }
});

// Экспорт reducer
export default ingredientsSlice.reducer;
