import { Badge } from "@/components/ui/badge";
import { statusLabels, statusColors, type TripStatus } from "@/lib/types/dashboard";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: TripStatus;
  className?: string;
  pulse?: boolean;
}

export function StatusBadge({ status, className, pulse }: StatusBadgeProps) {
  return (
    <Badge
      className={cn(
        "border font-medium",
        statusColors[status],
        pulse && status === "in-progress" && "animate-pulse",
        className
      )}
    >
      {status === "in-progress" && (
        <span className="mr-1 size-1.5 rounded-full bg-amber-400" aria-hidden />
      )}
      {statusLabels[status]}
    </Badge>
  );
}
