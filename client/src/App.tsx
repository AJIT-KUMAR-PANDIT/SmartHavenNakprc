import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";
import AuthScreen from "@/components/auth-screen";
import AppShell from "@/components/app-shell";
import Dashboard from "@/pages/dashboard";
import Devices from "@/pages/devices";
import Routes from "@/pages/routes";
import Logs from "@/pages/logs";
import Settings from "@/pages/settings";
import Automations from "@/pages/automations";
import Scenes from "@/pages/scenes";
import Rooms from "@/pages/rooms";
import Analytics from "@/pages/analytics";
import ElectricityMonitor from "@/pages/electricity-monitor";
import NotificationsPage from "@/pages/notifications";
import CustomerCare from "@/pages/customer-care";
import MyPlan from "@/pages/my-plan";
import AboutPage from "@/pages/about";
import Notification from "@/components/ui/notification";
import { AnimatePresence } from "framer-motion";
import { useAuth, AuthProvider } from "@/hooks/use-auth.jsx";
import { ThemeProvider } from "@/hooks/use-theme.jsx";
import { DataModeProvider } from "@/contexts/data-mode-context";
import UniversalSearch from "@/components/universal-search";
import VoiceControl from "@/components/voice-control";
import AppGuide, { GuideButton } from "@/components/app-guide";

function Router() {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <AppShell onSearchOpen={() => setSearchOpen(true)}>
      <AnimatePresence mode="wait">
        <Switch location={location} key={location}>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/devices" component={Devices} />
          <Route path="/rooms" component={Rooms} />
          <Route path="/scenes" component={Scenes} />
          <Route path="/routes" component={Routes} />
          <Route path="/automations" component={Automations} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/electricity" component={ElectricityMonitor} />
          <Route path="/notifications" component={NotificationsPage} />
          <Route path="/customer-care" component={CustomerCare} />
          <Route path="/my-plan" component={MyPlan} />
          <Route path="/about" component={AboutPage} />
          <Route path="/logs" component={Logs} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </AnimatePresence>
      
      {/* Universal Search Modal */}
      <UniversalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      
      {/* Voice Control is now in bottom nav */}
      
      {/* Interactive Guide */}
      <AppGuide />
      <GuideButton />
    </AppShell>
  );
}

function App() {
  const [notification, setNotification] = useState({ visible: false, message: "", detail: "", type: "success" });

  // Function to show notifications - will be used by the notification context
  const showNotification = (message, detail, type = "success") => {
    setNotification({ visible: true, message, detail, type });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  // Create notification context
  const notificationContext = {
    showNotification,
    hideNotification: () => setNotification(prev => ({ ...prev, visible: false }))
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <DataModeProvider>
              <div className="app-container dark:bg-[#121218]">
                <Toaster />
                <Router />
                <Notification 
                  visible={notification.visible}
                  message={notification.message}
                  detail={notification.detail}
                  type={notification.type}
                  onClose={() => setNotification(prev => ({ ...prev, visible: false }))}
                />
              </div>
            </AuthProvider>
          </DataModeProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
