import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricsSparklineProps {
  title: string;
  value: number;
  unit?: string;
  data: number[];
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MetricsSparkline: React.FC<MetricsSparklineProps> = ({
  title,
  value,
  unit = '',
  data,
  change,
  changeType = 'neutral',
  color = '#2563eb',
  size = 'md'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipData, setTooltipData] = useState<{ x: number; y: number; value: number } | null>(null);

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = range > 0 ? 100 - ((point - minValue) / range) * 80 : 50;
    return `${x},${y}`;
  }).join(' ');

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const sizeClasses = {
    sm: 'h-16',
    md: 'h-20',
    lg: 'h-24'
  };

  return (
    <Card 
      className="bg-white/80 backdrop-blur-sm border border-gray-200 hover:shadow-md transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTooltipData(null);
      }}
    >
      <CardContent className={`p-4 ${sizeClasses[size]}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {getChangeIcon()}
              <span className={`text-xs font-medium ${getChangeColor()}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
            </div>
          )}
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">
              {value.toLocaleString()}
            </span>
            {unit && (
              <span className="text-sm text-gray-500">{unit}</span>
            )}
          </div>

          <div className="relative flex-1 ml-4">
            <svg
              width="100%"
              height="40"
              viewBox="0 0 100 100"
              className="overflow-visible"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(37, 99, 235, 0.1))' }}
            >
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Sparkline */}
              <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                points={points}
                style={{ 
                  filter: isHovered ? 'drop-shadow(0 2px 6px rgba(37, 99, 235, 0.3))' : undefined 
                }}
              />

              {/* Data points */}
              {data.map((point, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = range > 0 ? 100 - ((point - minValue) / range) * 80 : 50;
                
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r={isHovered ? "3" : "2"}
                    fill={color}
                    style={{ 
                      transition: 'r 0.2s ease',
                      filter: isHovered ? 'drop-shadow(0 2px 4px rgba(37, 99, 235, 0.3))' : undefined 
                    }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltipData({
                        x: rect.left + rect.width / 2,
                        y: rect.top - 10,
                        value: point
                      });
                    }}
                    onMouseLeave={() => setTooltipData(null)}
                  />
                );
              })}
            </svg>

            {/* Tooltip */}
            {tooltipData && (
              <div
                className="absolute z-10 px-2 py-1 text-xs bg-gray-900 text-white rounded shadow-lg pointer-events-none"
                style={{
                  left: `${tooltipData.x}px`,
                  top: `${tooltipData.y}px`,
                  transform: 'translateX(-50%) translateY(-100%)'
                }}
              >
                {tooltipData.value.toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 