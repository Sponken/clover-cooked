import { Recipe } from ".";

/**
 * Ger deklarationen av en ingrediens, returnerar undefined om ingrediens ej hittas
 * @param ingredientId id för ingrediens du vill ha deklaration av
 * @param recipe recept ingrediens är deklarerad i
 */
export const getIngredientDecl = (ingredientId: string, recipe: Recipe) => {
  return recipe.ingredients.find((ingredient) => ingredient.id == ingredientId);
};

/**
 * Ger namnet på en ingrediens, returnerar undefined om ingrediens ej hittas
 * @param ingredientId id för ingrediens du vill ha namn på
 * @param recipe recept ingrediens är deklarerad i
 */
export const getIngredientName = (ingredientId: string, recipe: Recipe) => {
  const foundIngredient = getIngredientDecl(ingredientId, recipe);
  if (foundIngredient != undefined) {
    return foundIngredient.name;
  }
  return undefined;
};

/**
 * Ger enheten för en ingrediens, returnerar undefined om ingrediens ej hittas
 * @param ingredientId id för ingrediens du vill ha enhet för
 * @param recipe recept ingrediens är deklarerad i
 */
export const getIngredientUnit = (ingredientId: string, recipe: Recipe) => {
  const foundIngredient = getIngredientDecl(ingredientId, recipe);
  if (foundIngredient != undefined) {
    return foundIngredient.unit;
  }
  return undefined;
};
