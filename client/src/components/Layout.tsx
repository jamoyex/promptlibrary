import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { PlusCircle, Library, FolderOpen } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center sm:justify-start items-center h-16">
            <nav className="flex space-x-2 sm:space-x-4">
              <Link href="/">
                <Button
                  variant={location === "/" ? "secondary" : "ghost"}
                  className="gap-2 text-sm"
                >
                  <PlusCircle className="h-4 w-4 hidden sm:block" />
                  Create Chatbot
                </Button>
              </Link>
              
              <Link href="/my-prompts">
                <Button
                  variant={location === "/my-prompts" ? "secondary" : "ghost"}
                  className="gap-2 text-sm"
                >
                  <FolderOpen className="h-4 w-4 hidden sm:block" />
                  Your Chatbots
                </Button>
              </Link>
              
              <Link href="/library">
                <Button
                  variant={location === "/library" ? "secondary" : "ghost"}
                  className="gap-2 text-sm"
                >
                  <Library className="h-4 w-4 hidden sm:block" />
                  Library
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
