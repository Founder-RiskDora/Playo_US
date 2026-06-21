import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JoinRequest } from '../../entities/join-request.entity';
import { Activity } from '../../entities/activity.entity';
import { ActivityParticipant } from '../../entities/activity-participant.entity';

@Injectable()
export class JoinRequestsService {
  constructor(
    @InjectRepository(JoinRequest) private readonly repo: Repository<JoinRequest>,
    @InjectRepository(Activity) private readonly activityRepo: Repository<Activity>,
    @InjectRepository(ActivityParticipant) private readonly participantRepo: Repository<ActivityParticipant>,
  ) {}

  async create(activityId: string, userId: string) {
    const activity = await this.activityRepo.findOneBy({ id: activityId });
    if (!activity) throw new NotFoundException('Activity not found');
    if (activity.status === 'Cancelled' || activity.status === 'Completed') {
      throw new BadRequestException('Cannot join a cancelled or completed activity');
    }
    const existing = await this.repo.findOne({ where: { activityId, userId, status: 'Pending' } });
    if (existing) throw new BadRequestException('Already requested');
    const request = this.repo.create({ activityId, userId });
    return this.repo.save(request);
  }

  async listForActivity(activityId: string, requesterId: string) {
    const activity = await this.activityRepo.findOneBy({ id: activityId });
    if (!activity) throw new NotFoundException('Activity not found');
    if (activity.hostId !== requesterId) throw new ForbiddenException();
    return this.repo.find({ where: { activityId, status: 'Pending' }, relations: ['user'] });
  }

  async respond(hostId: string, requestId: string, decision: 'Accepted' | 'Rejected') {
    const request = await this.repo.findOne({ where: { id: requestId }, relations: ['activity'] });
    if (!request) throw new NotFoundException('Request not found');
    if (request.activity.hostId !== hostId) throw new ForbiddenException();
    if (request.status !== 'Pending') throw new BadRequestException('Request already resolved');

    request.status = decision;
    request.respondedAt = new Date();
    await this.repo.save(request);

    if (decision === 'Accepted') {
      const participant = this.participantRepo.create({
        activityId: request.activityId,
        userId: request.userId,
        role: 'Player',
        status: 'Active',
      });
      await this.participantRepo.save(participant);
    }

    return request;
  }

  async cancel(userId: string, requestId: string) {
    const request = await this.repo.findOneBy({ id: requestId });
    if (!request) throw new NotFoundException('Request not found');
    if (request.userId !== userId) throw new ForbiddenException();
    request.status = 'Cancelled';
    return this.repo.save(request);
  }
}
