import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
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

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  progress,
  className
}) => {
  return (
    <Card className={cn("hover:shadow-lg transition-all duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="text-blue-600">
                {icon}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
          {trend && (
            <div className={cn(
              "flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium",
              trend.isPositive 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            )}>
              <span>{trend.isPositive ? "↗" : "↘"}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        
        {progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Progresso</span>
              <span className="font-medium">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={cn(
                  "h-2 rounded-full transition-all duration-700",
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
