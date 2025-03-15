"reflect-metadata";
import { inject, injectable } from "tsyringe";
import { User } from "../entities/user";
import { UserRepository } from "../repositories/userRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

@injectable()
export class UserService {
  constructor(@inject(UserRepository) private userRepository: UserRepository) {}

  async registerUser(
    name: string,
    email: string,
    password: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = hashedPassword;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    return this.userRepository.createUser(user);
  }

  async loginUser(email: string, password: string): Promise<string | null> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    return token;
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findUserById(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAllUsers();
  }

  async updateUser(
    id: number,
    name: string,
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.userRepository.findUserById(id);
    if (!user) return null;
    user.name = name;
    user.email = email;
    user.password = await bcrypt.hash(password, 10);
    user.updatedAt = new Date();
    return this.userRepository.updateUser(user);
  }

  async deleteUser(id: number): Promise<void> {
    return this.userRepository.deleteUser(id);
  }
}
