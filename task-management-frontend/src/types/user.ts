export enum UserRole {
  ADMIN = 'ADMIN',
  DEV = 'DEV',
}

export interface User {
  token?: string,
  username: string;
  role: UserRole;
}


