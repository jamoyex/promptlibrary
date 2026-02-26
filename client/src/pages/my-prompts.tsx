import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Bot, ArrowRight, Clock, Loader2, AlertCircle } from "lucide-react";

interface GHLAgent {
  id?: string;
  name?: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  actions?: Array<{ name?: string; id?: string }>;
  [key: string]: unknown;
}

interface PromptCard {
  id: string;
  title: string;
  description: string;
  actions: string[];
  date: string;
  botName: string;
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

function mapGHLAgentToCard(agent: GHLAgent): PromptCard {
  const id = agent.id ?? "";
  const name = agent.name ?? "Unnamed Agent";
  const actions = Array.isArray(agent.actions)
    ? agent.actions.map((a) => (typeof a === "string" ? a : a?.name ?? "")).filter(Boolean)
    : [];
  return {
    id,
    title: name,
    description: agent.description ?? "Conversation AI agent from GoHighLevel.",
    actions: actions.length ? actions : ["Chat"],
    date: formatAgentDate(agent.updatedAt ?? agent.createdAt),
    botName: name,
  };
}

export default function MyPrompts() {
  const [prompts, setPrompts] = useState<PromptCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            <Card key={template.id} className="hover:shadow-md transition-all duration-200 border-gray-200 group hover:border-primary/30">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="flex items-center text-xs text-gray-400 gap-1">
                    <Clock className="h-3 w-3" />
                    {template.date}
                  </div>
                </div>
                <CardTitle className="text-xl mt-4">{template.title}</CardTitle>
                <CardDescription className="line-clamp-2">{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {template.actions.map((action) => (
                    <Badge key={action} variant="secondary" className="bg-gray-100 text-gray-600 font-medium text-xs">
                      {action}
                    </Badge>
                  ))}
                </div>
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
