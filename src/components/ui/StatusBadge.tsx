import React from "react";

interface StatusBadgeProps {
  status: "Pending" | "Confirmed" | "Cancelled" | string;
}

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Confirmed: "bg-green-100 text-green-700 border-green-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const style = statusStyles[status] || "bg-neutral-100 text-neutral-600 border-neutral-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style}`}
    >
      {status}
    </span>
  );
};
