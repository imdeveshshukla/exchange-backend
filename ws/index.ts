import {WebSocketServer} from 'ws'

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (socket:any) => {
  console.log('New client connected');

  socket.on('message', (message: string) => {
    console.log('Received:', message);
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});
