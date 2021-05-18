import { Recipe, Task } from "../data";

const getBranchesGraph = (recipe: Recipe) => {
  const branchGraph = new Map<string, string[]>();
  const tasksToCheck: Task[] = [];
  recipe.tasks.forEach((task) => {
    if (task.finalTask) {
      tasksToCheck.push(task);
    }
  });
  while (tasksToCheck) {
    const task = tasksToCheck.pop();
    if (task !== undefined && task.branch) {
      const taskDeps = recipe.taskDependencies.find((deps) => deps.taskId === task.id);
      let depIds: string[];
      if (taskDeps && taskDeps.dependsOn && taskDeps.strongDependsOn) {
        depIds = taskDeps.dependsOn.concat(taskDeps.strongDependsOn);
      } else if (taskDeps && taskDeps.dependsOn) {
        depIds = taskDeps.dependsOn
      } else if (taskDeps && taskDeps.strongDependsOn) {
        depIds = taskDeps.strongDependsOn
      } else {
        depIds = []
      }
      if (branchGraph.)
    }
  }
};
