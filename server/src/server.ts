import express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { AddressInfo } from 'net';
import {BasicScheduler, Scheduler} from "../../common/code/scheduler";
import chokladbiskvier from "../../common/data/recipes/chokladbiskvier.json";
import { functions, subscribers, SchedulerFunction } from "../../common/code/data/schedulerFunctions";
import { TaskID, CookID } from "../../common/code/scheduler/Scheduler";
const app = express();

type ClientID = number;
type FunctionID = number;

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

const broadcastRegex = /^broadcast\:/;

const tempCooks = ["enkock", "tvåkock", "trekock"]

const scheduler: Scheduler = new BasicScheduler(chokladbiskvier, tempCooks)


// We store subscriber functions here so we can retrieve them when the client wants to subscribe
type TaskAssignedFunctions       = Map<[ClientID, FunctionID], (task: TaskID | undefined, cook: CookID) => void>
type PassiveTaskStartedFunctions = Map<[ClientID, FunctionID], (task: TaskID, finish: Date)             => void>
const taskAssignedFunctions       : TaskAssignedFunctions = new Map();
const passiveTaskStartedFunctions : PassiveTaskStartedFunctions = new Map();

let clients: Map<number, WebSocket> = new Map();

wss.on('connection', (ws: WebSocket) => {
    // TODO: Add "clients" field in scheduler?.
    // NO, we don't want the scheduler to think about clients.
    // TODO: Better way of choosing id? This will not work if you remove clients.
    const cID: ClientID = clients.size;
    clients.set(cID, ws)

    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {
      
      //log the received message and send it back to the client
      console.log('received: %s', message);

      let jsonMessage = JSON.parse(message)

      try{
        switch(jsonMessage.type){
          case functions.addCook:
            scheduler.addCook(jsonMessage.data.cook); break;
          case functions.removeCook:
            scheduler.removeCook(jsonMessage.data.cook); break;
          case functions.subscribeTaskAssigned: {
            let fID: FunctionID = jsonMessage.data.function;
            subscribeTaskAssignedGlue(scheduler, ws, cID, fID, taskAssignedFunctions);
            break;
          }; 
          case functions.unsubscribeTaskAssigned: {
            let fID: FunctionID = jsonMessage.data.function;
            unsubscribeTaskAssignedGlue(scheduler, cID, fID, taskAssignedFunctions);
            break;
          };
          case functions.finishTask:
            scheduler.finishTask(jsonMessage.data.task, jsonMessage.data.cook); break;
          case functions.finishPassiveTask:
            scheduler.finishPassiveTask(jsonMessage.data.task); break;
          case functions.checkPassiveTaskFinished:
            scheduler.checkPassiveTaskFinished(jsonMessage.data.task); break;
          case functions.subscribePassiveTaskStarted: {
            let fID: FunctionID = jsonMessage.data.function;
            subscribePassiveTaskStartedGlue(scheduler, ws, cID, fID, passiveTaskStartedFunctions); 
          }; break;
          case functions.unsubscribePassiveTaskStarted: {
            let fID: FunctionID = jsonMessage.data.function;
            unsubscribePassiveTaskStartedGlue(scheduler, cID, fID, passiveTaskStartedFunctions);
          }; break;
          
        }
      }
      catch{
        
      }

      if (broadcastRegex.test(message)) {
        broadcast(message)
          
      } else {
          ws.send(`Hello, you sent -> ${message}`);
      }
  });

    //send immediatly a feedback to the incoming connection
    ws.send('Hi there, I am a WebSocket server');
    ws.send("Current recipe is: " + scheduler.getRecipe.name)
});

//start our server
server.listen(process.env.PORT || 8999, () => {
  let add = server.address() as AddressInfo;
  if (add) {
    console.log(`Server started on port ${add.port} :)`);
  }
});



function broadcast(message: string){
  console.log("BROADCASTING")
  message = message.replace(broadcastRegex, '');

  //send back the message to the other clients
  wss.clients
      .forEach(client => {

            client.send(`Hello, broadcast message -> ${message}`);
          
      });
}

function subscribeTaskAssignedGlue(scheduler: Scheduler, ws: WebSocket, cID: ClientID, fID: FunctionID, functions: TaskAssignedFunctions) {
  let serverFunction = (task: TaskID | undefined, cook: CookID) => {
    let message = {
      type : subscribers.taskAssignedSubscriber,
      data : { task, cook, clientFunction: fID }
    };
    ws.send(message.toString());
  }
  functions.set([cID, fID], serverFunction);
  scheduler.subscribeTaskAssigned(serverFunction)
}

function unsubscribeTaskAssignedGlue(scheduler: Scheduler, cID: ClientID, fID: FunctionID, functions: TaskAssignedFunctions) {
  let fun = functions.get([cID, fID]);
  if (fun) {
    scheduler.unsubscribeTaskAssigned(fun)
  } else {
    // TODO: What should happen if you unsubscribe a function that doesn't exist?
  }
  functions.delete([cID, fID])
}


function subscribePassiveTaskStartedGlue(scheduler: Scheduler, ws: WebSocket, cID: ClientID, fID: FunctionID, functions: PassiveTaskStartedFunctions) {
  let serverFunction = (task: TaskID , finish: Date) => {
    let message = {
      type : subscribers.passiveTaskStartedSubscriber,
      data : { task, finish, clientFunction: fID }
    };
    ws.send(message.toString());
  }
  functions.set([cID, fID], serverFunction);
  scheduler.subscribePassiveTaskStarted(serverFunction)
}

function unsubscribePassiveTaskStartedGlue(scheduler: Scheduler, cID: ClientID, fID: FunctionID, functions: PassiveTaskStartedFunctions) {
  let fun = functions.get([cID, fID]);
  if (fun) { scheduler.unsubscribePassiveTaskStarted(fun) }
  functions.delete([cID, fID])
}

