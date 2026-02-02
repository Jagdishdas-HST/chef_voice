import { pgTable, text, varchar, timestamp, boolean, decimal, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with enterprise-grade fields
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // bcrypt hashed
  name: text("name"),
  restaurantName: text("restaurant_name"),
  role: text("role").notNull().default("member"), // admin, manager, member
  isActive: boolean("is_active").notNull().default(true),
  emailVerified: boolean("email_verified").notNull().default(false),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Sessions table for express-session
export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: text("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Refrigeration Units
export const refrigerationUnits = pgTable("refrigeration_units", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  fridgeNumber: text("fridge_number").notNull(),
  type: text("type").notNull(), // Fridge, Freezer, Blast Chiller
  location: text("location").notNull(),
  targetTemperature: decimal("target_temperature", { precision: 5, scale: 2 }).notNull(),
  notes: text("notes"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Temperature Logs
export const temperatureLogs = pgTable("temperature_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  unitId: varchar("unit_id").notNull().references(() => refrigerationUnits.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  temperature: decimal("temperature", { precision: 5, scale: 2 }).notNull(),
  status: text("status").notNull(), // ok, warning, critical
  notes: text("notes"),
  readingTime: timestamp("reading_time").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Deliveries
export const deliveries = pgTable("deliveries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  staffMember: text("staff_member").notNull(),
  supplier: text("supplier").notNull(),
  deliveryDate: timestamp("delivery_date").notNull(),
  products: jsonb("products").notNull(), // Array of product objects
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Cook Records
export const cookRecords = pgTable("cook_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  productName: text("product_name").notNull(),
  staffName: text("staff_name").notNull(),
  temperature: decimal("temperature", { precision: 5, scale: 2 }).notNull(),
  cookedAt: timestamp("cooked_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Hot Holding Records
export const hotHoldingRecords = pgTable("hot_holding_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  foodItem: text("food_item").notNull(),
  timeIntoHotHold: text("time_into_hot_hold").notNull(),
  coreTemperature: decimal("core_temperature", { precision: 5, scale: 2 }).notNull(),
  checkedBy: text("checked_by").notNull(),
  comments: text("comments"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional(),
  restaurantName: z.string().optional(),
  role: z.enum(["admin", "manager", "member"]).default("member"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
  isActive: true,
  emailVerified: true,
});

export const selectUserSchema = createSelectSchema(users).omit({
  password: true, // Never expose password
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Signup schema
export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  name: z.string().optional(),
  restaurantName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Refrigeration Unit schemas
export const insertRefrigerationUnitSchema = createInsertSchema(refrigerationUnits, {
  fridgeNumber: z.string().min(1, "Fridge number is required"),
  type: z.enum(["Fridge", "Freezer", "Blast Chiller"]),
  location: z.string().min(1, "Location is required"),
  targetTemperature: z.string().transform(val => parseFloat(val)),
  notes: z.string().optional(),
}).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  isActive: true,
});

export const selectRefrigerationUnitSchema = createSelectSchema(refrigerationUnits);

// Temperature Log schemas
export const insertTemperatureLogSchema = createInsertSchema(temperatureLogs, {
  temperature: z.string().transform(val => parseFloat(val)),
  status: z.enum(["ok", "warning", "critical"]),
  notes: z.string().optional(),
}).omit({
  id: true,
  userId: true,
  createdAt: true,
  readingTime: true,
});

export const selectTemperatureLogSchema = createSelectSchema(temperatureLogs);

// Delivery schemas
export const insertDeliverySchema = createInsertSchema(deliveries, {
  staffMember: z.string().min(1, "Staff member is required"),
  supplier: z.string().min(1, "Supplier is required"),
  deliveryDate: z.string().transform(val => new Date(val)),
  products: z.array(z.object({
    name: z.string(),
    quantity: z.string().optional(),
    temperature: z.string().optional(),
    category: z.enum(["Frozen", "Chilled", "Ambient"]),
    batchNumber: z.string(),
    quality: z.enum(["Good", "Acceptable", "Rejected"]),
  })),
}).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const selectDeliverySchema = createSelectSchema(deliveries);

// Cook Record schemas
export const insertCookRecordSchema = createInsertSchema(cookRecords, {
  productName: z.string().min(1, "Product name is required"),
  staffName: z.string().min(1, "Staff name is required"),
  temperature: z.string().transform(val => parseFloat(val)),
}).omit({
  id: true,
  userId: true,
  createdAt: true,
  cookedAt: true,
});

export const selectCookRecordSchema = createSelectSchema(cookRecords);

// Hot Holding Record schemas
export const insertHotHoldingRecordSchema = createInsertSchema(hotHoldingRecords, {
  foodItem: z.string().min(1, "Food item is required"),
  timeIntoHotHold: z.string().min(1, "Time is required"),
  coreTemperature: z.string().transform(val => parseFloat(val)),
  checkedBy: z.string().min(1, "Checked by is required"),
  comments: z.string().optional(),
}).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const selectHotHoldingRecordSchema = createSelectSchema(hotHoldingRecords);

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type SafeUser = Omit<User, "password">;

export type RefrigerationUnit = typeof refrigerationUnits.$inferSelect;
export type InsertRefrigerationUnit = z.infer<typeof insertRefrigerationUnitSchema>;

export type TemperatureLog = typeof temperatureLogs.$inferSelect;
export type InsertTemperatureLog = z.infer<typeof insertTemperatureLogSchema>;

export type Delivery = typeof deliveries.$inferSelect;
export type InsertDelivery = z.infer<typeof insertDeliverySchema>;

export type CookRecord = typeof cookRecords.$inferSelect;
export type InsertCookRecord = z.infer<typeof insertCookRecordSchema>;

export type HotHoldingRecord = typeof hotHoldingRecords.$inferSelect;
export type InsertHotHoldingRecord = z.infer<typeof insertHotHoldingRecordSchema>;