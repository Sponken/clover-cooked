const recipeThumbnailDir = "../../assets/image/recipe_thumbnail/";

/**
 * Function används för att hämta thumbnail bild för ett givet receptid
 * @param recipeId för receptet
 * @returns thumbnail bild för receptet eller default bild om ingen hittas
 */
export const getRecipeThumbnail = (recipeId: string) => {
  switch (recipeId) {
    case "gräddtårta":
      return require(recipeThumbnailDir + "gräddtårta.jpg");
    case "ikeabull":
      return require(recipeThumbnailDir + "ikeabull.jpg");
    case "ugnpan":
      return require(recipeThumbnailDir + "ugnpan.jpg");
    case "auberginelasagne":
      return require(recipeThumbnailDir + "auberginegratäng.jpg");
    case "lasagne":
      return require(recipeThumbnailDir + "lasagne.jpg");
    case "bönsallad":
      return require(recipeThumbnailDir + "mexikansk_bönsallad.jpg");
    case "biskvier":
      return require(recipeThumbnailDir + "chokladbiskvier.jpg");
    default:
      return require(recipeThumbnailDir + "default.png");
  }
};
