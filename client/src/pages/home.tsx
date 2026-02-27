import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Bot, Mic } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f3f7fb] flex flex-col items-center justify-center p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link href="/chatbots" className="block">
          <Button
            variant="outline"
            className="w-full h-24 flex flex-col gap-2 bg-white hover:bg-gray-50 border-gray-200 hover:border-[#4698d8]/50"
          >
            <Bot className="h-8 w-8 text-[#4698d8]" />
            <span className="font-semibold">Chatbots</span>
            <span className="text-xs font-normal text-gray-500">Manage conversation AI agents</span>
          </Button>
        </Link>
        <Link href="/voiceai" className="block">
          <Button
            variant="outline"
            className="w-full h-24 flex flex-col gap-2 bg-white hover:bg-gray-50 border-gray-200 hover:border-[#4698d8]/50"
          >
            <Mic className="h-8 w-8 text-[#4698d8]" />
            <span className="font-semibold">Voice AI</span>
            <span className="text-xs font-normal text-gray-500">Voice AI dashboard</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
