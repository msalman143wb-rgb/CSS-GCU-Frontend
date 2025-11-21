// client/src/App.tsx
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";  // Changed from @/
import { TooltipProvider } from "./components/ui/tooltip";  // Changed from @/
import { ThemeProvider } from "./contexts/ThemeContext";  // Changed from @/
import Navigation from "./components/Navigation";  // Changed from @/
import Footer from "./components/Footer";  // Changed from @/
import ScrollToTop from "./components/ScrollToTop";  // Changed from @/
import Home from "./pages/Home";  // Changed from @/
import Admin from "./pages/Admin";  // Changed from @/
import NotFound from "./pages/not-found";  // Changed from @/

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
            <ScrollToTop />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;