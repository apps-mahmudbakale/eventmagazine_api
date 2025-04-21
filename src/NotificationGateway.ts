import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/notifications', cors: true })
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private activeClients: Record<number, string> = {}; // Map washer ID to socket ID

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Remove washer from active clients
    const washerId = Object.keys(this.activeClients).find(
      (key) => this.activeClients[key] === client.id,
    );
    if (washerId) {
      delete this.activeClients[washerId];
    }
  }

  registerWasher(washerId: number, clientId: string) {
    this.activeClients[washerId] = clientId;
  }

  notifyWasher(washerId: number, message: any) {
    const clientId = this.activeClients[washerId];
    if (clientId) {
      this.server.to(clientId).emit('notification', message);
    }
  }

  broadcastNewRequest(request: any) {
    this.server.emit('new-request', request);
  }
}
