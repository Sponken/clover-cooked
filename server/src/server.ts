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
} from "./scheduler/schedulerFunctions";
const app = express();

type ClientID = number;

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

const broadcastRegex = /^broadcast\:/;

const tempCooks = ["enkock", "tvåkock", "trekock"]

const scheduler: Scheduler = new BasicScheduler(chokladbiskvier, tempCooks)

// We store subscriber functions here so we can retrieve them when the client wants to subscribe
type TaskAssignedFunctions       = Map<ClientID, (task: TaskID | undefined, cook: CookID) => void>
type PassiveTaskStartedFunctions = Map<ClientID, (task: TaskID, finish: Date)             => void>
const taskAssignedFunctions       : TaskAssignedFunctions = new Map();
const passiveTaskStartedFunctions : PassiveTaskStartedFunctions = new Map();

let clients: Map<number, WebSocket> = new Map();

wss.on('connection', (ws: WebSocket) => {
    // TODO: Add "clients" field in scheduler?.
    // NO, we don't want the scheduler to think about clients.
    // TODO: Better way of choosing id? This will not work if you remove clients.
    const cID: ClientID = clients.size;
    clients.set(cID, ws)


    subscribeTaskAssignedGlue(scheduler, ws, cID, taskAssignedFunctions);
    subscribePassiveTaskStartedGlue(scheduler, ws, cID, passiveTaskStartedFunctions);

    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {
      
      //log the received message and send it back to the client
      console.log('received: %s', message);


      let jsonMessage = JSON.parse(message) as ServerFunction;

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
            
          default: {
            ws.send("Invalid function: " + jsonMessage.type)
            console.log("Invalid function from client: " + jsonMessage.type)
          }
        }
      }
      catch{
        
      }
  });

    //send immediatly a feedback to the incoming connection
    // ws.send('Hi there, I am a WebSocket server');
    // ws.send("Current recipe is: " + scheduler.getRecipe().name)
});


type BranchProgressJson = {data: [string,number][]};

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

