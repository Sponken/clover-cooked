import { Recipe, Task } from "../data";
import {Scheduler, CookID} from "./scheduler"
import {includesAll, removeElement} from "../utils"

type TaskID = string

// Funktion för att skapa en ny scheduler. Den ska användas genom
// ```
// let scheduler: Scheduler = createScheduler(recipe, ["William", "Pontus"], listenerFunction);
// let new_task: Task = scheduler.assignNewTask("William");
// scheduler.finishTask(new_task, "William");
// ```
export function createBasicScheduler(recipe: Recipe, cooks: CookID[], passiveTaskListener: (task: TaskID, cook: CookID) => void): Scheduler {
  let scheduler: Scheduler = {
    cooks: cooks,
    recipe: recipe,
    completedTasks: [],
    currentTasks: new Map<CookID, TaskID>(),
    currentPassiveTasks: new Map<TaskID, Date>(),
    finishTask: function (task: TaskID, cook: CookID) {
      this.completedTasks.push(task);
      this.currentTasks.delete(cook);
    },
    assignNewTask: function (cook: CookID): TaskID | undefined {
      let task = getNextTask(this.recipe, this.completedTasks, this.currentTasks);
      if (task) {
        this.currentTasks.set(cook, task);
      }
      return task;
    },
    passiveTaskListener: passiveTaskListener,
    extendPassive: function(task: TaskID, add: number){

    },
    getPassiveTasks: function() {
      let entries = Array.from(this.currentPassiveTasks.entries())
      let timeToFinish: Map<TaskID, number> = new Map(entries.map(([task, date]) => {
        let now: Date = new Date();
        let diffTime = Math.abs(now.getTime() - date.getTime()) / (1000*60)
        let timeLeft = getTask(recipe, task).estimatedTime - diffTime;
        return [task, timeLeft]

      }));
      return timeToFinish

    },
    getPassiveTask: function(task: TaskID) {
      return this.getPassiveTasks().get(task)
    },
    addCook: function(cook: CookID){
      cooks.includes(cook) ? "" : cooks.push(cook)
    },
    removeCook: function(cook: CookID){
      this.currentTasks.delete(cook)
      removeElement(cooks, cook)
    }
  };

  return scheduler;
}

// Returnerar en giltig task. Returner undefined om det inte finns någon giltig task.
function getNextTask(recipe: Recipe, completedTasks: TaskID[], currentTasks: Map<CookID, TaskID>): TaskID | undefined {
  let task: TaskID | undefined = basicFindTask(recipe, completedTasks, Array.from(currentTasks.values()))

  return task;
}


// En funktion som hittar någon task att tilldela.
function basicFindTask(recipe: Recipe, completedTasks: TaskID[], currentTasks: TaskID[]): TaskID | undefined {

  let eligible: TaskID | undefined;
  let [depMap, strongDepMap] = getDependencyMaps(recipe);

  for (const task of recipe.tasks) {
    if (completedTasks.includes(task.id) || currentTasks.includes(task.id)) {
      continue
    }
    if (!(includesAll(completedTasks, depMap.get(task.id) ?? []) && includesAll(completedTasks, strongDepMap.get(task.id) ?? []))) {
      continue
    }
    if (strongDepMap.get(task.id) != []) {
      return task.id
    }
    eligible = task.id;
  }

  return eligible;
}

let getDependencyMaps = (recipe: Recipe): [Map<TaskID, TaskID[]>, Map<TaskID, TaskID[]>] => {
  let depMap: Map<TaskID, TaskID[]> = new Map()
  let strongDepMap: Map<TaskID, TaskID[]> = new Map()


  recipe.tasks.forEach(task => {
    depMap.set(task.id, [])
    strongDepMap.set(task.id, [])
  })

  recipe.taskDependencies.forEach(taskDeps => {
    depMap.get(taskDeps.taskId)?.push(...taskDeps.dependsOn ?? [])
    strongDepMap.get(taskDeps.taskId)?.push(...taskDeps.strongDependsOn ?? [])
  })

  return [depMap, strongDepMap]
}

function getTask(recipe: Recipe, taskID: TaskID): Task{
  for (let i = 0; i < recipe.tasks.length ; i++) {
    if(recipe.tasks[i].id === taskID)
      return recipe.tasks[i]
  }
  throw "getTask: Task not found"
}