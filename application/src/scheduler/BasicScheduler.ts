import { Recipe, Task, isIdleTaskID, doDishesTaskID, setTableTaskID, helpOrRestTaskID } from "../data";
import { Scheduler, CookID, PassiveTaskStartedSubscriber, PassiveTaskFinishedSubscriber, PassiveTaskCheckFinishedSubscriber, TaskAssignedSubscriber, RecipeFinishedSubscriber, ProgressSubscriber } from "./Scheduler"
import { includesAll, removeElement } from "../utils"

type TaskID = string

// Bestämmer hur lång en minut är. Sätt till "1000" i dev så blir 1 minut lika lång som 1 sekund
const MINUTE = 60000;

export class BasicScheduler implements Scheduler {
  recipe: Recipe
  cooks: string[]

  taskAssignedSubscribers: TaskAssignedSubscriber[] = [];
  passiveTaskStartedSubscribers: PassiveTaskStartedSubscriber[] = [];
  passiveTaskFinishedSubscribers: PassiveTaskFinishedSubscriber[] = [];
  passiveTaskCheckFinishedSubscribers: PassiveTaskCheckFinishedSubscriber[] = [];
  recipeFinishedSubscribers: RecipeFinishedSubscriber[] = [];
  progressSubscribers: ProgressSubscriber[] = [];

  lastFinished: Map<CookID, Date> = new Map();

  branches = new Map<string, TaskID[]>();

  tableIsSet: boolean

  extended = new Map<TaskID, [number, number]>()


  completedTasks: TaskID[] = []
  currentTasks = new Map<CookID, TaskID>()
  currentPassiveTasks = new Map<TaskID, { finish: Date, timeout: NodeJS.Timeout }>()

  possibleDishesRemaining = false

  subscribeTaskAssigned(f: TaskAssignedSubscriber) { this.taskAssignedSubscribers.push(f) }
  unsubscribeTaskAssigned(f: TaskAssignedSubscriber) {
    this.taskAssignedSubscribers = this.taskAssignedSubscribers.filter((value) => value !== f)
  }
  subscribePassiveTaskStarted(f: PassiveTaskStartedSubscriber) { this.passiveTaskStartedSubscribers.push(f) }
  unsubscribePassiveTaskStarted(f: PassiveTaskStartedSubscriber) {
    this.passiveTaskStartedSubscribers = this.passiveTaskStartedSubscribers.filter((value) => value !== f)
  }
  subscribePassiveTaskFinished(f: PassiveTaskFinishedSubscriber) { this.passiveTaskFinishedSubscribers.push(f) }
  unsubscribePassiveTaskFinished(f: PassiveTaskFinishedSubscriber) {
    this.passiveTaskFinishedSubscribers = this.passiveTaskFinishedSubscribers.filter((value) => value !== f)
  }
  subscribePassiveTaskCheckFinished(f: PassiveTaskCheckFinishedSubscriber) { this.passiveTaskCheckFinishedSubscribers.push(f) }
  unsubscribePassiveTaskCheckFinished(f: PassiveTaskCheckFinishedSubscriber) {
    this.passiveTaskCheckFinishedSubscribers = this.passiveTaskCheckFinishedSubscribers.filter((value) => value !== f)
  }
  subscribeRecipeFinished(f: RecipeFinishedSubscriber) { this.recipeFinishedSubscribers.push(f) }
  unsubscribeRecipeFinished(f: RecipeFinishedSubscriber) {
    this.recipeFinishedSubscribers = this.recipeFinishedSubscribers.filter((value) => value !== f)
  }
  subscribeProgress(f: ProgressSubscriber) { this.progressSubscribers.push(f) }
  unsubscribeProgress(f: ProgressSubscriber) {
    this.progressSubscribers = this.progressSubscribers.filter((value) => value !== f)
  }
  getCompletedTasks() {
    return this.completedTasks
  }

  finishTask(task: TaskID, cook: CookID) {
    if (this.currentTasks.get(cook) === task) {
      if (this.recipe.tasks.some(t => t.id === task)) {
        this.lastFinished.set(cook, new Date(Date.now()));

        this.completedTasks.push(task);
        this.currentTasks.delete(cook);
        this.possibleDishesRemaining = true;
        if (this.isRecipeFinished()) {
          this.recipeFinishedSubscribers.forEach((fn) => fn());
          return;
        }
        this.assignTasks(cook);
      } else if (isIdleTaskID(task)) {
        switch (task) {
          case doDishesTaskID:
            this.currentTasks.delete(cook);
            this.possibleDishesRemaining = false;
            this.assignTasks(cook);
            break;
          case setTableTaskID:
            this.currentTasks.delete(cook);
            this.tableIsSet = true;
            this.assignTasks(cook);
            break;
          case helpOrRestTaskID:
            // Gör ingenting för nu
            break;
        }
      }
      this.assignTasks(cook);
    }
    this.updateProgress()
  }
  finishPassiveTask(task: TaskID) {

    const taskProps = this.currentPassiveTasks.get(task)
    if (taskProps) {
      this.finishPassiveTaskNotAssign(task, taskProps);

      // När en passiv task är klar kan nya tasks bli tillgängliga. Fördela dem.
      this.assignTasks();
      this.updateProgress()
    }
  }


  checkPassiveTaskFinished(task: TaskID) {
    this.passiveTaskCheckFinishedSubscribers.forEach(f => f(task));
  }

  /**
   * Startar om ett passivt task med updaterat färdig-datum och timeout
   * Antingen given tid m add eller om undefined kommer det förlängas m 10% av taskets egna uppskattade tid
   * @add tiden i minuter som ska förlängas, kan vara undefined
   */
  extendPassive(task: TaskID, add?: number) {
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
          if (extendedTimeLeft < 20000) {
            extendedTimeLeft = 20000;
          }
        } else {
          throw "extendPassive: " + task + " not found in recipe"
        }
      }
      else {
        extendedTimeLeft = timeLeft + add * MINUTE;
      }
      this.startPassiveTask(extendedTimeLeft / MINUTE, task);
    }
  }

  getPassiveTasks() {
    let tasks = new Map<string, Date>()
    this.currentPassiveTasks.forEach(({ finish }, task) => tasks.set(task, new Date(finish)))
    return tasks
  }

  getPassiveTask(task: TaskID) {
    return this.getPassiveTasks().get(task)
  }

  addCook(cook: CookID) {
    this.cooks.includes(cook) ? "" : this.cooks.push(cook)
    this.assignTasks(cook);

  }

  removeCook(cook: CookID) {
    this.currentTasks.delete(cook)
    removeElement(this.cooks, cook)
  }

  // Enkel implementation som antar att varje task tar 5 minuter
  timeLeft() {
    return (this.recipe.tasks.length - this.completedTasks.length) * 5

  }

  getTasks() { return new Map(this.currentTasks.entries()); }

  undo(task: TaskID, cook?: CookID) {
    if (this.completedTasks.includes(task) || task === doDishesTaskID || task === setTableTaskID) {
      this.doUndo(task, cook);
      this.updateProgress()
    }
  }

  getProgress() {
    return this.completedTasks.length / this.recipe.tasks.length;
  }

  getBranchProgress() {
    let ratio = this.completedTasks.length / this.recipe.tasks.length;
    let ret: [string, number][] = [["Måltiden", ratio]];
    for (const [branch, tasks] of Array.from(this.branches.entries())) {
      let done = 0;
      for (const task of tasks) {
        // TODO: quadratic complexity
        if (this.completedTasks.includes(task)) {
          done += 1;
        }
      }
      let ratio = done / tasks.length;
      ret.push([branch, ratio])
    }
    return ret;
  }

  updateProgress() {
    let progress = this.getProgress();
    this.progressSubscribers.forEach(f => f(progress));
  }

  finishPassiveTaskNotAssign(task: TaskID, taskProps: { finish: Date; timeout: NodeJS.Timeout }) {
    clearTimeout(taskProps.timeout);
    this.completedTasks.push(task);

    this.currentPassiveTasks.delete(task);
    this.passiveTaskFinishedSubscribers.forEach((fn) => fn(task));
  }

  /**
 * Startar eller förnyar ett passivt task. 
 * @timeLeft Tid i minuter tills task förväntas vara färdigt
 */
  startPassiveTask(timeLeft: number, task: TaskID) {
    const finish = new Date(Date.now() + timeLeft * MINUTE)
    const timeout = setTimeout(() => this.checkPassiveTaskFinished(task), timeLeft * MINUTE)
    this.currentPassiveTasks.set(task, { finish: finish, timeout: timeout });

    this.passiveTaskStartedSubscribers.forEach((fn) => fn(task, new Date(finish)));
  }


  getDependencyMaps(recipe: Recipe): [Map<TaskID, TaskID[]>, Map<TaskID, TaskID[]>] {
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


  getTask(taskID: TaskID): Task {
    for (let i = 0; i < this.recipe.tasks.length; i++) {
      if (this.recipe.tasks[i].id === taskID)
        return this.recipe.tasks[i]
    }
    throw "getTask: Task not found"
  }


  /**
 * Hittar alla tasks som är möjliga att utföra
 * Returnerar två listor. Den första listan innehållar alla passiva tasks som bör påbörjas,
 * den andra innehåller alla andra tasks som kan fördelas, i olika listor. Tasksen i varje lista har samma 
 * prioritet, där de i den första bör göras först
 */
  getEligibleTasks(): [TaskID[], TaskID[][]] {
    let recipe: Recipe = this.recipe
    let completedTasks: TaskID[] = this.completedTasks
    let currentTasks: Map<CookID, TaskID> = this.currentTasks
    let currentPassiveTasks = this.currentPassiveTasks

    let eligibleTasks: TaskID[] = [];
    let strongEligibleTasks: TaskID[] = [];
    let passiveEligibleTasks: TaskID[] = [];
    let initialEligibleTasks: TaskID[] = []; //De initiala tasksen ska fördelas först och behöver därför hållas koll på separat
    let [depMap, strongDepMap] = this.getDependencyMaps(recipe);

    for (const task of recipe.tasks) {
      if (completedTasks.includes(task.id) || this.mapHasValue(currentTasks, task.id) || currentPassiveTasks.has(task.id)) {
        continue
      }
      if (!(includesAll(completedTasks, depMap.get(task.id) ?? []) && includesAll(completedTasks, strongDepMap.get(task.id) ?? []))) {
        continue
      }
      if (task.passive) {
        passiveEligibleTasks.push(task.id)
        continue;
      }
      if (task.initalTask) {
        initialEligibleTasks.push(task.id)
        continue
      }
      let ddd = strongDepMap.get(task.id);
      if (ddd && ddd.length != 0) {
        strongEligibleTasks.push(task.id)
        continue
      }
      eligibleTasks.push(task.id);
    }

    return [passiveEligibleTasks, [initialEligibleTasks, strongEligibleTasks, eligibleTasks]]
  }


  // Om det går att fortsätta på samma "branch" som den senaste avslutade tasken, gör det
  // Annars ta första möjliga uppgiften på den mest kritiska pathen 
  assignTasks(cook?: CookID) {

    let passiveTasks: TaskID[]
    let initialTasks: TaskID[]
    let strongTasks: TaskID[]
    let restTasks: TaskID[]
    [passiveTasks, [initialTasks, strongTasks, restTasks]] = this.getEligibleTasks();
    // Starta alla passiva tasks som är möjliga
    for (const passiveTask of passiveTasks) {
      let real_task = this.getTask(passiveTask);
      this.extended.set(passiveTask, [0, 0]);
      this.startPassiveTask(real_task.estimatedTime, passiveTask);
    }


    //tilldelar initial tasks som bör göras
    this.prioritizeAndAssignTasks(initialTasks, cook, false)

    //tilldelas task som bör göras av specifik föregående users
    this.prioritizeAndAssignTasks(strongTasks, cook, true)

    //tilldelar resterande task till de som är kvar
    this.prioritizeAndAssignTasks(restTasks, cook, false)

    this.assignIdleTasks()

  }


  // Delar ut idle uppgifter till alla som inte lagar mat
  assignIdleTasks() {

    let idleCooks = this.getIdleCooks().filter(c => this.currentTasks.get(c) === helpOrRestTaskID || !this.currentTasks.has(c))
    // Om det är odukat och ingen dukar, ge någon i uppgift att duka
    if (idleCooks.length > 0 && !this.tableIsSet && !Array.from(this.currentTasks.values()).some(t => t === setTableTaskID)) {
      const nextIdleCook = idleCooks.pop()
      if (nextIdleCook) {
        this.assignTask(nextIdleCook, setTableTaskID)
      }
    }

    if (idleCooks.length > 0 && this.possibleDishesRemaining && !Array.from(this.currentTasks.values()).some(t => t === doDishesTaskID)) {
      const nextIdleCook = idleCooks.pop()
      if (nextIdleCook) {
        this.assignTask(nextIdleCook, doDishesTaskID)
      }
    }
    console.log("BRAP", this.currentTasks);
    for (const cook of idleCooks.filter(c => !this.currentTasks.has(c))) {
      this.assignTask(cook, helpOrRestTaskID)
    }

  }

  /**
   * Tilldelar ett givet task till en given cook
   */
  assignTask(cook: CookID, task: TaskID) {
    this.currentTasks.set(cook, task);
    this.taskAssignedSubscribers.forEach((fn) => fn(task, cook))
  }


  // Tilldelar givna uppgifter. 
  // om toPrev är true så tilldelas till samma kock som jobbat på branchen
  // om toPrev false tilldelas till kock som antingen varit inaktiv längst, över en viss tid, 
  // eller till random kock om ingen varit inaktiv tillräckligt länge
  prioritizeAndAssignTasks(eligibleTasks: TaskID[], cook: CookID | undefined, toPreviousUser: boolean) {
    let [depMap, strongDepMap] = this.getDependencyMaps(this.recipe);


    // Kolla om några möjliga tasks har dependencies som precis avslutades
    let lastCompletedTask: TaskID = this.completedTasks[this.completedTasks.length - 1]
    let cond = (eTask: TaskID) => strongDepMap.get(eTask)?.includes(lastCompletedTask) || depMap.get(eTask)?.includes(lastCompletedTask)
    let dependers = eligibleTasks.filter(cond)

    //delar ut alla task som precis blev möjliga
    this.assignGivenTasks(dependers, cook, toPreviousUser);

    //andra task som är möjliga sorteras om och delas ut
    let rest = eligibleTasks.filter(eTask => !cond(eTask))
    let paths = this.findCriticalPathTasks(rest);
    this.assignGivenTasks(paths, cook, toPreviousUser);
  }


  //om toPrev=true + en kock klickat klar + har strong dependency vill vi sätta den allra först
  //if    om lång tid utan task prioriteras dem
  //else  alltid annars kock som klickade klar
  //sen tilldela alla task som finns till kockarna i tur ordning


  assignGivenTasks(tasksToAssign: TaskID[], justFinishedCook: CookID | undefined, toPreviousUser: boolean) {

    let cooks = this.getIdleCooks();

    //alltid sortera cooks
    let waitingCooks: [CookID, Date][] = []
    let remainingCooks: CookID[] = []
    let now = new Date(Date.now());
    let timewait = 10 * MINUTE;
    for (const cook of cooks) {
      let cookLastFinished = this.lastFinished.get(cook)

      if (cookLastFinished && (now.getTime() - cookLastFinished.getTime() > timewait)) {
        waitingCooks.push([cook, cookLastFinished])
      } else if (cook !== justFinishedCook) {
        remainingCooks.push(cook)
      }
    }

    //sortera waitingCooks, de som väntat längst kommer sist i listan = högst orio
    waitingCooks.sort((a, b) => b[1].getTime() - a[1].getTime())
    let waitingCooksSorted: CookID[] = waitingCooks.map(([a, b]) => a)

    let sortedCooks = remainingCooks;


    // TODO: samma kock borde få task igen, prioriteras, om den vilat och sen bara gjort ett task

    //strong dependency - samma kock bör få task igen
    //[rest + waitingUsers + justfinished]
    if (toPreviousUser) {
      sortedCooks = sortedCooks.concat(waitingCooksSorted);
      if (justFinishedCook && cooks.includes(justFinishedCook)) {
        sortedCooks.push(justFinishedCook)
      }
    }
    //[rest + justfinished + waitingUsers]
    else {
      if (justFinishedCook && cooks.includes(justFinishedCook)) {
        sortedCooks.push(justFinishedCook)
      }
      sortedCooks = sortedCooks.concat(waitingCooksSorted);
    }

    //assigna task från våran skapade lista
    for (const task of tasksToAssign) {
      const cook = sortedCooks.pop()
      if (cook) {
        this.assignTask(cook, task);
      } else {
        break
      }
    }
  }


  isRecipeFinished(): boolean {
    return (this.completedTasks.length == this.recipe.tasks.length);
  }


  getIdleCooks(): CookID[] {
    let cooksWithIdleTasks: CookID[] = []
    this.currentTasks.forEach((task, cook) => {
      if (task === setTableTaskID || task === doDishesTaskID)
        cooksWithIdleTasks.push(cook);
    })
    this.currentTasks.forEach((task, cook) => {
      if (task === helpOrRestTaskID)
        cooksWithIdleTasks.push(cook);
    })

    return cooksWithIdleTasks.concat(this.cooks.filter(cook => !this.currentTasks.has(cook)))
  }


  findCriticalPathTasks(availableTasks: TaskID[]): TaskID[] {
    if (availableTasks.length == 0) { return [] }
    let graph = this.makeDepGraph();
    let res: [TaskID, number][] = availableTasks.map((task) => [task, this.longestPath(task, graph)]);

    // Sort the list from largest path to smallest.
    res.sort((a, b) => b[1] - a[1])
    return res.map((a) => a[0]);
  }


  makeDepGraph(): Map<TaskID, [number, TaskID[]]> {
    let graph: Map<TaskID, [number, TaskID[]]> = new Map();
    const recipe = this.recipe
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
  longestPath(start: TaskID, graph: Map<TaskID, [number, TaskID[]]>): number {
    let things = graph.get(start);
    if (things) {
      let [value, neighbours] = things;
      if (neighbours.length == 0) {
        return value;
      }
      let values = [];
      for (const nb of neighbours) {
        values.push(this.longestPath(nb, graph));
      }
      return value + Math.max(...values);
    }
    throw "longestPath failed, node not in graph"
  }

  // TODO: första currentTask är "finishedTask" och ska tas hand om utanför funktionen
  findActiveTasks(currentTask: TaskID, deps: Map<TaskID, TaskID[]>): [TaskID[], TaskID[], TaskID[]] {
    let currentPassiveTasks: TaskID[] = [];
    let currentTasks: TaskID[] = [];
    let finishedTasks: TaskID[] = [];
    let below = deps.get(currentTask) ?? [];


    for (const task of below) {
      let cur = this.mapHasValue(this.currentTasks, task);
      let fin = this.completedTasks.includes(task);
      let curPas = this.currentPassiveTasks.has(task);
      if (cur) {
        currentTasks.push(task);
      } else if (fin) {
        finishedTasks.push(task);
      } else if (curPas) {
        currentPassiveTasks.push(task);
      }
      if (cur || fin || curPas) {
        let [newPas, newCur, newFin] = this.findActiveTasks(task, deps);
        currentPassiveTasks = currentPassiveTasks.concat(newPas);
        currentTasks = currentTasks.concat(newCur);
        finishedTasks = finishedTasks.concat(newFin);
      }
    }
    return [currentPassiveTasks, currentTasks, finishedTasks];
  }



  // Undo a completed task. All dependencies that are
  // - finished will be undone
  // - ongoing will be canceled
  doUndo(mainTask: TaskID, cook?: CookID) {
    let deps_pre = this.makeDepGraph();
    let deps = this.filteredMap(deps_pre, (aa) => aa[1])


    // Find all tasks that should be cancelled/undone
    let [endPas, endCur, endFin] = this.findActiveTasks(mainTask, deps);

    // Cancel them
    for (const task of endPas) {
      let passiveProps = this.currentPassiveTasks.get(task);
      if (passiveProps) {
        this.finishPassiveTaskNotAssign(task, passiveProps);
        this.removeItem(this.completedTasks, task);
      }
    }

    for (const cook of this.cooks) {
      let task = this.currentTasks.get(cook)
      if (task) {
        if (endCur.includes(task)) {
          this.taskAssignedSubscribers.forEach((fn) => fn(undefined, cook))
          this.currentTasks.delete(cook);
        }
      }
    }
    for (const task of endFin) {
      this.removeItem(this.completedTasks, task);
    }
    // TODO: We assume that mainTask is completed. Is that correct?
    this.removeItem(this.completedTasks, mainTask);

    if (cook) {
      this.assignTask(cook, mainTask)
    }

    // Some peoples tasks have been canceled and must then be started again.
    this.assignTasks();
  }

  // HACK: We shouldn't use arrays.
  removeItem<T>(arr: Array<T>, value: T): Array<T> {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  filteredMap<T, V, W>(m: Map<T, V>, f: (v: V) => W): Map<T, W> {
    let m2 = new Map();
    m.forEach((value, key) => m2.set(key, f(value)))
    return m2
  }

  mapHasValue<K, V>(m: Map<K, V>, v: V): boolean {
    for (const [_, vi] of Array.from(m.entries())) {
      if (vi === v) { return true }
    }
    return false
  }

  constructor(recipe: Recipe, cooks: CookID[]) {
    this.recipe = recipe;
    this.cooks = cooks

    this.tableIsSet = !recipe.requiresSettingTable ?? false

    this.assignTasks()

    let branches = new Map<string, TaskID[]>();
    for (const task of recipe.tasks) {
      if (task.branch) {
        let tasks = branches.get(task.branch);
        if (tasks) {
          // TODO: Does this work?
          tasks.push(task.id);
        } else {
          branches.set(task.branch, [task.id])
        }
      }
    }
    this.branches = branches


    let now = new Date(Date.now())
    for (const cook of cooks) {
      this.lastFinished.set(cook, now)
    }
  }
}