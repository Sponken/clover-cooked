//Recept import TODO: dynamiskt få in recept i databas eller liknande
import gräddtårta from "../../data/recipes/gräddtårta.json";
import ikeaköttbullar_med_snabbmakaroner from "../../data/recipes/ikeaköttbullar_med_snabbmakaroner.json";
import ugnspannkaka from "../../data/recipes/ugnspannkaka.json";
import chokladbiskvier from "../../data/recipes/chokladbiskvier.json";
import auberginegratäng from "../../data/recipes/auberginegratäng.json";
import mexikans_bönsallad from "../../data/recipes/mexikans_bönsallad.json";
import lasagne from "../../data/recipes/lasagne.json";

export const recipes = [
  gräddtårta,
  ikeaköttbullar_med_snabbmakaroner,
  ugnspannkaka,
  chokladbiskvier,
  auberginegratäng,
  mexikans_bönsallad,
  lasagne,
];

export type IngredientDecl = {
  id: string;
  name: string;
  unit: string;
};

export type IngredientUsage = {
  ingredientId: string;
  amount: number;
};

export type ResourceDecl = {
  id: string;
  name: string;
  description?: string;
};

export type ResourceUsage = {
  resourceId: string;
  amount: number;
};

export type Task = {
  id: string;
  name: string;
  instructions: string;
  passive?: boolean;
  ingredients: IngredientUsage[];
  resources: ResourceUsage[];
  estimatedTime: number;
};

export type TaskDependency = {
  taskId: string;
  dependsOn?: string[];
  strongDependsOn?: string[];
};

export type Recipe = {
  name: string;
  description: string;
  ingredients: IngredientDecl[];
  resources: ResourceDecl[];
  tasks: Task[];
  taskDependencies: TaskDependency[];
  portions: number;
  id: string;
};
