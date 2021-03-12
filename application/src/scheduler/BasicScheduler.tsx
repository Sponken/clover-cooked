import { Recipe, Task } from "../data";
import {Scheduler, CookID} from "./Scheduler"
import {includesAll, removeElement} from "../utils"

type TaskID = string

// Funktion för att skapa en ny scheduler. Den ska användas genom
// ```
// let const tal  = (task: TaskID, cook: CookID)     => { /* gör saker när du får en task */ };
// let const ptsl = (task: TaskID, duration: number) => { /* gör saker när du får passiv task */ };
// let scheduler: Scheduler = createScheduler(recipe, ["William", "Pontus"], tal, ptsl);
// scheduler.finishTask(new_task, "William");
// ```
export function createBasicScheduler(recipe: Recipe, 
  cooks: CookID[], 
  taskAssignedListener: (task: TaskID, cook: CookID) => void, 
  passiveTaskStartedListener: (task: TaskID, duration: number) => void
  ): Scheduler {
  let scheduler: Scheduler = {
    cooks: cooks,
    recipe: recipe,
    completedTasks: [],
    currentTasks: new Map<CookID, TaskID>(),
    currentPassiveTasks: new Map<TaskID, Date>(),
    finishTask: function (task: TaskID, cook: CookID) {
      this.completedTasks.push(task);
      this.currentTasks.delete(cook);
      assignNewTask(cook, this)
    },
    taskAssignedListener: taskAssignedListener,
    passiveTaskStartedListener: passiveTaskStartedListener,
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
      let task = getNextTask(recipe, this.completedTasks, this.currentTasks)
      assignNewTask(cook, this)

    },
    removeCook: function(cook: CookID){
      this.currentTasks.delete(cook)
      removeElement(cooks, cook)
    },
    // Enkel implementation som antar att varje task tar 5 minuter
    timeLeft: function(){
      return (recipe.tasks.length - this.completedTasks.length) * 5

    },
  };



  scheduler.cooks.forEach(cook => {
    assignNewTask(cook, scheduler)
  });
  
  
  return scheduler;
}


function assignNewTask(cook: CookID, scheduler: Scheduler): TaskID | undefined {
  if(scheduler.currentTasks.get(cook))
    return undefined
  
  let task = getNextTask(scheduler.recipe, scheduler.completedTasks, scheduler.currentTasks);
  if (task) {
    scheduler.currentTasks.set(cook, task);
    scheduler.taskAssignedListener(task, cook)
  }
  return task;
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