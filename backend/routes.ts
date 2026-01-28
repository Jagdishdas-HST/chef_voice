import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";

import { insertUserSchema } from "@shared/schema";
import { storage } from "./storage"; // Assumes storage has getAllUsers, createUser, etc.
import uploadRoutes from "./upload.route";

export async function registerRoutes(app: Express): Promise<Server> {

  // Upload routes
  app.use("/api/upload", uploadRoutes);
  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
      return; // Add explicit return
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Validation error", errors: error.errors });
        return; // Add explicit return
      }
      console.error("Error creating users:", error);
      res.status(500).json({ message: "Failed to create user" });
      return; // Add explicit return
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
