import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusBadge = ({ status, showIcon = true }) => {
  const statusConfig = {
    active: {
      variant: "active",
      label: "Active",
      icon: "CheckCircle"
    },
    suspended: {
      variant: "suspended",
      label: "Suspended",
      icon: "PauseCircle"
    },
    cancelled: {
      variant: "cancelled",
      label: "Cancelled",
      icon: "XCircle"
    },
    trial: {
      variant: "trial",
      label: "Trial",
      icon: "Clock"
    },
    paid: {
      variant: "success",
      label: "Paid",
      icon: "CheckCircle"
    },
    pending: {
      variant: "warning",
      label: "Pending",
      icon: "Clock"
    },
    overdue: {
      variant: "danger",
      label: "Overdue",
      icon: "AlertCircle"
    }
  };

  const config = statusConfig[status.toLowerCase()] || statusConfig.active;

  return (
    <Badge variant={config.variant} className="inline-flex items-center">
      {showIcon && <ApperIcon name={config.icon} className="w-3 h-3 mr-1" />}
      {config.label}
    </Badge>
  );
};

export default StatusBadge;