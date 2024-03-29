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
    this.io.on('connection', (socket) => {
        console.log('WebSocket client connected : '+socket.id);
      });
  }

  sendMessageToClient(messageType, messageData) {
    this.io.emit(messageType, messageData);
  }
}
export default WebSocketManager;


