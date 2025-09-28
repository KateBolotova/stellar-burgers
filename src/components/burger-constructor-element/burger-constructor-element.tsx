import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch, useSelector } from '../../services/store';
import {
  moveIngredient,
  removeIngredient,
  selectConstructorIngredients
} from '../../services/burger-constructor';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const selectedIngredients = useSelector(selectConstructorIngredients);

    const selectedIndex = selectedIngredients.findIndex(
      (ing) => ing.id === ingredient.id
    );

    const handleMoveDown = () => {
      dispatch(
        moveIngredient({
          from: selectedIndex,
          to: selectedIndex + 1
        })
      );
    };

    const handleMoveUp = () => {
      dispatch(
        moveIngredient({
          from: selectedIndex,
          to: selectedIndex - 1
        })
      );
    };

    const handleClose = () => {
      dispatch(removeIngredient(selectedIndex));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
