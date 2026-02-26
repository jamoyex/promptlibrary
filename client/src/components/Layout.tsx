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
        {/* Topmost Icon Bar */}
        <div className="flex justify-between items-center h-14 px-4 sm:px-6 border-b border-gray-100">
          <div className="flex items-center">
            <Link href="/">
              <img src={logo} alt="BotBuilders Logo" className="h-6 object-contain cursor-pointer" />
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#41a25a] text-white flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"><Phone className="w-4 h-4"/></div>
            <div className="w-8 h-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"><Sparkles className="w-4 h-4"/></div>
            <div className="w-8 h-8 rounded-full bg-[#3fa899] text-white flex items-center justify-center relative cursor-pointer hover:opacity-90 transition-opacity">
              <Megaphone className="w-4 h-4"/>
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-[1.5px] border-white"></div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#f97316] text-white flex items-center justify-center relative cursor-pointer hover:opacity-90 transition-opacity">
              <Bell className="w-4 h-4"/>
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-yellow-400 rounded-full border-[1.5px] border-white"></div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#3b82f6] text-white flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"><HelpCircle className="w-4 h-4"/></div>
            <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs font-medium cursor-pointer hover:opacity-90 transition-opacity ml-1">MR</div>
          </div>
        </div>

        {/* Secondary Navigation Bar */}
        <div className="flex justify-between items-center h-14 px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:bg-gray-100 -ml-2">
              <Menu className="h-5 w-5" />
            </Button>
            
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
