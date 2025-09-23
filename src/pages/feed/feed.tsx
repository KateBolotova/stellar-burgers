import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectFeedsLoading,
  selectFeeds,
  fetchFeeds
} from '../../services/feeds';
import {
  selectIngredientsLoading,
  fetchIngredients
} from '../../services/ingredients';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const isFeedsLoading = useSelector(selectFeedsLoading);
  // Загрузим сразу, т.к. нужно внутри для отрисовки, чтобы не делать лоадер на карточках
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const feeds = useSelector(selectFeeds);

  useEffect(() => {
    dispatch(fetchFeeds());
    dispatch(fetchIngredients());
  }, [dispatch]);

  if (isIngredientsLoading || isFeedsLoading || !feeds) {
    return <Preloader />;
  }

  const orders: TOrder[] = feeds.orders;
  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
