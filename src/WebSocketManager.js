import { Server } from 'socket.io';

class WebSocketManager {
  constructor(server) {
    this.io = new Server(server , {
        cors: {
          origin: process.env.FRONTEND_HOST,
          methods: ["GET", "POST", "OPTIONS"],
          credentials: true
        }
      });
    this.setupConnectionHandler();
  }

  setupConnectionHandler() {
    this.io.on('connection', (socket) => {
      console.log('WebSocket client connected : '+socket.id);

      socket.on('Client', (data,ack) => 
      {
        console.log('Client:'+socket.id, data.message);
        ack({ message: 'Message received by the server.' });
      });
    });
  }

  sendMessageToClient(messageType, messageData) {
    this.io.emit(messageType, messageData);
  }
}
export default WebSocketManager;


