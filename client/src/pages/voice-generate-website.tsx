import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Globe, Loader2, Sparkles, CheckCircle2, FileSearch } from "lucide-react";
import { Link, useLocation } from "wouter";

const GENERATING_STEPS = [
  { label: "Scanning your website…", icon: Globe },
  { label: "Analyzing content & tone…", icon: FileSearch },
  { label: "Building your voice agent…", icon: Sparkles },
];

function GeneratingModal() {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIndex((i) => (i + 1) % GENERATING_STEPS.length);
    }, 2200);
    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((p) => (p >= 95 ? p : p + Math.random() * 8 + 2));
    }, 500);
    return () => clearInterval(progressInterval);
  }, []);

  const step = GENERATING_STEPS[stepIndex];
  const StepIcon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-xl animate-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#4698d8]/10">
            <Loader2 className="absolute h-8 w-8 animate-spin text-[#4698d8]/40" />
            <StepIcon className="h-7 w-7 text-[#4698d8] relative z-10 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900">Generating your voice agent</h3>
            <p
              key={stepIndex}
              className="text-sm text-gray-600 min-h-[20px] animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              {step.label}
            </p>
          </div>
          <div className="w-full space-y-2">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#4698d8] transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-center gap-1.5">
              {GENERATING_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    i === stepIndex ? "bg-[#4698d8] scale-125" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VoiceGenerateWebsite() {
  const [, setLocation] = useLocation();
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleGenerate = async () => {
    if (!url.trim()) return;
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-voice-from-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: url.trim() }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "Failed to generate voice agent from website");
      }
      setIsSuccess(true);
    } catch (err) {
      console.error("Voice generate from website:", err);
      alert(typeof err === "object" && err && "message" in err ? (err as Error).message : "Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto mt-12">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/voiceai">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <Card className="shadow-md border-green-200 mt-8 bg-green-50/30">
          <CardHeader className="text-center pb-8 pt-10">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-green-800">Voice Agent Successfully Created!</CardTitle>
            <CardDescription className="text-base mt-4 max-w-md mx-auto">
              Your voice agent has been generated and is ready to use based on the content from your website.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pb-12 pt-4">
            <Button
              size="lg"
              className="w-full max-w-xs gap-2 px-8 h-12 text-base bg-[#4698d8] hover:bg-[#3980b8] text-white rounded-full shadow-sm font-medium"
              onClick={() => setLocation("/voiceai")}
            >
              Go to Your Voice Bots
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <>
      {isGenerating && <GeneratingModal />}
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto mt-12">
        <div className="flex items-center gap-4">
          <Link href="/voiceai">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Generate Voice Agent from Website</h1>
            <p className="text-gray-500 text-sm">Enter a URL and we'll build a voice agent from your site.</p>
          </div>
        </div>

        <Card className="shadow-md border-gray-200 mt-8">
          <CardHeader className="text-center pb-8 pt-10">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Enter your Website URL</CardTitle>
            <CardDescription className="text-base mt-2">
              We'll analyze your website's content, tone, and goals to generate a voice agent personality and instructions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 max-w-md mx-auto">
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 text-lg text-center"
            />
          </CardContent>
          <CardFooter className="flex justify-center pb-10">
            <Button
              size="lg"
              className="gap-2 px-8 h-12 text-base"
              onClick={handleGenerate}
              disabled={!url.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Scanning Website...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate Voice Agent
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
