import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/generate-from-website", async (req, res) => {
    const { website } = req.body;

    if (!website || typeof website !== "string") {
      return res.status(400).json({ error: "A valid website URL is required." });
    }

    try {
      const response = await fetch(
        "https://webhook.botbuilders.cloud/webhook/2249dbb9-2c2a-40d9-88b6-6e445cf63577",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ website }),
        }
      );

      const webhookBody = await response.text();
      console.log(`Webhook response: status=${response.status}, body=${webhookBody}`);

      if (!response.ok) {
        return res.status(response.status).json({ 
          error: "Webhook returned an error.", 
          details: webhookBody 
        });
      }

      let data;
      try {
        data = JSON.parse(webhookBody);
      } catch {
        data = webhookBody;
      }

      res.json({ success: true, data });
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.status(502).json({ error: "Failed to reach webhook endpoint." });
    }
  });

  return httpServer;
}
