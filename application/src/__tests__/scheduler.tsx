import { Recipe } from "../data";
import { createBasicScheduler, Scheduler } from "../scheduler";

let recipe: Recipe = {
  name: "foo",
  id: "foo",
  description: "bar",
  portions: 1,
  ingredients: [],
  resources: [],
  tasks: [
    {
      id: "id",
      name: "name",
      instructions: "instructions",
      estimatedTime: 999,
      ingredients: [],
      resources: [],
    },
  ],
  taskDependencies: [],
};

describe("Basic scheduler", () => {
  var scheduler: Scheduler;
  let cooks: string[] = ["musse", "kalle"];

  beforeEach(() => {
    scheduler = createBasicScheduler(recipe, cooks, () => {});
  });

  test("Scheduler exists", () => {
    expect(scheduler).toBeDefined();
  });

  test("Finds the only existing task", () => {
    expect(scheduler.assignNewTask(cooks[0])).toEqual(recipe.tasks[0]);
    expect(scheduler.assignNewTask(cooks[1])).toBeUndefined();
  });
});
