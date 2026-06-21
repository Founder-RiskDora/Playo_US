import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';

@Controller('activities/:activityId/chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getMessages(@Request() req: any, @Param('activityId') activityId: string) {
    return this.chatService.getMessages(activityId, req.user.id);
  }
}
