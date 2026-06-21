import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Friendship } from '../../entities/friendship.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Friendship) private readonly friendshipRepo: Repository<Friendship>,
  ) {}

  async findById(id: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash: _, ...result } = user as any;
    return result;
  }

  async update(id: string, data: Partial<User>): Promise<Omit<User, 'passwordHash'>> {
    await this.userRepo.update(id, data);
    return this.findById(id);
  }

  async getPlaypals(userId: string) {
    return this.friendshipRepo.find({
      where: [
        { userId, status: 'Accepted' },
        { friendId: userId, status: 'Accepted' },
      ],
      relations: ['user', 'friend'],
    });
  }

  async search(query: string): Promise<User[]> {
    return this.userRepo.createQueryBuilder('u')
      .where('u.name ILIKE :q OR u.email ILIKE :q', { q: `%${query}%` })
      .select(['u.id', 'u.name', 'u.email', 'u.profilePhoto', 'u.skillLevel'])
      .getMany();
  }
}
