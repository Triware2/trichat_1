import React from 'react';
import { TrendingUp, Clock, Star } from 'lucide-react';

export const PerformanceMetrics = ({ presets }: { presets: any[] }) => {
  if (!presets || presets.length === 0) {
    return (
      <div className="p-6 bg-white/80 rounded-2xl border border-gray-200 text-center shadow-xl">
        <h2 className="text-xl font-bold mb-2">Performance Metrics</h2>
        <p className="text-gray-600">No presets available for metrics.</p>
      </div>
    );
  }

  const bestAccuracy = Math.max(...presets.map(p => p.performance?.accuracy || 0));
  const fastestResponse = Math.min(...presets.map(p => p.performance?.responseTime || 999));
  const highestSatisfaction = Math.max(...presets.map(p => p.performance?.userSatisfaction || 0));
  const accuracyArr = presets.map(p => p.performance?.accuracy || 0);
  const maxAcc = Math.max(...accuracyArr);
  const sparklinePoints = accuracyArr.map((acc, i) => `${i * 40},${80 - (acc / maxAcc) * 70}`).join(' ');

  return (
    <div className="p-10 bg-gradient-to-br from-white/80 via-blue-50/60 to-indigo-50/80 rounded-3xl border border-blue-100 shadow-2xl max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-1 text-slate-900">Performance Metrics</h2>
      <p className="text-base text-slate-500 mb-8">Key performance indicators and trends for your presets.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-green-50/80 rounded-2xl p-6 text-center shadow-md flex flex-col items-center">
          <TrendingUp className="w-7 h-7 text-green-500 mb-2" />
          <div className="text-2xl font-bold text-green-700">{bestAccuracy}%</div>
          <div className="text-xs text-slate-500 mt-1">Best Accuracy</div>
        </div>
        <div className="bg-blue-50/80 rounded-2xl p-6 text-center shadow-md flex flex-col items-center">
          <Clock className="w-7 h-7 text-blue-500 mb-2" />
          <div className="text-2xl font-bold text-blue-700">{fastestResponse}s</div>
          <div className="text-xs text-slate-500 mt-1">Fastest Response</div>
        </div>
        <div className="bg-purple-50/80 rounded-2xl p-6 text-center shadow-md flex flex-col items-center">
          <Star className="w-7 h-7 text-purple-500 mb-2" />
          <div className="text-2xl font-bold text-purple-700">{highestSatisfaction}/5</div>
          <div className="text-xs text-slate-500 mt-1">Highest Satisfaction</div>
        </div>
      </div>
      {/* Azure-inspired SVG Sparkline */}
      <div className="mt-8">
        <div className="text-base font-medium text-slate-700 mb-3">Accuracy Trend</div>
        <div className="bg-gradient-to-r from-green-100/60 to-blue-100/60 rounded-xl p-4 shadow-inner">
          <svg width={presets.length * 40} height="80" className="block mx-auto">
            <polyline
              fill="none"
              stroke="#22c55e"
              strokeWidth="3"
              points={sparklinePoints}
              style={{ filter: 'drop-shadow(0 2px 6px #22c55e33)' }}
            />
            {accuracyArr.map((acc, i) => (
              <circle
                key={i}
                cx={i * 40}
                cy={80 - (acc / maxAcc) * 70}
                r="5"
                fill="#22c55e"
                style={{ filter: 'drop-shadow(0 2px 6px #22c55e33)' }}
              />
            ))}
          </svg>
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            {presets.map((p, i) => (
              <span key={p.id} className="w-20 text-center truncate">{p.name.split(' ')[0]}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 