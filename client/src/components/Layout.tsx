import { Link, useLocation } from "wouter";
import logo from "@assets/botbuilderslogo_1772058512069.png";
import { Button } from "@/components/ui/button";
import { PlusCircle, Library, Globe, FileQuestion } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-gray-100">
          <Link href="/">
            <img src={logo} alt="BotBuilders Logo" className="h-8 object-contain cursor-pointer" />
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/">
            <Button
              variant={location === "/" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
            >
              <Library className="h-4 w-4" />
              Template Library
            </Button>
          </Link>
          
          <div className="pt-6 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Create New
          </div>
          
          <Link href="/create">
            <Button
              variant={location === "/create" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Manual Setup
            </Button>
          </Link>
          
          <Link href="/generate/website">
            <Button
              variant={location === "/generate/website" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
            >
              <Globe className="h-4 w-4" />
              From Website
            </Button>
          </Link>
          
          <Link href="/generate/questionnaire">
            <Button
              variant={location === "/generate/questionnaire" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
            >
              <FileQuestion className="h-4 w-4" />
              Questionnaire
            </Button>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
