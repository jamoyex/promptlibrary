import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Menu, ChevronDown, Phone, Sparkles, Megaphone, 
  Bell, HelpCircle, Wand2, FolderOpen, Library 
} from "lucide-react";
import logo from "@assets/botbuilderslogo_1772058512069.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-[#f3f7fb] flex flex-col">
      {/* Top Navigation Bar Container */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        {/* Secondary Navigation Bar */}
        <div className="flex justify-between items-center h-14 px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-sm font-semibold text-gray-800 px-2 hover:bg-gray-100 h-8">
                  Chatbots <ChevronDown className="w-4 h-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <Link href="/my-prompts">
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <FolderOpen className="h-4 w-4 text-gray-500" /> Your Chatbots
                  </DropdownMenuItem>
                </Link>
                <Link href="/library">
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <Library className="h-4 w-4 text-gray-500" /> Template Library
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center">
            <Link href="/">
              <Button className="bg-[#4698d8] hover:bg-[#3980b8] text-white gap-2 rounded-full px-6 shadow-sm font-medium">
                <Wand2 className="w-4 h-4" /> Create
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
