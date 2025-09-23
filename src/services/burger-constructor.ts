import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface BurgerConstructorState {
  // Храним массив id ингредиентов в порядке конструктора
  selectedIds: string[];
}

export const initialConstructor: BurgerConstructorState = {
  selectedIds: []
};

export const burgerConstructorSlice = createSlice({
  name: 'constructor',
  initialState: initialConstructor,
  reducers: {
    addIngredient(state, action: PayloadAction<string>) {
      // добавляем id ингредиента в конец
      if (!state.selectedIds.includes(action.payload))
        state.selectedIds.push(action.payload);
    },
    removeIngredient(state, action: PayloadAction<number>) {
      // удаляем по индексу
      state.selectedIds.splice(action.payload, 1);
    },
    moveIngredient(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      const item = state.selectedIds.splice(from, 1)[0];
      state.selectedIds.splice(to, 0, item);
    },
    clearConstructor(state) {
      state.selectedIds = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export const selectConstructorIds = (state: RootState) =>
  state.burgerConstructor.selectedIds;
