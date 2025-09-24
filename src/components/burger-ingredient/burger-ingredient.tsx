import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectConstructorIngredients,
  addIngredient,
  removeIngredient
} from '../../services/burger-constructor';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    // ингридиенты, которые пользователь добавил в конструктор (в порядке)
    const selectedIngredients = useSelector(selectConstructorIngredients);

    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      if (ingredient.type == 'bun') {
        const anotherBunIndex = selectedIngredients.findIndex(
          (ingredient) => ingredient.type == 'bun'
        );
        if (anotherBunIndex !== -1) {
          dispatch(removeIngredient(anotherBunIndex));
        }
      }

      dispatch(addIngredient(ingredient));
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
