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



export type SchedulerFunction =  Initialize|
                            FinishTask|
                            FinishPassiveTask|
                            CheckPassiveTaskFinished|
                            SubscribeTaskAssigned|
                            UnsubscribeTaskAssigned|
                            SubscribePassiveTaskStarted|
                            UnsubscribePassiveTaskStarted|
                            SubscribePassiveTaskFinished|
                            UnsubscribePassiveTaskFinished|
                            SubscribePassiveTaskCheckFinished|
                            UnsubscribePassiveTaskCheckFinished|
                            SubscribeRecipeFinished|
                            UnsubscribeRecipeFinished|
                            SubscribeProgress|
                            UnsubscribeProgress|
                            ExtendPassive|
                            GetPassiveTasks|
                            GetPassiveTask|
                            AddCook|
                            RemoveCook|
                            TimeLeft|
                            GetTasks|
                            GetCompletedTasks|
                            GetProgress|
                            GetBranchProgress|
                            Undo

type FunctionID = number

export type Initialize = {type: functions.initialize, parameters:{recipeId: string, cooks: string[]}}

export type FinishTask = {type: functions.finishTask, parameters:{task: string, cook: string}}
export type FinishPassiveTask = {type: functions.finishPassiveTask, parameters:{task: string}}
export type CheckPassiveTaskFinished = {type: functions.checkPassiveTaskFinished, parameters:{task:string}}
export type SubscribeTaskAssigned = {type: functions.subscribeTaskAssigned, parameters:{function: FunctionID}}
export type UnsubscribeTaskAssigned = {type: functions.unsubscribeTaskAssigned, parameters:{function: FunctionID}}
export type SubscribePassiveTaskStarted = {type: functions.subscribePassiveTaskStarted, parameters:{function: FunctionID}}
export type UnsubscribePassiveTaskStarted = {type: functions.unsubscribePassiveTaskStarted, parameters:{function: FunctionID}}
export type SubscribePassiveTaskFinished = {type: functions.subscribePassiveTaskFinished, parameters:{function: FunctionID}}
export type UnsubscribePassiveTaskFinished = {type: functions.unsubscribePassiveTaskFinished, parameters:{function: FunctionID}}
export type SubscribePassiveTaskCheckFinished = {type: functions.subscribePassiveTaskCheckFinished, parameters:{function: FunctionID}}
export type UnsubscribePassiveTaskCheckFinished = {type: functions.unsubscribePassiveTaskCheckFinished, parameters:{function: FunctionID}}
export type SubscribeRecipeFinished = {type: functions.subscribeRecipeFinished, parameters:{function: FunctionID}}
export type UnsubscribeRecipeFinished = {type: functions.unsubscribeRecipeFinished, parameters:{function: FunctionID}}
export type SubscribeProgress = {type: functions.subscribeProgress, parameters:{function: FunctionID}}
export type UnsubscribeProgress = {type: functions.unsubscribeProgress, parameters:{function: FunctionID}}
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
  passiveTaskStartedSubscriber,
  passiveTaskFinishedSubscriber,
  passiveTaskCheckFinishedSubscriber,
  taskAssignedSubscriber,
  recipeFinishedSubscriber,
  progressSubscriber,
}