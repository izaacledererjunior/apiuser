import { DataSource } from "typeorm";
import { User } from "./src/entities/user";
import { Task } from "./src/entities/tasks";

export const AppDataSourceTest = new DataSource({
  type: "sqlite",
  database: ":memory:",
  dropSchema: true,
  entities: [User, Task],
  synchronize: true,
  logging: false,
});
