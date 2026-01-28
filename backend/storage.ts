import { users, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getAllUsers(): Promise<User[]> {
    const result = await db.select().from(users);
    return result;
  }

  async createUser(user: InsertUser): Promise<User | undefined> {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }
}

export const storage = new DatabaseStorage();
