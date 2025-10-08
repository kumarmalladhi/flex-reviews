import { NextRequest, NextResponse } from 'next/server';

const BASE = 'https://maps.googleapis.com/maps/api/place/details/json';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get('placeId');
  const key = process.env.GOOGLE_MAPS_API_KEY;

  if (!placeId || !key) {
    return NextResponse.json({ status: 'error', message: 'Missing placeId or GOOGLE_MAPS_API_KEY' }, { status: 400 });
  }

  const url = `${BASE}?place_id=${encodeURIComponent(placeId)}&fields=reviews,rating,user_ratings_total,url&key=${key}`;
  const res = await fetch(url);
  const data = await res.json();

  const reviews = (data?.result?.reviews || []).map((r: any, idx: number) => ({
    id: String(idx + 1),
    listing: 'google-place',
    listingSlug: 'google-place',
    channel: 'google',
    type: 'guest-to-host',
    status: 'published',
    rating: r.rating ?? null,
    categories: {} as Record<string, number>,
    text: r.text || '',
    submittedAt: r.time ? new Date(r.time * 1000).toISOString() : new Date().toISOString()
  }));

  return NextResponse.json({ status: 'success', source: 'google', count: reviews.length, result: reviews });
}
