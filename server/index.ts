import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { handleDemo } from "./routes/demo";
import { handleSignup } from "./routes/signup";
import { handleChat } from "./routes/chat";
import { handleInitiateChat, handleAiResponse } from "./routes/webhook";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes
  app.post("/api/signup", handleSignup);

  // Chat routes
  app.post("/api/chat", handleChat);

  // SPA Fallback: Only in production mode
  // In development, Vite's dev server handles SPA routing
  if (process.env.NODE_ENV === "production") {
    app.use((req, res, next) => {
      // Skip API routes and let them be handled by Express
      if (req.path.startsWith("/api/")) {
        return next();
      }

      // Serve from dist/spa
      const indexPath = path.join(__dirname, "../dist/spa/index.html");
      res.sendFile(indexPath, (err) => {
        if (err) {
          res.status(404).json({ error: "Not found" });
        }
      });
    });
  }

  return app;
}
