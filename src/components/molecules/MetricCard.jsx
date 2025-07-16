import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = "positive", 
  icon,
  className 
}) => {
  const changeColor = changeType === "positive" ? "text-green-600" : "text-red-600";
  const changeIcon = changeType === "positive" ? "TrendingUp" : "TrendingDown";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn("", className)}
    >
      <Card className="shadow-premium hover:shadow-elevation transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-2xl font-bold text-gray-900 font-display">{value}</p>
              {change && (
                <div className={cn("flex items-center mt-2 text-sm", changeColor)}>
                  <ApperIcon name={changeIcon} className="w-4 h-4 mr-1" />
                  {change}
                </div>
              )}
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name={icon} className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MetricCard;