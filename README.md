# Flex Reviews (Demo)

A small Next.js app that provides a reviews API and a simple dashboard to approve and manage which reviews are displayed for each property.

## Tech stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Minimal serverless API routes

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

## Deployment (Vercel)

1. Create a new Vercel project and import this repo.
2. Add environment variables in Vercel:
   - `HOSTAWAY_ACCOUNT_ID` – provided
   - `HOSTAWAY_API_KEY` – provided
   - (optional) `GOOGLE_MAPS_API_KEY` – if you want Google reviews
3. Deploy. The app exposes:
   - `GET /api/reviews/hostaway` – normalized reviews
   - `GET /api/reviews/google?placeId=...` – basic Google reviews (optional)
   - Dashboard at `/`
   - Property page at `/property/[slug]`

## Notes

- The Hostaway sandbox returns no reviews, so the API route falls back to a realistic mock found in `data/mockReviews.json`.
- Approvals are kept in `localStorage` per listing (so you can demo end-to-end without a database).
- Normalized schema returned by `/api/reviews/hostaway`:

```json
{
  "status": "success",
  "source": "hostaway-mock",
  "count": 3,
  "result": [
    {
      "id": "101",
      "listing": "Loft A - Central",
      "listingSlug": "loft-a-central",
      "channel": "airbnb",
      "type": "guest-to-host",
      "status": "published",
      "rating": 4.8,
      "categories": { "cleanliness": 10, "communication": 9 },
      "text": "Clean place and easy check-in.",
      "submittedAt": "2023-11-12T10:15:00.000Z"
    }
  ]
}
```

## Google Reviews (exploration)

- Places Details can return up to 5 recent reviews when you include `fields=reviews`.
- API route included: `/api/reviews/google?placeId=...`. Requires `GOOGLE_MAPS_API_KEY` with Places API enabled.
- If you can’t enable the API on your account, document the approach instead (this route will return an error if no key is set).

## AI tool disclosure

- The initial project structure and boilerplate were generated using ChatGPT for speed. All logic, data, and deployment setup were manually reviewed and refined by me (Sam Malladi)

