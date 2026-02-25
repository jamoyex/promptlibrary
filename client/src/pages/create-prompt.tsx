import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Copy, CheckCircle2, AlertCircle, ToggleRight, Info } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function CreatePrompt() {
  const { toast } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [promptData, setPromptData] = useState({
    personality: "You are a helpful, enthusiastic, and polite assistant. You always greet the user warmly and answer their questions concisely.",
    goal: "Your primary goal is to help users troubleshoot login issues. Always remember to ask for and capture the user's Name, Email, and Phone number.",
    additionalInfo: "Never promise a refund. Always adhere to our company policy of maintaining a professional tone. \n\nQuestions to ask:\n- When is your birthday?\n- What is your company name?"
  });

  // Pre-defined actions required for this specific template
  const requiredActions = [
    {
      id: "contact-info",
      name: "Contact Info",
      instruction: "Enable this action for custom fields. (Note: Name, Email, and Phone are captured automatically via the prompt and do NOT need this action).",
      type: "contact-info",
      updates: [
        {
          id: "birthday-update",
          actionName: "Update Birthday",
          contactField: "Date of Birth",
          whatToUpdate: "birthdate of the contact"
        },
        {
          id: "company-update",
          actionName: "Update Company",
          contactField: "Company Name",
          whatToUpdate: "company name of the contact"
        }
      ]
    },
    {
      id: "appointment-booking",
      name: "Appointment Booking",
      instruction: "Enable this action and select your preferred calendar from the dropdown in your GoHighLevel settings. No need to copy any URLs.",
    }
  ];

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
              <CardTitle className="text-lg">Required Actions</CardTitle>
              <CardDescription>
                Configure these specific actions in your bot settings for this template to work.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm mb-6 flex gap-2 items-start">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <p>Turn on the following actions in your account and follow the instructions.</p>
              </div>

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
                        
                        {action.type === 'contact-info' && action.updates ? (
                          <div className="space-y-4 mt-2">
                            {action.updates.map((update, i) => (
                              <div key={update.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <h5 className="text-xs font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2 uppercase tracking-wider">Field Update {i + 1}</h5>
                                
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
                                        {copiedField === `${update.id}-action-name` ? <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" /> : <Copy className="h-3 w-3 mr-1" />}
                                        {copiedField === `${update.id}-action-name` ? "Copied!" : "Copy"}
                                      </Button>
                                    </div>
                                    <Input readOnly value={update.actionName} className="h-8 text-sm bg-white font-mono text-gray-600 focus-visible:ring-0" />
                                  </div>

                                  <div>
                                    <Label className="text-xs font-semibold text-gray-700">Which contact field to be updated</Label>
                                    <div className="text-sm font-medium text-gray-900 mt-1 px-3 py-1.5 bg-white border border-gray-200 rounded-md">
                                      {update.contactField} <span className="text-gray-400 font-normal ml-1">(Select from dropdown)</span>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex justify-between items-center mb-1">
                                      <Label className="text-xs font-semibold text-gray-700">What to update in the field</Label>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-6 px-2 text-xs"
                                        onClick={() => handleCopy(update.whatToUpdate, `${update.id}-what-to-update`)}
                                      >
                                        {copiedField === `${update.id}-what-to-update` ? <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" /> : <Copy className="h-3 w-3 mr-1" />}
                                        {copiedField === `${update.id}-what-to-update` ? "Copied!" : "Copy"}
                                      </Button>
                                    </div>
                                    <Input readOnly value={update.whatToUpdate} className="h-8 text-sm bg-white font-mono text-gray-600 focus-visible:ring-0" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (action as any).valueToCopy ? (
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                              <Label className="text-xs font-semibold text-gray-700">{(action as any).fieldLabel}</Label>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2 text-xs"
                                onClick={() => handleCopy((action as any).valueToCopy!, action.name)}
                              >
                                {copiedField === action.name ? (
                                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3 mr-1" />
                                )}
                                {copiedField === action.name ? "Copied!" : "Copy"}
                              </Button>
                            </div>
                            <Input 
                              readOnly
                              value={(action as any).valueToCopy}
                              className="h-8 text-sm bg-white font-mono text-gray-600 focus-visible:ring-0" 
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 text-sm text-gray-500 italic">
                            <Info className="h-4 w-4 text-gray-400" />
                            No data to copy for this step.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
