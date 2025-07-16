import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { subscriptionService } from "@/services/api/subscriptionService";
import { customerService } from "@/services/api/customerService";
import { invoiceService } from "@/services/api/invoiceService";
import { format, subDays, isAfter } from "date-fns";

const DashboardStats = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [subscriptions, customers, invoices] = await Promise.all([
        subscriptionService.getAll(),
        customerService.getAll(),
        invoiceService.getAll()
      ]);

      const activeSubscriptions = subscriptions.filter(sub => sub.status === "active");
      const monthlyRevenue = activeSubscriptions.reduce((sum, sub) => {
        if (sub.billingCycle === "monthly") return sum + sub.amount;
        if (sub.billingCycle === "yearly") return sum + (sub.amount / 12);
        return sum;
      }, 0);

      const lastMonth = subDays(new Date(), 30);
      const newCustomers = customers.filter(customer => 
        isAfter(new Date(customer.createdAt), lastMonth)
      ).length;

      const pendingInvoices = invoices.filter(invoice => invoice.status === "pending").length;
      const overdueInvoices = invoices.filter(invoice => 
        invoice.status === "overdue" || 
        (invoice.status === "pending" && isAfter(new Date(), new Date(invoice.dueDate)))
      ).length;

      setStats({
        totalCustomers: customers.length,
        activeSubscriptions: activeSubscriptions.length,
        monthlyRevenue,
        newCustomers,
        pendingInvoices,
        overdueInvoices
      });
    } catch (err) {
      setError("Failed to load dashboard statistics. Please try again.");
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) return <Loading variant="cards" />;
  if (error) return <Error message={error} onRetry={loadStats} />;

  const metrics = [
    {
      title: "Total Customers",
      value: stats.totalCustomers || 0,
      change: stats.newCustomers ? `+${stats.newCustomers} this month` : null,
      changeType: "positive",
      icon: "Users"
    },
    {
      title: "Active Subscriptions",
      value: stats.activeSubscriptions || 0,
      change: "+5.2% from last month",
      changeType: "positive",
      icon: "CreditCard"
    },
    {
      title: "Monthly Revenue",
      value: `$${(stats.monthlyRevenue || 0).toLocaleString()}`,
      change: "+8.1% from last month",
      changeType: "positive",
      icon: "DollarSign"
    },
    {
      title: "Pending Invoices",
      value: stats.pendingInvoices || 0,
      change: stats.overdueInvoices ? `${stats.overdueInvoices} overdue` : null,
      changeType: stats.overdueInvoices > 0 ? "negative" : "positive",
      icon: "Receipt"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <MetricCard {...metric} />
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;