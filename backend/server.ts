import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
const PgSession = connectPgSimple(session);

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "sessions",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "DUMMY_SESSION_SECRET_CHANGE_IN_PRODUCTION",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  })
);

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

// Health check endpoint
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

    // Setup Vite/static serving AFTER API routes
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