import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Star, Download, Heart, TrendingUp, Award, Crown,
  MessageSquare, Target, Settings, Bot, Users, Globe, Zap,
  CheckCircle, Clock, DollarSign, ArrowRight, Filter, ShoppingCart, BookOpen,
  BarChart3, Smile
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string;
  rating: number;
  downloads: number;
  isPremium: boolean;
  isVerified: boolean;
  tags: string[];
  performance: {
    accuracy: number;
    responseTime: number;
    userSatisfaction: number;
  };
  price?: number;
  lastUpdated: string;
}

export const TemplateLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const templates: Template[] = [
    {
      id: '1',
      name: 'Enterprise Customer Support',
      description: 'Comprehensive customer service template with escalation protocols and multi-language support',
      category: 'enterprise',
      author: 'Trichat Team',
      rating: 4.9,
      downloads: 1247,
      isPremium: false,
      isVerified: true,
      tags: ['enterprise', 'multi-language', 'escalation', 'compliance'],
      performance: { accuracy: 96.2, responseTime: 1.1, userSatisfaction: 4.8 },
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      name: 'E-commerce Assistant Pro',
      description: 'Specialized for online stores with product recommendations and order management',
      category: 'ecommerce',
      author: 'Trichat Team',
      rating: 4.7,
      downloads: 892,
      isPremium: false,
      isVerified: true,
      tags: ['ecommerce', 'product-recommendations', 'order-management'],
      performance: { accuracy: 94.5, responseTime: 1.3, userSatisfaction: 4.6 },
      lastUpdated: '2024-01-12'
    },
    {
      id: '3',
      name: 'Healthcare Triage Bot',
      description: 'Medical triage assistant with symptom analysis and emergency protocols',
      category: 'healthcare',
      author: 'Trichat Team',
      rating: 4.8,
      downloads: 567,
      isPremium: false,
      isVerified: true,
      tags: ['healthcare', 'triage', 'symptoms', 'emergency'],
      performance: { accuracy: 97.1, responseTime: 1.8, userSatisfaction: 4.9 },
      lastUpdated: '2024-01-10'
    },
    {
      id: '4',
      name: 'Financial Advisor',
      description: 'Investment and financial planning assistant with compliance features',
      category: 'finance',
      author: 'Trichat Team',
      rating: 4.6,
      downloads: 423,
      isPremium: false,
      isVerified: false,
      tags: ['finance', 'investment', 'compliance', 'planning'],
      performance: { accuracy: 93.8, responseTime: 2.1, userSatisfaction: 4.5 },
      lastUpdated: '2024-01-08'
    },
    {
      id: '5',
      name: 'Educational Tutor',
      description: 'Adaptive learning assistant with personalized curriculum and progress tracking',
      category: 'education',
      author: 'Trichat Team',
      rating: 4.5,
      downloads: 678,
      isPremium: false,
      isVerified: true,
      tags: ['education', 'tutoring', 'adaptive-learning', 'progress-tracking'],
      performance: { accuracy: 92.3, responseTime: 1.5, userSatisfaction: 4.4 },
      lastUpdated: '2024-01-05'
    },
    {
      id: '6',
      name: 'Technical Support Expert',
      description: 'Advanced troubleshooting with code analysis and debugging workflows',
      category: 'technical',
      author: 'Trichat Team',
      rating: 4.9,
      downloads: 1156,
      isPremium: false,
      isVerified: true,
      tags: ['technical', 'debugging', 'code-analysis', 'troubleshooting'],
      performance: { accuracy: 95.7, responseTime: 2.3, userSatisfaction: 4.7 },
      lastUpdated: '2024-01-03'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', icon: Globe },
    { id: 'enterprise', name: 'Enterprise', icon: Crown },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCart },
    { id: 'healthcare', name: 'Healthcare', icon: Heart },
    { id: 'finance', name: 'Finance', icon: DollarSign },
    { id: 'education', name: 'Education', icon: BookOpen },
    { id: 'technical', name: 'Technical', icon: Settings },
    { id: 'community', name: 'Community', icon: Users }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      case 'recent':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Award className="w-6 h-6 text-purple-600" />
              Template Library
            </h3>
            <p className="text-slate-600 mt-2">Curated templates from industry experts and community</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              <TrendingUp className="w-3 h-3 mr-1" />
              {templates.length} Templates
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="recent">Recently Updated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {category.name}
            </Button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedTemplates.map((template) => (
          <Card
            key={template.id}
            className="group border border-slate-200 bg-white/90 hover:shadow-lg transition-all duration-200 rounded-xl p-0 overflow-hidden relative"
            tabIndex={0}
            aria-label={`Template: ${template.name}`}
          >
            <div className="flex flex-col gap-2 p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-base text-slate-900 truncate">{template.name}</span>
                    {template.isPremium && (
                      <span className="ml-1 px-2 py-0.5 rounded bg-yellow-50 text-yellow-700 text-xs border border-yellow-100 flex items-center gap-1"><Crown className="w-3 h-3" />Premium</span>
                    )}
                    {template.isVerified && (
                      <span className="ml-1 px-2 py-0.5 rounded bg-green-50 text-green-700 text-xs border border-green-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Verified</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 truncate mb-1">{template.description}</div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className="text-slate-700 font-medium">{template.rating}</span>
                    <span>·</span>
                    <span>{template.downloads} downloads</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-600 mt-1">
                <div className="flex items-center gap-1">
                  <BarChart3 className="w-3 h-3 text-blue-400" />
                  <span>{template.performance.accuracy}%</span>
                  <span className="text-slate-400">Acc</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-green-400" />
                  <span>{template.performance.responseTime}s</span>
                  <span className="text-slate-400">Resp</span>
                </div>
                <div className="flex items-center gap-1">
                  <Smile className="w-3 h-3 text-pink-400" />
                  <span>{template.performance.userSatisfaction}/5</span>
                  <span className="text-slate-400">Sat</span>
                </div>
                <span className="ml-auto text-xs text-slate-400">{template.lastUpdated}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                {template.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">{tag}</span>
                ))}
                {template.tags.length > 3 && (
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">+{template.tags.length - 3} more</span>
                )}
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-500 truncate">by {template.author}</div>
                <div className="flex items-center gap-2">
                  {template.isPremium ? (
                    <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-200 px-2 py-1 h-7 min-w-0 text-xs">
                      <DollarSign className="w-3 h-3 mr-1" />
                      ${template.price}
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="px-2 py-1 h-7 min-w-0 text-xs">
                      <Download className="w-3 h-3 mr-1" />
                      Free
                    </Button>
                  )}
                  <Button size="sm" className="px-3 py-1 h-7 min-w-0 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    <ArrowRight className="w-3 h-3 mr-1" />
                    Use
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {sortedTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-pink-700 flex items-center justify-center shadow-lg shadow-purple-500/25 mx-auto mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Templates Found</h3>
          <p className="text-slate-600">Try adjusting your search criteria or browse all templates</p>
        </div>
      )}
    </div>
  );
}; 