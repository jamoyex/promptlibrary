import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Search, Mic, ArrowRight, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { VOICE_TEMPLATES } from "@/data/voice-templates";

export default function VoiceLibrary() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Template Library</h1>
        <p className="text-gray-500 text-sm mt-1">Voice AI templates to get started.</p>
      </div>
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
        <Search className="h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search templates by name or description..."
          className="border-0 shadow-none focus-visible:ring-0 px-0"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {VOICE_TEMPLATES.map((template) => (
          <Card
            key={template.id}
            className="hover:shadow-md transition-all duration-200 border-gray-200 group hover:border-primary/30"
          >
            <CardHeader className="pb-4">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-600 w-fit">
                <Mic className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl mt-4">{template.title}</CardTitle>
              <CardDescription className="line-clamp-2">{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {template.actions.map((action) => (
                  <Badge
                    key={action}
                    variant="secondary"
                    className="bg-gray-100 text-gray-600 font-medium text-xs"
                  >
                    {action}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t border-gray-100 flex justify-end gap-2">
              <Button variant="outline" size="sm" className="gap-2" disabled>
                <Download className="h-3 w-3" />
                Install Bot
              </Button>
              <Link href={`/voiceai/template/${template.id}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  View Template <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
