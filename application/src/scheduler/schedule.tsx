import { type } from "os"
import * as recipe from "../../data/recipes/gräddtårta.json"
//import {Task} from "../data"

type Task = string


let noOfCooks: number = 2

let schedule = (): void => {

  calculate()

}

let calculate = () => {

  let j: Task[] = allTasks() // All tasks(jobs) // TODO Change to un-started tasks to make eligible tasks more efficient?
  let g: number = 0 // Iteration
  let W: Task[][] = [[]] //Tasks assigned to a given iteration and worker(in that order). Only one task per worker and iteration. "" represents no task being done
  let P: Map<Task, Task[]>// Presedence/dependcy over tasks. 
  let SP: Map<string, string[]> // Strong presedence/dependcy over tasks. 
  [P, SP] = dependencies()
  let C: Task[][] = [["start"]]  // Tasks that have been completed at a given iteration
  let t: number[] = [0]   // Timestamp for a given iteration
  let F: Map<Task, number> = new Map() // Finish times for tasks
  let D: Task[][] = [[]] // The eligble tasks at given iteration
  let p: Map<Task, number> = timeEstimations() // The estimated time of completion for a given task

  while (C.flat().length < j.length) {
    g++

    t[g] = nextTime(W[g - 1].flat(), F)
    C.push([])
    W[g] = new Array(noOfCooks).fill("")

    completeTasks(W, C[g], g, t, F)
    D[g] = eligibleTasks(C, W, j, g, P, SP)

    while (D[g].length > 0 && freeWorkers(W[g])) {
      let newTask: Task = D[g].pop() ?? ""
      F.set(newTask, p.get(newTask) + t[g])
      addTask(W[g], newTask)
      D[g] = eligibleTasks(C, W, j, g, P, SP)
    }
  }

  printSchedule(W, t)
  console.log("Tasks that are not completed: ")
  console.log(nonCompletedTasks(j, C.flat()))
}

const nonCompletedTasks = (tasks: Task[], completed: Task[]): Task[] => {
  return tasks.filter(task => !completed.includes(task))

}


const freeWorkers = (W: Task[]): boolean => {
  for (let i = 0; i < noOfCooks; i++) {
    if (W[i] === "")
      return true
  }
  return false
}

const addTask = (W: Task[], t: Task) => {
  for (let i = 0; i < noOfCooks; i++) {
    if (W[i] === "") {
      W[i] = t
      break
    }
  }
}

// Find the tasks eligible for assignment
// FUNKAR INTE KORREKT
const eligibleTasks = (C: string[][], W: Task[][], tasks: Task[], g: number, P: Map<Task, Task[]>, SP: Map<Task, Task[]>): string[] => {
  let eligibleTasks: Task[] = []
  let strongEligibleTasks: Task[] = []
  let anyStrong = false


  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i]
    /*if (C.flat().includes(task)) // Check if it's complete
      continue
    else if (W[g].flat().includes(task)) // Check if it's currently active
      continue
    else if (!includesAll(C.flat(), P.get(task))) // Checks if any dependencies aren't complete
      continue
    else if (includesAny(C.flat(), SP.get(task) ?? [])) { // If there are any strong dependencies, add them to array
      strongEligibleTasks.push(task)
      anyStrong = true
      continue
    }*/

    if (isEligible(task, C.flat(), W.flat(), P, SP))
      eligibleTasks.push(task)

  }



  return anyStrong ? strongEligibleTasks : eligibleTasks // If any task has all it's strong depencies completed, only strong tasks are eligible
}

const isEligible = (task: Task, completedTasks: Task[], currentTasks: Task[], weakDependencies: Map<Task, Task[]>, strongDependencies: Map<Task, Task[]>): boolean => {
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
const completeTasks = (W: Task[][], C: Task[], g: number, t: number[], F: Map<Task, number>) => {

  for (let i = 0; i < noOfCooks; i++) {
    let oldTask = W[g - 1][i]
    if (oldTask === undefined || oldTask === "" || F.get(oldTask) <= t[g]) { // Om en arbetare inte var fördelad något, om den var fördelad inget eller tasken är klar så lämnas arbetaren fri
      W[g][i] = ""
      C.push(oldTask)
    } else {
      W[g][i] = oldTask
    }
  }

  /*
    W[g].forEach(worker =>  worker.forEach(task =>{
      if(t[g] >= F.get(task)){
        C[g].push(task)
        worker.re
      }
    }))
  
    W.forEach(worker => {
      worker[g-1].forEach(task => {
        if(t[g] >= F.get(task)) {
          C[g].push("task") 
        } 
        else worker[g].push("task")
      })
    });
  */
}

// Hitta tiden för nästa iteration. Denna tid är då nästa task är klar
const nextTime = (A: string[], F: Map<Task, number>): number => {
  if (!A?.length)
    return 0

  let min: number = Infinity

  A.forEach((t: string) => min = Math.min(min, F.get(t) ?? Infinity))
  return min
}


let timeEstimations = () => {
  let estimations: Map<Task, number> = new Map()

  recipe.tasks.forEach(task => estimations.set(task.id, task.estimatedTime))
  return estimations
}

let resources = () => {
  //Where do we get availability data?
  let resources = recipe.resources.map(r => { return { "id": r.id, "name": r.name, "availability": 1 } })
  resources.push({ "id": "workers", "name": "Cooks", "availability": noOfCooks })
  /*for (let i = 0; i < noOfCooks; i++) {
    resources.push({"id": "cookNo" + i,"name": "Cook " + i})
  }
  */
  return resources
}

// All dependencies, including the ones to the implicit "start" and "end" nodes
// Returns in the form of an array with two values, [dependencies, strongDependecies]
let dependencies = (): Map<string, string[]>[] => {

  let depMap: Map<string, string[]> = new Map()
  let strongDepMap: Map<string, string[]> = new Map()
  depMap.set("end", finalTasks().map(task => task.id))

  recipe.tasks.forEach(task => {
    depMap.set(task.id, [])
    strongDepMap.set(task.id, [])
  })

  recipe.taskDependencies.forEach(taskDeps => {
    depMap.get(taskDeps.taskId)?.push(...taskDeps.dependsOn ?? [])
    strongDepMap.get(taskDeps.taskId)?.push(...taskDeps.strongDependsOn ?? [])
  })

  // Add "start" as a dependency to all starting tasks
  startTasks().forEach(startT => {
    if (startT.initalTask) // If they are inital tasks, they are to be done right after start
      strongDepMap.get(startT.id)?.push("start")
    else
      depMap.get(startT.id)?.push("start")
  })


  return [depMap, strongDepMap]
}

let allTasks = (): string[] => recipe.tasks.map(task => task.id)




// All tasks that can be done at the start, eg. all tasks with no dependencies
let startTasks = () => {
  let startTasks = recipe.tasks.filter(task => !recipe.taskDependencies.some(dep => (dep.taskId == task.id || dep.taskId == task.id)))
  return startTasks
}

let finalTasks = () => {

  return recipe.tasks.filter((task) => {
    return task.finalTask ?? false
  })
}

const printSchedule = (W: Task[][], t: number[]) => {
  console.log("Detta ska göras")
  for (let g = 0; g < W.length; g++) {
    console.log(" Tid " + t[g] + ":")
    for (let i = 0; i < W[g].length; i++) {
      console.log("   Arbeterae " + i + " ska " + W[g][i])

    }
  }
}


export const setNoOfCooks = (no: number) => noOfCooks = no

export const getNoOfCooks = (): number => noOfCooks

export default schedule
