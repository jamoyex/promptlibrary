import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Bot, ArrowRight, Clock } from "lucide-react";

const MY_PROMPTS = [
  {
    id: "demo-site-bot",
    title: "Demo Site Bot",
    description: "Generated from example.com. Focuses on lead capture and general FAQs.",
    actions: ["Contact Info"],
    date: "2 hours ago",
    botName: "DemoBot"
  },
  {
    id: "support-helper",
    title: "Support Helper",
    description: "Built via questionnaire. Friendly IT support assistant.",
    actions: ["Appointment Booking", "Contact Info"],
    date: "Yesterday",
    botName: "TechHelper"
  }
];

export default function MyPrompts() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Agents</h1>
          <p className="text-gray-500 mt-1">Manage and access your generated conversation AI agents.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MY_PROMPTS.map((template) => (
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
                {template.actions.map(action => (
                  <Badge key={action} variant="secondary" className="bg-gray-100 text-gray-600 font-medium text-xs">
                    {action}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t border-gray-100 flex justify-end">
              <Link href={`/bot/${template.id}?name=${encodeURIComponent(template.botName)}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  Open Agent <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
        {MY_PROMPTS.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
            No agents generated yet. Go to "Create an Agent" to get started!
          </div>
        )}
      </div>
    </div>
  );
}
