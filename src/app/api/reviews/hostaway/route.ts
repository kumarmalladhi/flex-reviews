import { NextRequest, NextResponse } from 'next/server';
import { normalizeHostaway } from '@/lib/normalize';
import type { HostawayReview } from '@/lib/types';
import mock from '@/../../data/mockReviews.json';

const HOSTAWAY_BASE = 'https://api.hostaway.com/v1/reviews'; // placeholder

export async function GET(req: NextRequest) {
  const accountId = process.env.HOSTAWAY_ACCOUNT_ID;
  const apiKey = process.env.HOSTAWAY_API_KEY;

  let source: 'hostaway' | 'hostaway-mock' = 'hostaway';
  let items: HostawayReview[] = [];

  try {
    if (accountId && apiKey) {
      // Sandbox likely empty; attempt anyway
      const params = new URLSearchParams({
        accountId: accountId,
        limit: '50'
      });
      const res = await fetch(`${HOSTAWAY_BASE}?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
        // cache: 'no-store'
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json?.result) && json.result.length > 0) {
          items = json.result;
        } else {
          source = 'hostaway-mock';
          items = (mock as any).result as HostawayReview[];
        }
      } else {
        source = 'hostaway-mock';
        items = (mock as any).result as HostawayReview[];
      }
    } else {
      source = 'hostaway-mock';
      items = (mock as any).result as HostawayReview[];
    }
  } catch (e) {
    source = 'hostaway-mock';
    items = (mock as any).result as HostawayReview[];
  }

  const normalized = normalizeHostaway(items);
  return NextResponse.json({ status: 'success', source, count: normalized.length, result: normalized });
}
