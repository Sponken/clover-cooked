import { PassiveTaskFinishedSubscriber, PassiveTaskStartedSubscriber, ProgressSubscriber, RecipeFinishedSubscriber, Scheduler, TaskAssignedSubscriber, CookID } from './Scheduler'
import { 
  functions as schedulerFunctions,
  ServerFunction,
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
} from './schedulerFunctions'

export class ServerScheduler implements Scheduler {

  ws: WebSocket;

  getRecipe(): Recipe {

  }

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


  sendFunction(message: ServerFunction){
    this.ws.send(JSON.stringify(message))
    console.log('Sent message of type ${message.type}')
  }


  initSocket(ws: WebSocket){

    ws.onmessage = (e) => {
      console.log("Message received: " + e.data)
    };

    ws.send("Hi")

  }

  
  constructor(recipe: Recipe, cooks:CookID[]){
    this.ws = new WebSocket("ws://192.168.50.99:8999")
    this.initSocket(this.ws)

    

    //let msg: Initialize = {type: schedulerFunctions.initialize, parameters:{recipeId: recipe.id, cooks: cooks}}
1
    //this.send(msg)
  
    
  
  }
  
}