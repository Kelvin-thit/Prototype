import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Load data files
const trendsPath = path.resolve(process.cwd(), 'src/data/trends.json');
const creatorsPath = path.resolve(process.cwd(), 'src/data/creators.json');
const benchmarkPath = path.resolve(process.cwd(), 'src/data/benchmark.json');
const commentsPath = path.resolve(process.cwd(), 'src/data/comments100.json');
const brandsPath = path.resolve(process.cwd(), 'src/data/brands.json');

function loadJsonSafe(filePath: string, fallback: any = []) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (err) {
    console.error(`Failed to load ${filePath}:`, err);
  }
  return fallback;
}

// Data API endpoints
app.get('/api/trends', (req, res) => {
  const trends = loadJsonSafe(trendsPath);
  res.json(trends);
});

app.get('/api/creators', (req, res) => {
  const creators = loadJsonSafe(creatorsPath);
  res.json(creators);
});

app.get('/api/brands', (req, res) => {
  const brands = loadJsonSafe(brandsPath);
  res.json(brands);
});

app.get('/api/benchmark', (req, res) => {
  const benchmark = loadJsonSafe(benchmarkPath, {});
  const comments = loadJsonSafe(commentsPath, []);
  res.json({ ...benchmark, comments });
});

/**
 * POST /api/trend-scout
 * Analyzes any searched keyword, category, or brand to detect rising search & YouTube signals
 * and returns a structured trend object and recommended creator matches.
 */
app.post('/api/trend-scout', async (req, res) => {
  try {
    const { query, brand } = req.body;
    const cleanQuery = (query || 'Running').trim();
    const cleanBrand = (brand || 'Stride & Co.').trim();

    const creators = loadJsonSafe(creatorsPath);

    if (ai) {
      const prompt = `You are the Google Search & YouTube trend listening engine for CreatorXchange.
A user searched for the keyword / brand / niche: "${cleanQuery}".
Brand context: "${cleanBrand}".

Analyze this topic and output a realistic, timely Google Search & YouTube trend signal card in strict JSON:
1. "id": url-safe slug (e.g. "pickleball-recovery")
2. "name": high-impact trend title (e.g. "Pickleball Shoulder & Elbow Recovery")
3. "category": concise category (e.g. "Sports & Wellness")
4. "growth_7d": decimal growth over 7 days (e.g. 2.8 for +280%)
5. "growth_30d": decimal growth over 30 days (e.g. 4.6 for +460%)
6. "search_interest": integer 0-100 (e.g. 92)
7. "yt_interest": integer 0-100 (e.g. 88)
8. "state": one of "accelerating", "surging", "sustained", "peaking"
9. "summary": 1-2 sentence cultural description of why this is rising on Search and YouTube
10. "evidence": array of 3 bullet points with realistic data proof (e.g. search spikes, hashtag views, comment sentiments)
11. "top_queries": array of 4 actual rising search queries
12. "audience_vibe": description of the audience mindset and purchase intent
13. "brand_fit_angle": 1 sentence explaining how a brand like "${cleanBrand}" can activate this moment`;

      try {
        const response = await withTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  growth_7d: { type: Type.NUMBER },
                  growth_30d: { type: Type.NUMBER },
                  search_interest: { type: Type.INTEGER },
                  yt_interest: { type: Type.INTEGER },
                  state: { type: Type.STRING, enum: ['accelerating', 'surging', 'sustained', 'peaking'] },
                  summary: { type: Type.STRING },
                  evidence: { type: Type.ARRAY, items: { type: Type.STRING } },
                  top_queries: { type: Type.ARRAY, items: { type: Type.STRING } },
                  audience_vibe: { type: Type.STRING },
                  brand_fit_angle: { type: Type.STRING },
                },
                required: ['id', 'name', 'category', 'growth_7d', 'growth_30d', 'search_interest', 'yt_interest', 'state', 'summary', 'evidence', 'top_queries', 'audience_vibe', 'brand_fit_angle'],
              },
            },
          }),
          6000
        );

        const parsedTrend = JSON.parse(response.text || '{}');
        if (parsedTrend && parsedTrend.name) {
          return res.json({ trend: parsedTrend });
        }
      } catch (geminiErr) {
        console.warn('Gemini trend scout fallback:', geminiErr);
      }
    }

    // High quality deterministic fallback for query
    const fallbackTrend = {
      id: cleanQuery.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: `${cleanQuery.charAt(0).toUpperCase() + cleanQuery.slice(1)} Movement`,
      category: 'Lifestyle & Performance',
      growth_7d: 2.6,
      growth_30d: 4.2,
      search_interest: 88,
      yt_interest: 91,
      state: 'accelerating',
      summary: `Rising interest across Google Search and YouTube as creators showcase daily routines and practical tips for ${cleanQuery}.`,
      evidence: [
        `+260% surge in breakout searches for "${cleanQuery} beginner tips"`,
        `YouTube vlog engagement 65% higher for videos tagging #${cleanQuery.replace(/\s+/g, '')}`,
        `Comment sections showing high purchase inquiry rates for recommended products`,
      ],
      top_queries: [
        `best ${cleanQuery} for beginners`,
        `how to start ${cleanQuery}`,
        `${cleanQuery} routine 2026`,
        `${cleanQuery} gear recommendations`,
      ],
      audience_vibe: `High curiosity, community-oriented, eager to adopt trusted recommendations from peers.`,
      brand_fit_angle: `${cleanBrand} can provide genuine utility by supporting creators testing ${cleanQuery} in their daily content.`,
    };

    return res.json({ trend: fallbackTrend });
  } catch (err: any) {
    console.error('Error scouting trend:', err);
    return res.json({
      trend: {
        id: 'trend-signal',
        name: 'Trending Movement',
        category: 'Active Culture',
        growth_7d: 2.4,
        growth_30d: 3.8,
        search_interest: 86,
        yt_interest: 89,
        state: 'accelerating',
        summary: 'Rising momentum on YouTube and Search.',
        evidence: ['+240% breakout searches', 'Creator engagement +50%'],
        top_queries: ['best tips', 'routine 2026'],
        audience_vibe: 'High trust and active purchasing interest',
        brand_fit_angle: 'Authentic creator sponsorship match',
      },
    });
  }
});

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || '';
const isRealApiKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && !apiKey.includes('placeholder') && apiKey.length > 10);
const ai = isRealApiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

/**
 * POST /api/brief
 * input:  { campaign, trend_id, creator_id }
 * output: { trend_card, key_messages[], guardrails[], format, post_window,
 *           outreach_message, send_time, deal_type, deal_reason }
 *   deal_type: "paid_now" | "test_first" | "small_test_bonus"
 */
app.post('/api/brief', async (req, res) => {
  try {
    const { campaign, trend_id, creator_id } = req.body;

    const trends = loadJsonSafe(trendsPath);
    const creators = loadJsonSafe(creatorsPath);

    const trend = trends.find((t: any) => t.id === trend_id) || trends[0];
    const creator = creators.find((c: any) => c.id === creator_id) || creators[0];

    const campaignInfo = campaign || {
      brand_name: 'Stride & Co.',
      product_name: 'AeroFoam Long-Run Recovery Shoe',
      core_goal: 'Promote marathon-ready cushion & community group runs',
      budget_range: '$3,000 - $6,000',
      target_audience: 'Urban runners and wellness community builders',
    };

    // Calculate heuristic deal recommendation for context
    const trustScore = creator?.scores?.reception || 75;
    const purchaseIntent = creator?.intent_mix?.purchase || 0.12;
    const annoyanceIntent = creator?.intent_mix?.annoyance || 0.25;

    let baselineDealType = 'test_first';
    if (trustScore >= 80 && purchaseIntent >= 0.12) {
      baselineDealType = 'paid_now';
    } else if (annoyanceIntent > 0.50 || trustScore < 60) {
      baselineDealType = 'small_test_bonus';
    }

    if (ai) {
      const prompt = `You are the AI core for CreatorXchange, a platform that matches brands and creators on live Google Search & YouTube trends scored on audience trust.
Generate a structured, authentic campaign brief for this match.

CONTEXT:
Brand & Campaign:
- Brand: ${campaignInfo.brand_name || 'Brand'}
- Product: ${campaignInfo.product_name || 'Product'}
- Goal: ${campaignInfo.core_goal || 'Authentic trial and community connection'}
- Budget: ${campaignInfo.budget_range || '$3,000 - $5,000'}

Trend Data:
- Name: ${trend?.name || 'Rising Trend'}
- 7d Growth: ${trend?.growth_7d ? `+${(trend.growth_7d * 100).toFixed(0)}%` : '+240%'}
- State: ${trend?.state || 'accelerating'}
- Summary: ${trend?.summary || 'Cultural moment gaining momentum on YouTube and Search.'}
- Evidence: ${JSON.stringify(trend?.evidence || [])}

Creator Profile:
- Creator Name: ${creator?.name || 'Creator'}
- Channel: ${creator?.channel_name || 'Channel'}
- Subscribers: ${creator?.subscribers?.toLocaleString() || '200,000'}
- Tier: ${creator?.tier || 'mid-size'}
- Audience Trust Score: ${trustScore}/100
- Intent Mix: Purchase: ${(purchaseIntent * 100).toFixed(0)}%, Questions: ${((creator?.intent_mix?.question || 0.3) * 100).toFixed(0)}%, Annoyance: ${(annoyanceIntent * 100).toFixed(0)}%
- Ad Style: ${creator?.ad_analysis?.style || 'story-woven'} (${creator?.ad_analysis?.avg_length_sec || 40}s)
- Top Evidence Comment: ${creator?.evidence_comments?.[0]?.text || 'Love your recommendations!'}

GUIDELINES FOR OUTPUT:
1. "trend_card": object with trend_id, trend_name, growth_label (e.g. "+320% this week"), cultural_context (why this is rising now).
2. "key_messages": array of 3 authentic talking points suited to creator's natural content tone. No corporate marketing jargon.
3. "guardrails": array of 3 specific "what NOT to say or do" (anti-cringe rules, avoid forced scripts).
4. "format": precise video segment structure (e.g. "story-woven 40s mid-roll during morning run warm-up").
5. "post_window": specific timely delivery window (e.g. "Thursday - Saturday morning before 8:00 AM weekend club runs").
6. "outreach_message": a warm, peer-to-peer 3-sentence bilateral pitch invite referencing creator's actual recent video and audience trust.
7. "send_time": best estimated time to send based on creator cadence (e.g. "Tuesday 10:15 AM EDT").
8. "deal_type": strictly one of "paid_now", "test_first", "small_test_bonus".
9. "deal_reason": clear justification based on the creator's Audience Trust Score, intent mix, and past sponsor retention.`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                trend_card: {
                  type: Type.OBJECT,
                  properties: {
                    trend_id: { type: Type.STRING },
                    trend_name: { type: Type.STRING },
                    growth_label: { type: Type.STRING },
                    cultural_context: { type: Type.STRING },
                  },
                  required: ['trend_id', 'trend_name', 'growth_label', 'cultural_context'],
                },
                key_messages: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                guardrails: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                format: { type: Type.STRING },
                post_window: { type: Type.STRING },
                outreach_message: { type: Type.STRING },
                send_time: { type: Type.STRING },
                deal_type: {
                  type: Type.STRING,
                  enum: ['paid_now', 'test_first', 'small_test_bonus'],
                },
                deal_reason: { type: Type.STRING },
              },
              required: [
                'trend_card',
                'key_messages',
                'guardrails',
                'format',
                'post_window',
                'outreach_message',
                'send_time',
                'deal_type',
                'deal_reason',
              ],
            },
          },
        }),
        8000
      );

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    }

    // High quality deterministic fallback when no API key configured
    const fallbackBrief = generateFallbackBrief(campaignInfo, trend, creator, baselineDealType);
    return res.json(fallbackBrief);
  } catch (error: any) {
    console.error('Error generating brief with Gemini:', error);
    // Return structured graceful fallback with reason
    const { campaign, trend_id, creator_id } = req.body;
    const trends = loadJsonSafe(trendsPath);
    const creators = loadJsonSafe(creatorsPath);
    const trend = trends.find((t: any) => t.id === trend_id) || trends[0];
    const creator = creators.find((c: any) => c.id === creator_id) || creators[0];
    const fallbackBrief = generateFallbackBrief(campaign, trend, creator, 'paid_now');
    return res.json(fallbackBrief);
  }
});

function generateFallbackBrief(campaign: any, trend: any, creator: any, dealType: string) {
  const brandName = campaign?.brand_name || 'Stride & Co.';
  const productName = campaign?.product_name || 'AeroFoam Long-Run Shoe & Hydration Pack';
  const creatorName = creator?.name || 'Taylor K.';
  const trendName = trend?.name || 'Run Club Socials';
  const growth = trend?.growth_7d ? `+${(trend.growth_7d * 100).toFixed(0)}% this week` : '+320% this week';

  return {
    trend_card: {
      trend_id: trend?.id || 'run-club',
      trend_name: trendName,
      growth_label: growth,
      cultural_context: `${trendName} is surging on Google Search & YouTube as young urban creators replace nightlife with morning community movement and wellness rituals.`,
    },
    key_messages: [
      `Feature ${productName} organically during real preparation, emphasizing subjective comfort without reading rigid ad scripts.`,
      `Highlight how ${brandName} directly supports community members (e.g. sharing sample packs with fellow group attendees).`,
      `Directly answer audience questions about durability and fit, matching the ${creator?.scores?.reception || 82}% audience trust score.`,
    ],
    guardrails: [
      'Never freeze the video for a static unboxing shot; keep camera moving inside the creator\'s natural vlog flow.',
      'Do NOT claim clinical or medical guarantees; focus on genuine personal sensory feel and ease of use.',
      'Avoid corporate buzzwords like "game-changing technology" or scripted sponsor countdowns.',
    ],
    format: `story-woven ${creator?.ad_analysis?.avg_length_sec || 42}s integrated segment inside ${creator?.ad_analysis?.placement || 'mid-roll'} routine`,
    post_window: 'Thursday - Saturday morning (timed 24-48 hours before peak weekend viewer activity)',
    outreach_message: `Hey ${creatorName.split(' ')[0]} — love your authentic take on ${trendName}! Searches are up ${growth} and ${brandName} would love to partner on your upcoming vlog. We prepared this shared brief with zero corporate stiffness and guaranteed creative freedom. Check out the terms and opt in if you'd like to collaborate!`,
    send_time: 'Tuesday 10:15 AM EDT (historically highest response window)',
    deal_type: dealType,
    deal_reason: `Audience Trust Score of ${creator?.scores?.reception || 82}/100 and ${((creator?.intent_mix?.purchase || 0.14) * 100).toFixed(0)}% high-intent purchase comments confirms audience buys on recommendation, justifying ${dealType.replace('_', ' ')}.`,
  };
}

// In development, mount Vite middleware. In production, serve static dist.
async function startServer() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CreatorXchange server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
