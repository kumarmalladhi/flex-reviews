'use client';
import Link from 'next/link';

type Row = {
  id: string;
  listing: string;
  listingSlug: string;
  channel: string;
  rating: number | null;
  categories: Record<string, number>;
  text: string;
  submittedAt: string;
};

function approvedKey(listingSlug: string) {
  return `approved:${listingSlug}`;
}

function useApproved(listingSlug: string) {
  const key = approvedKey(listingSlug);
  const getSet = () => new Set<string>(JSON.parse(localStorage.getItem(key) || '[]'));
  function isApproved(id: string) { return getSet().has(id); }
  function toggle(id: string) {
    const s = getSet();
    if (s.has(id)) s.delete(id); else s.add(id);
    localStorage.setItem(key, JSON.stringify([...s]));
  }
  function clear() { localStorage.setItem(key, JSON.stringify([])); }
  return { isApproved, toggle, clear, key };
}

export default function ReviewTable({ rows }: { rows: Row[] }) {
  const byListing = rows.reduce((acc, r) => {
    acc[r.listingSlug] = acc[r.listingSlug] || { name: r.listing, items: [] as Row[] };
    acc[r.listingSlug].items.push(r);
    return acc;
  }, {} as Record<string, { name: string, items: Row[] }>) ;

  return (
    <div className="space-y-8">
      {Object.entries(byListing).map(([slug, { name, items }]) => {
        const { isApproved, toggle, clear } = useApproved(slug);
        return (
          <div key={slug} className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">{name}</div>
              <div className="flex items-center gap-3 text-sm">
                <Link className="badge hover:text-white" href={`/property/${slug}`}>View property page</Link>
                <button className="badge hover:text-white" onClick={clear}>Clear approvals</button>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Channel</th>
                  <th>Rating</th>
                  <th>Categories</th>
                  <th>Text</th>
                  <th>Approved</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r.id}>
                    <td>{new Date(r.submittedAt).toLocaleDateString()}</td>
                    <td className="capitalize">{r.channel}</td>
                    <td>{r.rating ?? '—'}</td>
                    <td className="max-w-[200px]">
                      <div className="flex flex-wrap gap-1">{Object.entries(r.categories).map(([k,v]) => (
                        <span key={k} className="badge">{k}: {v}</span>
                      ))}</div>
                    </td>
                    <td className="max-w-[420px]">{r.text}</td>
                    <td>
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked={isApproved(r.id)} onChange={() => toggle(r.id)} />
                        <span className="text-xs text-gray-400">Show on site</span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
