import remy from "../../data/chefs/Remy.json";
import tony from "../../data/chefs/Tony.json";

export const chefs = [remy, tony];

export type Chef = {
  id: string;
  name: string;
  color: string;
  image: string;

  // Sparade bara som idé, person kan välja sin portionsstorlek
  //portions: number;
};
