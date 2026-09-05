import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import JobSeekerOptions from "./pages/JobSeekerOptions";
import JobSeekerChat from "./pages/JobSeekerChat";
import PublicProfile from "./pages/PublicProfile";
import Login from "./pages/Login";
import CandidateDashboard from "./pages/CandidateDashboard";
import AgencyDashboard from "./pages/AgencyDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/job-seeker" element={<JobSeekerOptions />} />
              <Route path="/job-seeker/chat" element={<JobSeekerChat />} />
              <Route path="/profile/:id" element={<PublicProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/candidate/dashboard" element={<ProtectedRoute allowedRoles={["candidate"]}><CandidateDashboard /></ProtectedRoute>} />
              <Route path="/agency/dashboard" element={<ProtectedRoute allowedRoles={["agency"]}><AgencyDashboard /></ProtectedRoute>} />
              <Route path="/employer/dashboard" element={<ProtectedRoute allowedRoles={["employer"]}><EmployerDashboard /></ProtectedRoute>} />
              <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;