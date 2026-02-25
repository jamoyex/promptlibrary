import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Copy, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

const ACTIONS = [
  "Appointment Booking",
  "Trigger a Workflow",
  "Contact Info",
  "Stop Bot",
  "Human Handover",
  "Transfer Bot",
  "Auto Followup"
];

export default function CreatePrompt() {
  const { toast } = useToast();
  const [selectedActions, setSelectedActions] = useState<string[]>(["Contact Info"]);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [promptData, setPromptData] = useState({
    personality: "You are a helpful, enthusiastic, and polite assistant. You always greet the user warmly and answer their questions concisely.",
    goal: "Your primary goal is to help users troubleshoot login issues and capture their email if the issue remains unresolved.",
    additionalInfo: "Never promise a refund. Always adhere to our company policy of maintaining a professional tone.",
    contactField: "user_email",
    calendarLink: "",
    workflowId: ""
  });

  const toggleAction = (action: string) => {
    setSelectedActions(prev => 
      prev.includes(action) 
        ? prev.filter(a => a !== action)
        : [...prev, action]
    );
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast({
      title: "Copied to clipboard",
      description: `${fieldName} has been copied.`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Your Prompt Recipe</h1>
          <p className="text-gray-500 text-sm">Review, tweak, and copy these values into your GoHighLevel account.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle>Core Prompt Configuration</CardTitle>
              <CardDescription>Copy each of these sections directly into your bot settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              
              {/* Personality */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="personality" className="text-base font-semibold">Personality</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 gap-2"
                    onClick={() => handleCopy(promptData.personality, "Personality")}
                  >
                    {copiedField === "Personality" ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    {copiedField === "Personality" ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <Textarea 
                  id="personality" 
                  value={promptData.personality}
                  onChange={(e) => setPromptData({...promptData, personality: e.target.value})}
                  className="min-h-[120px] resize-y text-base bg-gray-50/50"
                />
              </div>

              {/* Goal */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="goal" className="text-base font-semibold">Goal</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 gap-2"
                    onClick={() => handleCopy(promptData.goal, "Goal")}
                  >
                    {copiedField === "Goal" ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    {copiedField === "Goal" ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <Textarea 
                  id="goal" 
                  value={promptData.goal}
                  onChange={(e) => setPromptData({...promptData, goal: e.target.value})}
                  className="min-h-[120px] resize-y text-base bg-gray-50/50"
                />
              </div>

              {/* Additional Info */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="additional-info" className="text-base font-semibold">Additional Info</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 gap-2"
                    onClick={() => handleCopy(promptData.additionalInfo, "Additional Info")}
                  >
                    {copiedField === "Additional Info" ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    {copiedField === "Additional Info" ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <Textarea 
                  id="additional-info" 
                  value={promptData.additionalInfo}
                  onChange={(e) => setPromptData({...promptData, additionalInfo: e.target.value})}
                  className="min-h-[120px] resize-y text-base bg-gray-50/50"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-sm border-gray-200 sticky top-6">
            <CardHeader className="bg-gray-50 border-b border-gray-100 rounded-t-xl">
              <CardTitle className="text-lg">Action Settings</CardTitle>
              <CardDescription>
                Configure the actions this bot can take.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm mb-6 flex gap-2 items-start">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <p>Select actions and copy the required settings below into your GHL configuration.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {ACTIONS.map((action) => {
                  const isSelected = selectedActions.includes(action);
                  return (
                    <button
                      key={action}
                      onClick={() => toggleAction(action)}
                      className={`
                        px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 flex items-center justify-center flex-grow sm:flex-grow-0
                        ${isSelected 
                          ? 'border-primary bg-primary text-white shadow-sm shadow-primary/20' 
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      {action}
                    </button>
                  );
                })}
              </div>
              
              {selectedActions.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold mb-4 text-gray-900">Required Action Values</h4>
                  <div className="space-y-4">
                    {selectedActions.includes("Contact Info") && (
                      <div className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex justify-between items-center mb-1">
                          <Label className="text-xs font-semibold text-gray-700">Save Contact Info to Field</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs"
                            onClick={() => handleCopy(promptData.contactField, "Contact Field")}
                          >
                            <Copy className="h-3 w-3 mr-1" /> Copy
                          </Button>
                        </div>
                        <Input 
                          value={promptData.contactField}
                          onChange={(e) => setPromptData({...promptData, contactField: e.target.value})}
                          className="h-9 text-sm bg-white font-mono" 
                        />
                      </div>
                    )}
                    
                    {selectedActions.includes("Appointment Booking") && (
                      <div className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex justify-between items-center mb-1">
                          <Label className="text-xs font-semibold text-gray-700">Calendar Link URL</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs"
                            onClick={() => handleCopy(promptData.calendarLink, "Calendar Link")}
                          >
                            <Copy className="h-3 w-3 mr-1" /> Copy
                          </Button>
                        </div>
                        <Input 
                          placeholder="https://calendly.com/..." 
                          value={promptData.calendarLink}
                          onChange={(e) => setPromptData({...promptData, calendarLink: e.target.value})}
                          className="h-9 text-sm bg-white" 
                        />
                      </div>
                    )}

                    {selectedActions.includes("Trigger a Workflow") && (
                      <div className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex justify-between items-center mb-1">
                          <Label className="text-xs font-semibold text-gray-700">Workflow ID / Name</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs"
                            onClick={() => handleCopy("Lead Capture Flow", "Workflow ID")}
                          >
                            <Copy className="h-3 w-3 mr-1" /> Copy
                          </Button>
                        </div>
                        <select className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                          <option>Lead Capture Flow</option>
                          <option>Support Ticket Flow</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
