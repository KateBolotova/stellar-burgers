import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { ingredientsSlice } from './ingredients';
import { burgerConstructorSlice } from './burger-constructor';
import { orderCreationSlice } from './order-creation';
import { feedsSlice } from './feeds';
import { ordersSlice } from './orders';
import { profileSlice } from './profile';

export const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  burgerConstructor: burgerConstructorSlice.reducer,
  orderCreation: orderCreationSlice.reducer,
  feeds: feedsSlice.reducer,
  orders: ordersSlice.reducer,
  profile: profileSlice.reducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type StoreType = typeof store;

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
