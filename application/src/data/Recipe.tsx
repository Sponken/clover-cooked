//Recept import TODO: dynamiskt få in recept i databasen
import gräddtårta from "../../data/recipes/gräddtårta.json";
import ikeaköttbullar_med_snabbmakaroner from "../../data/recipes/ikeaköttbullar_med_snabbmakaroner.json";
import ugnspannkaka from "../../data/recipes/ugnspannkaka.json";

export const recipes = [
  gräddtårta,
  ikeaköttbullar_med_snabbmakaroner,
  ugnspannkaka,
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
  ingredients: IngredientUsage[];
  resources: ResourceUsage[];
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

/*
// Jag (Emanuel) försökte få in recepten i en lokal databas eftersom det inte kommer att gå att direkt läsa json filerna
// Det funkade inte och lyckades inte hitta felet så jag gav upp
// Sparade koden då jag tror att en liknande lösning är vad vi vill göra i framtiden


import AsyncStorage from "@react-native-async-storage/async-storage";

const recepiesKey = "@recepies";
//Initsierar den lokala databasen med recepten i 'recipes'
export async function loadRecipes(): Promise<void> {
  try {
    await AsyncStorage.setItem(recepiesKey, JSON.stringify(recipes));
  } catch (error) {}
}


//Ger en lista av recepten som fins i den lokala databasen
export async function readRecipes(): Promise<object[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(recepiesKey);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {}
  return [];
}
*/
