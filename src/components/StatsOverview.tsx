import React from 'react';
import { Article } from '../types';
import { TrendingUp, TrendingDown, AlertTriangle, BarChart2 } from 'lucide-react';

interface StatsOverviewProps {
  articles: Article[];
}

export default function StatsOverview({ articles }: StatsOverviewProps) {
  const stats = articles.reduce(
    (acc, article) => {
      acc[article.sentiment]++;
      acc[article.impact]++;
      acc.totalConfidence += article.confidenceScore;
      return acc;
    },
    {
      bullish: 0,
      bearish: 0,
      neutral: 0,
      high: 0,
      medium: 0,
      low: 0,
      totalConfidence: 0,
    }
  );

  const avgConfidence = Math.round(stats.totalConfidence / articles.length);

  const cards = [
    {
      title: 'Bullish Signals',
      value: stats.bullish,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Bearish Signals',
      value: stats.bearish,
      icon: TrendingDown,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      title: 'High Impact News',
      value: stats.high,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Avg Confidence',
      value: `${avgConfidence}%`,
      icon: BarChart2,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="card p-6">
          <div className="flex items-center">
            <div className={`${card.bg} p-3 rounded-lg`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}