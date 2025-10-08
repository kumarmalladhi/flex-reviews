import type { HostawayReview, NormalizedReview } from '@/lib/types';

function slugify(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function normalizeHostaway(reviews: HostawayReview[]): NormalizedReview[] {
  return reviews.map((r) => {
    const categories: Record<string, number> = {};
    (r.reviewCategory || []).forEach((c) => {
      if (c && c.category) categories[c.category] = c.rating ?? 0;
    });
    const listing = r.listingName || 'unknown-listing';
    const listingSlug = slugify(listing);
    const dto: NormalizedReview = {
      id: String(r.id),
      listing,
      listingSlug,
      channel: r.channel || 'hostaway',
      type: r.type || 'guest-to-host',
      status: r.status || 'published',
      rating: r.rating ?? null,
      categories,
      text: r.publicReview || '',
      submittedAt: (r.submittedAt ? new Date(r.submittedAt).toISOString() : new Date().toISOString())
    };
    return dto;
  });
}
