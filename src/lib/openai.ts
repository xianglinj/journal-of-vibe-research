import OpenAI from 'openai';

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

export function getResearchModel(): string {
  return process.env.OPENAI_RESEARCH_MODEL || 'o3';
}

export function getUtilityModel(): string {
  return process.env.OPENAI_UTILITY_MODEL || 'gpt-4.1-mini';
}

export async function chatCompletion(
  messages: OpenAI.ChatCompletionMessageParam[],
  model?: string,
  temperature?: number,
): Promise<string> {
  const openai = getOpenAI();
  const selectedModel = model || getResearchModel();

  const params: OpenAI.ChatCompletionCreateParams = {
    model: selectedModel,
    messages,
  };

  // o-series models don't support temperature
  if (temperature !== undefined && !selectedModel.startsWith('o')) {
    params.temperature = temperature;
  }

  const response = await openai.chat.completions.create(params);
  return response.choices[0]?.message?.content || '';
}
