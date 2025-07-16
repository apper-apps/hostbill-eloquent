import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", to: "/", icon: "BarChart3" },
    { name: "Subscriptions", to: "/subscriptions", icon: "CreditCard" },
    { name: "Customers", to: "/customers", icon: "Users" },
    { name: "Invoices", to: "/invoices", icon: "Receipt" },
    { name: "Settings", to: "/settings", icon: "Settings" }
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
            <ApperIcon name="Server" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display">HostBill Pro</h1>
            <p className="text-xs text-gray-400">Billing Dashboard</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )
                }
                onClick={() => setIsOpen(false)}
              >
                <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3">
            <ApperIcon name="User" className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-400">System Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg"
        >
          <ApperIcon name={isOpen ? "X" : "Menu"} className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 h-screen fixed left-0 top-0 z-40">
        <SidebarContent />
      </div>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="fixed left-0 top-0 w-64 h-full"
          >
            <SidebarContent />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;