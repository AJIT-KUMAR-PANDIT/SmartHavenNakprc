import React from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BookOpen,
  CreditCard,
  HelpCircle,
  Home,
  Info,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Settings,
  Smartphone,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth.jsx";
import { Badge } from "@/components/ui/badge";

const HamburgerMenu = ({ isOpen, onClose }) => {
  const [location] = useLocation();
  const { currentUser, logout } = useAuth();

  // Menu items
  const menuItems = [
    {
      title: "Quick Access",
      items: [
        {
          label: "Dashboard",
          path: "/dashboard",
          icon: <LayoutDashboard className="h-5 w-5" />,
          notification: 0,
        },
        {
          label: "Devices",
          path: "/devices",
          icon: <Smartphone className="h-5 w-5" />,
          notification: 2,
        },
        {
          label: "Rooms",
          path: "/rooms",
          icon: <Home className="h-5 w-5" />,
          notification: 0,
        },
        {
          label: "Scenes",
          path: "/scenes",
          icon: <i className="ri-film-line h-5 w-5" />,
          notification: 0,
        },
        {
          label: "Routes",
          path: "/routes",
          icon: <i className="ri-route-line h-5 w-5" />,
          notification: 0,
        },
        {
          label: "Automations",
          path: "/automations",
          icon: <i className="ri-flow-chart h-5 w-5" />,
          notification: 0,
        },
      ],
    },
    {
      title: "Monitoring",
      items: [
        {
          label: "Analytics",
          path: "/analytics",
          icon: <i className="ri-bar-chart-line h-5 w-5" />,
          notification: 0,
        },
        {
          label: "Electricity",
          path: "/electricity",
          icon: <i className="ri-flashlight-line h-5 w-5" />,
          notification: 0,
        },
        {
          label: "Logs",
          path: "/logs",
          icon: <i className="ri-file-list-3-line h-5 w-5" />,
          notification: 0,
        },
      ],
    },
    {
      title: "My Account",
      items: [
        {
          label: "My Plan",
          path: "/my-plan",
          icon: <Package className="h-5 w-5" />,
          notification: 0,
        },
        {
          label: "Notifications",
          path: "/notifications",
          icon: <Bell className="h-5 w-5" />,
          notification: 3,
        },
        {
          label: "Settings",
          path: "/settings",
          icon: <Settings className="h-5 w-5" />,
          notification: 0,
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          label: "Customer Care",
          path: "/customer-care",
          icon: <MessageSquare className="h-5 w-5" />,
          notification: 0,
        },
        {
          label: "About SmartHaven",
          path: "/about",
          icon: <Info className="h-5 w-5" />,
          notification: 0,
        },
      ],
    },
  ];

  // Animation variants
  const variants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const overlayVariants = {
    open: { opacity: 0.5 },
    closed: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black z-40"
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            className="fixed top-0 left-0 h-full w-[280px] bg-[#121218] shadow-xl z-50 flex flex-col"
            initial="closed"
            animate="open"
            exit="closed"
            variants={variants}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <Home className="h-6 w-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-bold">SmartHaven</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* User Profile */}
            {currentUser && (
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3">
                    {currentUser.username?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-medium">
                      {currentUser.username || "User"}
                    </p>
                    <p className="text-xs text-gray-400">Premium Member</p>
                  </div>
                </div>
              </div>
            )}

            {/* Menu sections */}
            <div className="flex-1 overflow-y-auto py-2">
              {menuItems.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-6">
                  <h3 className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <ul>
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <Link href={item.path}>
                          <a
                            className={`flex items-center justify-between py-2 px-4 ${
                              location === item.path
                                ? "bg-blue-900/20 text-blue-500"
                                : "hover:bg-gray-800"
                            }`}
                            onClick={onClose}
                          >
                            <div className="flex items-center">
                              {item.icon}
                              <span className="ml-3">{item.label}</span>
                            </div>
                            {item.notification > 0 && (
                              <Badge
                                variant="destructive"
                                className="bg-red-500 text-white"
                              >
                                {item.notification}
                              </Badge>
                            )}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-800 p-4">
              <div className="grid grid-cols-2 gap-2">
                <Link href="/settings">
                  <a
                    className="flex items-center justify-center p-2 rounded-md hover:bg-gray-800"
                    onClick={onClose}
                  >
                    <Settings className="h-5 w-5 mr-2" />
                    <span>Settings</span>
                  </a>
                </Link>

                <button
                  className="flex items-center justify-center p-2 rounded-md hover:bg-gray-800"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Logout</span>
                </button>
              </div>

              <div className="mt-4 text-center text-xs text-gray-500">
                <p>SmartHaven v2.0.5</p>
                <p className="mt-1">© 2025 SmartHaven Inc.</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HamburgerMenu;
