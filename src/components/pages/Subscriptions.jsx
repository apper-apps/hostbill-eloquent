import { motion } from "framer-motion";
import SubscriptionTable from "@/components/organisms/SubscriptionTable";

const Subscriptions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Subscriptions
          </h1>
          <p className="text-gray-600 mt-1">
            Manage customer hosting subscriptions and billing cycles
          </p>
        </div>
      </div>

      <SubscriptionTable />
    </motion.div>
  );
};

export default Subscriptions;