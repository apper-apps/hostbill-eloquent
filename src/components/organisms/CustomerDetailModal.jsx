import { motion } from "framer-motion";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";

const CustomerDetailModal = ({ customer, subscriptions, isOpen, onClose }) => {
  if (!isOpen || !customer) return null;

  const customerStats = subscriptions.filter(sub => sub.customerId === customer.Id);
  const activeSubscriptions = customerStats.filter(sub => sub.status === "active");
  const totalRevenue = customerStats.reduce((sum, sub) => sum + sub.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-elevation w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold font-display gradient-text">
            Customer Details
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info Header */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold font-display text-gray-900">
                {customer.name}
              </h3>
              <p className="text-gray-600">{customer.email}</p>
              {customer.company && (
                <p className="text-gray-500">{customer.company}</p>
              )}
            </div>
            <StatusBadge 
              status={activeSubscriptions.length > 0 ? "active" : "inactive"}
              showIcon={true}
            />
          </div>

          {/* Customer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">
                  {customerStats.length}
                </div>
                <div className="text-sm text-gray-600">
                  Total Subscriptions
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-success">
                  {activeSubscriptions.length}
                </div>
                <div className="text-sm text-gray-600">
                  Active Plans
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-900">
                  ${totalRevenue.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">
                  Monthly Revenue
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ApperIcon name="Info" className="w-5 h-5 mr-2" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <p className="text-gray-900">{customer.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <p className="text-gray-900">{customer.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <p className="text-gray-900">{customer.phone || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <p className="text-gray-900">{customer.company || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Customer Since
                  </label>
                  <p className="text-gray-900">
                    {format(new Date(customer.createdAt), "MMMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="mt-1">
                    <StatusBadge 
                      status={activeSubscriptions.length > 0 ? "active" : "inactive"}
                      showIcon={true}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          {customer.address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ApperIcon name="MapPin" className="w-5 h-5 mr-2" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-900">
                  <p>{customer.address.street}</p>
                  <p>{customer.address.city}, {customer.address.state} {customer.address.zipCode}</p>
                  <p>{customer.address.country}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Subscriptions */}
          {activeSubscriptions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
                  Active Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeSubscriptions.map((sub) => (
                    <div key={sub.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{sub.plan}</p>
                        <p className="text-sm text-gray-600">
                          Started: {format(new Date(sub.startDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${sub.amount}/month</p>
                        <StatusBadge status={sub.status} showIcon={false} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerDetailModal;