import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectUserOrdersLoading,
  selectUserOrders,
  fetchUserOrders
} from '../../services/orders';
import {
  selectIngredientsLoading,
  fetchIngredients
} from '../../services/ingredients';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectUserOrders);
  const isOrdersLoading = useSelector(selectUserOrdersLoading);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);

  useEffect(() => {
    dispatch(fetchUserOrders());
    dispatch(fetchIngredients());
  }, [dispatch]);

  if (isOrdersLoading || isIngredientsLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
