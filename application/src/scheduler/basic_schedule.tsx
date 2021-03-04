import { Recipe, Task } from "../data";

type Cook = string;
type TaskId = string

// Detta representerar en schemaläggare som har koll på och delar ut tasks.
// "finishTask" och "assignNewTask" används för att avsluta respektive dela ut nya uppgifter. assignNewTask returnerar den
// delegerade uppgiften, och undefined i de fall då ingen uppgift delades ut.
// passiveTaskListener kallas på när en passiv task är avslutat, och returnar uppgiften tillsammans med en kock som ska utföra den.
// - OBS passiveTaskListener är inte implementerad OBS -
export type Scheduler = {
  cooks: Cook[];
  recipe: Recipe;
  completedTasks: Task[];
  currentTasks: Map<Cook, Task>;
  finishTask: (task: Task, cook: Cook) => void;
  assignNewTask: (cook: Cook) => Task | undefined;
  passiveTaskListener: (task: Task, cook: Cook) => void;
};

// Funktion för att skapa en ny scheduler. Den ska användas genom
// ```
// let scheduler: Scheduler = getScheduler(recipe, ["William", "Pontus"], listener);
// let new_task: Task = scheduler.assignNewTask("William");
// scheduler.finishTask(new_task, "William");
// ```
export function createScheduler(recipe: Recipe, cooks: Cook[], passiveTaskListener: (task: Task, cook: Cook) => void): Scheduler {
  let scheduler: Scheduler = {
    cooks: cooks,
    recipe: recipe,
    completedTasks: [],
    currentTasks: new Map(),
    finishTask: function (task: Task, cook: Cook) {
      this.completedTasks.push(task);
      this.currentTasks.delete(cook);
    },
    assignNewTask: function (cook: Cook): Task | undefined {
      let task = getNextTask(this.recipe, this.completedTasks, this.currentTasks);
      if (task) {
        this.currentTasks.set(cook, task);
      }
      return task;
    },
    passiveTaskListener: passiveTaskListener
  };

  return scheduler;
}

// Returnerar en giltig task. Returner undefined om det inte finns någon giltig task.
function getNextTask(recipe: Recipe, completedTasks: Task[], currentTasks: Map<Cook, Task>): Task | undefined {
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

const includesAll = (superArr: any[], subArr: any[]): boolean => subArr.every(e =>
  superArr.includes(e)
)