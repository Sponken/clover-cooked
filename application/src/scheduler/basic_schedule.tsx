import { Recipe, Task } from "../data";
import * as recipe from "../../data/recipes/ikeaköttbullar_med_snabbmakaroner.json";

type Cook = string;

export type Scheduler = {
  recipe: Recipe;
  completedTasks: Task[];
  currentTasks: Map<Cook, Task>;
  finishTask: (task: Task, cook: Cook) => void;
  assignNewTask: (cook: Cook) => Task;
};

function getBestNextTask(recipe: Recipe, completedTasks: Task[]): Task {
  // Magi för att hitta den bästa tasken
  return Task;
}

export function getScheduler(recipe: Recipe, cooks: Cook[]): Scheduler {
  let scheduler: Scheduler = {
    recipe: recipe,
    completedTasks: [],
    currentTasks: new Map(),
    finishTask: function(task: Task, cook: Cook) {
      this.completedTasks.push(task);
      this.currentTasks.delete(cook);
    },
    assignNewTask: function(cook: Cook): Task {
      let task = getBestNextTask(this.recipe, this.completedTasks);
      this.currentTasks.set(cook, task);
      return task;
    },
  };

  return scheduler;
}

// Imagine this is in a seperate file
let scheduler: Scheduler = getScheduler(recipe, ["William", "Pontus"]);
scheduler.assignNewTask("William");
scheduler.getTask("William");
