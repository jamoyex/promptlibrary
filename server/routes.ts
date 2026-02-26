import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const WEBHOOK_URL =
    "https://bbcommandcenterbackend.up.railway.app/webhook/jhgfdasdtgdthgsfd";

  app.post("/api/generate-from-website", async (req, res) => {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const text = await response.text();
    res.status(response.status).type("application/json").send(text);
  });

  return httpServer;
}
