import { Recipe } from '../data'

export type CookID = string;
export type TaskID = string;

export type PassiveTaskStartedSubscriber = (task: TaskID, finish: Date) => void;
export type PassiveTaskFinishedSubscriber = (task: TaskID) => void;
export type PassiveTaskCheckFinishedSubscriber = PassiveTaskFinishedSubscriber;
export type TaskAssignedSubscriber = (
  task: TaskID | undefined,
  cook: CookID
) => void;
export type RecipeFinishedSubscriber = () => void;
export type ProgressSubscriber = (progress: number) => void;
/**
 * Detta representerar en schemaläggare som har koll på och delar ut tasks.
 */
export interface Scheduler {
  /**
   * Avslutar en given, ej passiv, task för en användare.
   */
  finishTask: (task: TaskID, cook: CookID) => void;
  /**
   * Avslutar ett passivt task
   */
  finishPassiveTask: (task: TaskID) => void;
  /**
   * Signalerar till frontend att passivt task ska kollas om det är klart
   */
  checkPassiveTaskFinished: (task: TaskID) => void;
  /**
   * Metod som kallas på när en task är tilldelad
   */
  subscribeTaskAssigned: (f: TaskAssignedSubscriber) => void;
  unsubscribeTaskAssigned: (f: TaskAssignedSubscriber) => void;
  /**
   * Metod som kallas på när ny passiv task är startad
   */
  subscribePassiveTaskStarted: (f: PassiveTaskStartedSubscriber) => void;
  unsubscribePassiveTaskStarted: (f: PassiveTaskStartedSubscriber) => void;
  /**
   * Metod som kallas på när en passiv task är avslutad
   */
  subscribePassiveTaskFinished: (f: PassiveTaskFinishedSubscriber) => void;
  unsubscribePassiveTaskFinished: (f: PassiveTaskFinishedSubscriber) => void;
  /**
   * Metod som kallas för att kolla att det passiva tasket är helt avslutat av användaren
   */
  subscribePassiveTaskCheckFinished: (
    f: PassiveTaskCheckFinishedSubscriber
  ) => void;
  unsubscribePassiveTaskCheckFinished: (
    f: PassiveTaskCheckFinishedSubscriber
  ) => void;
  /**
   * Metod som kallas på när alla task är avklarade
   */
  subscribeRecipeFinished: (f: RecipeFinishedSubscriber) => void;
  unsubscribeRecipeFinished: (f: RecipeFinishedSubscriber) => void;
  /**
   * TODO
   */
  subscribeProgress: (f: ProgressSubscriber) => void;
  unsubscribeProgress: (f: ProgressSubscriber) => void;
  /**
   * Utöker tiden på en pågående passiv task
   */
  extendPassive: (task: TaskID, add?: number) => void;
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
  getCompletedTasks: () => TaskID[];
  getProgress: () => number;
  getBranchProgress: () => [string, number][];

  undo: (task: TaskID, cook?: CookID) => void;

  getRecipe: () => Recipe
}
