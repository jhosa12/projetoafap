import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface ChatProps {
  x: string;
  y: number;
  fill?: string;
}

interface SalesChartProps {
  data: ChatProps[];
  periodo: {
    start: string | undefined;
    end: string | undefined;
  };
}

export const SalesChart: React.FC<SalesChartProps> = ({ data, periodo }) => {
  const formatValue = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="x" 
            tick={{ fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            tickFormatter={formatValue}
          />
          <Tooltip 
            formatter={(value: number) => [formatValue(value), 'Vendas']}
            labelStyle={{ color: '#374151', fontSize: '12px' }}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '12px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar 
            dataKey="y" 
            fill="#3b82f6"
            radius={[2, 2, 0, 0]}
            className="hover:opacity-80 transition-opacity"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
