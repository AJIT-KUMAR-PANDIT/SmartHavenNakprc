import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { Bell, Search, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import BottomNav from '@/components/bottom-nav';
import HamburgerMenu from '@/components/hamburger-menu';

const AppShell = ({ children, onSearchOpen }) => {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const { currentUser, logout } = useAuth();
  const [showSidebar, setShowSidebar] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Navigation items for desktop sidebar
  const navItems = [
    { path: '/dashboard', icon: 'ri-dashboard-line', label: 'Dashboard' },
    { path: '/devices', icon: 'ri-device-line', label: 'Devices' },
    { path: '/rooms', icon: 'ri-home-line', label: 'Rooms' },
    { path: '/scenes', icon: 'ri-film-line', label: 'Scenes' },
    { path: '/routes', icon: 'ri-route-line', label: 'Routes' },
    { path: '/automations', icon: 'ri-flow-chart', label: 'Automations' },
    { path: '/analytics', icon: 'ri-bar-chart-line', label: 'Analytics' },
    { path: '/electricity', icon: 'ri-flashlight-line', label: 'Electricity' },
    { path: '/notifications', icon: 'ri-notification-3-line', label: 'Notifications' },
    { path: '/my-plan', icon: 'ri-vip-crown-line', label: 'My Plan' },
    { path: '/customer-care', icon: 'ri-customer-service-2-line', label: 'Support' },
    { path: '/about', icon: 'ri-information-line', label: 'About' },
    { path: '/logs', icon: 'ri-file-list-3-line', label: 'Logs' },
    { path: '/settings', icon: 'ri-settings-3-line', label: 'Settings' }
  ];
  
  // Handle sidebar toggle based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };
    
    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="flex h-screen bg-[#121218] text-white">
      {/* Desktop Sidebar */}
      <aside className={`fixed lg:relative lg:flex flex-col h-full w-64 bg-[#1e1e2e] border-r border-gray-800 transition-all z-30 ${
        showSidebar ? 'left-0' : '-left-64 lg:left-0'
      } hidden lg:block`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center">
              <i className="ri-home-smile-line text-3xl text-blue-500 mr-2"></i>
              <h1 className="text-xl font-bold">SmartHaven</h1>
            </a>
          </Link>
          <button 
            className="hidden lg:block p-1 hover:bg-gray-800 rounded-md"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <ChevronDown className="h-5 w-5 text-gray-400 transform rotate-90" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map(item => {
              const isActive = location === item.path || 
                              (item.path === '/dashboard' && location === '/');
              
              return (
                <li key={item.path}>
                  <Link href={item.path}>
                    <a className={`flex items-center px-3 py-2 rounded-md ${
                      isActive ? 'bg-[#2563eb]/10 text-[#2563eb]' : 'text-gray-400 hover:bg-gray-800'
                    }`}>
                      <i className={`${item.icon} text-xl mr-3`}></i>
                      <span>{item.label}</span>
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* User Area */}
        <div className="p-4 border-t border-gray-800">
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-gray-800 text-gray-400"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center mr-2">
                {currentUser?.username?.substring(0, 1)?.toUpperCase() || 'U'}
              </div>
              <span className="text-white">{currentUser?.username || 'User'}</span>
              <ChevronDown className="h-4 w-4 ml-auto" />
            </button>
            
            <AnimatePresence>
              {showUserMenu && (
                <motion.div 
                  className="absolute bottom-full left-0 mb-2 w-full bg-[#1e1e2e] rounded-md border border-gray-800 shadow-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <div className="p-2">
                    <Link href="/settings">
                      <a className="flex items-center px-3 py-2 text-sm text-gray-400 rounded-md hover:bg-gray-800">
                        <i className="ri-user-settings-line mr-2"></i>
                        Profile Settings
                      </a>
                    </Link>
                    <button 
                      onClick={() => logout()}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-400 rounded-md hover:bg-gray-800"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-[#1e1e2e] border-b border-gray-800 py-3 px-4 flex items-center justify-between lg:justify-end">
          {/* Mobile: Menu Toggle and Logo */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setShowMobileMenu(true)}
              className="p-2 mr-2 text-gray-400 hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/">
              <a className="flex items-center">
                <i className="ri-home-smile-line text-2xl text-blue-500 mr-2"></i>
                <h1 className="text-lg font-bold">SmartHaven</h1>
              </a>
            </Link>
          </div>
          
          {/* Search and Notifications (Desktop) */}
          <div className="hidden lg:flex items-center space-x-2">
            <button
              onClick={onSearchOpen}
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800"
            >
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800">
              <Bell className="h-5 w-5" />
            </button>
          </div>
          
          {/* Mobile: Search and Notifications */}
          <div className="flex items-center space-x-3 lg:hidden">
            <button
              onClick={onSearchOpen}
              className="p-2 text-gray-400 hover:text-white"
            >
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              className="flex-1 bg-[#121218] overflow-auto px-4 py-6 lg:px-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      {/* Mobile Menu */}
      <HamburgerMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
      
      {/* Bottom Navigation */}
      <BottomNav 
        onSearchOpen={onSearchOpen} 
        onMenuOpen={() => setShowMobileMenu(true)} 
      />
      
      {/* Add bottom padding to account for fixed navbar on mobile */}
      <div className="lg:hidden h-20"></div>
    </div>
  );
};

export default AppShell;