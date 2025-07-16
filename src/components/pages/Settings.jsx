import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const Settings = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Configure your billing system and hosting plans
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-premium">
          <CardHeader>
            <CardTitle className="text-xl font-display gradient-text">
              Billing Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField label="Company Name" required>
              <Input placeholder="Your Hosting Company" />
            </FormField>
            
            <FormField label="Default Currency">
              <Select>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </Select>
            </FormField>
            
            <FormField label="Payment Terms">
              <Select>
                <option value="net30">Net 30 days</option>
                <option value="net15">Net 15 days</option>
                <option value="immediate">Due immediately</option>
              </Select>
            </FormField>
            
            <FormField label="Late Fee Percentage">
              <Input type="number" placeholder="5.0" step="0.1" />
            </FormField>
            
            <Button variant="primary" className="w-full">
              <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              Save Billing Settings
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-premium">
          <CardHeader>
            <CardTitle className="text-xl font-display gradient-text">
              Hosting Plans
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Basic Plan</h4>
                    <p className="text-sm text-gray-600">1GB Storage, 10GB Bandwidth</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">$9.99/month</p>
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Pro Plan</h4>
                    <p className="text-sm text-gray-600">5GB Storage, 50GB Bandwidth</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">$19.99/month</p>
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Enterprise Plan</h4>
                    <p className="text-sm text-gray-600">Unlimited Storage & Bandwidth</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">$49.99/month</p>
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <Button variant="secondary" className="w-full">
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Add New Plan
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-premium">
        <CardHeader>
          <CardTitle className="text-xl font-display gradient-text">
            Email Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Invoice Templates</h4>
              <div className="space-y-2">
                <Button variant="secondary" className="w-full justify-start">
                  <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
                  Invoice Generated
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <ApperIcon name="AlertCircle" className="w-4 h-4 mr-2" />
                  Payment Reminder
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <ApperIcon name="CheckCircle" className="w-4 h-4 mr-2" />
                  Payment Received
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Subscription Templates</h4>
              <div className="space-y-2">
                <Button variant="secondary" className="w-full justify-start">
                  <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
                  Welcome Email
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
                  Renewal Notice
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <ApperIcon name="XCircle" className="w-4 h-4 mr-2" />
                  Cancellation
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Settings;