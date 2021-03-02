import * as recipe from "../../data/recipes/ikeaköttbullar_med_snabbmakaroner.json"

const noOfCooks = 2

type Task = string

let schedule = () => {

  calculate()

}

let calculate = () => {

  let j: Task[] = allTasks() // All tasks(jobs)
  let g = 0 // Iteration
  let W: Task[][][] = [[["start"]]] //Tasks assigned to a given iteration and worker(in that order). The first worker is for the passive tasks, the rest represent actual workers
  let P: Map<Task, Task[]>// Presedence/dependcy over tasks. 
  let SP: Map<string, string[]> // Strong presedence/dependcy over tasks. 
  [P, SP] = dependencies()
  let C: Task[][] = [[]]  // Tasks that have been completed at a given iteration
  let t: number[] = []   // Time for a given iteration
  let F: Map<Task, number> = new Map() // Finish times for tasks
  let D: Task[][] = [[]] // The eligble tasks at given iteration
  let p: Map<Task, number> = timeEstimations() // The estimated time of completion for a given task
  while (C.flat().length < j.length){
    g++
    console.log("New loop:  " + g)
   
    t[g] = nextTime(W)
    C.push([])
    W[g] = []
    for (let i = 0; i <= noOfCooks; i++) { // Add a list of task for every cook plus one for the passive tasks
      W[g].push([])
    }
    
    completeTasks(W, C, g, t, F)
    D[g] = eligibleTasks(C, W, j, g, P, SP)

    console.log("Completed tasks:")
    console.log(C[g])

    console.log("Eligible tasks:")
    console.log(D[g])

    
    let i = 0
    while (D[g].length > 0){
      i++
      let newTask: Task = D[g].pop()
      F.set(newTask, p.get(newTask))
      addTask(W[g], newTask)
      D[g] = eligibleTasks(C,W,j,g,P,SP)
      if (i > 3) break
    }
    
   if( g > 3)
    break
  }
  /*
  for (let i = 0; i < W.length; i++) {
    console.log("Iteration " + i)
    for (let j = 0; j < W[i].length; j++) {
      console.log("  Worker no " + j)
      for (let k = 0; k < W[i][j].length; k++) {
        console.log("    Task " + W[i][j][k])
      }
    }
  }*/
}

const initWorkers = (n: number):Task[][][]  => {
  let workers: Task[][][] = [[[]]]
  for (let i = 0; i < noOfCooks; i++) {
    workers[0][i] = [];
    
  }

  workers[0][0] = ["start"]
  return workers
}

const freeWorkers = (W: Task[][]): boolean => {
  for (let i = 0; i < W.length; i++) {
    if(W[i].length === 0)
      return true
  }
  return false
}

const addTask = (W: Task[][], t: Task) =>{
  for (let i = 0; i < W.length; i++) {
    if(W[i].length === 0)
      W[i].push[t]
  }
}

// Find the tasks eligible for assignment
const eligibleTasks = (C: string[][], W: Task[][][], tasks: Task[], g: number, P: Map<Task, Task[]>, SP: Map<Task, Task[]>): string[] => {
  let eligibleTasks: Task[] = []
  let strongEligibleTasks: Task[] = []
  let anyStrong = false
  let availableWorkers = 0
  // There are no eligible tasks when all workers are busy

  for (let i = 1; i < W[g].length; i++) {
    if(W[g].length === 0)
      availableWorkers++
  }

  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i]
    if (C.flat().includes(task)) // Check if it's complete
      continue
    else if (W[g].flat().includes(task)) // Check if it's currently active
      continue
    else if (!includesAll(C.flat(), P.get(task)??[])) // Checks if any dependencies aren't complete
      continue
    else if (includesAny(C.flat(), SP.get(task)??[])){ // If there are any strong dependencies, add them to array
      strongEligibleTasks.push(task)
      anyStrong = true
      continue
    }
    eligibleTasks.push(task)

  }
  

  return anyStrong ? strongEligibleTasks : eligibleTasks // If any task has all it's strong depencies completed, only strong tasks are eligible
} 

const includesAny = (superArr: any[], subArr: any[]) => subArr.some(e =>{
  superArr.includes(e)
})

const includesAll = (superArr: any[], subArr: any[]) => subArr.every(e =>{
    superArr.includes(e)
  })


// Updates the completed tasks and the current tasks
const completeTasks = (W: Task[][][], C: Task[][], g: number, t: number[], F: Map<Task, number>) => {

  // Task that are completed are removed and added to the list of completed tasks

  W[g] = W[g-1].map(worker => worker.filter( task => {
    if ( F.get(task) > t[g])                            // Ta en titt här #################
      return true
    C[g].push(task)
    return false
  }))

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

// This method is not correct, should use F
const nextTime = (W: string[][][]) :number =>{
  let min = Infinity
  let A = W.flat(Infinity)

  A.forEach(t => min = Math.min(min, t.estimatedTime))
  return min
}


let timeEstimations = () => {
  let estimations: Map<Task, number> = new Map()

  recipe.tasks.forEach(task => estimations.set(task.id, task.estimatedTime))
  return estimations
}

let resources = () => {
  //Where do we get availability data?
  let resources = recipe.resources.map(r => {return {"id": r.id, "name": r.name, "availability": 1}})
  resources.push({"id": "workers", "name": "Cooks", "availability": noOfCooks})
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
    depMap.get(taskDeps.taskId)?.push(...taskDeps.dependsOn??[])
    strongDepMap.get(taskDeps.taskId)?.push(...taskDeps.strongDependsOn??[])
  })

  // Add "start" as a dependency to all starting tasks
  startTasks().forEach(startT => {
    if(startT.initalTask) // If they are inital tasks, they are to be done right after start
      strongDepMap.get(startT.id)?.push("start")
    else
      depMap.get(startT.id)?.push("start")
  })


  return [depMap, strongDepMap]
}

let allTasks = (): string[] => recipe.tasks.map(task => task.id)


// All tasks that can be done at the start, eg. all tasks with no dependencies
let startTasks = () => {
  let startTasks = recipe.tasks.filter(task => !recipe.taskDependencies.some(dep => (dep.taskId ==task.id|| dep.taskId == task.id)))
  return startTasks
}

let finalTasks = () => {
  
  return recipe.tasks.filter((task) =>{
    return task.finalTask ?? false
  })}




export default schedule
