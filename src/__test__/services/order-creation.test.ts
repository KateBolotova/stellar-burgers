import {
  clearCreateOrderError,
  clearLastOrder,
  createOrder,
  initialOrderCreation,
  orderCreationSlice
} from '../../services/order-creation';

const testOrder = {
  _id: '123',
  status: 'WIP',
  name: 'Beef only',
  createdAt: '',
  updatedAt: '',
  number: 1,
  ingredients: ['beef']
};

describe('order creation slice', () => {
  const reducer = orderCreationSlice.reducer;

  test('При undefined state и неизвестном экшене возвращает initial state', () => {
    const next = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(next).toEqual(initialOrderCreation);
  });

  test('clearCreateOrderError сбрасывает поле error в null', () => {
    const stateWithError = { ...initialOrderCreation, error: 'some error' };
    const next = reducer(stateWithError, clearCreateOrderError());
    expect(next.error).toBeNull();
  });

  test('clearLastOrder сбрасывает поле последнего заказа в null', () => {
    const stateWithLastOrder = {
      ...initialOrderCreation,
      lastOrder: testOrder
    };
    const next = reducer(stateWithLastOrder, clearLastOrder());
    expect(next.lastOrder).toBeNull();
  });

  describe('createOrder', () => {
    test('createOrder.pending ставит loading=true и сбрасывает error', () => {
      const prev = { ...initialOrderCreation, loading: false, error: 'err' };
      const action = createOrder.pending('reqId', ['beef']);
      const next = reducer(prev, action);
      expect(next.loading).toBe(true);
      expect(next.error).toBeNull();
    });

    test('createOrder.fulfilled записывает payload в lastOrder и loading=false', () => {
      const action = createOrder.fulfilled(testOrder, 'reqId', ['beef']);
      const next = reducer(initialOrderCreation, action);
      expect(next.loading).toBe(false);
      expect(next.lastOrder).toEqual(testOrder);
    });

    test('createOrder.rejected устанавливает ошибку и loading=false', () => {
      const action = createOrder.rejected(
        new Error('request rejected'),
        'reqId',
        ['beef']
      );
      const next = reducer(initialOrderCreation, action);
      expect(next.loading).toBe(false);
      expect(next.error).toBe('request rejected');
    });
  });
});
