import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectConstructorIds,
  addIngredient,
  removeIngredient
} from '../../services/burger-constructor';
import { selectIngredients } from '../../services/ingredients';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    // ids, которые пользователь добавил в конструктор (в порядке)
    const selectedIds = useSelector(selectConstructorIds);

    // все доступные ингредиенты из стора (нужно для мапинга id -> объект)
    const allIngredients = useSelector(selectIngredients);

    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      if (ingredient.type == 'bun') {
        const anotherBunIndex = selectedIds.findIndex(
          (selectedBunId) =>
            !!allIngredients.find(
              (ing) => ing.type == 'bun' && ing._id === selectedBunId
            )
        );
        if (anotherBunIndex !== -1) {
          dispatch(removeIngredient(anotherBunIndex));
        }
      }

      dispatch(addIngredient(ingredient._id));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
