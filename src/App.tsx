import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import SmartInbox from "./pages/SmartInbox";
import HardwareCompanion from "./pages/HardwareCompanion";
import FieldToolkit from "./pages/FieldToolkit";
import CRMLead from "./pages/CRMLead";
import MyLeads from "./pages/MyLeads";
import LeadDetail from "./pages/LeadDetail";
import MyOpportunities from "./pages/MyOpportunities";
import OpportunityDetail from "./pages/OpportunityDetail";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import AIChat from "./pages/AIChat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/smart-inbox" element={<SmartInbox />} />
            <Route path="/hardware-companion" element={<HardwareCompanion />} />
            <Route path="/field-toolkit" element={<FieldToolkit />} />
            <Route path="/crm-lead" element={<CRMLead />} />
            <Route path="/my-leads" element={<MyLeads />} />
            <Route path="/lead-detail" element={<LeadDetail />} />
            <Route path="/my-opportunities" element={<MyOpportunities />} />
            <Route path="/opportunity-detail" element={<OpportunityDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/ai-chat" element={<AIChat />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
