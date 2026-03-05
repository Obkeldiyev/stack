export type Role = "PARENT" | "CHILD";

export interface User {
  id: number;
  username: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Family {
  id: number;
  title: string;
  createdBy?: number;
}

export interface FamilyMembership {
  id: number;
  family: Family;
  user: User;
  role: Role;
}

export interface FamilyMember {
  id: number;
  username: string;
  role: Role;
}

export interface InviteResponse {
  code: string;
}

export interface Game {
  id: number;
  title: string;
  code: string;
  description?: string;
  coinsPerHundredPoints: number;
}

export interface GameSession {
  id: number;
  gameId: number;
  userId: number;
  startedAt: string;
  finishedAt?: string;
  scorePoints?: number;
  coinsEarned?: number;
}

export interface GameFinishResponse {
  sessionId: number;
  scorePoints: number;
  coinsEarned: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}
