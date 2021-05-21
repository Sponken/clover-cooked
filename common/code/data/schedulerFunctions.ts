export enum functions {
  finishTask,
  finishPassiveTask,
  checkPassiveTaskFinished,
  subscribeTaskAssigned,
  unsubscribeTaskAssigned,
  subscribePassiveTaskStarted,
  unsubscribePassiveTaskStarted,
  subscribePassiveTaskFinished,
  unsubscribePassiveTaskFinished,
  subscribePassiveTaskCheckFinished,
  unsubscribePassiveTaskCheckFinished,
  subscribeRecipeFinished,
  unsubscribeRecipeFinished,
  subscribeProgress,
  unsubscribeProgress,
  extendPassive,
  getPassiveTasks,
  getPassiveTask,
  addCook,
  removeCook,
  timeLeft,
  getTasks,
  getCompletedTasks,
  getProgress,
  getBranchProgress,
  undo,
}

export enum subscribers {
  passiveTaskStartedSubscriber,
  passiveTaskFinishedSubscriber,
  passiveTaskCheckFinishedSubscriber,
  taskAssignedSubscriber,
  recipeFinishedSubscriber,
  progressSubscriber,
}