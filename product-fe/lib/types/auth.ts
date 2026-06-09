export type UserRole = "USER" | "ADMIN" | "MANAGER";

export interface User {
  id: number;
  username: string;
  email?: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}
