import { Recipe } from ".";

/**
 * Ger deklarationen av en ingrediens, returnerar undefined om ingrediens ej hittas
 * @param ingredientId id för ingrediens du vill ha deklaration av
 * @param recipe recept ingrediens är deklarerad i
 */
export const getIngredientDecl = (ingredientId: string, recipe: Recipe) => {
  const foundIngredient = recipe.ingredients.find(
    (ingredient) => ingredient.id == ingredientId
  );
  if (foundIngredient != undefined) {
    return foundIngredient;
  }
  throw "getIngredientDecl: Ingredient " + ingredientId + " not found";
};

/**
 * Ger namnet på en ingrediens, returnerar undefined om ingrediens ej hittas
 * @param ingredientId id för ingrediens du vill ha namn på
 * @param recipe recept ingrediens är deklarerad i
 */
export const getIngredientName = (ingredientId: string, recipe: Recipe) => {
  const foundIngredient = getIngredientDecl(ingredientId, recipe);
  return foundIngredient.name;
};

/**
 * Ger enheten för en ingrediens, returnerar undefined om ingrediens ej hittas
 * @param ingredientId id för ingrediens du vill ha enhet för
 * @param recipe recept ingrediens är deklarerad i
 */
export const getIngredientUnit = (ingredientId: string, recipe: Recipe) => {
  const foundIngredient = getIngredientDecl(ingredientId, recipe);
  return foundIngredient.unit;
};

export type IngredientListing = {
  name: string;
  amount: number;
  unit: string;
};

/**
 * Tar ut ingredienser, mängd och enhets för ett recept
 */
export const getIngredientListings = (recipe: Recipe) => {
  const ingredients: Record<string, IngredientListing> = {};
  recipe.tasks.forEach((task) => {
    task.ingredients.forEach(({ ingredientId, amount }) => {
      if (ingredientId in ingredients) {
        ingredients[ingredientId].amount += amount;
      } else {
        const ingredientUnit = getIngredientUnit(ingredientId, recipe);
        const ingredientName = getIngredientName(ingredientId, recipe);
        ingredients[ingredientId] = {
          name: ingredientName,
          amount: amount,
          unit: ingredientUnit,
        };
      }
    });
  });  
  return Object.values(ingredients);
};
