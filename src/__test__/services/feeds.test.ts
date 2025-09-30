import {
  feedsSlice,
  initialFeeds,
  fetchFeeds,
  clearFeedsError
} from '../../services/feeds';
import { TOrdersData } from '@utils-types';

const testFeeds: TOrdersData = {
  orders: [
    {
      _id: '123',
      status: 'WIP',
      name: 'Beef only',
      createdAt: '',
      updatedAt: '',
      number: 1,
      ingredients: ['beef']
    },
    {
      _id: '123',
      status: 'READY',
      name: 'VEGAN VIBE',
      createdAt: '',
      updatedAt: '',
      number: 2,
      ingredients: ['bun', 'lettuce']
    }
  ],
  total: 100,
  totalToday: 5
};

describe('feeds slice', () => {
  const reducer = feedsSlice.reducer;

  test('При undefined state и неизвестном экшене возвращает initial state', () => {
    const next = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(next).toEqual(initialFeeds);
  });

  test('clearFeedsError сбрасывает поле error в null', () => {
    const stateWithError = { ...initialFeeds, error: 'some error' };
    const next = reducer(stateWithError, clearFeedsError());
    expect(next.error).toBeNull();
  });

  describe('fetchFeeds', () => {
    test('fetchFeeds.pending ставит loading=true и сбрасывает error', () => {
      const prev = { ...initialFeeds, loading: false, error: 'err' };
      const action = fetchFeeds.pending('reqId');
      const next = reducer(prev, action);
      expect(next.loading).toBe(true);
      expect(next.error).toBeNull();
    });

    test('fetchFeeds.fulfilled записывает payload в data и loading=false', () => {
      const action = fetchFeeds.fulfilled(testFeeds, 'reqId');
      const next = reducer(initialFeeds, action);
      expect(next.loading).toBe(false);
      expect(next.data).toEqual(testFeeds);
    });

    test('fetchFeeds.rejected устанавливает ошибку и loading=false', () => {
      const action = fetchFeeds.rejected(
        new Error('request rejected'),
        'reqId'
      );
      const next = reducer(initialFeeds, action);
      expect(next.loading).toBe(false);
      expect(next.error).toBe('request rejected');
    });
  });
});
