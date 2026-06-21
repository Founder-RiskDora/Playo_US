import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token as string;
      const payload = this.jwtService.verify(token);
      (client as any).userId = payload.sub;
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {}

  @SubscribeMessage('join_room')
  async joinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { activityId: string }) {
    const userId = (client as any).userId;
    const allowed = await this.chatService.isParticipant(data.activityId, userId);
    if (!allowed) { client.emit('error', { message: 'Not a participant' }); return; }
    client.join(`activity:${data.activityId}`);
    client.emit('joined', { activityId: data.activityId });
  }

  @SubscribeMessage('send_message')
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: { activityId: string; text: string }) {
    const userId = (client as any).userId;
    const allowed = await this.chatService.isParticipant(data.activityId, userId);
    if (!allowed) { client.emit('error', { message: 'Not a participant' }); return; }
    const msg = await this.chatService.saveMessage(data.activityId, userId, data.text, 'text');
    this.server.to(`activity:${data.activityId}`).emit('new_message', msg);
  }
}
