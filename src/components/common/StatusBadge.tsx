import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "success" | "warning" | "error" | "info";
  progress?: number;
  className?: string;
  children?: React.ReactNode;
}

const StatusBadge = ({
  status,
  progress,
  className,
  children,
}: StatusBadgeProps) => {
  const statusVariants = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const progressColors = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  if (progress !== undefined) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300",
              progressColors[status]
            )}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground">{progress}%</span>
      </div>
    );
  }

  return (
    <Badge variant="outline" className={cn(statusVariants[status], className)}>
      {children}
    </Badge>
  );
};

export { StatusBadge };
