//Recept import TODO: dynamiskt få in recept i databas eller liknande
import gräddtårta from "../../../common/data/recipes//gräddtårta.json";
import ikeaköttbullar_med_snabbmakaroner from "../../../common/data/recipes//ikeaköttbullar_med_snabbmakaroner.json";
import ugnspannkaka from "../../../common/data/recipes//ugnspannkaka.json";
import chokladbiskvier from "../../../common/data/recipes//chokladbiskvier.json";
import auberginegratäng from "../../../common/data/recipes//auberginegratäng.json";
import mexikans_bönsallad from "../../../common/data/recipes//mexikans_bönsallad.json";
import lasagne from "../../../common/data/recipes/lasagne.json";

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
