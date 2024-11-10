export interface IBaseUser {
  email: string,
  password: string,
  blockedAt: Date | null,
  permissions: string[],
}
