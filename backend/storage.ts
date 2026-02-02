import { 
  users, 
  refrigerationUnits, 
  temperatureLogs, 
  deliveries, 
  cookRecords, 
  hotHoldingRecords,
  type User, 
  type InsertUser, 
  type SafeUser,
  type RefrigerationUnit,
  type InsertRefrigerationUnit,
  type TemperatureLog,
  type InsertTemperatureLog,
  type Delivery,
  type InsertDelivery,
  type CookRecord,
  type InsertCookRecord,
  type HotHoldingRecord,
  type InsertHotHoldingRecord,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
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

  // Refrigeration Units
  createRefrigerationUnit(userId: string, unit: InsertRefrigerationUnit): Promise<RefrigerationUnit>;
  getRefrigerationUnits(userId: string): Promise<RefrigerationUnit[]>;
  getRefrigerationUnitById(id: string, userId: string): Promise<RefrigerationUnit | undefined>;
  deleteRefrigerationUnit(id: string, userId: string): Promise<void>;

  // Temperature Logs
  createTemperatureLog(userId: string, log: InsertTemperatureLog): Promise<TemperatureLog>;
  getTemperatureLogs(userId: string): Promise<TemperatureLog[]>;
  getTemperatureLogsByUnit(unitId: string, userId: string): Promise<TemperatureLog[]>;

  // Deliveries
  createDelivery(userId: string, delivery: InsertDelivery): Promise<Delivery>;
  getDeliveries(userId: string): Promise<Delivery[]>;
  getDeliveryById(id: string, userId: string): Promise<Delivery | undefined>;

  // Cook Records
  createCookRecord(userId: string, record: InsertCookRecord): Promise<CookRecord>;
  getCookRecords(userId: string): Promise<CookRecord[]>;

  // Hot Holding Records
  createHotHoldingRecord(userId: string, record: InsertHotHoldingRecord): Promise<HotHoldingRecord>;
  getHotHoldingRecords(userId: string): Promise<HotHoldingRecord[]>;
}

export class DatabaseStorage implements IStorage {
  // Hash password
  async hashPassword(password: string): Promise<string> {
    console.log("[storage] Hashing password");
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  // Verify password
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    console.log("[storage] Verifying password");
    try {
      const isValid = await bcrypt.compare(plainPassword, hashedPassword);
      console.log("[storage] Password verification result:", isValid);
      return isValid;
    } catch (error) {
      console.error("[storage] Password verification error:", error);
      return false;
    }
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
    console.log("[storage] Getting user by email:", email);
    const [user] = await db.select().from(users).where(eq(users.email, email));
    console.log("[storage] User found:", user ? "yes" : "no");
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
    
    const hashedPassword = await this.hashPassword(userData.password);
    console.log("[storage] Password hashed successfully");
    
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

  // Refrigeration Units
  async createRefrigerationUnit(userId: string, unit: InsertRefrigerationUnit): Promise<RefrigerationUnit> {
    const [created] = await db.insert(refrigerationUnits).values({
      ...unit,
      userId,
    }).returning();
    return created;
  }

  async getRefrigerationUnits(userId: string): Promise<RefrigerationUnit[]> {
    return db.select()
      .from(refrigerationUnits)
      .where(and(
        eq(refrigerationUnits.userId, userId),
        eq(refrigerationUnits.isActive, true)
      ))
      .orderBy(desc(refrigerationUnits.createdAt));
  }

  async getRefrigerationUnitById(id: string, userId: string): Promise<RefrigerationUnit | undefined> {
    const [unit] = await db.select()
      .from(refrigerationUnits)
      .where(and(
        eq(refrigerationUnits.id, id),
        eq(refrigerationUnits.userId, userId)
      ));
    return unit;
  }

  async deleteRefrigerationUnit(id: string, userId: string): Promise<void> {
    await db.update(refrigerationUnits)
      .set({ isActive: false })
      .where(and(
        eq(refrigerationUnits.id, id),
        eq(refrigerationUnits.userId, userId)
      ));
  }

  // Temperature Logs
  async createTemperatureLog(userId: string, log: InsertTemperatureLog): Promise<TemperatureLog> {
    const [created] = await db.insert(temperatureLogs).values({
      ...log,
      userId,
    }).returning();
    return created;
  }

  async getTemperatureLogs(userId: string): Promise<TemperatureLog[]> {
    return db.select()
      .from(temperatureLogs)
      .where(eq(temperatureLogs.userId, userId))
      .orderBy(desc(temperatureLogs.readingTime));
  }

  async getTemperatureLogsByUnit(unitId: string, userId: string): Promise<TemperatureLog[]> {
    return db.select()
      .from(temperatureLogs)
      .where(and(
        eq(temperatureLogs.unitId, unitId),
        eq(temperatureLogs.userId, userId)
      ))
      .orderBy(desc(temperatureLogs.readingTime));
  }

  // Deliveries
  async createDelivery(userId: string, delivery: InsertDelivery): Promise<Delivery> {
    const [created] = await db.insert(deliveries).values({
      ...delivery,
      userId,
    }).returning();
    return created;
  }

  async getDeliveries(userId: string): Promise<Delivery[]> {
    return db.select()
      .from(deliveries)
      .where(eq(deliveries.userId, userId))
      .orderBy(desc(deliveries.createdAt));
  }

  async getDeliveryById(id: string, userId: string): Promise<Delivery | undefined> {
    const [delivery] = await db.select()
      .from(deliveries)
      .where(and(
        eq(deliveries.id, id),
        eq(deliveries.userId, userId)
      ));
    return delivery;
  }

  // Cook Records
  async createCookRecord(userId: string, record: InsertCookRecord): Promise<CookRecord> {
    const [created] = await db.insert(cookRecords).values({
      ...record,
      userId,
    }).returning();
    return created;
  }

  async getCookRecords(userId: string): Promise<CookRecord[]> {
    return db.select()
      .from(cookRecords)
      .where(eq(cookRecords.userId, userId))
      .orderBy(desc(cookRecords.cookedAt));
  }

  // Hot Holding Records
  async createHotHoldingRecord(userId: string, record: InsertHotHoldingRecord): Promise<HotHoldingRecord> {
    const [created] = await db.insert(hotHoldingRecords).values({
      ...record,
      userId,
    }).returning();
    return created;
  }

  async getHotHoldingRecords(userId: string): Promise<HotHoldingRecord[]> {
    return db.select()
      .from(hotHoldingRecords)
      .where(eq(hotHoldingRecords.userId, userId))
      .orderBy(desc(hotHoldingRecords.createdAt));
  }
}

export const storage = new DatabaseStorage();