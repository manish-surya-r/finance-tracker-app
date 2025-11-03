
import { GoogleGenAI } from "@google/genai";
import type { Transaction } from '../types';

export async function getSpendingInsights(transactions: Transaction[]): Promise<string> {
  if (!process.env.API_KEY) {
    return "API_KEY environment variable is not set. Please configure it to use AI insights.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const simplifiedTransactions = transactions.map(({ type, amount, category, date }) => ({
    type,
    amount,
    category,
    date
  }));

  const prompt = `
    You are a friendly financial advisor. Analyze the following list of personal financial transactions and provide some simple, actionable insights and recommendations.
    Focus on spending habits, potential savings, and positive reinforcement. Keep the tone encouraging and easy to understand.
    Format the output in markdown.

    Transactions:
    ${JSON.stringify(simplifiedTransactions, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching insights from Gemini API:", error);
    return "Sorry, I couldn't generate insights at the moment. Please try again later.";
  }
}
