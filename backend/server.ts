import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  let capturedJson: any;
  const originalJson = res.json;

  res.json = function (body, ...args) {
    capturedJson = body;
    return originalJson.call(this, body, ...args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      let logLine = `${req.method} ${req.path} ${res.statusCode} in ${duration}ms`;
      if (capturedJson) {
        logLine += ` :: ${JSON.stringify(capturedJson)}`;
      }
      log(logLine);
    }
  });

  next();
});

// Add health check endpoint before registerRoutes
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    version: process.env.npm_package_version || "1.0.0",
  });
});

// Start the server
async function startServer() {
  try {
    // Register API routes FIRST
    const server = await registerRoutes(app);

    // Error handler
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      const status = err.status || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      throw err;
    });

    // CRITICAL: Setup Vite/static serving AFTER API routes
    // This ensures the catch-all route doesn't interfere with API endpoints
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Single port serves everything
    const PORT = process.env.PORT || 3000;
    if (!process.env.PORT) {
      console.log("⚠️  .env not loaded or PORT not set");
    }

    server.listen(
      {
        port: PORT,
        host: "0.0.0.0",
        reusePort: true,
      },
      () => {
        log(`🚀 Joylo fullstack app running on port ${PORT}`);
        log(`Environment: ${app.get("env")}`);
        if (app.get("env") === "development") {
          log("Frontend served via Vite dev server");
        } else {
          log("Frontend served as static files");
        }
      }
    );
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
