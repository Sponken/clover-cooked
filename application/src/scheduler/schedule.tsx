import { Recipe, Task } from "../data";


type TaskId = string

// TANKE: Pontus frågor
// - Jag förstår inte riktigt koden överlag än men typer är mer logiska nu.
// - Vi jobbar hela tiden med id på tasks och har sedan flera `Map`s som har information om tasks. Men borde vi inte bara skicka runt tasks istället?
// - Hur ska vi hantera att vissa tasks håller på just nu? Ska de ligga i `W`? Man skulle kunna tänka sig att algoritmen redan "gått några iterationer" och fördelat ut uppgifter.
//   Men då måste vi också veta hur länge personer har hållt på eller? För att kunna säga hur länge mer de kommer jobba.
// - Completed tasks borde läggas i `C` iallafall
// - Vart är A (De tasks som är "aktiva" vid en specifik tidpunkt)? A används i `nextTime` men det som skickas in är `W[g - 1].flat()`. Hur skiljer sig algoritmen från det som står i pappret?
function calculate(
  recipe: Recipe,
  completedTasks: Task[],
  noOfCooks: number,
): Task {
  let j: TaskId[] = allTasks(recipe)        // All tasks(jobs) // TODO Change to un-started tasks to make eligible tasks more efficient?
  let g: number = 0                       // Iteration
  let W: TaskId[][] = [[]]                    // Tasks assigned to a given iteration and worker(in that order). Only one task per worker and iteration. "" represents no task being done
  let P: Map<TaskId, TaskId[]>                         // Presedence/dependcy over tasks. 
  let SP: Map<string, string[]>                         // Strong presedence/dependency over tasks.
  [P, SP] = dependencies(recipe);
  let C: TaskId[][] = [["start"]]             // Tasks that have been completed at a given iteration
  let t: number[] = [0]                     // Timestamp for a given iteration
  let F: Map<TaskId, number> = new Map()               // Finish times for tasks
  let D: TaskId[][] = [[]]                    // The eligble tasks at given iteration
  let p: Map<TaskId, number> = timeEstimations(recipe) // The estimated time of completion for a given task

  // TANKE: Varför just det här kriteriet? Det är väl inte vad som står i pappret?
  while (C.flat().length < j.length) {
    g++;

    t[g] = nextTime(W[g - 1].flat(), F);
    C.push([]);
    W[g] = new Array(noOfCooks).fill("");

    completeTasks(W, C[g], g, t, F, noOfCooks);
    D[g] = eligibleTasks(C, W, j, g, P, SP);

    while (D[g].length > 0 && freeWorkers(W[g], noOfCooks)) {
      let newTask: TaskId = D[g].pop() ?? "";
      F.set(newTask, p.get(newTask) + t[g]);
      addTask(W[g], newTask, noOfCooks);
      D[g] = eligibleTasks(C, W, j, g, P, SP);
    }
  }


  printSchedule(W, t);
  return W[0][0] // TANKE: Hur väljer man den?
  console.log("Tasks that are not completed: ")
  console.log(nonCompletedTasks(j, C.flat()))
}

const nonCompletedTasks = (tasks: TaskId[], completed: TaskId[]): TaskId[] => {
  return tasks.filter(task => !completed.includes(task))

}


const freeWorkers = (W: TaskId[], noOfCooks: number): boolean => {
  for (let i = 0; i < noOfCooks; i++) {
    if (W[i] === "")
      return true
  }
  return false
}

const addTask = (W: TaskId[], t: TaskId, noOfCooks: number) => {
  for (let i = 0; i < noOfCooks; i++) {
    if (W[i] === "") {
      W[i] = t
      break
    }
  }
}

// Find the tasks eligible for assignment
// FUNKAR INTE KORREKT
function eligibleTasks(C: string[][], W: TaskId[][], tasks: TaskId[], g: number, P: Map<TaskId, TaskId[]>, SP: Map<TaskId, TaskId[]>): string[] {
  let eligibleTasks: TaskId[] = []
  let strongEligibleTasks: TaskId[] = []
  let anyStrong = false


  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i]
    if (isEligible(task, C.flat(), W.flat(), P, SP)) {
      eligibleTasks.push(task)
    }
  }

  return anyStrong ? strongEligibleTasks : eligibleTasks // If any task has all it's strong depencies completed, only strong tasks are eligible
}

const isEligible = (task: TaskId, completedTasks: TaskId[], currentTasks: TaskId[], weakDependencies: Map<TaskId, TaskId[]>, strongDependencies: Map<TaskId, TaskId[]>): boolean => {
  if (completedTasks.includes(task)) {
    return false
  }
  else if (currentTasks.includes(task)) {
    return false
  }
  else if (!includesAll(completedTasks, weakDependencies.get(task)) || !includesAll(completedTasks, strongDependencies.get(task))) {
    return false
  }

  return true
}

const includesAny = (superArr: any[], subArr: any[]): boolean => subArr.some(e =>
  superArr.includes(e)
)

const includesAll = (superArr: any[], subArr: any[]): boolean => subArr.every(e =>
  superArr.includes(e)
)

// Updates the completed tasks and the current tasks
const completeTasks = (W: TaskId[][], C: TaskId[], g: number, t: number[], F: Map<TaskId, number>, noOfCooks: number) => {

  for (let i = 0; i < noOfCooks; i++) {
    let oldTask = W[g - 1][i]
    if (oldTask === undefined || oldTask === "" || F.get(oldTask) <= t[g]) { // Om en arbetare inte var fördelad något, om den var fördelad inget eller tasken är klar så lämnas arbetaren fri
      W[g][i] = ""
      C.push(oldTask)
    } else {
      W[g][i] = oldTask
    }
  }
}

// Hitta tiden för nästa iteration. Denna tid är då nästa task är klar
const nextTime = (A: string[], F: Map<TaskId, number>): number => {
  if (!A?.length)
    return 0

  let min: number = Infinity

  A.forEach((t: string) => min = Math.min(min, F.get(t) ?? Infinity))
  return min
}


let timeEstimations = (recipe: Recipe) => {
  let estimations: Map<TaskId, number> = new Map()

  recipe.tasks.forEach(task => estimations.set(task.id, task.estimatedTime))
  return estimations
}



// All dependencies, including the ones to the implicit "start" and "end" nodes
// Returns in the form of an array with two values, [dependencies, strongDependecies]
let dependencies = (recipe: Recipe): [Map<TaskId, TaskId[]>, Map<string, string[]>] => {

  let depMap: Map<string, string[]> = new Map()
  let strongDepMap: Map<string, string[]> = new Map()
  depMap.set("end", finalTasks(recipe).map(task => task.id))

  recipe.tasks.forEach(task => {
    depMap.set(task.id, [])
    strongDepMap.set(task.id, [])
  })

  recipe.taskDependencies.forEach(taskDeps => {
    depMap.get(taskDeps.taskId)?.push(...taskDeps.dependsOn ?? [])
    strongDepMap.get(taskDeps.taskId)?.push(...taskDeps.strongDependsOn ?? [])
  })

  // Add "start" as a dependency to all starting tasks
  startTasks(recipe).forEach(startT => {
    if (startT.initialTask) // If they are inital tasks, they are to be done right after start
      strongDepMap.get(startT.id)?.push("start")
    else
      depMap.get(startT.id)?.push("start")
  })


  return [depMap, strongDepMap]
}

let allTasks = (recipe: Recipe): string[] => recipe.tasks.map(task => task.id);




// All tasks that can be done at the start, eg. all tasks with no dependencies
let startTasks = (recipe: Recipe) => {
  let startTasks = recipe.tasks.filter(task => !recipe.taskDependencies.some(dep => (dep.taskId == task.id || dep.taskId == task.id)))
  return startTasks
}

let finalTasks = (recipe: Recipe) => {

  return recipe.tasks.filter((task) => {
    return task.finalTask ?? false
  })
}

const printSchedule = (W: TaskId[][], t: number[]) => {
  console.log("Detta ska göras")
  for (let g = 0; g < W.length; g++) {
    console.log(" Tid " + t[g] + ":")
    for (let i = 0; i < W[g].length; i++) {
      console.log("   Arbeterae " + i + " ska " + W[g][i])

    }
  }
}

let resources = (recipe: Recipe, noOfCooks: number) => {
  //Where do we get availability data?
  let resources = recipe.resources.map(r => { return { "id": r.id, "name": r.name, "availability": 1 } })
  resources.push({ "id": "workers", "name": "Cooks", "availability": noOfCooks })
  /*for (let i = 0; i < noOfCooks; i++) {
    resources.push({"id": "cookNo" + i,"name": "Cook " + i})
  }
  */
  return resources
}