import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { Link } from "wouter";

export default function VoiceGenerateQuestionnaire() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto mt-12">
      <div className="flex items-center gap-4">
        <Link href="/voiceai">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create Voice Agent via Questionnaire</h1>
          <p className="text-gray-500 text-sm">Coming soon — answer a few questions to build your voice agent.</p>
        </div>
      </div>

      <Card className="shadow-md border-gray-200 mt-8">
        <CardHeader className="text-center pb-8 pt-10">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <FileQuestion className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Answer a few questions</CardTitle>
          <CardDescription className="text-base mt-2">
            Voice agent creation via questionnaire will be available here.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center pb-10">
          <Button size="lg" className="gap-2 px-8 h-12 text-base" disabled>
            Coming soon
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
