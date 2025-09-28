import { TOrder } from '@utils-types';
import { getOrderByNumberApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface OrdersState {
  // заказы пользователя
  list: TOrder[];
  loading: boolean;
  error: string | null;

  // текущий заказ (по номеру)
  current: TOrder | null;
  currentLoading: boolean;
  currentError: string | null;
}

export const initialOrders: OrdersState = {
  list: [],
  loading: false,
  error: null,
  current: null,
  currentLoading: false,
  currentError: null
};

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    const data = await getOrdersApi(); // возвращает TOrder[]
    return data;
  } catch (err: any) {
    return rejectWithValue(
      err?.message ?? 'Ошибка загрузки заказов пользователя'
    );
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('orders/fetchByNumber', async (number, { rejectWithValue }) => {
  try {
    const data = await getOrderByNumberApi(number); // возвращает { orders: TOrder[] }
    const orders = (data as any).orders as TOrder[] | undefined;
    if (orders && orders.length > 0) return orders[0];
    return rejectWithValue('Заказ не найден');
  } catch (err: any) {
    return rejectWithValue(err?.message ?? 'Ошибка получения заказа');
  }
});

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: initialOrders,
  reducers: {
    clearOrdersError(state) {
      state.error = null;
    },
    clearCurrentOrder(state) {
      state.current = null;
      state.currentError = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchUserOrders.fulfilled,
      (state, action: PayloadAction<TOrder[]>) => {
        state.loading = false;
        state.list = action.payload;
      }
    );
    builder.addCase(fetchUserOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? action.error.message ?? 'Unknown error';
    });

    builder.addCase(fetchOrderByNumber.pending, (state) => {
      state.currentLoading = true;
      state.currentError = null;
    });
    builder.addCase(
      fetchOrderByNumber.fulfilled,
      (state, action: PayloadAction<TOrder>) => {
        state.currentLoading = false;
        state.current = action.payload;
      }
    );
    builder.addCase(fetchOrderByNumber.rejected, (state, action) => {
      state.currentLoading = false;
      state.currentError =
        action.payload ?? action.error.message ?? 'Unknown error';
    });
  }
});

export const { clearOrdersError, clearCurrentOrder } = ordersSlice.actions;

export const selectUserOrders = (state: RootState) => state.orders.list;
export const selectUserOrdersLoading = (state: RootState) =>
  state.orders.loading;
export const selectUserOrdersError = (state: RootState) => state.orders.error;
export const selectCurrentOrder = (state: RootState) => state.orders.current;
export const selectCurrentOrderLoading = (state: RootState) =>
  state.orders.currentLoading;
export const selectCurrentOrderError = (state: RootState) =>
  state.orders.currentError;
