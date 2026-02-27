import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download } from "lucide-react";
import { Link, useRoute } from "wouter";
import { getVoiceTemplateById } from "@/data/voice-templates";

export default function VoiceTemplateDetail() {
  const [, params] = useRoute("/voiceai/template/:id");
  const templateId = params?.id ?? null;
  const template = templateId ? getVoiceTemplateById(templateId) : null;

  if (!templateId || !template) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        <div className="flex items-center gap-4">
          <Link href="/voiceai/library">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <Card className="shadow-sm border-gray-200">
          <CardContent className="pt-6">
            <p className="text-gray-500">Template not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-4 flex-wrap">
        <Link href="/voiceai/library">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{template.title}</h1>
          <p className="text-gray-500 text-sm">Template preview — static content.</p>
        </div>
        <Button disabled className="gap-2 shrink-0">
          <Download className="h-4 w-4" />
          Install Bot
        </Button>
      </div>

      <div className="max-w-4xl space-y-8">
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle>About this template</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-gray-700 mb-2">Actions</p>
            <div className="flex flex-wrap gap-2">
              {template.actions.map((action) => (
                <Badge key={action} variant="secondary" className="bg-gray-100 text-gray-700">
                  {action}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
