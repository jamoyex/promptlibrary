import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import NotFound from "@/pages/not-found";
import CreateHub from "@/pages/create-hub";
import MyPrompts from "@/pages/my-prompts";
import Library from "@/pages/library";
import BotRecipe from "@/pages/bot-recipe";
import GenerateWebsite from "@/pages/generate-website";
import GenerateQuestionnaire from "@/pages/generate-questionnaire";

function Router() {
  return (
    <Switch>
      <Route path="/" component={CreateHub} />
      <Route path="/my-prompts" component={MyPrompts} />
      <Route path="/library" component={Library} />
      <Route path="/bot/:id" component={BotRecipe} />
      <Route path="/generate/website" component={GenerateWebsite} />
      <Route path="/generate/questionnaire" component={GenerateQuestionnaire} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Layout>
          <Router />
        </Layout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
