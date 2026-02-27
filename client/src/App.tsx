import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { VoiceAILayout } from "@/components/VoiceAILayout";
import VoiceMyBots from "@/pages/voice-my-bots";
import VoiceLibrary from "@/pages/voice-library";
import VoiceTemplateDetail from "@/pages/voice-template-detail";
import VoiceGenerateWebsite from "@/pages/voice-generate-website";
import VoiceGenerateQuestionnaire from "@/pages/voice-generate-questionnaire";
import VoiceBotRecipe from "@/pages/voice-bot-recipe";
import MyPrompts from "@/pages/my-prompts";
import Library from "@/pages/library";
import TemplateDetail from "@/pages/template-detail";
import BotRecipe from "@/pages/bot-recipe";
import GenerateWebsite from "@/pages/generate-website";
import GenerateQuestionnaire from "@/pages/generate-questionnaire";

function withChatbotsLayout(Component: React.ComponentType) {
  return function ChatbotsPage() {
    return (
      <Layout>
        <Component />
      </Layout>
    );
  };
}

function withVoiceAILayout(Component: React.ComponentType) {
  return function VoiceAIPage() {
    return (
      <VoiceAILayout>
        <Component />
      </VoiceAILayout>
    );
  };
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/voiceai/generate/questionnaire" component={withVoiceAILayout(VoiceGenerateQuestionnaire)} />
      <Route path="/voiceai/generate/website" component={withVoiceAILayout(VoiceGenerateWebsite)} />
      <Route path="/voiceai/bot/:id" component={withVoiceAILayout(VoiceBotRecipe)} />
      <Route path="/voiceai/template/:id" component={withVoiceAILayout(VoiceTemplateDetail)} />
      <Route path="/voiceai/library" component={withVoiceAILayout(VoiceLibrary)} />
      <Route path="/voiceai" component={withVoiceAILayout(VoiceMyBots)} />
      <Route path="/chatbots/generate/questionnaire" component={withChatbotsLayout(GenerateQuestionnaire)} />
      <Route path="/chatbots/generate/website" component={withChatbotsLayout(GenerateWebsite)} />
      <Route path="/chatbots/template/:id" component={withChatbotsLayout(TemplateDetail)} />
      <Route path="/chatbots/bot/:id" component={withChatbotsLayout(BotRecipe)} />
      <Route path="/chatbots/library" component={withChatbotsLayout(Library)} />
      <Route path="/chatbots/my-prompts" component={withChatbotsLayout(MyPrompts)} />
      <Route path="/chatbots" component={withChatbotsLayout(MyPrompts)} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
