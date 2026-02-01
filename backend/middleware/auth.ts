import { Request, Response, NextFunction } from "express";
import type { SafeUser } from "@shared/schema";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
    }
  }
}

// Middleware to check if user is authenticated
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  console.log("[auth] Checking authentication, session:", req.session);
  
  if (!req.session?.userId) {
    console.log("[auth] No user session found");
    return res.status(401).json({ message: "Authentication required" });
  }
  
  console.log("[auth] User authenticated:", req.session.userId);
  next();
}

// Middleware to check if user has specific role
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    
    next();
  };
}

// Middleware to attach user to request
export async function attachUser(req: Request, res: Response, next: NextFunction) {
  if (req.session?.userId) {
    const { storage } = await import("../storage");
    const user = await storage.getUserById(req.session.userId);
    if (user) {
      req.user = user;
    }
  }
  next();
}