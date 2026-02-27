import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, ExternalLink, ToggleRight } from "lucide-react";
import { Link, useRoute } from "wouter";

const EDIT_VOICE_BASE = import.meta.env.VITE_EDIT_VOICE_AGENT_BASE_URL ?? "";

function buildEditVoiceUrl(locationId: string, agentId: string): string {
  if (!EDIT_VOICE_BASE.trim()) return "";
  const base = EDIT_VOICE_BASE.replace(/\/$/, "");
  return `${base}/v2/location/${encodeURIComponent(locationId)}/ai-agents/voice-ai/${encodeURIComponent(agentId)}?mode=edit&tab=agent_details`;
}

export default function VoiceBotRecipe() {
  const [, params] = useRoute("/voiceai/bot/:id");
  const agentId = params?.id ?? null;
  const [agent, setAgent] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(!!agentId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) {
      setAgent(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/ghl/voice-ai/agents/${encodeURIComponent(agentId)}`, {
          credentials: "include",
        });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error ?? "Failed to load voice agent");
          setAgent(null);
        } else {
          setAgent(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError("Failed to load voice agent");
          setAgent(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [agentId]);

  if (!agentId) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        <Link href="/voiceai">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <Card className="shadow-sm border-gray-200">
          <CardContent className="pt-6">
            <p className="text-gray-500">No agent selected.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        <div className="flex items-center gap-4">
          <Link href="/voiceai">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <Card className="shadow-sm border-gray-200">
          <CardContent className="pt-6">
            <p className="text-gray-500">{error ?? "Voice agent not found."}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStr = (key: string) => (typeof agent[key] === "string" ? (agent[key] as string) : undefined);
  const name = getStr("agentName") ?? (agent.id && String(agent.id).slice(0, 12)) ?? "Unnamed Voice Agent";
  const businessName = getStr("businessName");
  const welcomeMessage = getStr("welcomeMessage") ?? "";
  const agentPrompt = getStr("agentPrompt") ?? "";
  const locationId = getStr("locationId") ?? "";
  const actions = Array.isArray(agent.actions)
    ? (agent.actions as Array<{ name?: string; actionType?: string }>)
        .map((a) => (a.name && String(a.name).trim()) || (a.actionType && String(a.actionType).trim()) || "")
        .filter(Boolean)
    : [];

  const editUrl = locationId ? buildEditVoiceUrl(locationId, agentId!) : "";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-4 flex-wrap">
        <Link href="/voiceai">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{name}</h1>
          <p className="text-gray-500 text-sm">
            {businessName ? `${businessName} · ` : ""}Settings for this voice agent.
          </p>
        </div>
        {editUrl && (
          <a href={editUrl} className="shrink-0" target="_blank" rel="noopener noreferrer">
            <Button className="gap-2 rounded-full px-6 shadow-sm font-medium bg-[#4698d8] hover:bg-[#3980b8] text-white border-0">
              <ExternalLink className="h-4 w-4" />
              Edit Voice Agent
            </Button>
          </a>
        )}
      </div>

      <div className="max-w-4xl space-y-8">
        <div className="space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle>Core configuration</CardTitle>
              <CardDescription>Current prompt and greeting for this voice agent.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="welcome" className="text-base font-semibold">
                  Welcome message
                </Label>
                <Textarea
                  id="welcome"
                  value={welcomeMessage}
                  readOnly
                  className="min-h-10 resize-y text-base bg-gray-50/50 border-gray-200 focus-visible:ring-0 cursor-default"
                  placeholder="—"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="agent-prompt" className="text-base font-semibold">
                  Agent prompt
                </Label>
                <Textarea
                  id="agent-prompt"
                  value={agentPrompt}
                  readOnly
                  className="min-h-[200px] resize-y text-base bg-gray-50/50 border-gray-200 focus-visible:ring-0 cursor-default"
                  placeholder="—"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gray-50 border-b border-gray-100 rounded-t-xl">
              <CardTitle className="text-lg">Actions included in this voice agent</CardTitle>
              <CardDescription>Actions configured for this voice agent.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {actions.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">No actions configured for this voice agent.</p>
              ) : (
                <div className="space-y-6">
                  {actions.map((actionName, index) => (
                    <div key={index} className="relative flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 z-10">
                        <ToggleRight className="h-4 w-4" />
                      </div>
                      <div className="flex-1 pt-1">
                        <h4 className="font-semibold text-gray-900">{actionName}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
