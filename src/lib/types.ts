export type ReviewCategory = { category: string; rating: number };
export type HostawayReview = {
  id: number;
  type: string | null;
  status?: string | null;
  rating?: number | null;
  publicReview?: string | null;
  reviewCategory?: ReviewCategory[];
  submittedAt?: string;
  guestName?: string | null;
  listingName?: string;
  channel?: string | null; // airbnb/booking/google/custom
};

export type NormalizedReview = {
  id: string;
  listing: string;         // listing name/slug
  listingSlug: string;
  channel: string;         // airbnb/booking/google/custom
  type: string;            // guest-to-host/host-to-guest
  status: string;
  rating: number | null;   // overall rating if present
  categories: Record<string, number>;
  text: string;
  submittedAt: string;     // ISO date
};

export type NormalizedResponse = {
  status: 'success';
  source: 'hostaway' | 'hostaway-mock' | 'google';
  count: number;
  result: NormalizedReview[];
};
