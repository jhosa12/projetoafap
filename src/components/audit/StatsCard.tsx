import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Icon } from "@radix-ui/react-select";

interface StatsCardProps {
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    trend?: string;
    trendDirection?: 'up' | 'down';
    bgColor: string;
}
export default function StatsCard({ title, value, icon, trend, trendDirection, bgColor }: StatsCardProps) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 ${bgColor} rounded-full opacity-5`} />
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
            <div className="text-3xl font-bold text-slate-900 mt-2">{value}</div>
          </div>
          <div className={`p-3 rounded-xl ${bgColor} bg-opacity-10`}>
            <Icon className={`w-6 h-6 ${bgColor.replace('bg-', 'text-')}`} />
          </div>
        </div>
      </CardHeader>
      {trend && (
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 text-sm">
            {trendDirection === 'up' ? (
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`font-medium ${trendDirection === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
              {trend}
            </span>
            <span className="text-slate-500">nas últimas 24h</span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}