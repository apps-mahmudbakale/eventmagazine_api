import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3001, { cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer() server: Server;
  private users: { [key: string]: Socket } = {}; // Store users and their connections

  // When a user connects, store their socket with their email
  handleConnection(client: Socket) {
    console.log(`User connected: ${client.id}`);
    client.on('register', (email: string) => {
      this.users[email] = client;
      console.log(`User registered: ${email}`);
    });
  }

  // When a user disconnects, remove their socket from the list
  handleDisconnect(client: Socket) {
    console.log(`User disconnected: ${client.id}`);
    for (let email in this.users) {
      if (this.users[email] === client) {
        delete this.users[email];
        break;
      }
    }
  }

  // Listen for messages and send to the specific user by email
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: { from: string; to: string; message: string }) {
    const { from, to, message } = data;

    // Check if the recipient user is connected
    if (this.users[to]) {
      this.users[to].emit('message', { from, message }); // Send message to the specific user
    }
  }
}
