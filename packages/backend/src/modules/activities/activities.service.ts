import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../../entities/activity.entity';
import { ActivityParticipant } from '../../entities/activity-participant.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity) private readonly activityRepo: Repository<Activity>,
    @InjectRepository(ActivityParticipant) private readonly participantRepo: Repository<ActivityParticipant>,
  ) {}

  async findPublic(filters: { city?: string; date?: string; skillLevel?: string }) {
    const qb = this.activityRepo.createQueryBuilder('a')
      .leftJoinAndSelect('a.host', 'host')
      .where('a.visibility = :v', { v: 'Public' })
      .andWhere('a.status NOT IN (:...statuses)', { statuses: ['Cancelled', 'Completed'] })
      .orderBy('a.dateTimeStart', 'ASC');
    return qb.getMany();
  }

  async findByUser(userId: string) {
    const hosted = await this.activityRepo.find({ where: { hostId: userId }, relations: ['host'] });
    const participations = await this.participantRepo.find({
      where: { userId, status: 'Active' },
      relations: ['activity', 'activity.host'],
    });
    return {
      hosted,
      joined: participations.filter(p => p.role === 'Player').map(p => p.activity),
    };
  }

  async findById(id: string) {
    const activity = await this.activityRepo.findOne({ where: { id }, relations: ['host'] });
    if (!activity) throw new NotFoundException('Activity not found');
    const participants = await this.participantRepo.find({
      where: { activityId: id, status: 'Active' },
      relations: ['user'],
    });
    return { ...activity, participants, currentPlayerCount: participants.length };
  }

  async create(hostId: string, data: any) {
    const activity = this.activityRepo.create({ ...data, hostId, sport: 'Badminton' });
    await this.activityRepo.save(activity);
    const participant = this.participantRepo.create({ activityId: activity.id, userId: hostId, role: 'Host', status: 'Active' });
    await this.participantRepo.save(participant);
    return activity;
  }

  async update(hostId: string, id: string, data: any) {
    const activity = await this.activityRepo.findOneBy({ id });
    if (!activity) throw new NotFoundException('Activity not found');
    if (activity.hostId !== hostId) throw new ForbiddenException();
    Object.assign(activity, data);
    return this.activityRepo.save(activity);
  }

  async cancel(hostId: string, id: string) {
    const activity = await this.activityRepo.findOneBy({ id });
    if (!activity) throw new NotFoundException('Activity not found');
    if (activity.hostId !== hostId) throw new ForbiddenException();
    activity.status = 'Cancelled';
    return this.activityRepo.save(activity);
  }

  async getRoster(id: string) {
    return this.participantRepo.find({ where: { activityId: id, status: 'Active' }, relations: ['user'] });
  }

  async removePlayer(hostId: string, activityId: string, userId: string) {
    const activity = await this.activityRepo.findOneBy({ id: activityId });
    if (!activity) throw new NotFoundException('Activity not found');
    if (activity.hostId !== hostId) throw new ForbiddenException();
    const participant = await this.participantRepo.findOne({ where: { activityId, userId } });
    if (!participant) throw new NotFoundException('Participant not found');
    participant.status = 'Removed';
    return this.participantRepo.save(participant);
  }

  async addParticipant(activityId: string, userId: string) {
    const existing = await this.participantRepo.findOne({ where: { activityId, userId } });
    if (existing) {
      existing.status = 'Active';
      return this.participantRepo.save(existing);
    }
    const participant = this.participantRepo.create({ activityId, userId, role: 'Player', status: 'Active' });
    return this.participantRepo.save(participant);
  }
}
