import { Controller, Get, Post, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JoinRequestsService } from './join-requests.service';

@Controller('activities/:activityId/join-requests')
@UseGuards(AuthGuard('jwt'))
export class JoinRequestsController {
  constructor(private readonly joinRequestsService: JoinRequestsService) {}

  @Post()
  requestToJoin(@Request() req: any, @Param('activityId') activityId: string) {
    return this.joinRequestsService.create(activityId, req.user.id);
  }

  @Get()
  listRequests(@Request() req: any, @Param('activityId') activityId: string) {
    return this.joinRequestsService.listForActivity(activityId, req.user.id);
  }

  @Patch(':requestId/accept')
  accept(@Request() req: any, @Param('activityId') activityId: string, @Param('requestId') requestId: string) {
    return this.joinRequestsService.respond(req.user.id, requestId, 'Accepted');
  }

  @Patch(':requestId/reject')
  reject(@Request() req: any, @Param('activityId') activityId: string, @Param('requestId') requestId: string) {
    return this.joinRequestsService.respond(req.user.id, requestId, 'Rejected');
  }

  @Patch(':requestId/cancel')
  cancel(@Request() req: any, @Param('requestId') requestId: string) {
    return this.joinRequestsService.cancel(req.user.id, requestId);
  }
}
