import { Recipe, Task } from "../data";

export const getBranchesGraph = (recipe: Recipe) => {
  const taskLookup = recipe.tasks.reduce((map, obj) => {
    map.set(obj.id, obj);
    return map;
  }, new Map<string, Task>());
  const branchGraph = new Map<string, string[]>();
  let tasksToCheck: Task[] = [];
  recipe.tasks.forEach((task) => {
    if (task.finalTask) {
      tasksToCheck.push(task);
    }
  });

  while (tasksToCheck.length > 0) {
    const task = tasksToCheck.pop();
    if (task !== undefined && task.branch) {
      const taskDeps = recipe.taskDependencies.find(
        (deps) => deps.taskId === task.id
      );
      let depIds: string[];
      if (taskDeps && taskDeps.dependsOn && taskDeps.strongDependsOn) {
        depIds = taskDeps.dependsOn.concat(taskDeps.strongDependsOn);
      } else if (taskDeps && taskDeps.dependsOn) {
        depIds = taskDeps.dependsOn;
      } else if (taskDeps && taskDeps.strongDependsOn) {
        depIds = taskDeps.strongDependsOn;
      } else {
        depIds = [];
      }
      for (const dependantTaskID of depIds) {
        const dependantTask = taskLookup.get(dependantTaskID);
        if (dependantTask) {
          tasksToCheck.push(dependantTask);
          if (dependantTask.branch && task.branch && dependantTask.branch != task.branch) {
            const dependsOnBranches = branchGraph.get(task.branch);
            if (dependsOnBranches && !dependsOnBranches.includes(task.branch)) {
              branchGraph.set(
                task.branch,
                dependsOnBranches.concat([dependantTask.branch])
              );
            } else {
              branchGraph.set(task.branch, [dependantTask.branch]);
            }
          }
        }
      }
    }
  }
  return branchGraph;
};

const getFinalBranches = (recipe: Recipe) => {
  const finalBranches: string[] = [];
  recipe.tasks.forEach((task) => {
    if (task.branch && task.finalTask && !finalBranches.includes(task.branch)) {
      finalBranches.push(task.branch);
    }
  });
  return finalBranches;
}

export const getSortedBranches = (recipe: Recipe) => {
  const branchGraph = getBranchesGraph(recipe);
  const branchOutgoingDep: Map<string, string> = new Map(); 
  branchGraph.forEach((deps, branch) => {
    for (const dep of deps) {
      branchOutgoingDep.set(dep, branch)
    }
  });
  const finalBranches = getFinalBranches(recipe);
  const branchesByLevel = [finalBranches];
  let branchesToAdd = [];
  for (const branch of finalBranches) {
    for (const dep of branchGraph.get(branch) ?? []) {
      branchesToAdd.push(dep)
    }
  }

  // Klura ut nivåerna
  while (branchesToAdd.length) {
    const deps: string[] = [];
    const levelBranches = [];
    for (const branch of branchesToAdd) {
      levelBranches.push(branch);
      for (const dep of branchGraph.get(branch) ?? []) {
        deps.push(dep)
      }
    }
    branchesToAdd = deps;
    branchesByLevel.push(levelBranches);
  }

  // Klura ut ordningen
  const branchWeights: Map<string, number> = new Map();
  for (let level = branchesByLevel.length - 1; level >= 0; level--) {
    const branches = branchesByLevel[level];
    let levelBonus = (branches.length) / 100.0;
    for (const branch of branches) {
      const deps = branchGraph.get(branch)
      let weight = 0;
      if (deps) {
        for (const dep of deps) {
          const depWeight = branchWeights.get(dep);
          if (depWeight && depWeight > weight) {
            weight = depWeight;
          }
        }
      } else {
        weight = level + levelBonus;
        levelBonus -= 0.01;
      }
      
      for (const branchToCheck of branches) {
        if (branchToCheck == branch)
          break;
        const checkWeight = branchWeights.get(branchToCheck);
        if (checkWeight && checkWeight > weight + 0.01 && branchOutgoingDep.get(branchToCheck) == branchOutgoingDep.get(branch)) {
          
        } 
      }
      
      branchWeights.set(branch, weight);
    }
  }

  // Sortera nivåerna
  for (const branches of branchesByLevel) {
    branches.sort((a, b) => (branchWeights.get(b) ?? 0) - (branchWeights.get(a) ?? 0))
  }
  return branchesByLevel;
}

// Map {
//   "Servera" => Array [
//     "Sallad",
//     "Tillaga lasagne",
//   ],
//   "Tillaga lasagne" => Array [
//     "Bygg lasagne",
//   ],
//   "Bygg lasagne" => Array [
//     "Auberginblandning",
//     "Sås",
//   ],
// }


/* [[Servera]],[], [[Sall, Till]], [[], [Bygg]], [[Aub, sås]]]

[[Sallad, Tillaga], [], []]
[[Servera], [], []]
*/

// [[servera],[sall, till],[bygg],[Aub, sås]]