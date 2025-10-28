import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PrayerTimeThemeProvider } from "@/components/PrayerTimeThemeProvider";
import Home from "@/pages/Home";
import WordPage from "@/pages/WordPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/word/:word" component={WordPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PrayerTimeThemeProvider>
          <Toaster />
          <Router />
        </PrayerTimeThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
