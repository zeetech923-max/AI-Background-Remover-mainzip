import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import RemoveBg from "@/pages/RemoveBg";
import Features from "@/pages/Features";
import HowItWorks from "@/pages/HowItWorks";
import Articles from "@/pages/Articles";
import ArticleDesignTips from "@/pages/ArticleDesignTips";
import ArticleEcommerceGuide from "@/pages/ArticleEcommerceGuide";
import ArticleAIvsManual from "@/pages/ArticleAIvsManual";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Security from "@/pages/Security";
import Terms from "@/pages/Terms";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/remove" component={RemoveBg} />
      <Route path="/features" component={Features} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/articles" component={Articles} />
      <Route path="/articles/design-tips" component={ArticleDesignTips} />
      <Route path="/articles/ecommerce-guide" component={ArticleEcommerceGuide} />
      <Route path="/articles/ai-vs-manual" component={ArticleAIvsManual} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/security" component={Security} />
      <Route path="/terms" component={Terms} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="bgremover-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
