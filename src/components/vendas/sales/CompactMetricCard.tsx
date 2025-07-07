import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CompactMetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  progress?: number;
  className?: string;
}

export const CompactMetricCard: React.FC<CompactMetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  progress,
  className
}) => {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded bg-blue-50">
              <div className="text-blue-600 text-sm">
                {icon}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{title}</p>
              <p className="text-sm font-bold">{value}</p>
            </div>
          </div>
          {trend && (
            <div className={cn(
              "flex items-center text-xs px-1.5 py-0.5 rounded-full",
              trend.isPositive 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            )}>
              <span>{trend.isPositive ? "↗" : "↘"}</span>
              <span className="ml-1">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        
        {progress !== undefined && (
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Meta</span>
              <span className="font-medium">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  progress >= 100 ? "bg-green-500" :
                  progress >= 75 ? "bg-blue-500" :
                  progress >= 50 ? "bg-yellow-500" : "bg-red-500"
                )}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
