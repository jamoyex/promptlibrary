import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Globe, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function GenerateWebsite() {
  const [, setLocation] = useLocation();
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleGenerate = async () => {
    if (!url) return;
    setIsGenerating(true);
    
    try {
      const response = await fetch("/api/generate-from-website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ website: url }),
      });

      if (!response.ok) {
        throw new Error("Failed to send webhook");
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Error calling webhook:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto mt-12">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/">
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
            <CardTitle className="text-3xl text-green-800">AI Agent Successfully Created!</CardTitle>
            <CardDescription className="text-base mt-4 max-w-md mx-auto">
              Your chatbot has been generated and is ready to use based on the content from your website.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pb-12 pt-4">
            <a href="https://app.automator.ai/v2/location/RfI0y4Ut54X08LB9xyww/ai-agents/conversation-ai" className="w-full max-w-xs block">
              <Button 
                size="lg" 
                className="w-full gap-2 px-8 h-12 text-base bg-[#4698d8] hover:bg-[#3980b8] text-white rounded-full shadow-sm font-medium" 
              >
                View Agent
              </Button>
            </a>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto mt-12">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Generate from Website</h1>
          <p className="text-gray-500 text-sm">Let our AI scan your site and build a prompt automatically</p>
        </div>
      </div>

      <Card className="shadow-md border-gray-200 mt-8">
        <CardHeader className="text-center pb-8 pt-10">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Globe className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Enter your Website URL</CardTitle>
          <CardDescription className="text-base mt-2">
            We'll analyze your website's content, tone, and goals to generate a comprehensive chatbot personality and instructions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 max-w-md mx-auto">
          <div className="space-y-2">
            <Input 
              placeholder="https://example.com" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 text-lg text-center"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pb-10">
          <Button 
            size="lg" 
            className="gap-2 px-8 h-12 text-base" 
            onClick={handleGenerate}
            disabled={!url || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Scanning Website...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Template
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
