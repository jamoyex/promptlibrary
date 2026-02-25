import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Loader2, Sparkles, FileQuestion, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";

const QUESTIONS = [
  {
    id: "q1",
    label: "What is the primary purpose of this bot?",
    placeholder: "e.g., To book meetings, provide tech support, qualify leads...",
    type: "textarea"
  },
  {
    id: "q2",
    label: "How should the bot sound? (Tone & Voice)",
    placeholder: "e.g., Professional, witty, casual, highly technical...",
    type: "input"
  },
  {
    id: "q3",
    label: "What is the ONE thing the bot must NEVER do?",
    placeholder: "e.g., Never promise a refund, never give legal advice...",
    type: "input"
  }
];

export default function GenerateQuestionnaire() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setIsGenerating(true);
      // Simulate generation delay
      setTimeout(() => {
        setIsGenerating(false);
        setLocation("/create");
      }, 2000);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const currentQuestion = QUESTIONS[step];
  const canProceed = answers[currentQuestion.id] && answers[currentQuestion.id].trim().length > 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto mt-12">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Generate from Questionnaire</h1>
          <p className="text-gray-500 text-sm">Answer a few questions to build your perfect prompt</p>
        </div>
      </div>

      <Card className="shadow-md border-gray-200 mt-8">
        <CardHeader className="text-center pb-6 pt-10">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <FileQuestion className="h-8 w-8 text-primary" />
          </div>
          <div className="flex justify-center gap-2 mb-6">
            {QUESTIONS.map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? 'w-8 bg-primary' : i < step ? 'w-4 bg-primary/50' : 'w-4 bg-gray-200'
                }`}
              />
            ))}
          </div>
          <CardTitle className="text-xl">{currentQuestion.label}</CardTitle>
          <CardDescription>Step {step + 1} of {QUESTIONS.length}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 max-w-md mx-auto">
          <div className="space-y-4">
            {currentQuestion.type === "textarea" ? (
              <Textarea
                placeholder={currentQuestion.placeholder}
                className="min-h-[120px] text-base"
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => setAnswers({...answers, [currentQuestion.id]: e.target.value})}
                autoFocus
              />
            ) : (
              <Input
                placeholder={currentQuestion.placeholder}
                className="h-12 text-base"
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => setAnswers({...answers, [currentQuestion.id]: e.target.value})}
                autoFocus
              />
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pb-10 px-10">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            disabled={step === 0 || isGenerating}
            className="text-gray-500"
          >
            Back
          </Button>
          <Button 
            size="lg" 
            className="gap-2 px-8" 
            onClick={handleNext}
            disabled={!canProceed || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : step === QUESTIONS.length - 1 ? (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Template
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
