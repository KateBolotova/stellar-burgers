import { FC, useMemo } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { selectUserProfile } from '../../services/profile';
import {
  selectCreateOrderLoading,
  selectLastCreatedOrder,
  clearLastOrder,
  createOrder
} from '../../services/order-creation';
import {
  selectConstructorIds,
  clearConstructor
} from '../../services/burger-constructor';
import { fetchUserOrders } from '../../services/orders';
import { selectIngredients } from '../../services/ingredients';
import { getConstructorData } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ids, которые пользователь добавил в конструктор (в порядке)
  const selectedIds = useSelector(selectConstructorIds);

  // все доступные ингредиенты из стора (нужно для мапинга id -> объект)
  const allIngredients = useSelector(selectIngredients);

  // флаг, что запрос создания заказа в процессе
  const orderRequest = useSelector(selectCreateOrderLoading);

  // данные последнего созданного заказа (для модалки)
  const orderModalData = useSelector(selectLastCreatedOrder);

  // пользователь для проверки авторизации
  const user = useSelector(selectUserProfile);

  /**
   * Собираем constructorItems:
   * - bun: первый найденный ингредиент типа 'bun' среди selectedIds (или null)
   * - ingredients: все остальные выбранные ингредиенты (в порядке)
   */
  const constructorItems = useMemo(
    () => getConstructorData(selectedIds, allIngredients),
    [selectedIds, allIngredients]
  );

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(createOrder(selectedIds)).then(() => {
      dispatch(clearLastOrder());
      dispatch(clearConstructor());
      dispatch(fetchUserOrders());
    });
  };
  const closeOrderModal = () => {
    dispatch(clearLastOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
