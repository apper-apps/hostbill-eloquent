import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { subscriptionService } from "@/services/api/subscriptionService";
import { customerService } from "@/services/api/customerService";
import { hostingPlanService } from "@/services/api/hostingPlanService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const SubscriptionTable = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [subscriptionsData, customersData, plansData] = await Promise.all([
        subscriptionService.getAll(),
        customerService.getAll(),
        hostingPlanService.getAll()
      ]);
      
      setSubscriptions(subscriptionsData);
      setCustomers(customersData);
      setPlans(plansData);
    } catch (err) {
      setError("Failed to load subscription data. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const handleStatusChange = async (subscriptionId, newStatus) => {
    try {
      await subscriptionService.update(subscriptionId, { status: newStatus });
      setSubscriptions(prev => prev.map(sub => 
        sub.Id === subscriptionId ? { ...sub, status: newStatus } : sub
      ));
      toast.success(`Subscription ${newStatus} successfully`);
    } catch (err) {
      toast.error("Failed to update subscription status");
    }
  };

  const handlePaymentRetry = async (subscriptionId) => {
    try {
      const updatedSubscription = await subscriptionService.retryPayment(subscriptionId);
      setSubscriptions(prev => prev.map(sub => 
        sub.Id === subscriptionId ? updatedSubscription : sub
      ));
      toast.success("Payment retry successful");
    } catch (err) {
      toast.error(`Payment retry failed: ${err.message}`);
    }
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const customer = customers.find(c => c.Id === subscription.customerId);
    const plan = plans.find(p => p.Id === subscription.planId);
    
    const matchesSearch = customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || subscription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loading variant="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <Card className="shadow-premium">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle className="text-xl font-display gradient-text">
            Subscriptions
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <SearchBar
              placeholder="Search subscriptions..."
              onSearch={setSearchTerm}
              className="w-full sm:w-64"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="cancelled">Cancelled</option>
              <option value="trial">Trial</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {filteredSubscriptions.length === 0 ? (
          <Empty
            title="No subscriptions found"
            description="No subscriptions match your current search criteria."
            icon="CreditCard"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Renewal Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubscriptions.map((subscription, index) => {
                  const customer = customers.find(c => c.Id === subscription.customerId);
                  const plan = plans.find(p => p.Id === subscription.planId);
                  
                  return (
                    <motion.tr
                      key={subscription.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mr-3">
                            <ApperIcon name="User" className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {customer?.name || "Unknown Customer"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {customer?.email || "No email"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {plan?.name || "Unknown Plan"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {subscription.billingCycle}
                        </div>
                      </td>
<td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <StatusBadge status={subscription.status} />
                          {subscription.paymentStatus === 'failed' && (
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="AlertCircle" className="w-4 h-4 text-red-500" />
                              <span className="text-xs text-red-600 font-medium">Payment Failed</span>
                            </div>
                          )}
                          {subscription.paymentStatus === 'pending' && (
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Clock" className="w-4 h-4 text-yellow-500" />
                              <span className="text-xs text-yellow-600 font-medium">Payment Pending</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${subscription.amount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          per {subscription.billingCycle}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(subscription.renewalDate), "MMM dd, yyyy")}
                      </td>
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {/* Payment method indicator */}
                          <div className="flex items-center space-x-1">
                            <ApperIcon 
                              name={subscription.paymentMethod === 'stripe' ? 'CreditCard' : 'Building2'} 
                              className="w-4 h-4 text-gray-500" 
                            />
                            <span className="text-xs text-gray-500 capitalize">
                              {subscription.paymentMethod === 'stripe' ? 'Card' : 'Bank'}
                            </span>
                          </div>
                          
                          {/* Payment retry button for failed payments */}
                          {subscription.paymentStatus === 'failed' && (
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() => handlePaymentRetry(subscription.Id)}
                              title="Retry payment"
                            >
                              <ApperIcon name="RefreshCw" className="w-4 h-4 mr-1" />
                              Retry
                            </Button>
                          )}
                          
                          {/* Status management buttons */}
                          {subscription.status === "active" && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleStatusChange(subscription.Id, "suspended")}
                            >
                              <ApperIcon name="Pause" className="w-4 h-4 mr-1" />
                              Suspend
                            </Button>
                          )}
                          {subscription.status === "suspended" && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleStatusChange(subscription.Id, "active")}
                            >
                              <ApperIcon name="Play" className="w-4 h-4 mr-1" />
                              Activate
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionTable;