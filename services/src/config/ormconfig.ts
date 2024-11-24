import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Message } from "../entities/Message";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: true,
  entities: [User, Message],
});
