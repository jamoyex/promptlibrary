import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Sparkles, Search, MoreVertical, Bot, Globe, FileQuestion, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

const TEMPLATES = [
  {
    id: 1,
    title: "Customer Support Agent",
    description: "Handles general inquiries, FAQs, and common customer issues with a polite and helpful tone.",
    actions: ["Contact Info", "Human Handover", "Appointment Booking"],
    type: "Proprietary",
  },
  {
    id: 2,
    title: "Real Estate Assistant",
    description: "Helps users find properties, schedules viewings, and captures lead information.",
    actions: ["Appointment Booking", "Auto Followup", "Contact Info"],
    type: "Proprietary",
  },
  {
    id: 3,
    title: "E-commerce Sales Bot",
    description: "Assists with product recommendations, order tracking, and cart recovery.",
    actions: ["Trigger a Workflow", "Stop Bot", "Contact Info"],
    type: "Proprietary",
  },
];

export default function Home() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Prompt Library</h1>
          <p className="text-gray-500 mt-1">Access our proprietary prompt experiences or generate your own.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Generate from Website
            </CardTitle>
            <CardDescription>Enter a URL and we'll automatically extract context to build a custom prompt.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/generate/website" className="w-full">
              <Button className="w-full gap-2">
                Start Generating <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileQuestion className="h-5 w-5 text-blue-600" />
              Generate via Questionnaire
            </CardTitle>
            <CardDescription>Answer a few questions about your bot's goal and we'll craft the perfect prompt.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/generate/questionnaire" className="w-full">
              <Button variant="secondary" className="w-full gap-2 bg-white hover:bg-gray-50 text-blue-700 border border-blue-200">
                Answer Questions <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Proprietary Templates</h2>
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
              <CardFooter className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">PRO</span>
                <Link href="/create">
                  <Button variant="outline" size="sm" className="gap-2">
                    Open Prompt <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
