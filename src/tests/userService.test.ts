// Testes gerados por IA.
"reflect-metadata";
import { UserService } from "../services/userService";
import { UserRepository } from "../repositories/userRepository";
import { User } from "../entities/user";
import { container } from "tsyringe";

jest.mock("../repositories/userRepository");

describe("UserService", () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = container.resolve(
      UserRepository
    ) as jest.Mocked<UserRepository>;
    userService = new UserService(userRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should hash the password and save the user", async () => {
      const user = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        password: "hashedpassword",
      } as User;
      userRepository.createUser.mockResolvedValue(user);

      const result = await userService.registerUser(
        "John Doe",
        "john@example.com",
        "password123"
      );

      expect(userRepository.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "John Doe",
          email: "john@example.com",
          password: expect.any(String),
        })
      );
      expect(result).toEqual(user);
    });
  });
});
