'use client';

import { useEffect, useMemo, useState } from 'react';
import type { NormalizedReview, NormalizedResponse } from '@/lib/types';
import Link from 'next/link';

function approvedKey(listingSlug: string) { return `approved:${listingSlug}`; }

export default function PropertyPage({ params }: { params: { slug: string }}) {
  const slug = params.slug;
  const [data, setData] = useState<NormalizedReview[]>([]);

  useEffect(() => {
    fetch('/api/reviews/hostaway').then(r => r.json()).then((j: NormalizedResponse) => setData(j.result));
  }, []);

  const listing = useMemo(() => data.find(d => d.listingSlug === slug)?.listing || slug, [data, slug]);
  const approved = useMemo(() => new Set<string>(JSON.parse(localStorage.getItem(approvedKey(slug)) || '[]')), [slug]);

  const visible = useMemo(() => data.filter(d => d.listingSlug === slug && approved.has(d.id)), [data, slug, approved]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{listing}</h1>
        <Link className="badge hover:text-white" href="/">Back to dashboard</Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card">
          <div className="mb-4">
            <div className="font-medium">About this property</div>
            <p className="text-sm text-gray-400">Simple layout to mimic the property page. The reviews section below only shows items approved on the dashboard.</p>
          </div>

          <div className="space-y-3">
            <div className="font-medium">Guest Reviews</div>
            {visible.length === 0 ? (
              <div className="text-sm text-gray-400">No reviews selected to display.</div>
            ) : (
              <ul className="space-y-3">
                {visible.map((r) => (
                  <li key={r.id} className="border border-gray-800 rounded-md p-3">
                    <div className="text-sm text-gray-400">{new Date(r.submittedAt).toLocaleDateString()} • <span className="capitalize">{r.channel}</span> • {r.rating ?? '—'}★</div>
                    <div className="mt-1">{r.text}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(r.categories).map(([k,v]) => (
                        <span key={k} className="badge">{k}: {v}</span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside className="card">
          <div className="font-medium">Summary</div>
          <div className="mt-2 text-sm text-gray-400">This panel could hold photos, amenities or a booking widget. For the exercise it’s just placeholder content.</div>
        </aside>
      </div>
    </div>
  );
}
