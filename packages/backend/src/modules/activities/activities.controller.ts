import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ActivitiesService } from './activities.service';

class CreateActivityDto {
  title: string;
  description: string;
  courtName: string;
  address: string;
  lat?: number;
  long?: number;
  dateTimeStart: string;
  dateTimeEnd: string;
  maxPlayers: number;
  visibility?: string;
}

@Controller('activities')
@UseGuards(AuthGuard('jwt'))
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  findAll(@Query('city') city?: string, @Query('date') date?: string, @Query('skillLevel') skillLevel?: string) {
    return this.activitiesService.findPublic({ city, date, skillLevel });
  }

  @Get('my')
  findMine(@Request() req: any) {
    return this.activitiesService.findByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitiesService.findById(id);
  }

  @Post()
  create(@Request() req: any, @Body() dto: CreateActivityDto) {
    return this.activitiesService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() dto: Partial<CreateActivityDto>) {
    return this.activitiesService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  cancel(@Request() req: any, @Param('id') id: string) {
    return this.activitiesService.cancel(req.user.id, id);
  }

  @Get(':id/roster')
  getRoster(@Param('id') id: string) {
    return this.activitiesService.getRoster(id);
  }

  @Delete(':id/roster/:userId')
  removePlayer(@Request() req: any, @Param('id') id: string, @Param('userId') userId: string) {
    return this.activitiesService.removePlayer(req.user.id, id, userId);
  }
}
