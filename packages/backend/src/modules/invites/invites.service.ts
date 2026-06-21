import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invite } from '../../entities/invite.entity';
import { Activity } from '../../entities/activity.entity';
import { ActivityParticipant } from '../../entities/activity-participant.entity';

@Injectable()
export class InvitesService {
  constructor(
    @InjectRepository(Invite) private readonly repo: Repository<Invite>,
    @InjectRepository(Activity) private readonly activityRepo: Repository<Activity>,
    @InjectRepository(ActivityParticipant) private readonly participantRepo: Repository<ActivityParticipant>,
  ) {}

  async send(activityId: string, invitedBy: string, invitedUserId: string) {
    const activity = await this.activityRepo.findOneBy({ id: activityId });
    if (!activity) throw new NotFoundException('Activity not found');
    if (activity.hostId !== invitedBy) throw new ForbiddenException('Only host can invite');
    const invite = this.repo.create({ activityId, invitedBy, invitedUserId });
    return this.repo.save(invite);
  }

  async listForActivity(activityId: string, hostId: string) {
    const activity = await this.activityRepo.findOneBy({ id: activityId });
    if (!activity) throw new NotFoundException();
    if (activity.hostId !== hostId) throw new ForbiddenException();
    return this.repo.find({ where: { activityId }, relations: ['invitedUser'] });
  }

  async respond(userId: string, inviteId: string, decision: 'Accepted' | 'Declined') {
    const invite = await this.repo.findOne({ where: { id: inviteId }, relations: ['activity'] });
    if (!invite) throw new NotFoundException('Invite not found');
    if (invite.invitedUserId !== userId) throw new ForbiddenException();
    invite.status = decision;
    await this.repo.save(invite);
    if (decision === 'Accepted') {
      const participant = this.participantRepo.create({
        activityId: invite.activityId,
        userId,
        role: 'Player',
        status: 'Active',
      });
      await this.participantRepo.save(participant);
    }
    return invite;
  }

  async getMyInvites(userId: string) {
    return this.repo.find({ where: { invitedUserId: userId, status: 'Sent' }, relations: ['activity', 'inviter'] });
  }
}
