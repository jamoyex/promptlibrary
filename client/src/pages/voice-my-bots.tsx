import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Mic, ArrowRight, Loader2, AlertCircle } from "lucide-react";

// GHL Voice AI List Agents API response shape (from actual API)
interface GHLVoiceAction {
  id?: string;
  actionType?: string;
  name?: string;
  actionParameters?: Record<string, unknown>;
}

interface GHLVoiceAgent {
  id?: string;
  locationId?: string;
  agentName?: string;
  businessName?: string;
  welcomeMessage?: string;
  agentPrompt?: string;
  voiceId?: string;
  language?: string;
  actions?: GHLVoiceAction[];
  [key: string]: unknown;
}

interface VoiceBotCard {
  id: string;
  title: string;
  description: string;
  actions: string[];
  date: string;
}

function formatAgentDate(iso?: string): string {
  if (!iso) return "Recently";
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60) return diffMins <= 1 ? "Just now" : `${diffMins} minutes ago`;
    if (diffHours < 24) return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString();
  } catch {
    return "Recently";
  }
}

function pickStr(obj: GHLVoiceAgent, ...keys: string[]): string {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

function mapVoiceAgentToCard(agent: GHLVoiceAgent): VoiceBotCard {
  const id = pickStr(agent, "id") || "";
  const title = pickStr(agent, "agentName") || (id ? `Voice Agent ${id.slice(0, 8)}` : "Unnamed Voice Agent");
  const description =
    pickStr(agent, "businessName") ||
    pickStr(agent, "welcomeMessage") ||
    (pickStr(agent, "agentPrompt") ? `${agent.agentPrompt!.slice(0, 80)}…` : "") ||
    (id ? `Agent ID: ${id}` : "—");
  const actions: string[] = Array.isArray(agent.actions)
    ? agent.actions.map((a) => (a.name && String(a.name).trim()) || (a.actionType && String(a.actionType).trim()) || "").filter(Boolean)
    : [];
  const date = formatAgentDate(
    (agent.updatedAt ?? agent.updated_at ?? agent.createdAt ?? agent.created_at) as string | undefined
  );
  return {
    id,
    title,
    description,
    actions,
    date,
  };
}

export default function VoiceMyBots() {
  const [bots, setBots] = useState<VoiceBotCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/ghl/voice-ai/agents", { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error ?? "Failed to load Voice AI agents");
          setBots(Array.isArray(data.agents) ? data.agents.map(mapVoiceAgentToCard) : []);
        } else {
          setError(null);
          const agents: GHLVoiceAgent[] = data.agents ?? [];
          agents.sort((a, b) => {
            const aDate = (a.updatedAt ?? a.updated_at ?? a.createdAt ?? a.created_at) ?? "";
            const bDate = (b.updatedAt ?? b.updated_at ?? b.createdAt ?? b.created_at) ?? "";
            return new Date(bDate).getTime() - new Date(aDate).getTime();
          });
          setBots(agents.map(mapVoiceAgentToCard));
        }
      } catch (e) {
        if (!cancelled) {
          setError("Failed to load Voice AI agents");
          setBots([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Your Voice Bots</h1>
        <p className="text-gray-500 text-sm mt-1">Voice AI agents from GoHighLevel appear here.</p>
      </div>
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          bots.map((bot) => (
            <Card
              key={bot.id}
              className="flex flex-col min-h-[260px] hover:shadow-md transition-all duration-200 border-gray-200 group hover:border-primary/30"
            >
              <CardHeader className="pb-3 flex-1 flex flex-col">
                <div className="p-2 bg-gray-100 rounded-lg text-gray-600 w-fit">
                  <Mic className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl mt-3">{bot.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{bot.description}</p>
                <span className="text-xs text-gray-400 mt-2 block">{bot.date}</span>
                <div className="mt-3 min-h-[40px]">
                  <p className="text-xs font-medium text-gray-600 mb-1.5">Actions</p>
                  {bot.actions.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {bot.actions.map((action) => (
                        <Badge key={action} variant="secondary" className="text-xs font-medium bg-gray-100 text-gray-700">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">No actions</span>
                  )}
                </div>
              </CardHeader>
              <CardFooter className="pt-4 border-t border-gray-100 mt-auto flex justify-end">
                <Link href={`/voiceai/bot/${bot.id}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    View Agent <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        )}
        {!isLoading && bots.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
            <div className="mx-auto w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Mic className="h-7 w-7 text-gray-400" />
            </div>
            <p className="font-medium text-gray-700">No voice bots yet</p>
            <p className="text-sm mt-1">
              Use Create to build a voice agent from a website or by answering questions. Ensure
              GHL_INTEGRATION_TOKEN (and optionally GHL_LOCATION_ID) are set for your location.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
