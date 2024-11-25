import axios from 'axios';
import { Article } from '../types';
import { analyzeArticle } from './openaiService';

const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/'
];

const RSS_URL = 'https://www.forexlive.com/feed/news';

export async function fetchRSSFeed(openAISettings?: {
  apiKey: string;
  model: string;
  temperature: number;
}): Promise<Article[]> {
  let lastError = null;
  
  for (const proxy of CORS_PROXIES) {
    try {
      const response = await axios.get(`${proxy}${encodeURIComponent(RSS_URL)}`, {
        headers: {
          'Accept': 'application/xml, text/xml, */*',
        },
      });
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, 'text/xml');
      
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error('Failed to parse XML response');
      }
      
      const items = Array.from(xmlDoc.querySelectorAll('item'));
      
      if (!items.length) {
        throw new Error('No items found in RSS feed');
      }
      
      const articles = items.map(item => ({
        title: item.querySelector('title')?.textContent?.trim() || '',
        pubDate: new Date(item.querySelector('pubDate')?.textContent || '').toISOString(),
        description: item.querySelector('description')?.textContent?.trim() || '',
        sentiment: 'neutral' as const,
        impact: 'low' as const,
        confidenceScore: 30
      }));

      if (openAISettings?.apiKey) {
        const analyzedArticles = await Promise.all(
          articles.map(async (article) => {
            try {
              const analysis = await analyzeArticle(
                article,
                openAISettings.apiKey,
                openAISettings.model,
                openAISettings.temperature
              );
              return { ...article, ...analysis };
            } catch (error) {
              console.error('Analysis failed for article:', error);
              return article;
            }
          })
        );
        return analyzedArticles;
      }

      return articles;
    } catch (error) {
      console.error(`Failed with proxy ${proxy}:`, error);
      lastError = error;
      continue;
    }
  }
  
  throw new Error(lastError?.message || 'Failed to fetch RSS feed from all proxies');
}