import {Recipe} from '../data'

export enum functions {
  initialize,
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

export type ClientFunction = TaskAssigned
                           | PassiveTaskStarted
                           | PassiveTaskFinished
                           | PassiveTaskCheckFinished
                           | RecipeFinished
                           | Progress

export type TaskAssigned = {type: subscribers.taskAssigned, parameters: { task: string, cook: string }}
export type PassiveTaskStarted = {type: subscribers.passiveTaskStarted, parameters:{task: string, finish: Date}}
export type PassiveTaskFinished = {type: subscribers.passiveTaskFinished, parameters:{task: string}}
export type PassiveTaskCheckFinished = {type: subscribers.passiveTaskCheckFinished, parameters:{task: string}}
export type RecipeFinished = {type: subscribers.recipeFinished, parameters:{}}
export type Progress = {type: subscribers.progress, parameters:{progress: number}}


export type ServerFunction = Initialize
                           | FinishTask
                           | FinishPassiveTask
                           | CheckPassiveTaskFinished
                           | ExtendPassive
                           | GetPassiveTasks
                           | GetPassiveTask
                           | AddCook
                           | RemoveCook
                           | TimeLeft
                           | GetTasks
                           | GetCompletedTasks
                           | GetProgress
                           | GetBranchProgress
                           | Undo

export type Initialize = {type: functions.initialize, parameters:{recipe: Recipe, cooks: string[]}}

export type FinishTask = {type: functions.finishTask, parameters:{task: string, cook: string}}
export type FinishPassiveTask = {type: functions.finishPassiveTask, parameters:{task: string}}
export type CheckPassiveTaskFinished = {type: functions.checkPassiveTaskFinished, parameters:{task:string}}
export type ExtendPassive = {type: functions.extendPassive, parameters:{task: string, add?: number}}
export type GetPassiveTasks = {type: functions.getPassiveTasks, parameters:{}}
export type GetPassiveTask = {type: functions.getPassiveTask, parameters:{task: string}}
export type AddCook = {type: functions.addCook, parameters:{cook: string}}
export type RemoveCook = {type: functions.removeCook, parameters:{cook: string}}
export type TimeLeft = {type: functions.timeLeft, parameters:{}}
export type GetTasks = {type: functions.getTasks, parameters:{}}
export type GetCompletedTasks = {type: functions.getCompletedTasks, parameters:{}}
export type GetProgress = {type: functions.getProgress, parameters:{}}
export type GetBranchProgress = {type: functions.getBranchProgress, parameters:{}}
export type Undo = {type: functions.undo, parameters:{task: string, cook?: string}}

export enum subscribers {
  passiveTaskStarted,
  passiveTaskFinished,
  passiveTaskCheckFinished,
  taskAssigned,
  recipeFinished,
  progress,
}