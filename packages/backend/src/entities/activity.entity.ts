import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  hostId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'hostId' })
  host: User;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'Badminton' })
  sport: string;

  @Column()
  courtName: string;

  @Column()
  address: string;

  @Column({ type: 'float', nullable: true })
  lat: number;

  @Column({ type: 'float', nullable: true })
  long: number;

  @Column({ type: 'timestamptz' })
  dateTimeStart: Date;

  @Column({ type: 'timestamptz' })
  dateTimeEnd: Date;

  @Column()
  maxPlayers: number;

  @Column({ default: 'Public' })
  visibility: string;

  @Column({ default: 'Upcoming' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
