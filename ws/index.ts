import { createClient } from 'redis';
import {WebSocketServer} from 'ws'
const wss = new WebSocketServer({ port: 8080 });

// const pubClient = createClient();
// await pubClient.connect();

// const subClient = createClient();
// await subClient.connect();
//Teitn
const subscription:{
  [key: string]: {
    ws:WebSocket
    rooms: string[]
  }
} = {};

wss.on('connection', (socket:any) => {
  console.log('New client connected');

  socket.on('message', (raw: Buffer | String) => {
    const uid = generateUID();
    subscription[uid] = {
        ws: socket,
        rooms: []
    };
    let message: any;
    try {
      message = JSON.parse(raw.toString());
    } catch (err) {
      console.error("Invalid JSON from client:", raw.toString());
      console.log(err);
      return;
    }
    const type = message.type;
    if(type === 'subscribe') {
      const {channel} = message;
      console.log(`Client subscribed to channel: ${channel}`);
      subscription[uid].rooms.push(channel);
    }
    else if(type === 'Unsubscribe'){
      const {channel} = message;
      console.log(`Client unsubscribed from channel: ${channel}`);
      if (subscription[uid] && subscription[uid].rooms.includes(channel)) {
        subscription[uid].rooms = subscription[uid].rooms.filter(room => room !== channel);
        if (subscription[uid].rooms.length === 0) {
          delete subscription[uid];
        }
      }
    }
    else if(type == "sendMessage"){
      const {channel,msg} = message;
      console.log(`Client sent message to channel: ${channel}`);
      for(const uid in subscription) {
        console.log(`Checking subscription for UID: ${uid}`);
        console.log(subscription[uid]?.rooms);
        if(subscription[uid]?.rooms.includes(channel)) {
          subscription[uid].ws.send(msg);
        }
      }
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

function generateUID(): string {
  return 'uid_' + Math.random().toString(36).substr(2, 9);
}