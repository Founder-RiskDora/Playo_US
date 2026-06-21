export enum SkillLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

export enum ActivityStatus {
  Upcoming = 'Upcoming',
  Full = 'Full',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export enum ActivityVisibility {
  Public = 'Public',
  Private = 'Private',
}

export enum ParticipantRole {
  Host = 'Host',
  Player = 'Player',
}

export enum ParticipantStatus {
  Active = 'Active',
  Removed = 'Removed',
  Left = 'Left',
}

export enum JoinRequestStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled',
}

export enum InviteStatus {
  Sent = 'Sent',
  Accepted = 'Accepted',
  Declined = 'Declined',
  Expired = 'Expired',
}

export enum FriendshipStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
}

export enum MessageType {
  Text = 'text',
  System = 'system',
}

export interface IUser {
  id: string;
  name: string;
  profilePhoto?: string;
  phone?: string;
  email: string;
  skillLevel: SkillLevel;
  city?: string;
  createdAt: Date;
}

export interface IActivity {
  id: string;
  hostId: string;
  host?: IUser;
  title: string;
  description: string;
  sport: string;
  courtName: string;
  address: string;
  lat?: number;
  long?: number;
  dateTimeStart: Date;
  dateTimeEnd: Date;
  maxPlayers: number;
  currentPlayerCount: number;
  visibility: ActivityVisibility;
  status: ActivityStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IActivityParticipant {
  id: string;
  activityId: string;
  userId: string;
  user?: IUser;
  role: ParticipantRole;
  joinedAt: Date;
  status: ParticipantStatus;
}

export interface IJoinRequest {
  id: string;
  activityId: string;
  userId: string;
  user?: IUser;
  status: JoinRequestStatus;
  requestedAt: Date;
  respondedAt?: Date;
}

export interface IInvite {
  id: string;
  activityId: string;
  invitedBy: string;
  invitedUserId: string;
  invitedUser?: IUser;
  status: InviteStatus;
  sentAt: Date;
}

export interface IChatMessage {
  id: string;
  activityId: string;
  senderId: string;
  sender?: IUser;
  messageText: string;
  sentAt: Date;
  messageType: MessageType;
}

export interface IFriendship {
  id: string;
  userId: string;
  friendId: string;
  friend?: IUser;
  status: FriendshipStatus;
  createdAt: Date;
}
