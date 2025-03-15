import { Repository, DataSource } from "typeorm";
import { User } from "../entities/user";
import { AppDataSource } from "../config/database";

export class UserRepository {
  private repository: Repository<User>;

  constructor(dataSource: DataSource = AppDataSource) {
    this.repository = dataSource.getRepository(User);
  }

  async createUser(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async findUserById(id: number): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  async findAllUsers(): Promise<User[]> {
    return this.repository.find();
  }

  async updateUser(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
