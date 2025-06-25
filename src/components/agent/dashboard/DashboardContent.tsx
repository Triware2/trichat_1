import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardStats } from '@/components/agent/DashboardStats';
import { QueueStatus } from '@/components/agent/QueueStatus';
import { RecentActivity } from '@/components/agent/RecentActivity';
import { Search, Filter, Star, TrendingUp, MessageSquare, Award, UserCircle, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardContentProps {
  stats: Array<{
    title: string;
    value: string;
    icon: any;
    color: string;
  }>;
  agentName: string;
  activities: Array<{
    customer: string;
    action: string;
    time: string;
    type: string;
  }>;
  feedback: {
    csat: number;
    dsat: number;
    totalResponses: number;
    recentFeedback: Array<{
      rating: number;
      feedback: string;
      customer: string;
      date: string;
    }>;
  };
  onStatClick: (statTitle: string) => void;
  onQueueAction: (chatId: string) => void;
  queue: any[];
  todayPerformance: any;
}

export const DashboardContent = ({ 
  stats, 
  agentName,
  activities, 
  feedback,
  onStatClick, 
  onQueueAction,
  queue,
  todayPerformance
}: DashboardContentProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleGlobalSearch = () => {
    if (searchQuery.trim()) {
      console.log('Global search for:', searchQuery);
      // Global search functionality would be implemented here
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="dashboard-bg min-h-screen p-6 md:p-8">
      {/* Redesigned Frosted Glass Header */}
      <header className="relative bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl px-10 py-7 flex items-center justify-between mb-10 border border-slate-100">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shadow-lg ring-4 ring-blue-200 animate-pulse-slow">
              <UserCircle className="w-9 h-9 text-blue-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold font-roboto text-black">Welcome back, {agentName}!</span>
              <span className="text-2xl">👋</span>
            </div>
            <div className="mt-1 text-base font-medium text-slate-600 font-roboto">Here's your performance overview</div>
            <div className="mt-2 h-1 w-16 bg-gradient-to-r from-blue-400 to-blue-200 rounded-full opacity-60"></div>
          </div>
        </div>
        <button className="rounded-full p-3 bg-slate-100 hover:bg-blue-100 transition shadow" onClick={() => navigate('/agent/notifications')}>
            <span className="sr-only">Notifications</span>
          <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          </button>
      </header>

      {/* Stat Cards Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        {/* Placeholder stat cards, replace with mapped stats */}
        {stats.map((stat, idx) => (
          <div key={idx} className="glass flex flex-col items-start justify-between p-6 rounded-2xl shadow group hover:shadow-xl transition cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <span className="p-3 rounded-xl shadow-md bg-gradient-to-tr from-blue-400 to-blue-600 text-white group-hover:scale-110 transition-transform"><stat.icon className="w-6 h-6" /></span>
              <span className="text-xs font-medium tracking-wide text-slate-600 dark:text-slate-400 uppercase">{stat.title}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-extrabold text-black dark:text-white">{stat.value}</span>
              {/* Placeholder for trend arrow/mini graph */}
              <span className="text-green-500 text-xs font-bold">+12%</span>
            </div>
            <span className="text-xs text-slate-400 mt-1">vs last month</span>
          </div>
        ))}
      </section>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance & Feedback */}
        <section className="lg:col-span-2 flex flex-col gap-8">
          {/* Performance Card + DSAT Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CSAT Score Card */}
            <div className="glass rounded-2xl p-8 shadow flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" stroke="#e0e7ff" strokeWidth="10" fill="none" />
                  <circle cx="50" cy="50" r="45" stroke="#6366f1" strokeWidth="10" fill="none" strokeDasharray="282.74" strokeDashoffset={`${282.74 * (1 - feedback.csat / 100)}`} strokeLinecap="round" />
                </svg>
                <span className="text-3xl font-extrabold text-black">{feedback.csat.toFixed(1)}%</span>
              </div>
              <span className="mt-2 text-lg font-bold text-slate-800 dark:text-slate-200">CSAT Score</span>
            </div>
            {/* DSAT Score Card */}
            <div className="glass rounded-2xl p-8 shadow flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" stroke="#fee2e2" strokeWidth="10" fill="none" />
                  <circle cx="50" cy="50" r="45" stroke="#f87171" strokeWidth="10" fill="none" strokeDasharray="282.74" strokeDashoffset={`${282.74 * (1 - feedback.dsat / 100)}`} strokeLinecap="round" />
                </svg>
                <span className="text-3xl font-extrabold text-red-500">{feedback.dsat.toFixed(1)}%</span>
              </div>
              <span className="mt-2 text-lg font-bold text-slate-800 dark:text-slate-200">DSAT Score</span>
            </div>
            {/* Total Responses Card */}
            <div className="glass rounded-2xl p-8 shadow flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                 <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" stroke="#f0fdf4" strokeWidth="10" fill="none" />
                  <circle cx="50" cy="50" r="45" stroke="#22c55e" strokeWidth="10" fill="none" strokeDasharray="282.74" strokeDashoffset="0" strokeLinecap="round" />
                </svg>
                <span className="text-3xl font-extrabold text-green-600">{feedback.totalResponses}</span>
              </div>
              <span className="mt-2 text-lg font-bold text-slate-800 dark:text-slate-200">Total Responses</span>
            </div>
          </div>
          {/* Recent Feedback */}
          <div className="glass rounded-2xl p-8 shadow flex flex-col">
            <h3 className="text-lg font-extrabold text-black dark:text-white mb-3">Recent Feedback</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {feedback.recentFeedback.length > 0 ? (
                feedback.recentFeedback.map((fb, idx) => (
                  <div key={idx} className="glass px-4 py-2 rounded-xl shadow text-slate-700 dark:text-slate-200 flex-shrink-0">
                    <div className="flex items-center gap-2 mb-1">{getRatingStars(fb.rating)}</div>
                    <p className="font-medium">"<span className='font-bold'>{fb.customer}</span> {fb.feedback}"</p>
                    <p className="text-xs text-slate-400 mt-1 text-right">- {fb.customer}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 font-medium">No feedback yet for this month.</p>
              )}
            </div>
          </div>
        </section>
        {/* My Queue & Recent Activity */}
        <aside className="flex flex-col gap-6">
          <QueueStatus chats={queue} onQueueAction={onQueueAction} small />
          <RecentActivity activities={activities} small />
        </aside>
      </main>
    </div>
  );
};
