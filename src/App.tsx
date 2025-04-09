
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SwimProvider } from "@/contexts/SwimContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { TrainingProvider } from "@/contexts/TrainingContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import LogSession from "./pages/LogSession";
import LogTraining from "./pages/LogTraining";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Swimmers from "./pages/Swimmers";
import SwimmerDetail from "./pages/SwimmerDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <ProfileProvider>
              <SwimProvider>
                <TrainingProvider>
                  <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/" element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    } />
                    <Route path="/log" element={
                      <ProtectedRoute>
                        <LogSession />
                      </ProtectedRoute>
                    } />
                    <Route path="/log-training" element={
                      <ProtectedRoute>
                        <LogTraining />
                      </ProtectedRoute>
                    } />
                    <Route path="/history" element={
                      <ProtectedRoute>
                        <History />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/swimmers" element={
                      <ProtectedRoute>
                        <Swimmers />
                      </ProtectedRoute>
                    } />
                    <Route path="/swimmers/:swimmerId" element={
                      <ProtectedRoute>
                        <SwimmerDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </TrainingProvider>
              </SwimProvider>
            </ProfileProvider>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
