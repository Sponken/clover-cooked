import express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { AddressInfo } from 'net';
import {BasicScheduler, Scheduler, TaskID, CookID} from "./scheduler";
import chokladbiskvier from "./chokladbiskvier.json";
import { functions, subscribers, ServerFunction, TaskAssigned,
  PassiveTaskStarted,
  PassiveTaskFinished,
  PassiveTaskCheckFinished,
  RecipeFinished,
  Progress,
  ClientFunction,
  BranchProgressJson,
  ProgressJson,
  TasksJson,
  CompletedTasksJson,
  TimeLeftJson,
  PassiveTaskJson,
  PassiveTasksJson,
  RecipeJson,
} from "./scheduler/schedulerFunctions";
const app = express();

type ClientID = number;

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

const broadcastRegex = /^broadcast\:/;

const scheduler: Scheduler = new BasicScheduler(chokladbiskvier, [])

// We store subscriber functions here so we can retrieve them when the client wants to subscribe
type PassiveTaskStartedFunctions = Map<ClientID, (task: TaskID, finish: Date) => void>
type PassiveTaskFinishedFunctions = Map<ClientID, (task: TaskID) => void>
type PassiveTaskCheckFinishedFunctions = PassiveTaskFinishedFunctions
type TaskAssignedFunctions = Map<ClientID, (
  task: TaskID | undefined,
  cook: CookID
) => void>
type RecipeFinishedFunctions = Map<ClientID, () => void>
type ProgressFunctions = Map<ClientID, (progress: number) => void>



const passiveTaskStartedFunctions       : PassiveTaskStartedFunctions       = new Map();
const passiveTaskFinishedFunctions      : PassiveTaskFinishedFunctions      = new Map();
const passiveTaskCheckFinishedFunctions : PassiveTaskCheckFinishedFunctions = new Map();
const taskAssignedFunctions             : TaskAssignedFunctions             = new Map();
const recipeFinishedFunctions           : RecipeFinishedFunctions           = new Map();
const progressFunctions                 : ProgressFunctions                 = new Map();

let clients: Map<number, WebSocket> = new Map();

wss.on('connection', (ws: WebSocket) => {
    // TODO: Add "clients" field in scheduler?.
    // NO, we don't want the scheduler to think about clients.
    // TODO: Better way of choosing id? This will not work if you remove clients.
    const cID: ClientID = clients.size;
    clients.set(cID, ws)


    subscribeTaskAssignedGlue(scheduler, ws, cID, taskAssignedFunctions);
    subscribePassiveTaskStartedGlue(scheduler, ws, cID, passiveTaskStartedFunctions);
    subscribePassiveTaskFinishedGlue(scheduler, ws, cID, passiveTaskFinishedFunctions);
    subscribePassiveTaskCheckFinishedGlue(scheduler, ws, cID, passiveTaskCheckFinishedFunctions);
    subscribeRecipeFinishedGlue(scheduler, ws, cID, recipeFinishedFunctions);
    subscribeProgressGlue(scheduler, ws, cID, progressFunctions);

    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {
      
      //log the received message
      console.log('received: %s', message);


      let jsonMessage = JSON.parse(message) as ServerFunction;

      // if(jsonMessage.type == functions.initialize){
      //   scheduler = new BasicScheduler(jsonMessage.parameters.recipe, jsonMessage.parameters.cooks)
      // }else if(!scheduler){
      //   ws.send("Scheduler is not initalized")
      //   console.log("Client sent function to a non-initialized scheduler")
      // }
      

      try{
        switch(jsonMessage.type){

          case functions.addCook:
            scheduler.addCook(jsonMessage.parameters.cook); break;

          case functions.removeCook:
            scheduler.removeCook(jsonMessage.parameters.cook); break;

          case functions.finishTask:
            scheduler.finishTask(jsonMessage.parameters.task, jsonMessage.parameters.cook); break;

          case functions.finishPassiveTask:
            scheduler.finishPassiveTask(jsonMessage.parameters.task); break;

          case functions.checkPassiveTaskFinished:
            scheduler.checkPassiveTaskFinished(jsonMessage.parameters.task); break;
          
          case functions.extendPassive:
            scheduler.extendPassive(jsonMessage.parameters.task, jsonMessage.parameters.add); break;

          case functions.undo:
            scheduler.undo(jsonMessage.parameters.task, jsonMessage.parameters.cook); break;
            
          default: {
            ws.send("Invalid function: " + jsonMessage.type)
            console.log("Invalid function from client: " + jsonMessage.type)
          }
        }
      }
      catch{
        
      }
  });

});


app.get('/recipe', function (req, res) {
  let progress = scheduler.getRecipe();
  let message: RecipeJson = {data: progress}
  res.send(message)
})

app.get('/passiveTasks', function (req, res) {
  let progress = scheduler.getPassiveTasks();
  let message: PassiveTasksJson = {data: progress}
  res.send(message)
})

app.get('/passiveTask/:taskID', function (req, res) {
  let taskID = req.params["taskID"]
  let progress = scheduler.getPassiveTask(taskID);
  let message: PassiveTaskJson = {data: progress}
  res.send(message)
})

app.get('/progress', function (req, res) {
  let progress = scheduler.getProgress();
  let message: ProgressJson = {data: progress}
  res.send(message)
})

app.get('/timeLeft', function (req, res) {
  let timeLeft = scheduler.timeLeft();
  let message: TimeLeftJson = {data: timeLeft}
  res.send(message)
})

app.get('/tasks', function (req, res) {
  let tasks = scheduler.getTasks();
  let message: TasksJson = {data: tasks}
  res.send(message)
})

app.get('/completedTasks', function (req, res) {
  let completedTasks = scheduler.getCompletedTasks();
  let message: CompletedTasksJson = {data: completedTasks}
  res.send(message)
})

app.get('/progress', function (req, res) {
  let progress = scheduler.getProgress();
  let message: ProgressJson = {data: progress}
  res.send(message)
})

app.get('/branchProgress', function (req, res) {
  let progress = scheduler.getBranchProgress();
  let message: BranchProgressJson = {data: progress}
  res.send(message)
})








//start our server
server.listen(process.env.PORT || 8999, () => {
  let add = server.address() as AddressInfo;
  if (add) {
    console.log(`Server started on port ${add.port} :)`);
  }
});

function sendMessage(ws: WebSocket, message: ClientFunction): void {
  ws.send(JSON.stringify(message));
  console.log('Sent message of type' + message.type)

}


function subscribeTaskAssignedGlue(scheduler: Scheduler, ws: WebSocket, cID: ClientID, functions: TaskAssignedFunctions) {
  let serverFunction = (task: TaskID | undefined, cook: CookID) => {
    let message: TaskAssigned = {
      type : subscribers.taskAssigned,
      parameters : { task, cook }
    };
    sendMessage(ws, message);
  }
  functions.set(cID, serverFunction);
  scheduler.subscribeTaskAssigned(serverFunction)
}

function unsubscribeTaskAssignedGlue(scheduler: Scheduler, cID: ClientID, functions: TaskAssignedFunctions) {
  let fun = functions.get(cID);
  // TODO: What should happen if you unsubscribe a function that doesn't exist?
  if (fun) { scheduler.unsubscribeTaskAssigned(fun) }
  functions.delete(cID)
}


function subscribePassiveTaskStartedGlue(scheduler: Scheduler, ws: WebSocket, cID: ClientID, functions: PassiveTaskStartedFunctions) {
  let serverFunction = (task: TaskID , finish: Date) => {
    let message: PassiveTaskStarted = {
      type : subscribers.passiveTaskStarted,
      parameters : { task, finish }
    };
    sendMessage(ws, message);
  }
  functions.set(cID, serverFunction);
  scheduler.subscribePassiveTaskStarted(serverFunction)
}

function unsubscribePassiveTaskStartedGlue(scheduler: Scheduler, cID: ClientID, functions: PassiveTaskStartedFunctions) {
  let fun = functions.get(cID);
  if (fun) { scheduler.unsubscribePassiveTaskStarted(fun) }
  functions.delete(cID)
}


function subscribeProgressGlue(scheduler: Scheduler, ws: WebSocket, cID: ClientID, functions: ProgressFunctions) {
  let serverFunction = (progress: number) => {
    let message: Progress = {
      type : subscribers.progress,
      parameters : { progress }
    };
    sendMessage(ws, message);
  }
  functions.set(cID, serverFunction);
  scheduler.subscribeProgress(serverFunction)
}

function subscribeRecipeFinishedGlue(scheduler: Scheduler, ws: WebSocket, cID: ClientID, functions: RecipeFinishedFunctions) {
  let serverFunction = () => {
    let message: RecipeFinished = {
      type : subscribers.recipeFinished,
      parameters : {}
    };
    sendMessage(ws, message);
  }
  functions.set(cID, serverFunction);
  scheduler.subscribeRecipeFinished(serverFunction)
}

function subscribePassiveTaskFinishedGlue(scheduler: Scheduler, ws: WebSocket, cID: ClientID, functions: PassiveTaskFinishedFunctions) {
  let serverFunction = (task: TaskID) => {
    let message: PassiveTaskFinished = {
      type : subscribers.passiveTaskFinished,
      parameters : {task}
    };
    sendMessage(ws, message);
  }
  functions.set(cID, serverFunction);
  scheduler.subscribePassiveTaskFinished(serverFunction)
}


function subscribePassiveTaskCheckFinishedGlue(scheduler: Scheduler, ws: WebSocket, cID: ClientID, functions: PassiveTaskCheckFinishedFunctions) {
  let serverFunction = (task: TaskID) => {
    let message: PassiveTaskCheckFinished = {
      type : subscribers.passiveTaskCheckFinished,
      parameters : {task}
    };
    sendMessage(ws, message);
  }
  functions.set(cID, serverFunction);
  scheduler.subscribePassiveTaskCheckFinished(serverFunction)
}