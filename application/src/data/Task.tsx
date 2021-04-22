import { Task } from "./Recipe";

export const setTableTaskID = "idleTask:setTable";
export const doDishesTaskID = "idleTask:doDishes";
export const helpOrRestTaskID = "idleTask:helpOrRest";

export const idleTasks: Task[] = [
  {
    id: setTableTaskID,
    name: "Duka",
    instructions: "Duka",
    ingredients: [],
    resources: [],
    estimatedTime: 0,
  },
  {
    id: doDishesTaskID,
    name: "Diska",
    instructions: "Diska det som går att diska",
    ingredients: [],
    resources: [],
    estimatedTime: 0,
  },
  {
    id: helpOrRestTaskID,
    name: "Hjälp eller vila",
    instructions:
      "Fråga om någon annan behöver hjälp, passa annars på att vila!",
    ingredients: [],
    resources: [],
    estimatedTime: 0,
  },
];
export const idleTaskIDs: string[] = idleTasks.map((task) => task.id);

export const getIdleTask = (taskId: string): Task => {
  for (const task of idleTasks) {
    if (task.id === taskId) {
      return task;
    }
  }
  throw "getIdleTask: Task is not an idle task";
};

export const isIdleTaskID = (taskId: string) => idleTaskIDs.includes(taskId);
