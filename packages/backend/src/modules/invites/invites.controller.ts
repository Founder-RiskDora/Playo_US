import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InvitesService } from './invites.service';

@Controller('activities/:activityId/invites')
@UseGuards(AuthGuard('jwt'))
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post()
  sendInvite(@Request() req: any, @Param('activityId') activityId: string, @Body() body: { invitedUserId: string }) {
    return this.invitesService.send(activityId, req.user.id, body.invitedUserId);
  }

  @Get()
  listInvites(@Request() req: any, @Param('activityId') activityId: string) {
    return this.invitesService.listForActivity(activityId, req.user.id);
  }

  @Patch(':inviteId/accept')
  accept(@Request() req: any, @Param('inviteId') inviteId: string) {
    return this.invitesService.respond(req.user.id, inviteId, 'Accepted');
  }

  @Patch(':inviteId/decline')
  decline(@Request() req: any, @Param('inviteId') inviteId: string) {
    return this.invitesService.respond(req.user.id, inviteId, 'Declined');
  }
}
