import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mic } from "lucide-react";

export default function VoiceAIDashboard() {
  return (
    <div className="min-h-screen bg-[#f3f7fb] flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex justify-between items-center h-14 px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-[#4698d8]" />
              <span className="text-sm font-semibold text-gray-800">Voice AI</span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-4 sm:p-8">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Voice AI Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Manage your Voice AI agents and settings.</p>
            </div>
            <Card className="shadow-sm border-gray-200 border-dashed">
              <CardHeader>
                <CardTitle className="text-lg">Coming soon</CardTitle>
                <CardDescription>
                  Voice AI dashboard content will appear here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  This area is reserved for Voice AI–specific features and configuration.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
