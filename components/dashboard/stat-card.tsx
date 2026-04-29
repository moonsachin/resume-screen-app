import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: number;
    label: string;
  };
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-indigo-600",
  iconBg = "bg-indigo-50",
}: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 cursor-default">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {description && (
              <p className="text-xs text-gray-400">{description}</p>
            )}
          </div>
          <div className={cn("rounded-lg p-3", iconBg)}>
            <Icon className={cn("h-6 w-6", iconColor)} aria-hidden="true" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
