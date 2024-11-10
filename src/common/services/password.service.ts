import * as bcrypt from 'bcryptjs';


export class PasswordService {
  public static async comparePassword (password: string, hashPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }

  public static async hashPassword (password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public static hashPasswordSync (password: string): string {
    return bcrypt.hashSync(password, 10);
  }
}
