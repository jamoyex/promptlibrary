import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Search, Bot, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

const TEMPLATES = [
  {
    id: "customer-support",
    title: "Customer Support Chatbot",
    description: "Handles general inquiries, FAQs, and common customer issues with a polite and helpful tone.",
    actions: ["Contact Info", "Human Handover", "Appointment Booking"],
    botName: "SupportChatbot"
  },
  {
    id: "real-estate",
    title: "Real Estate Assistant",
    description: "Helps users find properties, schedules viewings, and captures lead information.",
    actions: ["Appointment Booking", "Auto Followup", "Contact Info"],
    botName: "PropertyBot"
  },
  {
    id: "ecommerce",
    title: "E-commerce Sales Bot",
    description: "Assists with product recommendations, order tracking, and cart recovery.",
    actions: ["Trigger a Workflow", "Stop Bot", "Contact Info"],
    botName: "SalesBot"
  },
];

export default function Library() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-4">
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
        <Search className="h-5 w-5 text-gray-400" />
        <Input 
          placeholder="Search templates by name, action, or description..." 
          className="border-0 shadow-none focus-visible:ring-0 px-0"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-all duration-200 border-gray-200 group hover:border-primary/30">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                  <Bot className="h-5 w-5" />
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
                  Open Chatbot <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
