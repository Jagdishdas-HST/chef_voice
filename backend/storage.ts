import { users, type User, type InsertUser, type SafeUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export interface IStorage {
  // User management
  getAllUsers(): Promise<SafeUser[]>;
  getUserById(id: string): Promise<SafeUser | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<SafeUser>;
  updateUserLastLogin(id: string): Promise<void>;
  
  // Authentication
  verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
}

export class DatabaseStorage implements IStorage {
  // Hash password
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  // Verify password
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Get all users (without passwords)
  async getAllUsers(): Promise<SafeUser[]> {
    const result = await db.select({
      id: users.id,
      email: users.email,
      username: users.username,
      name: users.name,
      restaurantName: users.restaurantName,
      role: users.role,
      isActive: users.isActive,
      emailVerified: users.emailVerified,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    }).from(users);
    return result;
  }

  // Get user by ID (without password)
  async getUserById(id: string): Promise<SafeUser | undefined> {
    const [user] = await db.select({
      id: users.id,
      email: users.email,
      username: users.username,
      name: users.name,
      restaurantName: users.restaurantName,
      role: users.role,
      isActive: users.isActive,
      emailVerified: users.emailVerified,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    }).from(users).where(eq(users.id, id));
    return user;
  }

  // Get user by email (with password for authentication)
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  // Get user by username (with password for authentication)
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  // Create user with hashed password
  async createUser(userData: InsertUser): Promise<SafeUser> {
    console.log("[storage] Creating user:", userData.email);
    
    // Hash password before storing
    const hashedPassword = await this.hashPassword(userData.password);
    
    const [createdUser] = await db.insert(users).values({
      ...userData,
      password: hashedPassword,
    }).returning({
      id: users.id,
      email: users.email,
      username: users.username,
      name: users.name,
      restaurantName: users.restaurantName,
      role: users.role,
      isActive: users.isActive,
      emailVerified: users.emailVerified,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });
    
    console.log("[storage] User created successfully:", createdUser.id);
    return createdUser;
  }

  // Update last login timestamp
  async updateUserLastLogin(id: string): Promise<void> {
    await db.update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, id));
  }
}

export const storage = new DatabaseStorage();