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
import { customerService } from "@/services/api/customerService";
import { subscriptionService } from "@/services/api/subscriptionService";
import { format } from "date-fns";

const CustomerGrid = () => {
  const [customers, setCustomers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [customersData, subscriptionsData] = await Promise.all([
        customerService.getAll(),
        subscriptionService.getAll()
      ]);
      
      setCustomers(customersData);
      setSubscriptions(subscriptionsData);
    } catch (err) {
      setError("Failed to load customer data. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getCustomerStats = (customerId) => {
    const customerSubs = subscriptions.filter(sub => sub.customerId === customerId);
    const activeSubs = customerSubs.filter(sub => sub.status === "active");
    const totalRevenue = customerSubs.reduce((sum, sub) => sum + sub.amount, 0);
    
    return {
      totalSubscriptions: customerSubs.length,
      activeSubscriptions: activeSubs.length,
      totalRevenue,
      status: activeSubs.length > 0 ? "active" : "inactive"
    };
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading variant="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold font-display gradient-text">
          Customers
        </h2>
        <SearchBar
          placeholder="Search customers..."
          onSearch={setSearchTerm}
          className="w-full sm:w-64"
        />
      </div>

      {filteredCustomers.length === 0 ? (
        <Empty
          title="No customers found"
          description="No customers match your current search criteria."
          icon="Users"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer, index) => {
            const stats = getCustomerStats(customer.Id);
            
            return (
              <motion.div
                key={customer.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="shadow-premium hover:shadow-elevation transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" className="w-6 h-6 text-primary" />
                      </div>
                      <StatusBadge 
                        status={stats.status} 
                        showIcon={false}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 font-display">
                        {customer.name}
                      </h3>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                      {customer.company && (
                        <p className="text-sm text-gray-500">{customer.company}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">
                          {stats.activeSubscriptions}
                        </div>
                        <div className="text-xs text-gray-500">
                          Active Plans
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">
                          ${stats.totalRevenue.toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Monthly Revenue
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 text-center">
                      Customer since {format(new Date(customer.createdAt), "MMM yyyy")}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="primary" size="sm" className="flex-1">
                        <ApperIcon name="Eye" className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="secondary" size="sm" className="flex-1">
                        <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerGrid;