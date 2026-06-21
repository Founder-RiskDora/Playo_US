import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from '../../entities/chat-message.entity';
import { ActivityParticipant } from '../../entities/activity-participant.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage) private readonly messageRepo: Repository<ChatMessage>,
    @InjectRepository(ActivityParticipant) private readonly participantRepo: Repository<ActivityParticipant>,
  ) {}

  async isParticipant(activityId: string, userId: string): Promise<boolean> {
    const p = await this.participantRepo.findOne({ where: { activityId, userId, status: 'Active' } });
    return !!p;
  }

  async getMessages(activityId: string, userId: string) {
    if (!(await this.isParticipant(activityId, userId))) throw new ForbiddenException();
    return this.messageRepo.find({
      where: { activityId },
      relations: ['sender'],
      order: { sentAt: 'ASC' },
    });
  }

  async saveMessage(activityId: string, senderId: string | null, text: string, type: 'text' | 'system' = 'text') {
    const msg = this.messageRepo.create({ activityId, senderId, messageText: text, messageType: type });
    return this.messageRepo.save(msg);
  }
}
