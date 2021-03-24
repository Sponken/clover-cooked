import { Recipe, Task } from "../data";

export type CookID = string;
export type TaskID = string;

export type PassiveTaskSubscriber = (task: TaskID, finish: Date) => void;
export type TaskAssignedSubscriber = (
  task: TaskID | undefined,
  cook: CookID
) => void;

/** Detta representerar en schemaläggare som har koll på och delar ut tasks.
 * Enbart metoderna bör användas. Ändra inte i de övriga fälten
 */
export interface Scheduler {
  readonly extended: Map<TaskID, [number, number]>;
  readonly cooks: CookID[];
  readonly recipe: Recipe;
  readonly completedTasks: TaskID[];
  readonly currentTasks: Map<CookID, TaskID>;
  readonly currentPassiveTasks: Map<TaskID, Date>;
  /**
   * Avslutar en given task för en användare. Kan även användas för passiva tasks
   */
  finishTask: (task: TaskID, cook: CookID) => void;
  /**
   * Metod som kallas på när en task är tilldelad
   */
  subscribeTaskAssigned: (f: TaskAssignedSubscriber) => () => void;
  /**
   * Metod som kallas på när en ny passiv task är startad
   */
  subscribePassiveTaskStarted: (f: PassiveTaskSubscriber) => () => void;
  /**
   * Utöker tiden på en pågående passiv task
   */
  extendPassive: (task: TaskID, add: number) => void;
  /**
   * Returnerar alla pågående passiva tasks, tillsammans med hur lång tid som är kvar i minuter
   */
  getPassiveTasks: () => Map<TaskID, number>;
  /**
   * Returnerar hur lång tid det är kvar i minuter för en given task. Returnerar undefined om tasken inte är pågående
   */
  getPassiveTask: (task: TaskID) => number | undefined;
  /**
   * Lägg till en kock med dens ID.
   */
  addCook: (cook: CookID) => void;
  /**
   * Ta bort en kock utifrån ett givet ID.
   */
  removeCook: (cook: CookID) => void;
  /**
   * Hur lång tid som är kvar i minuter innan maten är klar
   */
  timeLeft: () => number;
  /**
   * Hämtar nuvarande tasks
   */
  getTasks: () => Map<CookID, TaskID>;

  // Subscription listor med alla subsribe funktioner
  readonly passiveTaskSubscribers: PassiveTaskSubscriber[];
  readonly taskAssignedSubscribers: TaskAssignedSubscriber[];
}
