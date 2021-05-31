//Recept import TODO: dynamiskt få in recept i databas eller liknande
import gräddtårta from "../../../application/data/recipes/gräddtårta.json";
import ikeaköttbullar_med_snabbmakaroner from "../../../application/data/recipes/ikeaköttbullar_med_snabbmakaroner.json";
import ugnspannkaka from "../../../application/data/recipes/ugnspannkaka.json";
import chokladbiskvier from "../../../application/data/recipes/chokladbiskvier.json";
import auberginegratäng from "../../../application/data/recipes/auberginegratäng.json";
import mexikans_bönsallad from "../../../application/data/recipes/mexikans_bönsallad.json";
import lasagne from "../../../application/data/recipes/lasagne.json";

export const recipes = [
  auberginegratäng,
  lasagne,
  mexikans_bönsallad,
  chokladbiskvier,
  // gräddtårta,
  // ikeaköttbullar_med_snabbmakaroner,
  // ugnspannkaka,
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
  initalTask?: boolean;
  ingredients: IngredientUsage[];
  resources: ResourceUsage[];
  estimatedTime: number;
  branch?: string;
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
  requiresSettingTable: boolean;
};
