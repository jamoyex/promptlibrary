import type { Express } from "express";
import { createServer, type Server } from "http";

const GHL_BASE = "https://services.leadconnectorhq.com";
const GHL_AGENTS_SEARCH_URL = `${GHL_BASE}/conversation-ai/agents/search`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const WEBHOOK_URL = process.env.WEBHOOK_URL;
  const GHL_TOKEN = process.env.GHL_INTEGRATION_TOKEN;

  app.get("/api/ghl/agents", async (_req, res) => {
    if (!GHL_TOKEN) {
      res.status(503).json({
        error: "GoHighLevel integration is not configured (GHL_INTEGRATION_TOKEN)",
        agents: [],
      });
      return;
    }
    try {
      const url = new URL(GHL_AGENTS_SEARCH_URL);
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${GHL_TOKEN}`,
          "Content-Type": "application/json",
          Version: "2021-07-28",
        },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        res.status(response.status).json({
          error: data.message || "Failed to fetch GoHighLevel agents",
          agents: [],
        });
        return;
      }
      const agents = data.agents ?? data.data?.agents ?? [];
      res.json({ agents });
    } catch (err) {
      console.error("GHL agents search error:", err);
      res.status(500).json({
        error: "Failed to fetch agents",
        agents: [],
      });
    }
  });

  const ghlHeaders = {
    Authorization: `Bearer ${GHL_TOKEN}`,
    "Content-Type": "application/json",
    Version: "2021-04-15",
  };

  app.get("/api/ghl/agents/:id", async (req, res) => {
    const { id } = req.params;
    if (!GHL_TOKEN) {
      res.status(503).json({
        error: "GoHighLevel integration is not configured (GHL_INTEGRATION_TOKEN)",
      });
      return;
    }
    if (!id) {
      res.status(400).json({ error: "Agent ID is required" });
      return;
    }
    try {
      const url = `${GHL_BASE}/conversation-ai/agents/${encodeURIComponent(id)}`;
      const response = await fetch(url, {
        method: "GET",
        headers: ghlHeaders,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        res.status(response.status).json(
          data?.message ? { error: data.message } : data
        );
        return;
      }
      const listUrl = `${GHL_BASE}/conversation-ai/agents/${encodeURIComponent(id)}/actions/list`;
      const listRes = await fetch(listUrl, { method: "GET", headers: ghlHeaders });
      const listData = await listRes.json().catch(() => ({}));
      const listActions = listRes.ok ? (listData.actions ?? listData.data?.actions ?? []) : [];
      if (listActions.length > 0) {
        const byId = new Map(listActions.map((a: { id?: string }) => [a.id ?? "", a]));
        data.actions = (data.actions ?? []).map((a: { id?: string; type?: string }) => ({
          ...(byId.get(a.id ?? "") ?? a),
          id: a.id,
          type: a.type ?? byId.get(a.id ?? "")?.type,
        }));
      }
      res.json(data);
    } catch (err) {
      console.error("GHL get agent error:", err);
      res.status(500).json({ error: "Failed to fetch agent" });
    }
  });

  app.get("/api/ghl/agents/:agentId/actions/list", async (req, res) => {
    const { agentId } = req.params;
    if (!GHL_TOKEN) {
      res.status(503).json({
        error: "GoHighLevel integration is not configured (GHL_INTEGRATION_TOKEN)",
        actions: [],
      });
      return;
    }
    if (!agentId) {
      res.status(400).json({ error: "Agent ID is required", actions: [] });
      return;
    }
    try {
      const url = `${GHL_BASE}/conversation-ai/agents/${encodeURIComponent(agentId)}/actions/list`;
      const response = await fetch(url, {
        method: "GET",
        headers: ghlHeaders,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        res.status(response.status).json({
          error: data.message ?? "Failed to fetch actions",
          actions: [],
        });
        return;
      }
      const actions = data.actions ?? data.data?.actions ?? [];
      res.json({ actions });
    } catch (err) {
      console.error("GHL list actions error:", err);
      res.status(500).json({ error: "Failed to fetch actions", actions: [] });
    }
  });

  app.get("/api/ghl/agents/:agentId/actions/:actionId", async (req, res) => {
    const { agentId, actionId } = req.params;
    if (!GHL_TOKEN) {
      res.status(503).json({
        error: "GoHighLevel integration is not configured (GHL_INTEGRATION_TOKEN)",
      });
      return;
    }
    if (!agentId || !actionId) {
      res.status(400).json({ error: "Agent ID and Action ID are required" });
      return;
    }
    try {
      const url = `${GHL_BASE}/conversation-ai/agents/${encodeURIComponent(agentId)}/actions/${encodeURIComponent(actionId)}`;
      const response = await fetch(url, {
        method: "GET",
        headers: ghlHeaders,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        res.status(response.status).json(
          data?.message ? { error: data.message } : data
        );
        return;
      }
      res.json(data);
    } catch (err) {
      console.error("GHL get action error:", err);
      res.status(500).json({ error: "Failed to fetch action" });
    }
  });

  app.post("/api/generate-from-website", async (req, res) => {
    if (!WEBHOOK_URL) {
      res.status(503).json({
        error: "Generate-from-website webhook is not configured (WEBHOOK_URL)",
      });
      return;
    }
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
