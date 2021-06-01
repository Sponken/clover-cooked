import { PassiveTaskCheckFinishedSubscriber, PassiveTaskFinishedSubscriber, PassiveTaskStartedSubscriber, ProgressSubscriber, RecipeFinishedSubscriber, Scheduler, TaskAssignedSubscriber, CookID } from './Scheduler'
import { 
  functions as schedulerFunctions,
  ServerFunction,
  FinishTask,
  Initialize,
  FinishPassiveTask,
  CheckPassiveTaskFinished,
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
  functions,
  subscribers,
  ClientFunction,
  BranchProgressJson,
  ProgressJson,
  TasksJson,
  CompletedTasksJson,
  TimeLeftJson,
  PassiveTaskJson,
  PassiveTasksJson,
  RecipeJson,
} from './schedulerFunctions'
import {filteredMap} from '../utils'
import {Recipe} from '../data' 


const SERVER_URL = '192.168.50.99:8999'


export class ServerScheduler implements Scheduler {

  ws: WebSocket;


  taskAssignedSubscribers:             TaskAssignedSubscriber[]             = [];
  passiveTaskStartedSubscribers:       PassiveTaskStartedSubscriber[]       = [];
  passiveTaskFinishedSubscribers:      PassiveTaskFinishedSubscriber[]      = [];
  passiveTaskCheckFinishedSubscribers: PassiveTaskCheckFinishedSubscriber[] = [];
  recipeFinishedSubscribers:           RecipeFinishedSubscriber[]           = [];
  progressSubscribers:                 ProgressSubscriber[]                 = [];

  // TODO: Use this
  getRecipe(): Promise<Recipe> {
    const response = fetch('http://' + SERVER_URL + '/recipe')
          .then((response) => response.json())
          .then((json : RecipeJson) => json.data);

    return response
  }

  finishTask(task: string, cook: string): void{
    const message: FinishTask = {
      type: functions.finishTask,
      parameters: {task, cook}
    };
    this.sendFunction(message)
  }
  
  finishPassiveTask(task: string): void {
    const message: FinishPassiveTask = {
      type: functions.finishPassiveTask,
      parameters: {task}
    };
    this.sendFunction(message)
  }
  
  checkPassiveTaskFinished(task: string): void {
    const message: CheckPassiveTaskFinished = {
      type: functions.checkPassiveTaskFinished,
      parameters: {task}
    };
    this.sendFunction(message)
  }
  
  subscribeTaskAssigned(f: TaskAssignedSubscriber): void { this.taskAssignedSubscribers.push(f) }
  unsubscribeTaskAssigned(f: TaskAssignedSubscriber): void {
    this.taskAssignedSubscribers = this.taskAssignedSubscribers.filter((value) => value !== f)
  }

  subscribePassiveTaskStarted(f: PassiveTaskStartedSubscriber): void { this.passiveTaskStartedSubscribers.push(f) }
  unsubscribePassiveTaskStarted(f: PassiveTaskStartedSubscriber): void {
    this.passiveTaskStartedSubscribers = this.passiveTaskStartedSubscribers.filter((value) => value !== f)
  }
  subscribePassiveTaskFinished(f: PassiveTaskFinishedSubscriber): void { this.passiveTaskFinishedSubscribers.push(f) }
  unsubscribePassiveTaskFinished(f: PassiveTaskFinishedSubscriber): void {
    this.passiveTaskFinishedSubscribers = this.passiveTaskFinishedSubscribers.filter((value) => value !== f)
  }
  subscribePassiveTaskCheckFinished(f: PassiveTaskCheckFinishedSubscriber): void { this.passiveTaskCheckFinishedSubscribers.push(f) }
  unsubscribePassiveTaskCheckFinished(f: PassiveTaskCheckFinishedSubscriber): void {
    this.passiveTaskCheckFinishedSubscribers = this.passiveTaskCheckFinishedSubscribers.filter((value) => value !== f)
  }
  subscribeRecipeFinished(f: RecipeFinishedSubscriber): void { this.recipeFinishedSubscribers.push(f) }
  unsubscribeRecipeFinished(f: RecipeFinishedSubscriber): void {
    this.recipeFinishedSubscribers = this.recipeFinishedSubscribers.filter((value) => value !== f)
  }
  subscribeProgress(f: ProgressSubscriber): void { this.progressSubscribers.push(f) }
  unsubscribeProgress(f: ProgressSubscriber): void {
    this.progressSubscribers = this.progressSubscribers.filter((value) => value !== f)
  }
  
  extendPassive(task: string, add?: number | undefined): void {
    const message: ExtendPassive = {
      type: functions.extendPassive,
      parameters: {task, add}
    };
    this.sendFunction(message)
  }
  
  getPassiveTasks(): Promise<Map<string, Date>> {
    const response = fetch('http://' + SERVER_URL + '/passiveTasks')
          .then((response) => response.json())
          .then((json : PassiveTasksJson) => filteredMap(new Map(json.data), (v) => new Date(v)))
          .then((res) => {console.log("TYPE INSIDE", typeof res); return res})

    return response
  }
  
  getPassiveTask(task: string): Promise<Date | undefined> {
    const response = fetch('http://' + SERVER_URL + '/passiveTask/' + task)
          .then((response) => response.json())
          .then((json : PassiveTaskJson) => json.data ? new Date(json.data) : undefined);
      
    return response
  }
  
  addCook(cook: string): void {
    const message: AddCook = {
      type: functions.addCook,
      parameters: {cook}
    };
    this.sendFunction(message)
  }

  removeCook(cook: string): void {
    const message: RemoveCook = {
      type: functions.removeCook,
      parameters: {cook}
    };
    this.sendFunction(message)
    
  }
  
  timeLeft(): Promise<number> {
    const response = fetch('http://' + SERVER_URL + '/timeLeft')
          .then((response) => response.json())
          .then((json : TimeLeftJson) => json.data);

    return response
  }
  
  getTasks(): Promise<Map<string, string>>{
    const response = fetch('http://' + SERVER_URL + '/tasks')
          .then((response) => response.json())
          .then((json : TasksJson) => new Map(json.data));

    return response
  }
  
  getCompletedTasks(): Promise<string[]>{
    const response = fetch('http://' + SERVER_URL + '/completedTasks')
          .then((response) => response.json())
          .then((json : CompletedTasksJson) => json.data);

    return response
  }
  
  getProgress(): Promise<number>{
    const response = fetch('http://' + SERVER_URL + '/progress')
          .then((response) => response.json())
          .then((json : ProgressJson) => json.data);

    return response
  }
  

  getBranchProgress(): Promise<[string, number][]> {
    const response = fetch('http://' + SERVER_URL + '/branchProgress')
          .then((response) => response.json())
          .then((json : BranchProgressJson) => json.data);

    return response
  }

  
  
  undo(task: string, cook?: string | undefined): void {
    const message: Undo = {
      type: functions.undo,
      parameters: {task, cook}
    };
    this.sendFunction(message)
  }


  sendFunction(message: ServerFunction){
    this.ws.send(JSON.stringify(message))
    console.log('Sent message of type' + message.type)
  }


  initSocket(ws: WebSocket){

    ws.onmessage = (e) => {
      console.log("Message received: " + e.data)
      console.log("stringed " + JSON.parse(e.data))
      let jsonMessage = JSON.parse(e.data) as ClientFunction;
      try{
        switch(jsonMessage.type){
          case subscribers.taskAssigned: {
            const task = jsonMessage.parameters.task;
            const cook = jsonMessage.parameters.cook;
            this.taskAssignedSubscribers.forEach(f => f(task, cook));
            break;
          }
          case subscribers.passiveTaskStarted: {
            const task   = jsonMessage.parameters.task;
            const finish = new Date(jsonMessage.parameters.finish);
            this.passiveTaskStartedSubscribers.forEach(f => f(task, finish));
            break;
          }
          case subscribers.passiveTaskFinished: {
            const task = jsonMessage.parameters.task;
            this.passiveTaskFinishedSubscribers.forEach(f => f(task));
            break;
          }
          case subscribers.passiveTaskCheckFinished: {
            const task = jsonMessage.parameters.task;
            this.passiveTaskCheckFinishedSubscribers.forEach(f => f(task));
            break;
          }
          case subscribers.recipeFinished: {
            this.recipeFinishedSubscribers.forEach(f => f());
            break;
          }
          case subscribers.progress: {
            const progress = jsonMessage.parameters.progress;
            this.progressSubscribers.forEach(f => f(progress));
            break;
          }
            
          default: {
            ws.send("Invalid function: " + jsonMessage)
            console.log("Invalid function from server: " + jsonMessage)
          }
        }
      }
      catch{
        
      }
    };
  }

  
  constructor(recipe: Recipe, cooks:CookID[]){
    this.ws = new WebSocket("ws://"  + SERVER_URL)
    this.initSocket(this.ws)

    this.ws.onopen = () => {
      cooks.forEach((c) => this.addCook(c))
    };
    
    //let msg: Initialize = {type: schedulerFunctions.initialize, parameters:{recipeId: recipe.id, cooks: cooks}}

    //this.send(msg)
  
    
  
  }
  
}