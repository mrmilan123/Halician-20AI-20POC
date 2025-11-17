import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { handleDemo } from "./routes/demo";
import { handleSignup } from "./routes/signup";
import { handleChat } from "./routes/chat";

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

  // SPA Fallback: Serve index.html for any non-API, non-static routes
  // This allows client-side routing to work on hard refresh
  app.use((req, res, next) => {
    // Skip API routes and let them be handled by Express
    if (req.path.startsWith("/api/")) {
      return next();
    }

    // In development, Vite will serve index.html
    // In production, serve from dist/spa
    const indexPath = path.join(__dirname, "../dist/spa/index.html");
    res.sendFile(indexPath, (err) => {
      if (err) {
        // If file doesn't exist (dev mode), send a basic HTML that lets Vite handle it
        res.setHeader("Content-Type", "text/html");
        res.send(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Loading...</title>
            </head>
            <body>
              <div id="root"></div>
              <script type="module" src="/client/main.tsx"></script>
            </body>
          </html>
        `);
      }
    });
  });

  return app;
}
