import {
  clearCurrentOrder,
  clearOrdersError,
  fetchOrderByNumber,
  fetchUserOrders,
  initialOrders,
  ordersSlice
} from '../../services/orders';

const testOrder = {
  _id: '123',
  status: 'WIP',
  name: 'Beef only',
  createdAt: '',
  updatedAt: '',
  number: 1,
  ingredients: ['beef']
};

describe('orders slice', () => {
  const reducer = ordersSlice.reducer;

  test('При undefined state и неизвестном экшене возвращает initial state', () => {
    const next = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(next).toEqual(initialOrders);
  });

  test('clearOrdersError сбрасывает поле error в null', () => {
    const stateWithError = { ...initialOrders, error: 'some error' };
    const next = reducer(stateWithError, clearOrdersError());
    expect(next.error).toBeNull();
  });

  describe('clearCurrentOrder', () => {
    test('clearCurrentOrder сбрасывает поле последнего заказа в null', () => {
      const stateWithCurrentOtder = {
        ...initialOrders,
        current: testOrder,
        currentError: null
      };
      const next = reducer(stateWithCurrentOtder, clearCurrentOrder());
      expect(next.current).toBeNull();
    });

    test('clearCurrentOrder сбрасывает поле ошибки последнего заказа в null', () => {
      const stateWithCurrentError = {
        ...initialOrders,
        current: null,
        currentError: 'order error'
      };
      const next = reducer(stateWithCurrentError, clearCurrentOrder());
      expect(next.currentError).toBeNull();
    });
  });

  describe('fetchUserOrders', () => {
    test('fetchUserOrders.pending ставит loading=true и сбрасывает error', () => {
      const prev = { ...initialOrders, loading: false, error: 'err' };
      const action = fetchUserOrders.pending('reqId');
      const next = reducer(prev, action);
      expect(next.loading).toBe(true);
      expect(next.error).toBeNull();
    });

    test('fetchUserOrders.fulfilled записывает payload в list и loading=false', () => {
      const action = fetchUserOrders.fulfilled([testOrder], 'reqId');
      const next = reducer(initialOrders, action);
      expect(next.loading).toBe(false);
      expect(next.list).toEqual([testOrder]);
    });

    test('fetchUserOrders.rejected устанавливает ошибку и loading=false', () => {
      const action = fetchUserOrders.rejected(
        new Error('request rejected'),
        'reqId'
      );
      const next = reducer(initialOrders, action);
      expect(next.loading).toBe(false);
      expect(next.error).toBe('request rejected');
    });
  });

  describe('fetchOrderByNumber', () => {
    test('fetchOrderByNumber.pending ставит currentLoading=true и сбрасывает error', () => {
      const prev = { ...initialOrders, loading: false, error: 'err' };
      const action = fetchOrderByNumber.pending('reqId', 1);
      const next = reducer(prev, action);
      expect(next.currentLoading).toBe(true);
      expect(next.currentError).toBeNull();
    });

    test('fetchOrderByNumber.fulfilled записывает payload в current и currentLoading=false', () => {
      const action = fetchOrderByNumber.fulfilled(testOrder, 'reqId', 1);
      const next = reducer(initialOrders, action);
      expect(next.currentLoading).toBe(false);
      expect(next.current).toEqual(testOrder);
    });

    test('fetchOrderByNumber.rejected устанавливает ошибку и currentLoading=false', () => {
      const action = fetchOrderByNumber.rejected(
        new Error('request rejected'),
        'reqId',
        1
      );
      const next = reducer(initialOrders, action);
      expect(next.currentLoading).toBe(false);
      expect(next.currentError).toBe('request rejected');
    });
  });
});
