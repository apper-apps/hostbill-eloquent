import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  title = "No items found", 
  description = "Get started by adding your first item.", 
  actionLabel = "Add Item",
  onAction,
  icon = "Package",
  className 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex flex-col items-center justify-center py-16", className)}
    >
      <div className="bg-white rounded-lg shadow-premium border border-gray-200 p-8 max-w-md mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center"
        >
          <ApperIcon name={icon} className="w-10 h-10 text-gray-400" />
        </motion.div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2 font-display">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-8 text-sm leading-relaxed">
          {description}
        </p>
        
        {onAction && (
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAction}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-elevation transition-all duration-200 font-medium"
          >
            <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
            {actionLabel}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;