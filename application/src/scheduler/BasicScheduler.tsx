import { Recipe, Task } from "../data";
import {Scheduler, CookID, PassiveTaskStartedSubscriber, PassiveTaskFinishedSubscriber, PassiveTaskCheckFinishedSubscriber, TaskAssignedSubscriber,RecipeFinishedSubscriber} from "./Scheduler"
import {includesAll, removeElement} from "../utils"

type TaskID = string

// Bestämmer hur lång en minut är. Sätt till "1000" i dev så blir 1 minut lika lång som 1 sekund
const MINUTE = 60000;

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
  const passiveTaskCheckFinishedSubscribers: PassiveTaskCheckFinishedSubscriber[] = [];
  const recipeFinishedSubscribers: RecipeFinishedSubscriber[] =[];
  let scheduler: Scheduler = {
    taskAssignedSubscribers: taskAssignedSubscribers,
    passiveTaskStartedSubscribers: passiveTaskStartedSubscribers,
    passiveTaskFinishedSubscribers: passiveTaskFinishedSubscribers,
    passiveTaskCheckFinishedSubscribers: passiveTaskCheckFinishedSubscribers,
    recipeFinishedSubscribers: recipeFinishedSubscribers,

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
    currentPassiveTasks: new Map<TaskID, {finish: Date, timeout: NodeJS.Timeout}>(),
    finishTask: function (task: TaskID, cook: CookID) {
      this.completedTasks.push(task);
      this.currentTasks.delete(cook);
      if(isRecipeFinished(this)){
        this.recipeFinishedSubscribers.forEach((fn) => fn());
        return;
      }
      assignTasks(scheduler, cook);
    },
    finishPassiveTask: function (task: TaskID) {
      const taskProps = this.currentPassiveTasks.get(task)
      if (taskProps) {
        clearTimeout(taskProps.timeout);
        console.log("COMPLETED PASSIVE TASK: " + task);
        this.completedTasks.push(task);
        
        this.currentPassiveTasks.delete(task);
        this.passiveTaskFinishedSubscribers.forEach((fn) => fn(task));
        // När en passiv task är klar kan nya tasks bli tillgängliga. Fördela dem.
        assignTasks(this);
      }
    },
    checkPassiveTaskFinished: function (task: TaskID) {
      this.passiveTaskCheckFinishedSubscribers.forEach(f => f(task));
    },
    subscribeTaskAssigned: getSubscribeFunction(taskAssignedSubscribers),
    subscribePassiveTaskStarted: getSubscribeFunction(passiveTaskStartedSubscribers),
    subscribePassiveTaskFinished: getSubscribeFunction(passiveTaskFinishedSubscribers),
    subscribePassiveTaskCheckFinished: getSubscribeFunction(passiveTaskCheckFinishedSubscribers),
    subscribeRecipeFinished: getSubscribeFunction(recipeFinishedSubscribers),

    /**
     * Startar om ett passivt task med updaterat färdig-datum och timeout
     * Antingen given tid m add eller om undefined kommer det förlängas m 10% av taskets egna uppskattade tid
     * @add tiden i minuter som ska förlängas, kan vara undefined
     */
    extendPassive: function(task: TaskID, add?: number) {
      let taskProps = this.currentPassiveTasks.get(task);
      if (add === 0) {
        return;
      }
      if (taskProps) {
        clearTimeout(taskProps.timeout);
        const timeLeft = Math.max(taskProps.finish.getTime() - Date.now(), 0);
        let extendedTimeLeft: number;
        if (add === undefined) {
          const taskObj = this.recipe.tasks.find((foundTask) => foundTask.id === task)
          if (taskObj) {
            extendedTimeLeft = timeLeft + taskObj.estimatedTime * 0.2 * MINUTE;
            //förlänger med åtminstonde 20 sekunder
            if (extendedTimeLeft < 20000){
              extendedTimeLeft = 20000;
            }
          } else {
            throw "extendPassive: " + task + " not found in recipe"
          }
        }
        else {
          extendedTimeLeft = timeLeft + add * MINUTE;
        }
        startPassiveTask(extendedTimeLeft / MINUTE, this, task);
      }
    },
    getPassiveTasks: function() {
      let tasks = new Map<string, Date>()
      this.currentPassiveTasks.forEach(({finish},task) => tasks.set(task, new Date(finish)))
      return tasks
    },
    getPassiveTask: function(task: TaskID) {
      return this.getPassiveTasks().get(task)
    },
    addCook: function(cook: CookID){
      cooks.includes(cook) ? "" : cooks.push(cook)
      assignTasks(this, cook);

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


  assignTasks(scheduler);
  
  return scheduler;
}

/**
 * Startar eller förnyar ett passivt task. 
 * @timeLeft Tid i minuter tills task förväntas vara färdigt
 */
function startPassiveTask(timeLeft: number, scheduler: Scheduler, task: TaskID) {
  //const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  console.log("NEW PASSIVE TASK STARTED: " + task + " for " + new String(timeLeft));
  const finish = new Date(Date.now() + timeLeft*MINUTE)
  const timeout = setTimeout(() => scheduler.checkPassiveTaskFinished(task), timeLeft*MINUTE)
  scheduler.currentPassiveTasks.set(task, {finish: finish, timeout: timeout});
  
  scheduler.passiveTaskStartedSubscribers.forEach((fn) => fn(task, new Date(finish)));

  /*
  wait(timeLeft*1000).then(() => {
    let ext = scheduler.extended.get(task);
    if (ext) {
      if (ext[0] == ext[1]) {
        console.log("COMPLETED PASSIVE TASK: " + task);
        scheduler.completedTasks.push(task);
        
        scheduler.currentPassiveTasks.delete(task);
        scheduler.passiveTaskFinishedSubscribers.forEach((fn) => fn(task));
        // När en passiv task är klar kan nya tasks bli tillgängliga. Fördela dem.
        assignTasks(scheduler);
      } else {
        let new_values: [number, number] = [ext[0] + 1, ext[1]];
        scheduler.extended.set(task, new_values);
      }
    }
  });*/
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
    const unsubscribe = () => {subList = subList.filter((value) => value !== subscribedFunction)};
    subList.push(subscribedFunction);
    return unsubscribe;
  }
  return subscribe;
}

/**
 * Hittar alla tasks som är möjliga att utföra
 * Returnerar två listor. Den första listan innehållar alla passiva tasks som bör påbörjas,
 * den andra innehåller alla andra tasks som kan fördelas, i olika listor. Tasksen i varje lista har samma 
 * prioritet, där de i den första bör göras först
 */
function getEligibleTasks(
  scheduler: Scheduler): [TaskID[], TaskID[][]] {
  let recipe: Recipe = scheduler.recipe
  let completedTasks: TaskID[] = scheduler.completedTasks
  let currentTasks: TaskID[] = Array.from(scheduler.currentTasks.values())
  let currentPassiveTasks = scheduler.currentPassiveTasks
    
  let eligibleTasks: TaskID[] = [];
  let strongEligibleTasks: TaskID[] = [];
  let passiveEligibleTasks: TaskID[] = [];
  let initialEligibleTasks: TaskID[] = []; //De initiala tasksen ska fördelas först och behöver därför hållas koll på separat
  let [depMap, strongDepMap] = getDependencyMaps(recipe);

  for (const task of recipe.tasks) {
    if (completedTasks.includes(task.id) || currentTasks.includes(task.id) || currentPassiveTasks.has(task.id)) {
      continue
    }
    if (!(includesAll(completedTasks, depMap.get(task.id) ?? []) && includesAll(completedTasks, strongDepMap.get(task.id) ?? []))) {
      continue
    }
    if (task.passive){
      passiveEligibleTasks.push(task.id)
      continue;
    }
    if (task.initalTask){
      initialEligibleTasks.push(task.id)
      continue
    }
    if (strongDepMap.get(task.id) != []) {
      strongEligibleTasks.push(task.id)
      continue
    }
    eligibleTasks.push(task.id);
  }


  return [passiveEligibleTasks, [initialEligibleTasks, strongEligibleTasks, eligibleTasks]]
}


// Om det går att fortsätta på samma "branch" som den senaste avslutade tasken, gör det
// Annars ta första möjliga uppgiften på den mest kritiska pathen 
function assignTasks(scheduler: Scheduler, cook?: CookID) {

  let passiveTasks: TaskID[]
  let eligibleTasks: TaskID[][]
  [passiveTasks, eligibleTasks] = getEligibleTasks(scheduler);

  // Starta alla passiva tasks som är möjliga
  for (const passiveTask of passiveTasks) {
    let real_task = getTask(scheduler.recipe, passiveTask);
    scheduler.extended.set(passiveTask, [0, 0]);
    startPassiveTask(real_task.estimatedTime, scheduler, passiveTask);
  }
  

  for (const tasks of eligibleTasks) {
    prioritizeAndAssignTasks(scheduler, tasks, cook)
  }



}



// Tilldelar givna uppgifter. Försöker först tilldela till kock som jobbar på branchen, sedan för att minimera tiden
function prioritizeAndAssignTasks(scheduler: Scheduler, eligibleTasks: TaskID[], cook?: CookID) {
  let [depMap, strongDepMap] = getDependencyMaps(scheduler.recipe);


  // Kolla om några möjliga tasks har dependencies som precis avslutades
  let lastCompletedTask: TaskID = scheduler.completedTasks[scheduler.completedTasks.length-1]
  let cond = (eTask: TaskID) => strongDepMap.get(eTask)?.includes(lastCompletedTask) || depMap.get(eTask)?.includes(lastCompletedTask)
  let dependers = eligibleTasks.filter(cond)

  assignGivenTasks(scheduler, dependers, cook);

  let rest = eligibleTasks.filter(eTask => !cond(eTask))
  let paths = findCriticalPathTasks(scheduler.recipe, rest);
  assignGivenTasks(scheduler, paths, cook);
}



function assignGivenTasks(scheduler: Scheduler, tasksToAssign: TaskID[], priorityCook?: CookID) {
  let cooks = vacantCooks(scheduler);
  if (priorityCook) {
    cooks = cooks.filter(c => c != priorityCook)
    cooks.push(priorityCook)
  }

  for (const task of tasksToAssign) {
    const cook = cooks.pop()
    if (cook) {
      scheduler.currentTasks.set(cook, task);
      scheduler.taskAssignedSubscribers.forEach((fn) => fn(task, cook))
    } else {
      break
    }
  }
}

function isRecipeFinished(scheduler: Scheduler): boolean{
  return (scheduler.completedTasks.length == scheduler.recipe.tasks.length);
}


function vacantCooks(scheduler: Scheduler): CookID[] {
  return scheduler.cooks.filter(cook => !scheduler.currentTasks.has(cook))
}


function findCriticalPathTasks(recipe: Recipe, availableTasks: TaskID[]): TaskID[] {
  if (availableTasks.length == 0) { return [] }
  let graph = makeDepGraph(recipe);
  let res: [TaskID, number][] = availableTasks.map((task) => [task, longestPath(task, graph)]);

  // Sort the list from largest path to smallest.
  res.sort( (a, b) => b[1] - a[1])
  return res.map( (a) => a[0]);
}

function makeDepGraph(recipe: Recipe): Map<TaskID, [number, TaskID[]]> {
  let graph: Map<TaskID, [number, TaskID[]]> = new Map();
  for (const task of recipe.tasks) {
    graph.set(task.id, [task.estimatedTime, []]);
  }
  for (const dep of recipe.taskDependencies) {
    let to_id = dep.taskId;
    let deps = dep.dependsOn;
    let depsStrong = dep.strongDependsOn;
    if (deps) {
      for (const from_id of deps) {
        let el = graph.get(from_id) ?? [0, []];
        el[1].push(to_id);
      }
    }
    if (depsStrong) {
      for (const from_id of depsStrong) {
        let el = graph.get(from_id) ?? [0, []];
        el[1].push(to_id);
      }
    }
  }
  return graph
}

// Assumes loopless graph
function longestPath(start: TaskID, graph: Map<TaskID, [number, TaskID[]]>): number {
  let things = graph.get(start);
  if (things) {
    let [value, neighbours] = things;
    if (neighbours.length == 0) {
      return value;
    }
    let values = [];
    for (const nb of neighbours) {
      values.push(longestPath(nb, graph));
    }
    return value + Math.max(...values);
  }
  throw "longestPath failed, node not in graph"
}