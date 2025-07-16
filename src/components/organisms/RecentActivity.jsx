import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { subscriptionService } from "@/services/api/subscriptionService";
import { customerService } from "@/services/api/customerService";
import { invoiceService } from "@/services/api/invoiceService";
import { format, isAfter, subDays } from "date-fns";

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [subscriptions, customers, invoices] = await Promise.all([
        subscriptionService.getAll(),
        customerService.getAll(),
        invoiceService.getAll()
      ]);

      const recentActivities = [];
      const recentDate = subDays(new Date(), 7);

      // Recent subscriptions
      subscriptions.forEach(sub => {
        if (isAfter(new Date(sub.startDate), recentDate)) {
          const customer = customers.find(c => c.Id === sub.customerId);
          recentActivities.push({
            id: `sub-${sub.Id}`,
            type: "subscription",
            title: "New Subscription",
            description: `${customer?.name || "Unknown"} subscribed to ${sub.billingCycle} plan`,
            timestamp: sub.startDate,
            icon: "CreditCard",
            status: sub.status
          });
        }
      });

      // Recent invoices
      invoices.forEach(invoice => {
        if (isAfter(new Date(invoice.dueDate), recentDate)) {
          const customer = customers.find(c => c.Id === invoice.customerId);
          recentActivities.push({
            id: `inv-${invoice.Id}`,
            type: "invoice",
            title: "Invoice Generated",
            description: `Invoice #${invoice.Id} for ${customer?.name || "Unknown"} - $${invoice.amount.toFixed(2)}`,
            timestamp: invoice.dueDate,
            icon: "Receipt",
            status: invoice.status
          });
        }
      });

      // Recent customers
      customers.forEach(customer => {
        if (isAfter(new Date(customer.createdAt), recentDate)) {
          recentActivities.push({
            id: `cust-${customer.Id}`,
            type: "customer",
            title: "New Customer",
            description: `${customer.name} joined from ${customer.company || "Individual"}`,
            timestamp: customer.createdAt,
            icon: "UserPlus",
            status: "active"
          });
        }
      });

      // Sort by timestamp (newest first)
      recentActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setActivities(recentActivities.slice(0, 10));
    } catch (err) {
      setError("Failed to load recent activity. Please try again.");
      console.error("Error loading activities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadActivities} />;

  return (
    <Card className="shadow-premium">
      <CardHeader>
        <CardTitle className="text-xl font-display gradient-text">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <Empty
            title="No recent activity"
            description="Recent customer and subscription activities will appear here."
            icon="Activity"
          />
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                  <ApperIcon name={activity.icon} className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <StatusBadge status={activity.status} showIcon={false} />
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(activity.timestamp), "MMM dd, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;