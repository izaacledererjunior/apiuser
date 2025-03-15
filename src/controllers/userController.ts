import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { UserService } from "../services/userService";

export class UserController {
  constructor() {
    this.register = this.register.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;
    const userService = container.resolve(UserService);
    const token = await userService.loginUser(email, password);
    if (!token) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    res.status(200).json({ token });
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { name, email, password } = req.body;
    const userService = container.resolve(UserService);
    const user = await userService.registerUser(name, email, password);
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  }

  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const userService = container.resolve(UserService);
    const user = await userService.getUserById(Number(id));
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  }

  async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userService = container.resolve(UserService);
    const users = await userService.getAllUsers();
    const usersWithoutPassword = users.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword
    );
    res.status(201).json(usersWithoutPassword);
  }

  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const userService = container.resolve(UserService);
    const user = await userService.updateUser(
      Number(id),
      name,
      email,
      password
    );
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  }

  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const userService = container.resolve(UserService);
    await userService.deleteUser(Number(id));
    res.status(200).json({ meessage: "User deleted" });
  }
}
