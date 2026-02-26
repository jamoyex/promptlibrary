import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ToggleRight, Download } from "lucide-react";
import { Link, useRoute } from "wouter";
import { getTemplateById } from "@/data/templates";

export default function TemplateDetail() {
  const [, params] = useRoute("/template/:id");
  const templateId = params?.id ?? null;
  const template = templateId ? getTemplateById(templateId) : null;

  if (!templateId || !template) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        <div className="flex items-center gap-4">
          <Link href="/library">
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
        <Link href="/library">
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
        <div className="space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle>Core Prompt Configuration</CardTitle>
              <CardDescription>Example prompt settings for this template.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Personality</Label>
                <Textarea
                  value={template.personality ?? ""}
                  readOnly
                  className="min-h-[120px] resize-y text-base bg-gray-50/50 border-gray-200 focus-visible:ring-0 cursor-default"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-base font-semibold">Goal</Label>
                <Textarea
                  value={template.goal ?? ""}
                  readOnly
                  className="min-h-[120px] resize-y text-base bg-gray-50/50 border-gray-200 focus-visible:ring-0 cursor-default"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-base font-semibold">Additional Info / Instructions</Label>
                <Textarea
                  value={template.additionalInfo ?? ""}
                  readOnly
                  className="min-h-[120px] resize-y text-base bg-gray-50/50 border-gray-200 focus-visible:ring-0 cursor-default"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gray-50 border-b border-gray-100 rounded-t-xl">
              <CardTitle className="text-lg">Actions included in this template</CardTitle>
              <CardDescription>Example actions for this chatbot template.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {template.actions.map((action, index) => (
                  <div key={action} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <ToggleRight className="h-4 w-4" />
                    </div>
                    <div className="flex-1 flex items-center">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-medium">
                        {action}
                      </Badge>
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
