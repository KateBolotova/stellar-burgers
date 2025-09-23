import { TConstructorIngredient, TIngredient } from '@utils-types';

export const getConstructorData = (
  selectedIds: string[],
  allIngredients: TIngredient[]
) => {
  const bun: TConstructorIngredient | null = (() => {
    for (const id of selectedIds) {
      const ing = allIngredients.find((i) => i._id === id);
      if (ing && ing.type === 'bun')
        return {
          id: ing._id,
          ...ing!
        };
    }
    return null;
  })();

  const ingredients: TConstructorIngredient[] = selectedIds
    .map((id) => allIngredients.find((i) => i._id === id))
    .filter(Boolean)
    .filter((ing) => (ing as TIngredient).type !== 'bun')
    .map((ing) => ({
      id: ing!._id,
      ...ing!
    }));

  return {
    bun: bun,
    ingredients
  };
};
