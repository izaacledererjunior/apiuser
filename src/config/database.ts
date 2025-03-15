import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "../entities/user";
import { Task } from "../entities/tasks";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User, Task],
  synchronize: false,
  logging: true,
  migrations: ["src/migrations/*.ts"],
  ssl: {
    rejectUnauthorized: false,
  },
});
