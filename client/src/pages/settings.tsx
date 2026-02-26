import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle2, Link as LinkIcon, Loader2, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const handleConnect = () => {
    if (!apiKey) return;
    setIsConnecting(true);
    
    // Simulate API connection
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      toast({
        title: "GoHighLevel Connected",
        description: "Your account has been successfully linked.",
      });
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setApiKey("");
    toast({
      title: "Disconnected",
      description: "Your GoHighLevel account has been unlinked.",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account integrations and preferences.</p>
      </div>

      <div className="max-w-2xl">
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-gray-400" />
              GoHighLevel Integration
            </CardTitle>
            <CardDescription>
              Connect your GHL account to automatically create custom fields directly from your agent prompts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isConnected ? (
              <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900">Connected to GoHighLevel</h4>
                    <p className="text-sm text-green-700 mt-0.5">Active Workspace: Demo Agency</p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleDisconnect} className="bg-white border-green-200 text-green-700 hover:bg-green-50">
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key" className="text-sm font-semibold">GHL API Key</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <Key className="h-4 w-4" />
                    </div>
                    <Input 
                      id="api-key" 
                      type="password" 
                      placeholder="Enter your API key or Location ID..." 
                      className="pl-9 h-11"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">You can find this in your GoHighLevel Business Settings.</p>
                </div>
              </div>
            )}
          </CardContent>
          {!isConnected && (
            <CardFooter className="bg-gray-50 border-t border-gray-100 rounded-b-xl pt-4 pb-4 flex justify-end">
              <Button 
                onClick={handleConnect} 
                disabled={!apiKey || isConnecting}
                className="gap-2"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect Account"
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
