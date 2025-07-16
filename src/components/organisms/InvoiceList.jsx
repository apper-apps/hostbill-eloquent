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
import { invoiceService } from "@/services/api/invoiceService";
import { customerService } from "@/services/api/customerService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [invoicesData, customersData] = await Promise.all([
        invoiceService.getAll(),
        customerService.getAll()
      ]);
      
      setInvoices(invoicesData);
      setCustomers(customersData);
    } catch (err) {
      setError("Failed to load invoice data. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (invoiceId, newStatus) => {
    try {
      await invoiceService.update(invoiceId, { status: newStatus });
      setInvoices(prev => prev.map(invoice => 
        invoice.Id === invoiceId ? { ...invoice, status: newStatus } : invoice
      ));
      toast.success(`Invoice marked as ${newStatus} successfully`);
    } catch (err) {
      toast.error("Failed to update invoice status");
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const customer = customers.find(c => c.Id === invoice.customerId);
    
    const matchesSearch = customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.Id.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loading variant="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <Card className="shadow-premium">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle className="text-xl font-display gradient-text">
            Invoices
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <SearchBar
              placeholder="Search invoices..."
              onSearch={setSearchTerm}
              className="w-full sm:w-64"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {filteredInvoices.length === 0 ? (
          <Empty
            title="No invoices found"
            description="No invoices match your current search criteria."
            icon="Receipt"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice ID
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice, index) => {
                  const customer = customers.find(c => c.Id === invoice.customerId);
                  
                  return (
                    <motion.tr
                      key={invoice.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-accent/10 to-info/10 rounded-full flex items-center justify-center mr-3">
                            <ApperIcon name="Receipt" className="w-5 h-5 text-accent" />
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            #{invoice.Id.toString().padStart(4, "0")}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {customer?.name || "Unknown Customer"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {customer?.email || "No email"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${invoice.amount.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={invoice.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {invoice.status === "pending" && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleStatusChange(invoice.Id, "paid")}
                            >
                              <ApperIcon name="CheckCircle" className="w-4 h-4 mr-1" />
                              Mark Paid
                            </Button>
                          )}
                          <Button
                            variant="secondary"
                            size="sm"
                          >
                            <ApperIcon name="Download" className="w-4 h-4 mr-1" />
                            Download
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

export default InvoiceList;