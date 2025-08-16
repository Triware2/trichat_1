import React from 'react';
import { TrendingUp, Star, Users, BarChart3 } from 'lucide-react';

export const PresetAnalytics = ({ presets }: { presets: any[] }) => {
  if (!presets || presets.length === 0) {
    return (
      <div className="p-6 bg-white/80 rounded-2xl border border-slate-100 text-center shadow-xl">
        <h2 className="text-xl font-bold mb-2">Preset Analytics</h2>
        <p className="text-gray-600">No presets available for analytics.</p>
      </div>
    );
  }

  const total = presets.length;
  const avgAccuracy = (presets.reduce((sum, p) => sum + (p.performance?.accuracy || 0), 0) / total).toFixed(1);
  const avgSatisfaction = (presets.reduce((sum, p) => sum + (p.performance?.userSatisfaction || 0), 0) / total).toFixed(2);
  const mostUsed = presets.reduce((a, b) => (a.usageCount > b.usageCount ? a : b));
  const usageCounts = presets.map(p => p.usageCount);
  const maxUsage = Math.max(...usageCounts);
  const sparklinePoints = usageCounts.map((count, i) => `${i * 40},${80 - (count / maxUsage) * 70}`).join(' ');

  return (
    <div className="p-10 bg-gradient-to-br from-white/80 via-blue-50/60 to-indigo-50/80 rounded-3xl border border-blue-100 shadow-2xl max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-1 text-slate-900">Preset Analytics</h2>
      <p className="text-base text-slate-500 mb-8">Key analytics and visualizations for your training presets.</p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-blue-50/80 rounded-2xl p-6 text-center shadow-md flex flex-col items-center">
          <Users className="w-7 h-7 text-blue-500 mb-2" />
          <div className="text-2xl font-bold text-blue-700">{total}</div>
          <div className="text-xs text-slate-500 mt-1">Total Presets</div>
        </div>
        <div className="bg-green-50/80 rounded-2xl p-6 text-center shadow-md flex flex-col items-center">
          <TrendingUp className="w-7 h-7 text-green-500 mb-2" />
          <div className="text-2xl font-bold text-green-700">{avgAccuracy}%</div>
          <div className="text-xs text-slate-500 mt-1">Avg. Accuracy</div>
        </div>
        <div className="bg-purple-50/80 rounded-2xl p-6 text-center shadow-md flex flex-col items-center">
          <Star className="w-7 h-7 text-purple-500 mb-2" />
          <div className="text-2xl font-bold text-purple-700">{avgSatisfaction}/5</div>
          <div className="text-xs text-slate-500 mt-1">Avg. Satisfaction</div>
        </div>
        <div className="bg-yellow-50/80 rounded-2xl p-6 text-center shadow-md flex flex-col items-center">
          <BarChart3 className="w-7 h-7 text-yellow-500 mb-2" />
          <div className="text-xs text-slate-500 mb-1">Most Used</div>
          <div className="font-semibold text-yellow-700 text-base truncate">{mostUsed.name}</div>
          <div className="text-xs text-yellow-600">{mostUsed.usageCount} uses</div>
        </div>
      </div>
      {/* Azure-inspired SVG Sparkline */}
      <div className="mt-8">
        <div className="text-base font-medium text-slate-700 mb-3">Preset Usage Trend</div>
        <div className="bg-gradient-to-r from-blue-100/60 to-indigo-100/60 rounded-xl p-4 shadow-inner">
          <svg width={presets.length * 40} height="80" className="block mx-auto">
            <polyline
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              points={sparklinePoints}
              style={{ filter: 'drop-shadow(0 2px 6px #2563eb33)' }}
            />
            {usageCounts.map((count, i) => (
              <circle
                key={i}
                cx={i * 40}
                cy={80 - (count / maxUsage) * 70}
                r="5"
                fill="#2563eb"
                style={{ filter: 'drop-shadow(0 2px 6px #2563eb33)' }}
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