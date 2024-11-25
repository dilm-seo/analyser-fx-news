import OpenAI from 'openai';
import { Article } from '../types';

export async function analyzeArticle(
  article: Partial<Article>,
  apiKey: string,
  model: string,
  temperature: number
): Promise<{
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impact: 'low' | 'medium' | 'high';
  confidenceScore: number;
}> {
  if (!apiKey) {
    throw new Error('OpenAI API key is required. Please check your settings.');
  }

  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });

  const prompt = `
    Analyze the following forex news article and provide a JSON response with:
    - sentiment: "bullish", "bearish", or "neutral"
    - impact: "low", "medium", or "high"
    - confidenceScore: number between 30 and 95

    Title: ${article.title}
    Content: ${article.description}

    Respond only with valid JSON.
  `;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: model,
      temperature: temperature,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(response);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to analyze article with OpenAI');
  }
}