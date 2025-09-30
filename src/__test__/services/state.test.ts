import { initialFeeds } from '../../services/feeds';
import { rootReducer } from '../../services/store';
import { initialOrders } from '../../services/orders';
import { initialProfile } from '../../services/profile';
import { initialOrderCreation } from '../../services/order-creation';
import { initialIngredients } from '../../services/ingredients';
import { initialConstructor } from '../../services/burger-constructor';

describe('root reducer', () => {
  const reducer = rootReducer;
  test('При undefined state и неизвестном экшене возвращает initial state', () => {
    const next = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(next.feeds).toEqual(initialFeeds);
    expect(next.burgerConstructor).toEqual(initialConstructor);
    expect(next.ingredients).toEqual(initialIngredients);
    expect(next.orderCreation).toEqual(initialOrderCreation);
    expect(next.profile).toEqual(initialProfile);
    expect(next.orders).toEqual(initialOrders);
  });
});
