import { motion } from "framer-motion";
import InvoiceList from "@/components/organisms/InvoiceList";

const Invoices = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Invoices
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage customer invoices and payments
          </p>
        </div>
      </div>

      <InvoiceList />
    </motion.div>
  );
};

export default Invoices;