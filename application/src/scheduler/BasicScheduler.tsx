import { Recipe, Task } from "../data";
import {Scheduler, CookID, PassiveTaskStartedSubscriber, PassiveTaskFinishedSubscriber, TaskAssignedSubscriber} from "./Scheduler"
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
  ): Scheduler {
  const taskAssignedSubscribers: TaskAssignedSubscriber[] = [];
  const passiveTaskStartedSubscribers: PassiveTaskStartedSubscriber[] = [];
  const passiveTaskFinishedSubscribers: PassiveTaskFinishedSubscriber[] = [];
  let scheduler: Scheduler = {
    taskAssignedSubscribers: taskAssignedSubscribers,
    passiveTaskStartedSubscribers: passiveTaskStartedSubscribers,
    passiveTaskFinishedSubscribers: passiveTaskFinishedSubscribers,

    // Detta fältet representerar hur många gånger en task har blivit förlängd.
    // I `[number, number]` är det första värdet hur många gånger den blivit
    // "klar" och det andra värdet är hur många gånger den förlängts och en ny
    // timer startats. Vi gör så för att det inte går att stoppa en passiv task
    // som redan börjat.
    extended: new Map<TaskID, [number, number]>(),
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
    finishPassiveTask: function (task: TaskID) {

    },
    subscribeTaskAssigned: getSubscribeFunction(taskAssignedSubscribers),
    subscribePassiveTaskStarted: getSubscribeFunction(passiveTaskStartedSubscribers),
    subscribePassiveTaskFinished: getSubscribeFunction(passiveTaskFinishedSubscribers),

    // TODO: Testa så det här funkar.
    // TODO: När vi förlänger tiden av en task beter vi oss som om vi startar
    // samma task igen men att den börjar senare i tiden. Är det rätt sätt att
    // implementera det på?
    extendPassive: function(task: TaskID, add: number) {
      let started = this.currentPassiveTasks.get(task);
      if (started) {
        let new_time = new Date (started.getTime() + add*1000);
        let time_passed = (started.getTime() - new Date().getTime()) / 1000;
        let real_task = getTask(scheduler.recipe, task);
        let time_left = (real_task.estimatedTime - time_passed) + add;
        let ext = scheduler.extended.get(task);
        if (ext) {
          scheduler.extended.set(task, [ext[0], ext[1]+1])
        } else {
          throw "Failed to find ext";
        }
        startPassiveTask(time_left, this, task);
        scheduler.passiveTaskStartedSubscribers.forEach((fn) => fn(task, new_time));
        scheduler.currentPassiveTasks.set(task, new_time);
      }
    },
    getPassiveTasks: function() {
      return new Map(this.currentPassiveTasks)
    },
    getPassiveTask: function(task: TaskID) {
      return this.getPassiveTasks().get(task)
    },
    addCook: function(cook: CookID){
      cooks.includes(cook) ? "" : cooks.push(cook)
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
    getTasks: function(){return new Map(this.currentTasks);}
  };



  scheduler.cooks.forEach(cook => {
    assignNewTask(cook, scheduler)
  });
  
  
  return scheduler;
}

/**
 * Startar en passiv task. En task kan förlängas, då kallas den här metoden igen.
 * Innan det görs måste `scheduler.extended` uppdateras.
 */
function startPassiveTask(timeLeft: number, scheduler: Scheduler, task: TaskID) {
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    console.log("NEW PASSIVE TASK STARTED: " + task + " for " + new String(timeLeft));

    const finish = new Date(Date.now() + timeLeft*1000)
    scheduler.currentPassiveTasks.set(task, finish);
    scheduler.passiveTaskStartedSubscribers.forEach((fn) => fn(task, new Date(finish)));

    wait(timeLeft*1000).then(() => {
      let ext = scheduler.extended.get(task);
      if (ext) {
        if (ext[0] == ext[1]) {
          console.log("COMPLETED PASSIVE TASK: " + task);
          scheduler.completedTasks.push(task);
          scheduler.currentPassiveTasks.delete(task);
          scheduler.passiveTaskFinishedSubscribers.forEach((fn) => fn(task));

          
          // När en passiv task är klar kan nya tasks bli tillgängliga. Fördela dem.
          scheduler.cooks.filter((cook) => !scheduler.currentTasks.has(cook)).forEach(cook => {
            assignNewTask(cook, scheduler)
          });
        } else {
          let new_values: [number, number] = [ext[0] + 1, ext[1]];
          scheduler.extended.set(task, new_values);
        }
      }
  });
}


function assignNewTask(cook: CookID, scheduler: Scheduler): TaskID | undefined {
  if (scheduler.currentTasks.get(cook)) {
    return undefined
  }
  // Försöker hitta en task att ge till `cook`, tar hand om alla passiva först.
  while (true) {
      const task = getNextTask(scheduler.recipe, scheduler.completedTasks, scheduler.currentTasks, scheduler.currentPassiveTasks);
      if (task) {
        let real_task = getTask(scheduler.recipe, task);
        if (real_task.passive) {
          scheduler.extended.set(task, [0, 0]);
          startPassiveTask(real_task.estimatedTime, scheduler, task);
          continue;
        }
        scheduler.currentTasks.set(cook, task);
        scheduler.taskAssignedSubscribers.forEach((fn) => fn(task, cook));
      }
      return task;
  }
}


// Returnerar en giltig task. Returner undefined om det inte finns någon giltig task.
function getNextTask(recipe: Recipe, completedTasks: TaskID[], currentTasks: Map<CookID, TaskID>, currentPassiveTasks: Map<TaskID, Date>): TaskID | undefined {
  let task: TaskID | undefined = basicFindTask(recipe, completedTasks, Array.from(currentTasks.values()), currentPassiveTasks)

  return task;
}


// En funktion som hittar någon task att tilldela. Prioriteringen är: passiv > strongDependency > vanlig
function basicFindTask(recipe: Recipe, completedTasks: TaskID[], currentTasks: TaskID[], currentPassiveTasks: Map<TaskID, Date>): TaskID | undefined {

  let eligible: TaskID | undefined;
  let [depMap, strongDepMap] = getDependencyMaps(recipe);

  for (const task of recipe.tasks) {
    if (completedTasks.includes(task.id) || currentTasks.includes(task.id) || currentPassiveTasks.has(task.id)) {
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
/**
 * Skapar subscription function till en given array med subscribers
 * @param subList array där subscribers sparas
 * @returns subscription function till subList som returnerar unsub function
 */
function getSubscribeFunction<FunctionType>(subList: FunctionType[]) {
  const subscribe = (subscribedFunction: FunctionType) => {
    const unsubscribe = () => subList.filter((value) => value !== subscribedFunction);
    subList.push(subscribedFunction);
    return unsubscribe;
  }
  return subscribe;
}