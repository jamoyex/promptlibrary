import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { PlusCircle, Search, MoreVertical, Bot, Globe, FileQuestion } from "lucide-react";
import { Input } from "@/components/ui/input";

const TEMPLATES = [
  {
    id: 1,
    title: "Customer Support Agent",
    description: "Handles general inquiries, FAQs, and common customer issues with a polite and helpful tone.",
    actions: ["Contact Info", "Human Handover", "Appointment Booking"],
    type: "Manual",
  },
  {
    id: 2,
    title: "Real Estate Assistant",
    description: "Helps users find properties, schedules viewings, and captures lead information.",
    actions: ["Appointment Booking", "Auto Followup", "Contact Info"],
    type: "Website",
  },
  {
    id: 3,
    title: "E-commerce Sales Bot",
    description: "Assists with product recommendations, order tracking, and cart recovery.",
    actions: ["Trigger a Workflow", "Stop Bot", "Contact Info"],
    type: "Questionnaire",
  },
];

export default function Home() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Prompt Templates</h1>
          <p className="text-gray-500 mt-1">Manage your bot personalities and actions</p>
        </div>
        <div className="flex gap-2">
          <Link href="/create">
            <Button className="gap-2 shadow-sm">
              <PlusCircle className="h-4 w-4" />
              New Template
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <Search className="h-5 w-5 text-gray-400" />
        <Input 
          placeholder="Search templates by name, action, or description..." 
          className="border-0 shadow-none focus-visible:ring-0 px-0"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow duration-200 border-gray-200 group">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {template.type === 'Manual' && <Bot className="h-5 w-5" />}
                  {template.type === 'Website' && <Globe className="h-5 w-5" />}
                  {template.type === 'Questionnaire' && <FileQuestion className="h-5 w-5" />}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 group-hover:text-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-xl mt-4">{template.title}</CardTitle>
              <CardDescription className="line-clamp-2">{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {template.actions.map(action => (
                  <Badge key={action} variant="secondary" className="bg-gray-100 text-gray-600 font-medium">
                    {action}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
              <span>Generated via {template.type}</span>
              <Button variant="link" className="text-primary h-auto p-0">Edit</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
