import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Gigs from "./pages/Gigs";
import Requests from "./pages/Requests";
import GigDetail from "./pages/GigDetail";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import ClientDashboard from "./pages/dashboard/ClientDashboard";
import OrderDetail from "./pages/OrderDetail";
import MyProjects from "./pages/MyProjects";
import Profile from "./pages/Profile";
import Marketplace from "./pages/Marketplace";
import { isSupabaseConfigured } from "./integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!isSupabaseConfigured && (
          <div className="fixed top-0 left-0 right-0 z-[100] p-4 bg-destructive/10 backdrop-blur-sm">
            <div className="container max-w-4xl mx-auto">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Configuration Error</AlertTitle>
                <AlertDescription>
                  Supabase is not configured properly. Please add your <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> to the <code>.env</code> file.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/gigs" element={<Gigs />} />
          <Route path="/gigs/:id" element={<GigDetail />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/requests/:id" element={<JobDetail />} />
          <Route path="/marketplace" element={<Marketplace />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/student" element={<StudentDashboard />} />
            <Route path="/dashboard/client" element={<ClientDashboard />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/projects" element={<MyProjects />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
