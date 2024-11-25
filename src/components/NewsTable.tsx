import React from 'react';
import { format } from 'date-fns';
import { Article } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface NewsTableProps {
  articles: Article[];
}

export default function NewsTable({ articles }: NewsTableProps) {
  const getSentimentIcon = (sentiment: Article['sentiment']) => {
    switch (sentiment) {
      case 'bullish':
        return <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-green-500" />;
      case 'bearish':
        return <TrendingDown className="w-4 sm:w-5 h-4 sm:h-5 text-red-500" />;
      default:
        return <Minus className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />;
    }
  };

  const getImpactBadge = (impact: Article['impact']) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[impact]}`}>
        {impact.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="-mx-4 sm:mx-0 overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sentiment
                </th>
                <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impact
                </th>
                <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.map((article, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    {format(new Date(article.pubDate), 'MMM d, HH:mm')}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4">
                    <div className="text-xs sm:text-sm font-medium text-gray-900 mb-1">{article.title}</div>
                    <div className="text-xs text-gray-500 line-clamp-2 hidden sm:block">{article.description}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                    {getSentimentIcon(article.sentiment)}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                    {getImpactBadge(article.impact)}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                    <div className="w-16 sm:w-full bg-gray-200 rounded-full h-1.5 sm:h-2.5">
                      <div
                        className="bg-blue-600 h-1.5 sm:h-2.5 rounded-full"
                        style={{ width: `${article.confidenceScore}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {article.confidenceScore}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}