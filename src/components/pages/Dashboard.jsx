import { motion } from "framer-motion";
import DashboardStats from "@/components/organisms/DashboardStats";
import RecentActivity from "@/components/organisms/RecentActivity";

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome to your hosting billing dashboard
          </p>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivity />
<div className="bg-white rounded-lg shadow-premium p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">
            Payment Processing
          </h3>
          <div className="h-64 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="space-y-2">
                <p className="text-gray-900 font-medium">Stripe & GoCardless Integration</p>
                <p className="text-gray-600 text-sm">
                  Automated payment processing with dual gateway support
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Card Payments
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                    Direct Debit
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;