import { UserApi } from '../api';

export class UserService {
  static async register(userId: number, username?: string): Promise<void> {
    await UserApi.addUser(userId, username);
  }

  static async getAll() {
    return UserApi.fetchUsers();
  }
}
