import { TIngredient } from '@utils-types';
import {
  fetchIngredients,
  ingredientsSlice,
  initialIngredients
} from '../../services/ingredients';

const testIngredients: TIngredient[] = [
  {
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
  },
  {
    _id: '1235',
    name: 'Мясо хобгоблина',
    type: 'meat',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: '',
    image_mobile: '',
    image_large: ''
  }
];

describe('ingredients slice', () => {
  const reducer = ingredientsSlice.reducer;

  test('При undefined state и неизвестном экшене возвращает initial state', () => {
    const next = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(next).toEqual(initialIngredients);
  });

  describe('fetchIngredients', () => {
    test('fetchIngredients.pending ставит loading=true и сбрасывает error', () => {
      const prev = { ...initialIngredients, loading: false, error: 'err' };
      const action = fetchIngredients.pending('reqId');
      const next = reducer(prev, action);
      expect(next.loading).toBe(true);
      expect(next.error).toBeNull();
    });

    test('fetchIngredients.fulfilled записывает payload в data и loading=false', () => {
      const action = fetchIngredients.fulfilled(testIngredients, 'reqId');
      const next = reducer(initialIngredients, action);
      expect(next.loading).toBe(false);
      expect(next.data).toEqual(testIngredients);
    });

    test('fetchIngredients.rejected устанавливает ошибку и loading=false', () => {
      const action = fetchIngredients.rejected(
        new Error('request rejected'),
        'reqId'
      );
      const next = reducer(initialIngredients, action);
      expect(next.loading).toBe(false);
      expect(next.error).toBe('request rejected');
    });
  });
});
