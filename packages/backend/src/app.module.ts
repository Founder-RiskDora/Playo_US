import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { JoinRequestsModule } from './modules/join-requests/join-requests.module';
import { InvitesModule } from './modules/invites/invites.module';
import { ChatModule } from './modules/chat/chat.module';
import { FriendshipsModule } from './modules/friendships/friendships.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig()),
    AuthModule,
    UsersModule,
    ActivitiesModule,
    JoinRequestsModule,
    InvitesModule,
    ChatModule,
    FriendshipsModule,
  ],
})
export class AppModule {}
