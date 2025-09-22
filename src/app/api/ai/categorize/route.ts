import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { CATEGORIES } from '@/lib/tx/categories';
import { normalizeMerchant, suggestCategory } from '@/lib/tx/rules';

const Body = z.object({
  uid: z.string().min(1),
  items: z.array(z.object({ merchant: z.string(), amount: z.number(), memo: z.string().optional() })).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { uid, items } = Body.parse(json);

    // Try Genkit at runtime; if not present or fails, use heuristics
    try {
      const { ai } = await import('@/ai/genkit');
      
      const sys = `You are a finance categorizer. Map transactions to one of these categories: ${CATEGORIES.join(', ')}. Return JSON array of {merchant, amount, suggestedCategory, confidence (0-1), reason}.`;
      const prompt = items.map((t, i) => `${i+1}. merchant="${t.merchant}" amount=${t.amount}`).join('\n');
      
      const out = await ai.generate({
        prompt: prompt,
        model: 'googleai/gemini-1.5-flash',
        config: {
            custom: {role: 'system', content: sys}
        },
        output: { format: 'json' },
      });


      const parsed = safeParseArray(out.text ?? '');
      if (parsed && Array.isArray(parsed) && parsed.length) {
        // Clamp to allowed categories and sanitize shape
        const normalized = parsed.map((r: any) => ({
          merchant: String(r.merchant ?? ''),
          amount: Number(r.amount ?? 0),
          suggestedCategory: clampCategory(String(r.suggestedCategory ?? 'Uncategorized')),
          confidence: Math.max(0, Math.min(1, Number(r.confidence ?? 0.5))),
          reason: String(r.reason ?? ''),
        }));
        return NextResponse.json({ uid, items: normalized }, { status: 200 });
      }
      // fall through to heuristic if model didn’t return JSON
    } catch (_e) {
      // Genkit not configured or model call failed
    }

    // Fallback: rules + heuristics
    const ruleMap = new Map<string, string>(); // Optionally hydrate from Firestore here
    const suggested = items.map((t) => ({
      merchant: t.merchant,
      amount: t.amount,
      suggestedCategory: clampCategory(suggestCategory(t.merchant, t.amount, ruleMap) ?? 'Uncategorized'),
      confidence: 0.35,
      reason: 'Heuristic',
    }));
    return NextResponse.json({ uid, items: suggested }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Bad Request' }, { status: 400 });
  }
}

function clampCategory(x: string) {
  const hit = CATEGORIES.find(c => c.toLowerCase() === String(x).toLowerCase());
  return hit ?? 'Uncategorized';
}

function safeParseArray(s: string) {
  try { return JSON.parse(s); } catch { return null; }
}
