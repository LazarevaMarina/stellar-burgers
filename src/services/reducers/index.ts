import { combineReducers } from 'redux';
import authReducer from './authReducer';
import feedReducer from './feedReducer';
import burgerReducer from './burgerReducer';
import ingredientsReducer from './ingredientsReducer';
import orderSlice from './orderReducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  burger: burgerReducer,
  feed: feedReducer,
  ingredients: ingredientsReducer,
  order: orderSlice
});
