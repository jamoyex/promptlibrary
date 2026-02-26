import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Copy, CheckCircle2, AlertCircle, ToggleRight, Loader2, PlusCircle } from "lucide-react";
import { Link, useRoute } from "wouter";
import { useToast } from "@/hooks/use-toast";

const GHL_ACTION_TYPE_MAP: Record<
  string,
  { name: string; instruction: string }
> = {
  updateContactField: {
    name: "Contact Info",
    instruction:
      "Enable this action for custom fields. (Note: Name, Email, and Phone are captured automatically via the prompt and do NOT need this action).",
  },
  appointmentBooking: {
    name: "Appointment Booking",
    instruction:
      "Enable this action and select your preferred calendar from the dropdown in your GoHighLevel settings. No need to copy any URLs.",
  },
  triggerWorkflow: {
    name: "Trigger Workflow",
    instruction: "Configure which workflow to run when this action is triggered in your agent settings.",
  },
  humanHandOver: {
    name: "Human Handover",
    instruction: "Enable to transfer the conversation to a human agent when needed.",
  },
  stopBot: {
    name: "Stop Bot",
    instruction: "Stops the bot and can optionally trigger a workflow.",
  },
  advancedFollowup: {
    name: "Advanced Follow-up",
    instruction: "Configure follow-up sequences for this agent.",
  },
  transferBot: {
    name: "Transfer Bot",
    instruction: "Transfer the conversation to another bot.",
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
      instruction: mapped?.instruction ?? `Enable and configure this action in your GoHighLevel agent settings.`,
      type,
      ...(updates?.length ? { updates } : {}),
    };
  });
}

export default function BotRecipe() {
  const { toast } = useToast();
  const [, params] = useRoute("/bot/:id");
  const agentId = params?.id ?? null;

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [promptData, setPromptData] = useState({
    personality: "",
    goal: "",
    additionalInfo: "",
  });
  const [requiredActions, setRequiredActions] = useState<RequiredAction[]>([]);
  const [agentName, setAgentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [creatingField, setCreatingField] = useState<string | null>(null);
  const [createdFields, setCreatedFields] = useState<string[]>([]);

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

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast({
      title: "Copied to clipboard",
      description: `${fieldName} has been copied.`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCreateField = (fieldId: string) => {
    setCreatingField(fieldId);
    setTimeout(() => {
      setCreatingField(null);
      setCreatedFields((prev) => [...prev, fieldId]);
      toast({
        title: "Field Created in GHL",
        description: "The custom field was successfully created in your GoHighLevel account.",
      });
    }, 1500);
  };

  const displayName = agentName || new URLSearchParams(window.location.search).get("name") || "Your Chatbot";

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
      <div className="flex items-center gap-4">
        <Link href="/my-prompts">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {displayName}
          </h1>
          <p className="text-gray-500 text-sm">Review, tweak, and copy these values into your GoHighLevel account.</p>
        </div>
      </div>

      <div className="max-w-4xl space-y-8">
        <div className="space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle>Core Prompt Configuration</CardTitle>
              <CardDescription>Copy each of these sections directly into your agent settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="personality" className="text-base font-semibold">Personality</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2"
                    onClick={() => handleCopy(promptData.personality, "Personality")}
                    disabled={!promptData.personality}
                  >
                    {copiedField === "Personality" ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    {copiedField === "Personality" ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <Textarea
                  id="personality"
                  value={promptData.personality}
                  onChange={(e) => setPromptData({ ...promptData, personality: e.target.value })}
                  className="min-h-[120px] resize-y text-base bg-gray-50/50"
                  placeholder="e.g. Friendly and helpful"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="goal" className="text-base font-semibold">Goal</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2"
                    onClick={() => handleCopy(promptData.goal, "Goal")}
                    disabled={!promptData.goal}
                  >
                    {copiedField === "Goal" ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    {copiedField === "Goal" ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <Textarea
                  id="goal"
                  value={promptData.goal}
                  onChange={(e) => setPromptData({ ...promptData, goal: e.target.value })}
                  className="min-h-[120px] resize-y text-base bg-gray-50/50"
                  placeholder="e.g. Assist customers with inquiries"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="additional-info" className="text-base font-semibold">Additional Info / Instructions</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2"
                    onClick={() => handleCopy(promptData.additionalInfo, "Additional Info")}
                    disabled={!promptData.additionalInfo}
                  >
                    {copiedField === "Additional Info" ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    {copiedField === "Additional Info" ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <Textarea
                  id="additional-info"
                  value={promptData.additionalInfo}
                  onChange={(e) => setPromptData({ ...promptData, additionalInfo: e.target.value })}
                  className="min-h-[120px] resize-y text-base bg-gray-50/50"
                  placeholder="e.g. Provide excellent customer service"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gray-50 border-b border-gray-100 rounded-t-xl">
              <CardTitle className="text-lg">Required Actions</CardTitle>
              <CardDescription>
                Configure these specific actions in your agent settings for this template to work.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm mb-6 flex gap-2 items-start">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <p>Turn on the following actions in your account and follow the instructions.</p>
              </div>

              {requiredActions.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">No actions configured for this agent in GoHighLevel.</p>
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
                            <p className="text-sm text-gray-500">{action.instruction}</p>
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
                                      <div className="flex justify-between items-center mb-1">
                                        <Label className="text-xs font-semibold text-gray-700">Action name</Label>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 px-2 text-xs"
                                          onClick={() => handleCopy(update.actionName, `${update.id}-action-name`)}
                                        >
                                          {copiedField === `${update.id}-action-name` ? (
                                            <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                                          ) : (
                                            <Copy className="h-3 w-3 mr-1" />
                                          )}
                                          {copiedField === `${update.id}-action-name` ? "Copied!" : "Copy"}
                                        </Button>
                                      </div>
                                      <Input
                                        readOnly
                                        value={update.actionName}
                                        className="h-8 text-sm bg-white font-mono text-gray-600 focus-visible:ring-0"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs font-semibold text-gray-700">
                                        Which contact field to be updated
                                      </Label>
                                      <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 text-sm font-medium text-gray-900 px-3 py-1.5 bg-white border border-gray-200 rounded-md truncate">
                                          {update.contactField}{" "}
                                          <span className="text-gray-400 font-normal ml-1 hidden sm:inline">
                                            (Select from dropdown)
                                          </span>
                                        </div>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className={`h-8 shrink-0 ${
                                            createdFields.includes(update.id)
                                              ? "text-green-600 border-green-200 bg-green-50"
                                              : "text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100"
                                          }`}
                                          onClick={() => handleCreateField(update.id)}
                                          disabled={creatingField === update.id || createdFields.includes(update.id)}
                                        >
                                          {creatingField === update.id ? (
                                            <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                                          ) : createdFields.includes(update.id) ? (
                                            <CheckCircle2 className="h-3 w-3 mr-1.5" />
                                          ) : (
                                            <PlusCircle className="h-3 w-3 mr-1.5" />
                                          )}
                                          {createdFields.includes(update.id) ? "Created" : "Create Field in GHL"}
                                        </Button>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="flex justify-between items-center mb-1">
                                        <Label className="text-xs font-semibold text-gray-700">
                                          What to update in the field
                                        </Label>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 px-2 text-xs"
                                          onClick={() => handleCopy(update.whatToUpdate, `${update.id}-what-to-update`)}
                                        >
                                          {copiedField === `${update.id}-what-to-update` ? (
                                            <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                                          ) : (
                                            <Copy className="h-3 w-3 mr-1" />
                                          )}
                                          {copiedField === `${update.id}-what-to-update` ? "Copied!" : "Copy"}
                                        </Button>
                                      </div>
                                      <Input
                                        readOnly
                                        value={update.whatToUpdate}
                                        className="h-8 text-sm bg-white font-mono text-gray-600 focus-visible:ring-0"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : action.type === "updateContactField" ? (
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-600">
                              Configure contact field updates in your GoHighLevel agent: Conversation AI → this agent
                              → Actions.
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
