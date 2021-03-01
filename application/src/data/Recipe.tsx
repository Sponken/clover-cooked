//Recept import TODO: dynamiskt få in recept i databas eller liknande
import gräddtårta from "../../data/recipes/gräddtårta.json";
import ikeaköttbullar_med_snabbmakaroner from "../../data/recipes/ikeaköttbullar_med_snabbmakaroner.json";
import ugnspannkaka from "../../data/recipes/ugnspannkaka.json";

export const recipes = [
  gräddtårta,
  ikeaköttbullar_med_snabbmakaroner,
  ugnspannkaka,
];

type IngredientDecl = {
  id: string;
  name: string;
  unit: string;
};

type IngredientUsage = {
  ingredientId: string;
  amount: number;
};

type ResourceDecl = {
  id: string;
  name: string;
  description?: string;
};

type ResourceUsage = {
  resourceId: string;
  amount: number;
};

type Task = {
  id: string;
  name: string;
  instructions: string;
  ingredients: IngredientUsage[];
  resources: ResourceUsage[];
};

type TaskDependency = {
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
