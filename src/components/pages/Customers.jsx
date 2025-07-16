import { motion } from "framer-motion";
import CustomerGrid from "@/components/organisms/CustomerGrid";

const Customers = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Customers
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage your hosting customers
          </p>
        </div>
      </div>

      <CustomerGrid />
    </motion.div>
  );
};

export default Customers;