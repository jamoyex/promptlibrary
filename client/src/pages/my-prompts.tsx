import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Bot, ArrowRight, Clock, Loader2, AlertCircle, MoreVertical, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface GHLAgent {
  id?: string;
  name?: string;
  businessName?: string;
  description?: string;
  status?: string;
  mode?: string;
  channels?: string[];
  createdAt?: string;
  updatedAt?: string;
  actions?: Array<{ name?: string; id?: string }>;
  [key: string]: unknown;
}

interface PromptCard {
  id: string;
  title: string;
  businessName: string;
  actions: string[];
  date: string;
  botName: string;
  isPrimary?: boolean;
  mode?: string;
  channels: string[];
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

function formatMode(mode?: string): string {
  if (!mode) return "—";
  const m = mode.toLowerCase();
  if (m === "auto-pilot" || m === "autopilot") return "Auto-pilot";
  if (m === "suggestive") return "Suggestive";
  if (m === "off") return "Off";
  return mode;
}

function mapGHLAgentToCard(agent: GHLAgent): PromptCard {
  const id = agent.id ?? "";
  const name = agent.name ?? "Unnamed Agent";
  const actions = Array.isArray(agent.actions)
    ? agent.actions.map((a) => (typeof a === "string" ? a : a?.name ?? "")).filter(Boolean)
    : [];
  const channels = Array.isArray(agent.channels) ? agent.channels : [];
  return {
    id,
    title: name,
    businessName: agent.businessName ?? agent.description ?? "—",
    actions,
    date: formatAgentDate(agent.updatedAt ?? agent.createdAt),
    botName: name,
    isPrimary: Boolean(agent.isPrimary),
    mode: agent.mode,
    channels,
  };
}

const CHANNEL_COLORS: Record<string, string> = {
  IG: "bg-pink-100 text-pink-800 border-pink-200",
  FB: "bg-blue-100 text-blue-800 border-blue-200",
  SMS: "bg-emerald-100 text-emerald-800 border-emerald-200",
  WebChat: "bg-slate-100 text-slate-700 border-slate-200",
  WhatsApp: "bg-green-100 text-green-800 border-green-200",
  Live_Chat: "bg-amber-100 text-amber-800 border-amber-200",
};

function channelBadgeClass(channel: string): string {
  return CHANNEL_COLORS[channel] ?? "bg-gray-100 text-gray-700 border-gray-200";
}

export default function MyPrompts() {
  const { toast } = useToast();
  const [prompts, setPrompts] = useState<PromptCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settingPrimaryId, setSettingPrimaryId] = useState<string | null>(null);

  const refetchAgents = async () => {
    try {
      const res = await fetch("/api/ghl/agents", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to load agents");
        setPrompts(Array.isArray(data.agents) ? data.agents.map(mapGHLAgentToCard) : []);
      } else {
        setError(null);
        const agents = data.agents ?? [];
        setPrompts(agents.map(mapGHLAgentToCard));
      }
    } catch (e) {
      setError("Failed to load agents");
      setPrompts([]);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/ghl/agents", { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error ?? "Failed to load agents");
          setPrompts(Array.isArray(data.agents) ? data.agents.map(mapGHLAgentToCard) : []);
        } else {
          setError(null);
          const agents = data.agents ?? [];
          setPrompts(agents.map(mapGHLAgentToCard));
        }
      } catch (e) {
        if (!cancelled) {
          setError("Failed to load agents");
          setPrompts([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSetPrimary = async (agentId: string) => {
    setSettingPrimaryId(agentId);
    try {
      const res = await fetch(`/api/ghl/agents/${encodeURIComponent(agentId)}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPrimary: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({
          title: "Failed to set primary",
          description: data.error ?? data.message ?? "Could not update agent.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Set as primary",
        description: "This chatbot is now the primary agent.",
      });
      await refetchAgents();
    } catch (e) {
      toast({
        title: "Failed to set primary",
        description: "Could not update agent.",
        variant: "destructive",
      });
    } finally {
      setSettingPrimaryId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-4">
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
          prompts.map((template) => (
            <Card
              key={template.id}
              className={
                template.isPrimary
                  ? "hover:shadow-md transition-all duration-200 border-2 border-[#4698d8] bg-blue-50/40 group hover:border-[#3980b8]"
                  : "hover:shadow-md transition-all duration-200 border-gray-200 group hover:border-primary/30"
              }
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div
                      className={
                        template.isPrimary
                          ? "p-2 rounded-lg bg-[#4698d8]/20 text-[#4698d8]"
                          : "p-2 bg-gray-100 rounded-lg text-gray-600"
                      }
                    >
                      <Bot className="h-5 w-5" />
                    </div>
                    {template.isPrimary && (
                      <Badge className="bg-[#4698d8] text-white text-xs font-medium border-0">
                        Primary
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-xs text-gray-400 gap-1">
                      <Clock className="h-3 w-3" />
                      {template.date}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 text-gray-500 hover:text-gray-700"
                          disabled={settingPrimaryId === template.id}
                        >
                          {settingPrimaryId === template.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreVertical className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => handleSetPrimary(template.id)}
                          disabled={template.isPrimary || settingPrimaryId === template.id}
                          className="gap-2"
                        >
                          <Star className="h-4 w-4" />
                          Set as Primary
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardTitle className="text-xl mt-4">{template.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{template.businessName}</p>
                {template.mode && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    <span className="font-medium text-gray-600">Mode:</span> {formatMode(template.mode)}
                  </p>
                )}
                {template.channels.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-600 mb-1.5">Channels</p>
                    <div className="flex flex-wrap gap-1.5">
                      {template.channels.map((ch) => (
                        <Badge
                          key={ch}
                          variant="secondary"
                          className={`text-xs font-medium border ${channelBadgeClass(ch)}`}
                        >
                          {ch}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {template.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {template.actions.map((action) => (
                      <Badge key={action} variant="secondary" className="bg-gray-100 text-gray-600 font-medium text-xs">
                        {action}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-4 border-t border-gray-100 flex justify-end">
                <Link href={`/bot/${template.id}?name=${encodeURIComponent(template.botName)}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    Open Chatbot <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        )}
        {!isLoading && prompts.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
            No chatbots found. Connect your GoHighLevel account in Settings or create an agent in Conversation AI.
          </div>
        )}
      </div>
    </div>
  );
}
