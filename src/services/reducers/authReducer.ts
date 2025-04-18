import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '../../utils/burger-api';
import { refreshAccessToken } from './burgerReducer';
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage
} from '../../utils/storage';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

interface AuthState {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = { user: null, isLoading: false, error: null };

export const getUserData = createAsyncThunk(
  'auth/getUserData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response;
    } catch (e) {
      return rejectWithValue('Ошибка авторизации');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      setCookie('accessToken', response.accessToken);
      setCookie('refreshToken', response.refreshToken);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      window.location.href = '/';
      return response;
    } catch (error) {
      return rejectWithValue('Ошибка авторизации');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      setCookie('accessToken', response.accessToken);
      setCookie('refreshToken', response.refreshToken);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      window.location.href = '/';
      return response;
    } catch (error) {
      return rejectWithValue('Ошибка авторизации');
    }
  }
);

export const changeUserData = createAsyncThunk(
  'auth/changeUserData',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(data);
      return response;
    } catch (e) {
      return rejectWithValue('Ошибка смены данных');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      state = initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload.user;
      })
      .addCase(getUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload.user;
      })
      .addCase(changeUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changeUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload.user;
      });
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
