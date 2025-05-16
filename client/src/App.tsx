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
import Notification from "@/components/ui/notification";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

function Router() {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <Switch location={location} key={location}>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/devices" component={Devices} />
          <Route path="/routes" component={Routes} />
          <Route path="/automations" component={Automations} />
          <Route path="/logs" component={Logs} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </AnimatePresence>
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
      <TooltipProvider>
        <div className="app-container">
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
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
