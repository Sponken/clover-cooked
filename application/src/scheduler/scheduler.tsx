import { Recipe, Task } from "../data";

export type CookID = string;
export type TaskID = string;

/** Detta representerar en schemaläggare som har koll på och delar ut tasks.
 * Enbart metoderna bör användas. Ändra inte i de övriga fälten
 */
export type Scheduler = {
  cooks: CookID[];
  recipe: Recipe;
  completedTasks: TaskID[];
  currentTasks: Map<CookID, TaskID>;
  currentPassiveTasks: Map<TaskID, Date>;
  /**
   * Avslutar en given task för en användare. Kan även användas för passiva tasks
   */
  finishTask: (task: TaskID, cook: CookID) => void;
  /**
   * Tilldelar en ny task till en användare. Om ingen tasks tilldelas returneras undefined
   */
  assignNewTask: (cook: CookID) => TaskID | undefined;
  /**
   * Callback metod som används när en passiv task är klar.
   * Då skickas task:en som avslutar den passiva tillbaks, tillsammans med vems om bör avsluta den
   */
  passiveTaskListener: (task: TaskID, cook: CookID) => void;
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
};
