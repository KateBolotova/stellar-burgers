import { TConstructorIngredient, TIngredient } from '@utils-types';

export const getConstructorData = (
  selectedIngredients: TConstructorIngredient[]
) => {
  const bun: TConstructorIngredient | null = (() => {
    for (const ing of selectedIngredients) {
      if (ing.type == 'bun') {
        return {
          ...ing
        };
      }
    }
    return null;
  })();

  const ingredients: TConstructorIngredient[] = selectedIngredients
    .filter(Boolean)
    .filter((ing) => (ing as TIngredient).type !== 'bun');

  return {
    bun: bun,
    ingredients
  };
};
