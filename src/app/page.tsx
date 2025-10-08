'use client';

import { useEffect, useMemo, useState } from 'react';
import Filters from '@/components/Filters';
import ReviewTable from '@/components/ReviewTable';
import type { NormalizedReview, NormalizedResponse } from '@/lib/types';

type FiltersState = {
  listing: 'all' | string;
  channel: 'all' | string;
  category: 'all' | string;
  minRating: number;
  start?: string;
  end?: string;
};

export default function Page() {
  const [data, setData] = useState<NormalizedReview[]>([]);
  const [filters, setFilters] = useState<FiltersState>({
    listing: 'all', channel: 'all', category: 'all', minRating: 0
  });

  useEffect(() => {
    fetch('/api/reviews/hostaway').then(r => r.json()).then((j: NormalizedResponse) => {
      setData(j.result);
    });
  }, []);

  const listings = useMemo(() => Array.from(new Set(data.map(d => d.listing))), [data]);
  const channels = useMemo(() => Array.from(new Set(data.map(d => d.channel))), [data]);
  const categories = useMemo(() => {
    const set = new Set<string>();
    data.forEach(d => Object.keys(d.categories).forEach(c => set.add(c)));
    return Array.from(set);
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter((r) => {
      if (filters.listing !== 'all' && r.listing !== filters.listing) return false;
      if (filters.channel !== 'all' && r.channel !== filters.channel) return false;
      if (filters.category !== 'all' && !(filters.category in r.categories)) return false;
      if ((filters.minRating || 0) > 0 && (r.rating ?? 0) < filters.minRating) return false;
      if (filters.start && new Date(r.submittedAt) < new Date(filters.start)) return false;
      if (filters.end && new Date(r.submittedAt) > new Date(filters.end)) return false;
      return true;
    });
  }, [data, filters]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Reviews Dashboard</h1>
      <p className="text-sm text-gray-400">Filter by listing, channel, category, rating, and date. Approve the reviews you want shown on the property page.</p>
      <Filters
        listings={listings}
        channels={channels}
        categories={categories}
        value={filters}
        onChange={setFilters}
      />
      <ReviewTable rows={filtered} />
    </div>
  );
}
