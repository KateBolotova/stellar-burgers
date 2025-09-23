import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { selectConstructorIds } from '../../services/burger-constructor';
import { selectIngredients } from '../../services/ingredients';
import { getConstructorData } from '../../utils/utils';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  // ids, которые пользователь добавил в конструктор (в порядке)
  const selectedIds = useSelector(selectConstructorIds);

  // все доступные ингредиенты из стора (нужно для мапинга id -> объект)
  const allIngredients = useSelector(selectIngredients);

  const burgerConstructor = useMemo(
    () => getConstructorData(selectedIds, allIngredients),
    [selectedIds, allIngredients]
  );

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients } = burgerConstructor;
    const counters: { [key: string]: number } = {};
    ingredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
