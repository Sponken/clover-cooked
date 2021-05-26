import { PassiveTaskFinishedSubscriber, PassiveTaskStartedSubscriber, ProgressSubscriber, RecipeFinishedSubscriber, Scheduler, TaskAssignedSubscriber, CookID } from './Scheduler'
import { 
  functions as schedulerFunctions,
  SchedulerFunction,
  Recipe, 
  Initialize,
  FinishPassiveTask,
  CheckPassiveTaskFinished,
  SubscribeTaskAssigned,
  UnsubscribeTaskAssigned,
  SubscribePassiveTaskStarted,
  UnsubscribePassiveTaskStarted,
  SubscribePassiveTaskFinished,
  UnsubscribePassiveTaskFinished,
  SubscribePassiveTaskCheckFinished,
  UnsubscribePassiveTaskCheckFinished,
  SubscribeRecipeFinished,
  UnsubscribeRecipeFinished,
  SubscribeProgress,
  UnsubscribeProgress,
  ExtendPassive,
  GetPassiveTasks,
  GetPassiveTask,
  AddCook,
  RemoveCook,
  TimeLeft,
  GetTasks,
  GetCompletedTasks,
  GetProgress,
  GetBranchProgress,
  Undo,
} from '../../../common/code/data'

export class ServerScheduler implements Scheduler {

  ws: WebSocket

  
  finishTask(task: string, cook: string): void{
    
  }
  
  finishPassiveTask(task: string): void{
    
  }
  
  checkPassiveTaskFinished(task: string): void{
    
  }
  
  subscribeTaskAssigned(f: TaskAssignedSubscriber): void{
    
  }
  
  unsubscribeTaskAssigned(f: TaskAssignedSubscriber): void{
    
  }
  
  subscribePassiveTaskStarted(f: PassiveTaskStartedSubscriber): void{
    
  }
  
  unsubscribePassiveTaskStarted(f: PassiveTaskStartedSubscriber): void{
    
  }

  subscribePassiveTaskFinished(f: PassiveTaskFinishedSubscriber): void{
    
  }

  unsubscribePassiveTaskFinished(f: PassiveTaskFinishedSubscriber): void{
    
  }
  
  subscribePassiveTaskCheckFinished(f: PassiveTaskFinishedSubscriber): void{
    
  }
  
  unsubscribePassiveTaskCheckFinished(f: PassiveTaskFinishedSubscriber): void{
    
  }
  
  subscribeRecipeFinished(f: RecipeFinishedSubscriber): void{
    
  }
  
  unsubscribeRecipeFinished(f: RecipeFinishedSubscriber): void{
    
  }
  
  subscribeProgress(f: ProgressSubscriber): void{
    
  }
  
  unsubscribeProgress(f: ProgressSubscriber): void{
    
  }
  
  extendPassive(task: string, add?: number | undefined): void{
    
  }
  
  getPassiveTasks(): Map<string, Date>{
    
  }
  
  getPassiveTask(task: string): Date | undefined{
    
  }
  
  addCook(cook: string): void{
    
  }
  
  removeCook(cook: string): void{
    
  }
  
  timeLeft(): number{
    
  }
  
  getTasks(): Map<string, string>{
    
  }
  
  getCompletedTasks(): string[]{
    
  }
  
  getProgress(): number{
    
  }
  
  getBranchProgress(): [string, number][]{
    
  }
  
  undo(task: string, cook?: string | undefined): void{
    
  }


  send(message: SchedulerFunction){
    this.ws.send(JSON.stringify(message))
    console.log('Sent message of type ${message.type}')
  }
  
  constructor(recipe: Recipe, cooks:CookID[]){
    this.ws = new WebSocket("INSERT URL")

    let msg: Initialize = {type: schedulerFunctions.initialize, parameters:{recipeId: recipe.id, cooks: cooks}}

    this.send(msg)
  
  
  }
  
}