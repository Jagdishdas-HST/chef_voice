import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";

import { 
  loginSchema, 
  signupSchema,
  insertRefrigerationUnitSchema,
  insertTemperatureLogSchema,
  insertDeliverySchema,
  insertCookRecordSchema,
  insertHotHoldingRecordSchema,
} from "@shared/schema";
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
      
      const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
      if (existingUserByEmail) {
        return res.status(409).json({ message: "Email already registered" });
      }
      
      const existingUserByUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUserByUsername) {
        return res.status(409).json({ message: "Username already taken" });
      }
      
      const user = await storage.createUser({
        email: validatedData.email,
        username: validatedData.username,
        password: validatedData.password,
        name: validatedData.name,
        restaurantName: validatedData.restaurantName,
      });
      
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
      
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        console.log("[login] User not found:", validatedData.email);
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      if (!user.isActive) {
        console.log("[login] User account is inactive:", user.id);
        return res.status(403).json({ message: "Account is inactive" });
      }
      
      const isValidPassword = await storage.verifyPassword(
        validatedData.password,
        user.password
      );
      
      if (!isValidPassword) {
        console.log("[login] Invalid password for user:", user.id);
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      await storage.updateUserLastLogin(user.id);
      
      req.session.userId = user.id;
      
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

  // ============ REFRIGERATION ROUTES ============

  app.post("/api/refrigeration/units", requireAuth, async (req: Request, res: Response) => {
    try {
      const validated = insertRefrigerationUnitSchema.parse(req.body);
      const unit = await storage.createRefrigerationUnit(req.session.userId!, validated);
      res.status(201).json(unit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("[refrigeration] Create unit error:", error);
      res.status(500).json({ message: "Failed to create unit" });
    }
  });

  app.get("/api/refrigeration/units", requireAuth, async (req: Request, res: Response) => {
    try {
      const units = await storage.getRefrigerationUnits(req.session.userId!);
      res.json(units);
    } catch (error) {
      console.error("[refrigeration] Get units error:", error);
      res.status(500).json({ message: "Failed to fetch units" });
    }
  });

  app.delete("/api/refrigeration/units/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      await storage.deleteRefrigerationUnit(req.params.id, req.session.userId!);
      res.json({ message: "Unit deleted successfully" });
    } catch (error) {
      console.error("[refrigeration] Delete unit error:", error);
      res.status(500).json({ message: "Failed to delete unit" });
    }
  });

  app.post("/api/refrigeration/logs", requireAuth, async (req: Request, res: Response) => {
    try {
      const validated = insertTemperatureLogSchema.parse(req.body);
      const log = await storage.createTemperatureLog(req.session.userId!, validated);
      res.status(201).json(log);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("[refrigeration] Create log error:", error);
      res.status(500).json({ message: "Failed to create log" });
    }
  });

  app.get("/api/refrigeration/logs", requireAuth, async (req: Request, res: Response) => {
    try {
      const logs = await storage.getTemperatureLogs(req.session.userId!);
      res.json(logs);
    } catch (error) {
      console.error("[refrigeration] Get logs error:", error);
      res.status(500).json({ message: "Failed to fetch logs" });
    }
  });

  // ============ DELIVERY ROUTES ============

  app.post("/api/deliveries", requireAuth, async (req: Request, res: Response) => {
    try {
      const transformed = {
        ...req.body,
        deliveryDate: req.body.deliveryDate ? new Date(req.body.deliveryDate) : new Date(),
      };
      const validated = insertDeliverySchema.parse(transformed);
      const delivery = await storage.createDelivery(req.session.userId!, validated);
      res.status(201).json(delivery);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("[deliveries] Create error:", error);
      res.status(500).json({ message: "Failed to create delivery" });
    }
  });

  app.get("/api/deliveries", requireAuth, async (req: Request, res: Response) => {
    try {
      const deliveries = await storage.getDeliveries(req.session.userId!);
      res.json(deliveries);
    } catch (error) {
      console.error("[deliveries] Get error:", error);
      res.status(500).json({ message: "Failed to fetch deliveries" });
    }
  });

  // ============ COOK RECORD ROUTES ============

  app.post("/api/cook-records", requireAuth, async (req: Request, res: Response) => {
    try {
      const validated = insertCookRecordSchema.parse(req.body);
      const record = await storage.createCookRecord(req.session.userId!, validated);
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("[cook-records] Create error:", error);
      res.status(500).json({ message: "Failed to create cook record" });
    }
  });

  app.get("/api/cook-records", requireAuth, async (req: Request, res: Response) => {
    try {
      const records = await storage.getCookRecords(req.session.userId!);
      res.json(records);
    } catch (error) {
      console.error("[cook-records] Get error:", error);
      res.status(500).json({ message: "Failed to fetch cook records" });
    }
  });

  // ============ HOT HOLDING ROUTES ============

  app.post("/api/hot-holding", requireAuth, async (req: Request, res: Response) => {
    try {
      const validated = insertHotHoldingRecordSchema.parse(req.body);
      const record = await storage.createHotHoldingRecord(req.session.userId!, validated);
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("[hot-holding] Create error:", error);
      res.status(500).json({ message: "Failed to create hot holding record" });
    }
  });

  app.get("/api/hot-holding", requireAuth, async (req: Request, res: Response) => {
    try {
      const records = await storage.getHotHoldingRecords(req.session.userId!);
      res.json(records);
    } catch (error) {
      console.error("[hot-holding] Get error:", error);
      res.status(500).json({ message: "Failed to fetch hot holding records" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}