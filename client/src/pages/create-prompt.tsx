import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Sparkles, AlertCircle } from "lucide-react";
import { Link } from "wouter";

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
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  const toggleAction = (action: string) => {
    setSelectedActions(prev => 
      prev.includes(action) 
        ? prev.filter(a => a !== action)
        : [...prev, action]
    );
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create Template</h1>
          <p className="text-gray-500 text-sm">Manually define your bot's behavior and actions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle>Core Prompt</CardTitle>
              <CardDescription>Define the personality, goal, and additional instructions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="template-name" className="text-sm font-semibold">Template Name</Label>
                <Input id="template-name" placeholder="e.g., Friendly Customer Support" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="personality" className="text-sm font-semibold">Personality</Label>
                  <Button variant="ghost" size="sm" className="h-6 text-xs text-primary gap-1 px-2">
                    <Sparkles className="h-3 w-3" /> Optimize
                  </Button>
                </div>
                <Textarea 
                  id="personality" 
                  placeholder="Describe how the bot should act and respond. E.g., 'You are a helpful, enthusiastic, and polite assistant...'" 
                  className="min-h-[100px] resize-y"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="goal" className="text-sm font-semibold">Goal</Label>
                  <Button variant="ghost" size="sm" className="h-6 text-xs text-primary gap-1 px-2">
                    <Sparkles className="h-3 w-3" /> Optimize
                  </Button>
                </div>
                <Textarea 
                  id="goal" 
                  placeholder="What is the main objective of this bot? E.g., 'Your primary goal is to help users troubleshoot login issues and capture their email if unresolved.'" 
                  className="min-h-[100px] resize-y"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional-info" className="text-sm font-semibold">Additional Info</Label>
                <Textarea 
                  id="additional-info" 
                  placeholder="Any other rules, boundaries, or context the bot needs to know." 
                  className="min-h-[100px] resize-y"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border-gray-200 sticky top-6">
            <CardHeader className="bg-gray-50 border-b border-gray-100 rounded-t-xl">
              <CardTitle className="text-lg">Setup your Actions</CardTitle>
              <CardDescription>
                Select which actions this prompt can trigger during a conversation.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm mb-6 flex gap-2 items-start">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <p>A good prompt will allow the bot to better interpret and respond appropriately. <a href="#" className="underline font-medium ml-1 hover:text-blue-800">Prompt Guidelines</a></p>
              </div>

              <div className="flex flex-wrap gap-3">
                {ACTIONS.map((action) => {
                  const isSelected = selectedActions.includes(action);
                  return (
                    <button
                      key={action}
                      onClick={() => toggleAction(action)}
                      className={`
                        px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 flex items-center justify-center
                        ${isSelected 
                          ? 'border-primary bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]' 
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
                  <h4 className="text-sm font-semibold mb-3 text-gray-900">Action Settings</h4>
                  <div className="space-y-4">
                    {selectedActions.includes("Contact Info") && (
                      <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-100 animate-in fade-in">
                        <Label className="text-xs">Save Contact Info to Field</Label>
                        <Input placeholder="e.g., user_email" className="h-8 text-sm bg-white" />
                      </div>
                    )}
                    {selectedActions.includes("Appointment Booking") && (
                      <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-100 animate-in fade-in">
                        <Label className="text-xs">Calendar Link URL</Label>
                        <Input placeholder="https://calendly.com/..." className="h-8 text-sm bg-white" />
                      </div>
                    )}
                    {selectedActions.includes("Trigger a Workflow") && (
                      <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-100 animate-in fade-in">
                        <Label className="text-xs">Select Workflow</Label>
                        <select className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                          <option>Lead Capture Flow</option>
                          <option>Support Ticket Flow</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-gray-50 border-t border-gray-100 rounded-b-xl pt-4 pb-4">
              <Button className="w-full gap-2">
                <Save className="h-4 w-4" />
                Save Template
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
