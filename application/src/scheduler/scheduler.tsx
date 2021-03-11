import { Recipe, Task } from "../data";

export type CookID = string;

/** Detta representerar en schemaläggare som har koll på och delar ut tasks.
 * Enbart metoderna bör användas. Ändra inte i de övriga fälten
 */
export type Scheduler = {
  cooks: CookID[];
  recipe: Recipe;
  completedTasks: Task[];
  currentTasks: Map<CookID, Task>;
  currentPassiveTasks: Map<Task, Date>;
  /**
   * Avslutar en given task för en användare. Kan även användas för passiva tasks
   */
  finishTask: (task: Task, cook: CookID) => void;
  /**
   * Tilldelar en ny task till en användare. Om ingen tasks tilldelas returneras undefined
   */
  assignNewTask: (cook: CookID) => Task | undefined;
  /**
   * Callback metod som används när en passiv task är klar.
   * Då skickas task:en som avslutar den passiva tillbaks, tillsammans med vems om bör avsluta den
   */
  passiveTaskListener: (task: Task, cook: CookID) => void;
  /**
   * Utöker tiden på en pågående passiv task
   */
  extendPassive: (task: Task, add: number) => void;
  /**
   * Returnerar alla pågående passiva tasks, tillsammans med hur lång tid som är kvar i minuter
   */
  getPassiveTasks: () => Map<Task, number>;
  /**
   * Returnerar hur lång tid det är kvar i minuter för en given task. Returnerar undefined om tasken inte är pågående
   */
  getPassiveTask: (task: Task) => number | undefined;
  /**
   * Lägg till en kock med dens ID.
   */
  addCook: (cook: CookID) => void;
  /**
   * Ta bort en kock utifrån ett givet ID.
   */
  removeCook: (cook: CookID) => void;
};
