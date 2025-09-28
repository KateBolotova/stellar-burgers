import {
  burgerConstructorSlice,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  initialConstructor
} from '../../services/burger-constructor';
import { TIngredient } from '@utils-types';

const uid = 'test-uuid';
jest.mock('uuid', () => ({ v4: () => uid }));

const testIngredient: TIngredient = {
  _id: '1234',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: '',
  image_mobile: '',
  image_large: ''
};

describe('burger-constructor slice', () => {
  test('При undefined state и неизвестном экшене возвращает initial state', () => {
    const state = burgerConstructorSlice.reducer(undefined, {
      type: 'unknown'
    });
    expect(state).toEqual(initialConstructor);
  });

  describe('addIngredient', () => {
    test('Добавляет выбранный ингредиент и генерирует ему id для DND', () => {
      const action = addIngredient(testIngredient);
      const state = burgerConstructorSlice.reducer(initialConstructor, action);

      expect(state.selectedIngredients).toEqual([
        {
          ...testIngredient,
          id: uid
        }
      ]);
    });

    test('Добавляет ингредиент в список, когда там уже есть такой же', () => {
      const initialState = {
        selectedIngredients: [{ ...testIngredient, id: 'existing-id' }]
      };

      const action = addIngredient(testIngredient);
      const state = burgerConstructorSlice.reducer(initialState, action);

      expect(state.selectedIngredients).toHaveLength(2);
      expect(state.selectedIngredients[1]).toEqual({
        ...testIngredient,
        id: uid
      });
    });
  });

  describe('removeIngredient', () => {
    test('Удаляет ингредиент по индексу', () => {
      const initialState = {
        selectedIngredients: [
          { ...testIngredient, id: '1' },
          { ...testIngredient, id: '2' },
          { ...testIngredient, id: '3' }
        ]
      };

      const action = removeIngredient(1);
      const state = burgerConstructorSlice.reducer(initialState, action);

      expect(state.selectedIngredients).toEqual([
        { ...testIngredient, id: '1' },
        { ...testIngredient, id: '3' }
      ]);
    });
  });

  describe('moveIngredient', () => {
    test('Перемещает ингредиент с одного индекса на другой', () => {
      const ingredients = [
        { ...testIngredient, id: '1' },
        { ...testIngredient, id: '2' },
        { ...testIngredient, id: '3' }
      ];
      const initialState = { selectedIngredients: ingredients };

      const action = moveIngredient({ from: 0, to: 2 });
      const state = burgerConstructorSlice.reducer(initialState, action);

      expect(state.selectedIngredients).toEqual([
        { ...testIngredient, id: '2' },
        { ...testIngredient, id: '3' },
        { ...testIngredient, id: '1' }
      ]);
    });
  });

  describe('clearConstructor', () => {
    test('Очищает все ингредиенты', () => {
      const initialState = {
        selectedIngredients: [
          { ...testIngredient, id: '1' },
          { ...testIngredient, id: '2' }
        ]
      };

      const action = clearConstructor();
      const state = burgerConstructorSlice.reducer(initialState, action);

      expect(state.selectedIngredients).toEqual([]);
    });
  });
});
