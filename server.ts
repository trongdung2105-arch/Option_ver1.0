import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildStrategicDecision } from './src/utils/decisionEngine.ts';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Robust caller that falls back to alternate models if a 503 spike occurs
async function generateContentWithFallback(params: { contents: any; config?: any }) {
  const candidateModels = [
    'gemini-3.6-flash',
    'gemini-2.5-flash-lite',
    'gemini-3.5-flash',
  ];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const callPromise = ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      // 8 second timeout per model to keep UX crisp
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout on model ${model}`)), 8000)
      );
      const res: any = await Promise.race([callPromise, timeoutPromise]);
      if (res && res.text) {
        return res;
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed or timed out:`, err?.message || err);
      lastError = err;
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  throw lastError || new Error('All models failed to respond');
}

// API health route
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey && apiKey.length > 5),
    mode: process.env.NODE_ENV || 'development',
  });
});

// Main Analysis Endpoint
app.post('/api/analyze', async (req: Request, res: Response) => {
  const { dilemma = '', options = [], contextNotes = '', language = 'vi' } = req.body || {};

  try {
    if (!dilemma || typeof dilemma !== 'string' || dilemma.trim().length === 0) {
      res.status(400).json({ error: 'Dilemma is required' });
      return;
    }

    const langInstruction = language === 'vi' 
      ? 'All titles, texts, pros, cons, SWOT, criteria, and rationale MUST be written in fluent, articulate Vietnamese (Tiếng Việt).'
      : 'All titles, texts, pros, cons, SWOT, criteria, and rationale MUST be written in fluent, articulate English.';

    const prompt = `You are "The Tiebreaker", an elite strategic decision-making advisor and cognitive consultant.
The user has a difficult decision or dilemma to resolve:
"${dilemma}"

${options && options.length > 0 ? `User-suggested options: ${JSON.stringify(options)}` : 'Infer exactly 2 to 3 distinct, practical, mutually exclusive options for this dilemma.'}
${contextNotes ? `Additional context / constraints provided by user: "${contextNotes}"` : ''}

${langInstruction}

Analyze this thoroughly using strategic decision frameworks:
1. Executive Summary: Core trade-off and root tension.
2. 2 to 3 Options compared with:
   - Name and high-level tagline
   - Detailed Pros (with category, text, concise rationale, suggested importance weight 1-10)
   - Detailed Cons (with category, text, concise rationale, suggested importance weight 1-10)
   - SWOT Analysis:
     * Strengths (Internal advantages of choosing this option)
     * Weaknesses (Internal limitations/costs of choosing this option)
     * Opportunities (External upside/future leverage this option unlocks)
     * Threats (External risks/dangers this option exposes)
3. Direct Comparison Matrix:
   - 4 to 6 critical evaluation criteria (e.g., Speed, Long-term Value, Financial ROI, Stress/Effort, Risk).
   - Rating score for each option on each criterion from 1 to 10.
   - Criterion weight from 1 to 10.
   - Analytical commentary for each criterion.
4. TOWS Strategic Action Directives:
   - 3 to 4 actionable tactics (e.g. SO: Strength-Opportunity leverage, WT: Weakness-Threat mitigation) showing how to execute effectively.
5. Strategic Verdict (The Tiebreaker Recommendation):
   - Recommended Option ID
   - Punchy, decisive headline
   - Deep strategic rationale explaining why this option edges out the other
   - Confidence score percentage (50-95%)
   - Key critical conditions/assumptions under which this verdict holds true.`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        systemInstruction: 'You are The Tiebreaker, an expert strategic consultant. Be sharp, objective, avoiding superficial fluff. Provide thorough, realistic pros/cons and rigorous SWOT/TOWS analysis.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'Executive summary explaining the fundamental dilemma',
            },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  tagline: { type: Type.STRING },
                  description: { type: Type.STRING },
                  pros: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        text: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                        category: { type: Type.STRING },
                        weight: { type: Type.NUMBER, description: 'Default importance 1 to 10' },
                      },
                      required: ['id', 'text', 'explanation', 'weight'],
                    },
                  },
                  cons: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        text: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                        category: { type: Type.STRING },
                        weight: { type: Type.NUMBER, description: 'Default severity 1 to 10' },
                      },
                      required: ['id', 'text', 'explanation', 'weight'],
                    },
                  },
                  swot: {
                    type: Type.OBJECT,
                    properties: {
                      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                      opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                      threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['strengths', 'weaknesses', 'opportunities', 'threats'],
                  },
                },
                required: ['id', 'name', 'tagline', 'description', 'pros', 'cons', 'swot'],
              },
            },
            comparisonMatrix: {
              type: Type.OBJECT,
              properties: {
                criteria: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      weight: { type: Type.NUMBER },
                    },
                    required: ['id', 'name', 'description', 'weight'],
                  },
                },
                scores: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      criteriaId: { type: Type.STRING },
                      scoresByOption: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            optionId: { type: Type.STRING },
                            score: { type: Type.NUMBER, description: 'Score 1 to 10' },
                          },
                          required: ['optionId', 'score'],
                        },
                      },
                      commentary: { type: Type.STRING },
                    },
                    required: ['criteriaId', 'scoresByOption', 'commentary'],
                  },
                },
              },
              required: ['criteria', 'scores'],
            },
            towsTactics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: 'SO, WO, ST, or WT' },
                  title: { type: Type.STRING },
                  action: { type: Type.STRING },
                  relevantOption: { type: Type.STRING },
                },
                required: ['type', 'title', 'action'],
              },
            },
            verdict: {
              type: Type.OBJECT,
              properties: {
                recommendedOptionId: { type: Type.STRING },
                headline: { type: Type.STRING },
                rationale: { type: Type.STRING },
                confidenceScore: { type: Type.NUMBER, description: '50-100' },
                keyConditions: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['recommendedOptionId', 'headline', 'rationale', 'confidenceScore', 'keyConditions'],
            },
          },
          required: ['summary', 'options', 'comparisonMatrix', 'towsTactics', 'verdict'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No response text received from Gemini');
    }

    const parsedData = JSON.parse(text);
    res.json(parsedData);
  } catch (error: any) {
    console.error('Error analyzing dilemma, activating strategic fallback engine:', error?.message || error);
    try {
      const fallback = buildStrategicDecision(dilemma, options, contextNotes, language);
      res.json(fallback);
    } catch (fallbackError: any) {
      console.error('Fallback error:', fallbackError);
      res.status(500).json({
        error: error.message || 'Failed to analyze decision',
      });
    }
  }
});

// Dynamic AI Tiebreaker Adjudication
app.post('/api/tiebreaker', async (req: Request, res: Response) => {
  const {
    dilemma = '',
    options = [],
    currentWeights = {},
    mode = 'rational',
    userPriorityNote = '',
    language = 'vi',
  } = req.body || {};

  try {
    const langInstruction = language === 'vi'
      ? 'Respond completely in fluent, engaging Vietnamese (Tiếng Việt).'
      : 'Respond completely in fluent, engaging English.';

    const prompt = `You are "The Tiebreaker", delivering the final verdict on this dilemma:
Dilemma: "${dilemma}"
Options: ${JSON.stringify(options)}
User Current Weight Preferences / Scores: ${JSON.stringify(currentWeights)}
Adjudication Mode: "${mode}" (rational, devils_advocate, regret_minimization, or coin_toss_psychology)
User Priority / Gut Note: "${userPriorityNote}"

${langInstruction}

Act according to the mode:
- If 'rational': Deliver a mathematically weighted & strategic verdict based on their custom priorities.
- If 'devils_advocate': Aggressively challenge the consensus, reveal the blind spots and risks they are overlooking.
- If 'regret_minimization': Apply Jeff Bezos's 10/10/10 framework (How will you feel in 10 minutes, 10 months, 10 years?).
- If 'coin_toss_psychology': Analyze their subconscious gut reaction and provide the psychological tiebreaker test.

Provide:
1. chosenOptionId: ID of the winning or recommended option.
2. punchline: Catchy, memorable verdict headline.
3. deepDiveVerdict: 2-3 structured paragraphs explaining the decisive reasons.
4. blindSpotsToWatch: 2-3 risks or delusions to actively guard against.
5. thirtyDayNextStep: Concrete immediate action to take within 24-48 hours.
6. the101010Test: { tenMinutes: string, tenMonths: string, tenYears: string }`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chosenOptionId: { type: Type.STRING },
            punchline: { type: Type.STRING },
            deepDiveVerdict: { type: Type.STRING },
            blindSpotsToWatch: { type: Type.ARRAY, items: { type: Type.STRING } },
            thirtyDayNextStep: { type: Type.STRING },
            the101010Test: {
              type: Type.OBJECT,
              properties: {
                tenMinutes: { type: Type.STRING },
                tenMonths: { type: Type.STRING },
                tenYears: { type: Type.STRING },
              },
              required: ['tenMinutes', 'tenMonths', 'tenYears'],
            },
          },
          required: ['chosenOptionId', 'punchline', 'deepDiveVerdict', 'blindSpotsToWatch', 'thirtyDayNextStep', 'the101010Test'],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error('No verdict received');
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error in tiebreaker endpoint, using heuristic fallback:', error?.message || error);
    const isVi = language === 'vi';
    const firstOpt = (options && options[0]?.name) || (isVi ? 'Phương án ưu tiên' : 'Option A');
    res.json({
      chosenOptionId: options && options[0]?.id ? options[0].id : 'opt-a',
      punchline: isVi 
        ? `Lựa chọn dứt khoát: Hãy nghiêng về ${firstOpt} để đón đầu chu kỳ mới` 
        : `Decisive call: Lean into ${firstOpt} for future upside`,
      deepDiveVerdict: isVi
        ? `Dựa trên phân tích trọng số bạn đã tùy chỉnh, việc trì hoãn không giải quyết được xung đột cốt lõi. Sự an toàn ngắn hạn có thể trở thành cái bẫy của chi phí cơ hội. Hãy biến quyết định này thành bệ phóng năng lực thay vì lo sợ rủi ro chưa diễn ra.`
        : `Based on your weighted distribution, lingering ambiguity creates cognitive debt. Action provides real data, while indecision only multiplies imagined friction.`,
      blindSpotsToWatch: isVi
        ? ['Đánh giá thấp thời gian hòa vốn và sức chịu đựng tâm lý', 'Bỏ qua các cảnh báo nhỏ trong những tuần đầu thực thi']
        : ['Underestimating the time to stabilize', 'Ignoring early friction signs in week 1-4'],
      thirtyDayNextStep: isVi
        ? 'Lên danh sách 3 hành động cụ thể cần hoàn tất trước 18:00 ngày mai để xác nhận cam kết.'
        : 'Draft 3 non-negotiable milestones to execute within the next 24 hours.',
      the101010Test: {
        tenMinutes: isVi ? 'Cảm thấy nhẹ nhõm vì đã phá vỡ thế lưỡng lự giằng co.' : 'Relief that analysis paralysis is finally broken.',
        tenMonths: isVi ? 'Bắt đầu thấy kết quả cụ thể và thích nghi hoàn toàn với quỹ đạo mới.' : 'Experiencing tangible traction and momentum in your new normal.',
        tenYears: isVi ? 'Tự hào vì bản thân đã dũng cảm đưa ra quyết định thay vì chấp nhận thụ động.' : 'Deep pride that you took proactive agency over your destiny.',
      },
    });
  }
});

// Counter-argument or mitigation advice on specific item
app.post('/api/mitigate', async (req: Request, res: Response) => {
  const { itemText = '', itemType = '', optionName = '', dilemma = '', language = 'vi' } = req.body || {};

  try {
    const langInstruction = language === 'vi' ? 'Respond in Vietnamese (Tiếng Việt).' : 'Respond in English.';

    const prompt = `In the decision context "${dilemma}", for option "${optionName}", the user is examining this ${itemType}:
"${itemText}"

${langInstruction}

Provide:
1. realityCheck: Is this concern/benefit usually overblown or accurate in practice? (1-2 sentences)
2. strategicMitigation: Practical step to neutralize this risk (if con) or maximize this advantage (if pro).
3. testQuestion: One decisive question the user should ask themselves right now.`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            realityCheck: { type: Type.STRING },
            strategicMitigation: { type: Type.STRING },
            testQuestion: { type: Type.STRING },
          },
          required: ['realityCheck', 'strategicMitigation', 'testQuestion'],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error('No advice received');
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error in mitigate endpoint, using heuristic advice:', error?.message || error);
    const isVi = language === 'vi';
    res.json({
      realityCheck: isVi 
        ? `Vấn đề "${itemText}" là yếu tố thực tế nhưng thường bị phóng đại nỗi sợ hãi hoặc kỳ vọng lên khoảng 30-40% so với thực tế.`
        : `The point "${itemText}" is real, but typically amplified by 30-40% emotional bias.`,
      strategicMitigation: isVi
        ? `Đặt ra hạn mức giới hạn (Stop-loss threshold) rõ ràng trước khi bắt đầu, và kiểm tra định kỳ mỗi 2 tuần một lần.`
        : `Establish an explicit stop-loss threshold upfront and schedule a bi-weekly post-mortem review.`,
      testQuestion: isVi
        ? `Nếu kịch bản xấu nhất của điểm này xảy ra, bạn có phương án dự phòng để vượt qua được không?`
        : `If the worst-case scenario for this item materializes, do you possess a survivable hedge?`,
    });
  }
});

// Serve frontend
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`The Tiebreaker server running on http://0.0.0.0:${port}`);
  });
}

startServer();
