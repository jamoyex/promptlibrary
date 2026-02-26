import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Globe, FileQuestion, ArrowRight } from "lucide-react";

export default function CreateHub() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Generate from Website
            </CardTitle>
            <CardDescription>Enter a URL and we'll automatically extract context to build a custom agent prompt.</CardDescription>
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
            <CardDescription>Answer a few questions about your agent's goal and we'll craft the perfect prompt.</CardDescription>
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
    </div>
  );
}
