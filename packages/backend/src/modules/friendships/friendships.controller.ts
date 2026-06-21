import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FriendshipsService } from './friendships.service';

@Controller('friendships')
@UseGuards(AuthGuard('jwt'))
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  @Get()
  getMyFriends(@Request() req: any) {
    return this.friendshipsService.getFriends(req.user.id);
  }

  @Post()
  sendRequest(@Request() req: any, @Body() body: { friendId: string }) {
    return this.friendshipsService.sendRequest(req.user.id, body.friendId);
  }

  @Patch(':id/accept')
  accept(@Request() req: any, @Param('id') id: string) {
    return this.friendshipsService.respond(req.user.id, id, 'Accepted');
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.friendshipsService.remove(req.user.id, id);
  }
}
