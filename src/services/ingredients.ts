import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { RootState } from './store';

interface IngredientsState {
  data: TIngredient[];
  loading: boolean;
  error: string | null;
}

export const initialIngredients: IngredientsState = {
  data: [],
  loading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetch', async (_, { rejectWithValue }) => {
  try {
    const data = await getIngredientsApi(); // возвращает TIngredient[]
    return data;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? 'Ошибка загрузки ингредиентов');
  }
});

export const selectIngredients = (state: RootState) => state.ingredients.data;

export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;

export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: initialIngredients,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIngredients.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchIngredients.fulfilled,
      (state, action: PayloadAction<TIngredient[]>) => {
        state.loading = false;
        state.data = action.payload;
      }
    );
    builder.addCase(fetchIngredients.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? action.error.message ?? 'Unknown error';
    });
  }
});

export const {} = ingredientsSlice.actions;
