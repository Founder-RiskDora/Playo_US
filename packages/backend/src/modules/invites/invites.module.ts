import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invite } from '../../entities/invite.entity';
import { Activity } from '../../entities/activity.entity';
import { ActivityParticipant } from '../../entities/activity-participant.entity';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';

@Module({
  imports: [TypeOrmModule.forFeature([Invite, Activity, ActivityParticipant])],
  controllers: [InvitesController],
  providers: [InvitesService],
})
export class InvitesModule {}
