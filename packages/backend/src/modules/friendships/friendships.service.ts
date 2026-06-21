import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friendship } from '../../entities/friendship.entity';

@Injectable()
export class FriendshipsService {
  constructor(@InjectRepository(Friendship) private readonly repo: Repository<Friendship>) {}

  async getFriends(userId: string) {
    return this.repo.find({
      where: [{ userId, status: 'Accepted' }, { friendId: userId, status: 'Accepted' }],
      relations: ['user', 'friend'],
    });
  }

  async sendRequest(userId: string, friendId: string) {
    if (userId === friendId) throw new BadRequestException('Cannot friend yourself');
    const existing = await this.repo.findOne({
      where: [{ userId, friendId }, { userId: friendId, friendId: userId }],
    });
    if (existing) throw new BadRequestException('Friendship already exists');
    const f = this.repo.create({ userId, friendId, status: 'Pending' });
    return this.repo.save(f);
  }

  async respond(userId: string, id: string, status: 'Accepted') {
    const f = await this.repo.findOneBy({ id });
    if (!f) throw new NotFoundException();
    if (f.friendId !== userId) throw new ForbiddenException();
    f.status = status;
    return this.repo.save(f);
  }

  async remove(userId: string, id: string) {
    const f = await this.repo.findOneBy({ id });
    if (!f) throw new NotFoundException();
    if (f.userId !== userId && f.friendId !== userId) throw new ForbiddenException();
    return this.repo.remove(f);
  }
}
