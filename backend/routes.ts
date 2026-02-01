import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";

import { loginSchema, signupSchema, insertUserSchema } from "@shared/schema";
import { storage } from "./storage";
import { requireAuth, attachUser } from "./middleware/auth";
import uploadRoutes from "./upload.route";

// Extend session data
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Attach user to all requests
  app.use(attachUser);

  // Upload routes
  app.use("/api/upload", uploadRoutes);

  // ============ AUTHENTICATION ROUTES ============

  // Signup
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      console.log("[signup] Request received:", req.body);
      
      const validatedData = signupSchema.parse(req.body);
      
      // Check if user already exists
      const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
      if (existingUserByEmail) {
        return res.status(409).json({ message: "Email already registered" });
      }
      
      const existingUserByUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUserByUsername) {
        return res.status(409).json({ message: "Username already taken" });
      }
      
      // Create user (password will be hashed in storage)
      const user = await storage.createUser({
        email: validatedData.email,
        username: validatedData.username,
        password: validatedData.password,
        name: validatedData.name,
        restaurantName: validatedData.restaurantName,
      });
      
      // Create session
      req.session.userId = user.id;
      
      console.log("[signup] User created and logged in:", user.id);
      res.status(201).json({ user });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("[signup] Validation error:", error.errors);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("[signup] Error:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      console.log("[login] Request received:", req.body.email);
      
      const validatedData = loginSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        console.log("[login] User not found:", validatedData.email);
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Check if user is active
      if (!user.isActive) {
        console.log("[login] User account is inactive:", user.id);
        return res.status(403).json({ message: "Account is inactive" });
      }
      
      // Verify password
      const isValidPassword = await storage.verifyPassword(
        validatedData.password,
        user.password
      );
      
      if (!isValidPassword) {
        console.log("[login] Invalid password for user:", user.id);
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Update last login
      await storage.updateUserLastLogin(user.id);
      
      // Create session
      req.session.userId = user.id;
      
      // Return user without password
      const { password, ...safeUser } = user;
      
      console.log("[login] User logged in successfully:", user.id);
      res.json({ user: safeUser });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("[login] Validation error:", error.errors);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("[login] Error:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    console.log("[logout] User logging out:", req.session.userId);
    req.session.destroy((err) => {
      if (err) {
        console.error("[logout] Error destroying session:", err);
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/auth/me", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user });
    } catch (error) {
      console.error("[me] Error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ============ USER ROUTES (Protected) ============

  app.get("/api/users", requireAuth, async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}