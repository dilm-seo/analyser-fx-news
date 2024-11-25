import React, { useState, useEffect } from 'react';
import { fetchRSSFeed } from './services/rssService';
import NewsTable from './components/NewsTable';
import CurrencyHeatmap from './components/CurrencyHeatmap';
import SettingsModal from './components/SettingsModal';
import StatsOverview from './components/StatsOverview';
import { Article, Currency, Settings } from './types';
import { RefreshCw, Settings as SettingsIcon, LineChart } from 'lucide-react';

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    openai: {
      apiKey: '',
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
    },
  });
  const [currencies] = useState<Currency[]>([
    { pair: 'EUR/USD', sentiment: 65, strength: 72 },
    { pair: 'GBP/USD', sentiment: 45, strength: 58 },
    { pair: 'USD/JPY', sentiment: 80, strength: 85 },
    { pair: 'AUD/USD', sentiment: 30, strength: 42 },
    { pair: 'USD/CAD', sentiment: 55, strength: 63 }
  ]);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRSSFeed(settings.openai);
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedSettings = localStorage.getItem('forexAnalyzerSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    fetchNews();
  }, []);

  const handleSaveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('forexAnalyzerSettings', JSON.stringify(newSettings));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
          <div className="flex items-center space-x-3">
            <LineChart className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Forex RSS Analyzer
            </h1>
          </div>
          <div className="flex w-full sm:w-auto space-x-2 sm:space-x-4">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="btn-secondary flex-1 sm:flex-none justify-center"
            >
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </button>
            <button
              onClick={fetchNews}
              disabled={loading}
              className="btn-primary flex-1 sm:flex-none justify-center"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Scan Now
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-6 sm:mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <div className="flex">
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-4 sm:space-y-6">
          {articles.length > 0 ? (
            <>
              <StatsOverview articles={articles} />
              <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="card p-4 sm:p-6 order-2 lg:order-1">
                  <CurrencyHeatmap currencies={currencies} />
                </div>
                <div className="card p-4 sm:p-6 order-1 lg:order-2">
                  <NewsTable articles={articles} />
                </div>
              </div>
            </>
          ) : !loading && !error ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500">No articles found. Click "Scan Now" to fetch the latest news.</p>
            </div>
          ) : null}
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />
    </div>
  );
}

export default App;