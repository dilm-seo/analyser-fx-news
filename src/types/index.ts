export interface Article {
  title: string;
  pubDate: string;
  description: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impact: 'low' | 'medium' | 'high';
  confidenceScore: number;
}

export interface Currency {
  pair: string;
  sentiment: number;
  strength: number;
}

export interface OpenAISettings {
  apiKey: string;
  model: 'gpt-3.5-turbo' | 'gpt-4';
  temperature: number;
}

export interface Settings {
  openai: OpenAISettings;
}