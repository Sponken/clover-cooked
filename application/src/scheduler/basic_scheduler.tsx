import { Recipe, Task } from "../data";
import {Scheduler, CookID} from "./scheduler"
import {includesAll} from "../utils"

type TaskId = string

// Funktion för att skapa en ny scheduler. Den ska användas genom
// ```
// let scheduler: Scheduler = createScheduler(recipe, ["William", "Pontus"], listenerFunction);
// let new_task: Task = scheduler.assignNewTask("William");
// scheduler.finishTask(new_task, "William");
// ```
export function createBasicScheduler(recipe: Recipe, cooks: CookID[], passiveTaskListener: (task: Task, cook: CookID) => void): Scheduler {
  let scheduler: Scheduler = {
    cooks: cooks,
    recipe: recipe,
    completedTasks: [],
    currentTasks: new Map(),
    currentPassiveTasks: new Map(),
    finishTask: function (task: Task, cook: CookID) {
      this.completedTasks.push(task);
      this.currentTasks.delete(cook);
    },
    assignNewTask: function (cook: CookID): Task | undefined {
      let task = getNextTask(this.recipe, this.completedTasks, this.currentTasks);
      if (task) {
        this.currentTasks.set(cook, task);
      }
      return task;
    },
    passiveTaskListener: passiveTaskListener,
    extendPassive: function(task: Task, add: number){

    },
    getPassiveTasks: function() {
      let entries = Array.from(this.currentPassiveTasks.entries())
      let timeToFinish: Map<Task, number> = new Map(entries.map(([task, date]) => {
        let now: Date = new Date();
        let diffTime = Math.abs(now.getTime() - date.getTime()) / (1000*60)
        let timeLeft = task.estimatedTime - diffTime;
        return [task, timeLeft]

      }));
      return timeToFinish

    },
    getPassiveTask: function(task: Task) {
      return this.getPassiveTasks().get(task)
    }
  };

  return scheduler;
}

// Returnerar en giltig task. Returner undefined om det inte finns någon giltig task.
function getNextTask(recipe: Recipe, completedTasks: Task[], currentTasks: Map<CookID, Task>): Task | undefined {
  let task: Task | undefined = basicFindTask(recipe, completedTasks, Array.from(currentTasks.values()))

  return task;
}


// En funktion som hittar någon task att tilldela.
function basicFindTask(recipe: Recipe, completedTasks: Task[], currentTasks: Task[]): Task | undefined {

  let eligible: Task | undefined;
  let [depMap, strongDepMap] = getDependencyMaps(recipe);

  for (const task of recipe.tasks) {
    if (completedTasks.includes(task) || currentTasks.includes(task)) {
      continue
    }
    if (!(includesAll(completedTasks, depMap.get(task.id) ?? []) && includesAll(completedTasks, strongDepMap.get(task.id) ?? []))) {
      continue
    }
    if (strongDepMap.get(task.id) != []) {
      return task
    }
    eligible = task;
  }

  return eligible;
}

let getDependencyMaps = (recipe: Recipe): [Map<TaskId, TaskId[]>, Map<TaskId, TaskId[]>] => {
  let depMap: Map<TaskId, TaskId[]> = new Map()
  let strongDepMap: Map<TaskId, TaskId[]> = new Map()


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

