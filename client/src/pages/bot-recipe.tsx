import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, AlertCircle, ToggleRight, Loader2, ExternalLink } from "lucide-react";
import { Link, useRoute } from "wouter";

const GHL_ACTION_TYPE_MAP: Record<
  string,
  { name: string; instruction: string }
> = {
  updateContactField: {
    name: "Contact Info",
    instruction:
      "Captures and updates contact fields. Name, Email, and Phone are captured automatically via the prompt.",
  },
  appointmentBooking: {
    name: "Appointment Booking",
    instruction: "Books appointments using your connected calendar.",
  },
  triggerWorkflow: {
    name: "Trigger Workflow",
    instruction: "Runs a workflow when triggered.",
  },
  humanHandOver: {
    name: "Human Handover",
    instruction: "Transfers the conversation to a human agent.",
  },
  stopBot: {
    name: "Stop Bot",
    instruction: "Stops the bot and can optionally trigger a workflow.",
  },
  advancedFollowup: {
    name: "Advanced Follow-up",
    instruction: "Follow-up sequences for this agent.",
  },
  transferBot: {
    name: "Transfer Bot",
    instruction: "Transfers the conversation to another bot.",
  },
};

interface GHLAction {
  id?: string;
  type?: string;
  name?: string;
  config?: Record<string, unknown>;
  contactFieldUpdates?: Array<Record<string, unknown>>;
  updates?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

interface FieldUpdate {
  id: string;
  actionName: string;
  contactField: string;
  whatToUpdate: string;
}

interface RequiredAction {
  id: string;
  name: string;
  instruction: string;
  type: string;
  updates?: FieldUpdate[];
}

function parseFieldUpdates(action: GHLAction, actionId: string): FieldUpdate[] | undefined {
  const raw =
    action.contactFieldUpdates ??
    action.updates ??
    (Array.isArray(action.config?.contactFieldUpdates) ? action.config.contactFieldUpdates : null) ??
    (Array.isArray(action.config?.updates) ? action.config.updates : null);
  if (!raw?.length) return undefined;
  return raw.map((u: Record<string, unknown>, i: number) => ({
    id: (u.id as string) ?? `${actionId}-update-${i}`,
    actionName: (u.actionName ?? u.name ?? u.fieldLabel ?? "Update Field") as string,
    contactField: (u.contactField ?? u.contactFieldName ?? u.fieldName ?? "Contact field") as string,
    whatToUpdate: (u.whatToUpdate ?? u.valueToUpdate ?? u.description ?? "") as string,
  }));
}

function mapGHLActionsToRequired(actions: GHLAction[] = []): RequiredAction[] {
  return actions.map((a, i) => {
    const type = (a.type ?? "unknown").toString();
    const mapped = GHL_ACTION_TYPE_MAP[type];
    const id = a.id ?? `action-${i}`;
    const updates = parseFieldUpdates(a, id);
    return {
      id,
      name: (a.name as string) || mapped?.name || type,
      instruction: mapped?.instruction ?? "",
      type,
      ...(updates?.length ? { updates } : {}),
    };
  });
}

export default function BotRecipe() {
  const [, params] = useRoute("/bot/:id");
  const agentId = params?.id ?? null;

  const [promptData, setPromptData] = useState({
    personality: "",
    goal: "",
    additionalInfo: "",
  });
  const [requiredActions, setRequiredActions] = useState<RequiredAction[]>([]);
  const [agentName, setAgentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) {
      setLoading(false);
      setLoadError("No agent selected.");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/ghl/agents/${encodeURIComponent(agentId)}`, {
          credentials: "include",
        });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          setLoadError(data.error ?? "Failed to load agent");
          setRequiredActions([]);
          setLoading(false);
          return;
        }
        setAgentName(data.name ?? new URLSearchParams(window.location.search).get("name") ?? "Your Chatbot");
        setPromptData({
          personality: data.personality ?? "",
          goal: data.goal ?? "",
          additionalInfo: data.instructions ?? "",
        });
        setRequiredActions(mapGHLActionsToRequired(data.actions ?? []));
        setLoadError(null);
      } catch {
        if (!cancelled) {
          setLoadError("Failed to load agent");
          setRequiredActions([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [agentId]);

  const displayName = agentName || new URLSearchParams(window.location.search).get("name") || "Your Chatbot";
  const editAgentBase = import.meta.env.VITE_EDIT_AGENT_BASE_URL ?? "";
  const editAgentUrl = editAgentBase && agentId ? `${editAgentBase.replace(/\/$/, "")}/${agentId}` : "";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (loadError && !promptData.personality && !promptData.goal && requiredActions.length === 0) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        <div className="flex items-center gap-4">
          <Link href="/my-prompts">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <Card className="shadow-sm border-amber-200 bg-amber-50/50">
          <CardContent className="pt-6 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-amber-800">{loadError}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-4 flex-wrap">
        <Link href="/my-prompts">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {displayName}
          </h1>
          <p className="text-gray-500 text-sm">Settings for this chatbot.</p>
        </div>
        {editAgentUrl && (
          <a
            href={editAgentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Edit Chatbot
            </Button>
          </a>
        )}
      </div>

      <div className="max-w-4xl space-y-8">
        <div className="space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle>Core Prompt Configuration</CardTitle>
              <CardDescription>Current prompt settings for this chatbot.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="personality" className="text-base font-semibold">Personality</Label>
                <Textarea
                  id="personality"
                  value={promptData.personality}
                  readOnly
                  className="min-h-[120px] resize-y text-base bg-gray-50/50 border-gray-200 focus-visible:ring-0 cursor-default"
                  placeholder="—"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="goal" className="text-base font-semibold">Goal</Label>
                <Textarea
                  id="goal"
                  value={promptData.goal}
                  readOnly
                  className="min-h-[120px] resize-y text-base bg-gray-50/50 border-gray-200 focus-visible:ring-0 cursor-default"
                  placeholder="—"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="additional-info" className="text-base font-semibold">Additional Info / Instructions</Label>
                <Textarea
                  id="additional-info"
                  value={promptData.additionalInfo}
                  readOnly
                  className="min-h-[120px] resize-y text-base bg-gray-50/50 border-gray-200 focus-visible:ring-0 cursor-default"
                  placeholder="—"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gray-50 border-b border-gray-100 rounded-t-xl">
              <CardTitle className="text-lg">Actions included in this chatbot</CardTitle>
              <CardDescription>
                Actions configured for this chatbot.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {requiredActions.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">No actions configured for this chatbot.</p>
              ) : (
                <div className="space-y-6">
                  {requiredActions.map((action, index) => (
                    <div key={action.id} className="relative">
                      {index !== requiredActions.length - 1 && (
                        <div className="absolute left-4 top-8 bottom-[-24px] w-px bg-gray-200" />
                      )}
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 z-10">
                          <ToggleRight className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-2 pt-1">
                          <div>
                            <h4 className="font-semibold text-gray-900">{action.name}</h4>
                            {action.instruction && (
                              <p className="text-sm text-gray-500">{action.instruction}</p>
                            )}
                          </div>
                          {action.type === "updateContactField" && action.updates && action.updates.length > 0 ? (
                            <div className="space-y-4 mt-2">
                              {action.updates.map((update, i) => (
                                <div key={update.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                  <h5 className="text-xs font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2 uppercase tracking-wider">
                                    Field Update {i + 1}
                                  </h5>
                                  <div className="space-y-4">
                                    <div>
                                      <Label className="text-xs font-semibold text-gray-700">Action name</Label>
                                      <Input
                                        readOnly
                                        value={update.actionName}
                                        className="mt-1 h-8 text-sm bg-white font-mono text-gray-600 focus-visible:ring-0 border-gray-200"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs font-semibold text-gray-700">
                                        Contact field to be updated
                                      </Label>
                                      <div className="mt-1 text-sm font-medium text-gray-900 px-3 py-1.5 bg-white border border-gray-200 rounded-md">
                                        {update.contactField}
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-xs font-semibold text-gray-700">
                                        What to update in the field
                                      </Label>
                                      <Input
                                        readOnly
                                        value={update.whatToUpdate}
                                        className="mt-1 h-8 text-sm bg-white font-mono text-gray-600 focus-visible:ring-0 border-gray-200"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : action.type === "updateContactField" ? (
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-600">
                              Contact field updates configured in agent settings.
                            </div>
                          ) : null}
                        </div>
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
