var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// backend/server.ts
import "dotenv/config";
import express2 from "express";

// backend/routes.ts
import { createServer } from "http";
import { z } from "zod";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  insertUserSchema: () => insertUserSchema,
  users: () => users
});
import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});

// backend/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// backend/storage.ts
var DatabaseStorage = class {
  async getAllUsers() {
    const result = await db.select().from(users);
    return result;
  }
  async createUser(user) {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }
};
var storage = new DatabaseStorage();

// backend/upload.route.ts
import { Router } from "express";
import multer from "multer";

// backend/file.service.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
var DO_SPACES_ENDPOINT = "https://lon1.digitaloceanspaces.com";
var DO_SPACES_BUCKET = "hstengineer";
var DO_SPACES_REGION = "lon1";
var CDN_BASE = process.env.CDN_URL || `https://${DO_SPACES_BUCKET}.lon1.cdn.digitaloceanspaces.com`;
var s3Client = new S3Client({
  region: DO_SPACES_REGION,
  endpoint: DO_SPACES_ENDPOINT,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY || "",
    secretAccessKey: process.env.DO_SPACES_SECRET || ""
  },
  forcePathStyle: false
  // Use virtual-hosted-style URLs
});
function getProjectId() {
  const apiUrl = process.env.VITE_API_URL || "";
  const match = apiUrl.match(/https?:\/\/([a-f0-9-]+)-app\.joylo\.io/);
  return match ? match[1] : "unknown";
}
var ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
var ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
var ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
var MAX_FILE_SIZE = 50 * 1024 * 1024;
function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: images (jpeg, png, gif, webp) and videos (mp4, webm)`
    };
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: 50MB`
    };
  }
  return { valid: true };
}
async function saveFile(file, folder = "media") {
  const projectId = getProjectId();
  const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "")}`;
  const key = `generated_projects/${projectId}/uploads/${folder}/${safeName}`;
  const type = file.mimetype.startsWith("video/") ? "video" : "image";
  try {
    const command = new PutObjectCommand({
      Bucket: DO_SPACES_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read"
    });
    await s3Client.send(command);
    console.log(`Uploaded to S3 with public-read ACL: ${key}`);
    return {
      url: `${CDN_BASE}/${key}`,
      key,
      type,
      filename: safeName
    };
  } catch (error) {
    console.error("Failed to upload to S3:", error);
    throw new Error("Failed to upload file to storage");
  }
}
async function deleteFile(key) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: DO_SPACES_BUCKET,
      Key: key
    });
    await s3Client.send(command);
    console.log(`Deleted from S3: ${key}`);
    return true;
  } catch (error) {
    console.error("Failed to delete from S3:", error);
    return false;
  }
}

// backend/upload.route.ts
var router = Router();
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024
    // 50MB
  }
});
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }
    const uploadedFile = {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer
    };
    const validation = validateFile(uploadedFile);
    if (!validation.valid) {
      res.status(400).json({ error: validation.error });
      return;
    }
    const folder = req.query.folder || "media";
    const result = await saveFile(uploadedFile, folder);
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});
router.delete("/", async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) {
      res.status(400).json({ error: "No file key provided" });
      return;
    }
    const success = await deleteFile(key);
    if (success) {
      res.json({ success: true, message: "File marked for deletion" });
    } else {
      res.status(500).json({ error: "Failed to mark file for deletion" });
    }
  } catch (error) {
    console.error("Delete failed:", error);
    res.status(500).json({ error: "Delete failed" });
  }
});
var upload_route_default = router;

// backend/routes.ts
async function registerRoutes(app2) {
  app2.use("/api/upload", upload_route_default);
  app2.get("/api/users", async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      res.json(users2);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
      return;
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
        return;
      }
      console.error("Error creating users:", error);
      res.status(500).json({ message: "Failed to create user" });
      return;
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// backend/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "vite-joylo-runtime-overlay";
import joyloEditor from "vite-plugin-joylo-editor";
var vite_config_default = defineConfig({
  plugins: [joyloEditor(), runtimeErrorOverlay(), react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "frontend/src"),
      "@shared": path.resolve(import.meta.dirname, "shared")
    }
  },
  root: path.resolve(import.meta.dirname, "frontend"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// backend/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("/*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "frontend",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
  log("Vite development server setup complete");
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) {
      return next();
    }
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
  log("Static file serving setup complete");
}

// backend/server.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  let capturedJson;
  const originalJson = res.json;
  res.json = function(body, ...args) {
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
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    version: process.env.npm_package_version || "1.0.0"
  });
});
async function startServer() {
  try {
    const server = await registerRoutes(app);
    app.use((err, req, res, next) => {
      const status = err.status || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      throw err;
    });
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    const PORT = process.env.PORT || 3e3;
    if (!process.env.PORT) {
      console.log("\u26A0\uFE0F  .env not loaded or PORT not set");
    }
    server.listen(
      {
        port: PORT,
        host: "0.0.0.0",
        reusePort: true
      },
      () => {
        log(`\u{1F680} Joylo fullstack app running on port ${PORT}`);
        log(`Environment: ${app.get("env")}`);
        if (app.get("env") === "development") {
          log("Frontend served via Vite dev server");
        } else {
          log("Frontend served as static files");
        }
      }
    );
  } catch (err) {
    console.error("\u274C Failed to start server:", err);
    process.exit(1);
  }
}
startServer();
