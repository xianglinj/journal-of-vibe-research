import https from 'https';

export function getResearchModel(): string {
  return process.env.OPENAI_RESEARCH_MODEL || 'gpt-5.4-pro';
}

export function getUtilityModel(): string {
  return process.env.OPENAI_UTILITY_MODEL || 'gpt-5.4-pro';
}

// Models that require the Responses API instead of Chat Completions
function requiresResponsesApi(model: string): boolean {
  return model.includes('-pro');
}

export async function chatCompletion(
  messages: { role: string; content: string }[],
  model?: string,
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const selectedModel = model || getResearchModel();

  if (requiresResponsesApi(selectedModel)) {
    return responsesApiCall(apiKey, selectedModel, messages);
  }

  return chatCompletionsCall(apiKey, selectedModel, messages);
}

// Use node:https directly to avoid undici/Next.js fetch timeout issues
// (undici default headersTimeout is 5 min, gpt-5.4-pro can take longer)
function httpsPost(url: string, headers: Record<string, string>, body: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = https.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname,
        method: 'POST',
        headers,
        timeout: 10 * 60 * 1000, // 10 minutes
      },
      (res) => {
        let data = '';
        res.on('data', (chunk: Buffer) => (data += chunk.toString()));
        res.on('end', () => resolve({ status: res.statusCode || 0, body: data }));
      },
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('OpenAI request timed out after 10 minutes'));
    });
    req.write(body);
    req.end();
  });
}

async function responsesApiCall(
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[],
): Promise<string> {
  const systemMsg = messages.find(m => m.role === 'system' || m.role === 'developer');
  const userMsg = messages.find(m => m.role === 'user');

  const res = await httpsPost(
    'https://api.openai.com/v1/responses',
    {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    JSON.stringify({
      model,
      instructions: systemMsg?.content || '',
      input: userMsg?.content || '',
    }),
  );

  if (res.status !== 200) {
    throw new Error(`OpenAI Responses API error ${res.status}: ${res.body}`);
  }

  const data = JSON.parse(res.body);
  return data.output_text || '';
}

async function chatCompletionsCall(
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[],
): Promise<string> {
  const res = await httpsPost(
    'https://api.openai.com/v1/chat/completions',
    {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    JSON.stringify({ model, messages }),
  );

  if (res.status !== 200) {
    throw new Error(`OpenAI Chat Completions API error ${res.status}: ${res.body}`);
  }

  const data = JSON.parse(res.body);
  return data.choices?.[0]?.message?.content || '';
}
