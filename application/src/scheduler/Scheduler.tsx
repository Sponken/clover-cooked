import { Recipe, Task } from "../data";

export type CookID = string;
export type TaskID = string;

export type PassiveTaskStartedSubscriber = (task: TaskID, finish: Date) => void;
export type PassiveTaskFinishedSubscriber = (task: TaskID) => void;
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
   * Avslutar en given, ej passiv, task för en användare.
   */
  finishTask: (task: TaskID, cook: CookID) => void;
  /**
   * Avslutar ett passivt task
   */
  finishPassiveTask: (task: TaskID) => void;
  /**
   * Metod som kallas på när en task är tilldelad
   */
  subscribeTaskAssigned: (f: TaskAssignedSubscriber) => () => void;
  /**
   * Metod som kallas på när ny passiv task är startad
   */
  subscribePassiveTaskStarted: (f: PassiveTaskStartedSubscriber) => () => void;
  /**
   * Metod som kallas på när en passiv task är avslutad
   */
  subscribePassiveTaskFinished: (
    f: PassiveTaskFinishedSubscriber
  ) => () => void;
  /**
   * Utöker tiden på en pågående passiv task
   */
  extendPassive: (task: TaskID, add: number) => void;
  /**
   * Returnerar alla pågående passiva tasks, tillsammans med Date för när de är slut
   */
  getPassiveTasks: () => Map<TaskID, Date>;
  /**
   * Returnerar Date för när passivt task är slut. Returnerar undefined om tasken inte är pågående
   */
  getPassiveTask: (task: TaskID) => Date | undefined;
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
  readonly passiveTaskStartedSubscribers: PassiveTaskStartedSubscriber[];
  readonly passiveTaskFinishedSubscribers: PassiveTaskFinishedSubscriber[];
  readonly taskAssignedSubscribers: TaskAssignedSubscriber[];
}
