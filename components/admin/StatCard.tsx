import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  // Optional: Allow different colors for different stats (defaulting to brand orange)
  color?: 'orange' | 'blue' | 'green' | 'purple'; 
}

export default function StatCard({ 
    title, 
    value, 
    icon: Icon, 
    trend,
    color = 'orange' 
}: StatCardProps) {
    
  // Color mapping for dynamic styling if needed
  const colorStyles = {
    orange: { bg: 'bg-orange-50', text: 'text-[#F68B1E]', ring: 'ring-orange-100' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-100' },
    green: { bg: 'bg-green-50', text: 'text-green-600', ring: 'ring-green-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-100' },
  };

  const currentStyle = colorStyles[color];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          {/* Title */}
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            {title}
          </p>
          
          {/* Main Value */}
          <h3 className="text-2xl font-bold text-gray-900">
            {value}
          </h3>
        </div>

        {/* Icon Circle */}
        <div className={`p-3 rounded-full ${currentStyle.bg} ${currentStyle.text} ring-1 ${currentStyle.ring}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Trend Footer */}
      {trend && (
        <div className="mt-4 flex items-center">
          <span 
            className={`
              inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
              ${trend.isPositive 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
              }
            `}
          >
            {trend.isPositive ? (
                <ArrowUpRight className="w-3 h-3 mr-1" />
            ) : (
                <ArrowDownRight className="w-3 h-3 mr-1" />
            )}
            {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-gray-400 ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
}