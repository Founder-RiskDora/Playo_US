import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Activity } from './activity.entity';
import { User } from './user.entity';

@Entity('invites')
export class Invite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  activityId: string;

  @ManyToOne(() => Activity)
  @JoinColumn({ name: 'activityId' })
  activity: Activity;

  @Column()
  invitedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'invitedBy' })
  inviter: User;

  @Column()
  invitedUserId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'invitedUserId' })
  invitedUser: User;

  @Column({ default: 'Sent' })
  status: string;

  @CreateDateColumn()
  sentAt: Date;
}
