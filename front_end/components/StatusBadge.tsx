import type { ToolStatus } from "../data/dashboardData";

const STATUS_CLASS: Record<ToolStatus, string> = {
  Active: "bg-gradient-to-r from-emerald-400 to-teal-500 text-white",
  Expiring: "bg-gradient-to-r from-amber-400 to-orange-500 text-white",
  Unused: "bg-gradient-to-r from-rose-500 to-pink-600 text-white",
};

interface StatusBadgeProps {
  status: ToolStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-normal ${STATUS_CLASS[status]}`}>
      {status}
    </span>
  );
}
