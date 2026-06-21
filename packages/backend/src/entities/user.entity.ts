import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  profilePhoto: string;

  @Column({ nullable: true })
  passwordHash: string;

  @Column({ default: 'Beginner' })
  skillLevel: string;

  @Column({ nullable: true })
  city: string;

  @CreateDateColumn()
  createdAt: Date;
}
