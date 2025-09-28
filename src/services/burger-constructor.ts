import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 } from 'uuid';

interface BurgerConstructorState {
  // Храним массив id ингредиентов в порядке конструктора
  selectedIngredients: TConstructorIngredient[];
}

export const initialConstructor: BurgerConstructorState = {
  selectedIngredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'constructor',
  initialState: initialConstructor,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.selectedIngredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => {
        const key = v4();
        return { payload: { ...ingredient, id: key } };
      }
    },
    removeIngredient(state, action: PayloadAction<number>) {
      // удаляем по индексу
      state.selectedIngredients.splice(action.payload, 1);
    },
    moveIngredient(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      const item = state.selectedIngredients.splice(from, 1)[0];
      state.selectedIngredients.splice(to, 0, item);
    },
    clearConstructor(state) {
      state.selectedIngredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export const selectConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.selectedIngredients;
