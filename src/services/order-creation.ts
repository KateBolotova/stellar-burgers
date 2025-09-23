import { TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface OrderCreationState {
  // результат создания заказа (последний созданный заказ)
  lastOrder: TOrder | null;
  loading: boolean;
  error: string | null;
}

export const initialOrderCreation: OrderCreationState = {
  lastOrder: null,
  loading: false,
  error: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('orderCreation/createOrder', async (ingredientIds, { rejectWithValue }) => {
  try {
    const data = await orderBurgerApi(ingredientIds);
    return data.order;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? 'Ошибка создания заказа');
  }
});

export const orderCreationSlice = createSlice({
  name: 'orderCreation',
  initialState: initialOrderCreation,
  reducers: {
    clearCreateOrderError(state) {
      state.error = null;
    },
    clearLastOrder(state) {
      state.lastOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createOrder.fulfilled,
      (state, action: PayloadAction<TOrder>) => {
        state.loading = false;
        state.lastOrder = action.payload;
      }
    );
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? action.error.message ?? 'Unknown error';
    });
  }
});

export const { clearCreateOrderError, clearLastOrder } =
  orderCreationSlice.actions;

export const selectLastCreatedOrder = (state: RootState) =>
  state.orderCreation.lastOrder;
export const selectCreateOrderLoading = (state: RootState) =>
  state.orderCreation.loading;
export const selectCreateOrderError = (state: RootState) =>
  state.orderCreation.error;
