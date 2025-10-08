'use client';

type Props = {
  listings: string[];
  channels: string[];
  categories: string[];
  value: {
    listing: string | 'all';
    channel: string | 'all';
    minRating: number | 0;
    category: string | 'all';
    start?: string;
    end?: string;
  };
  onChange: (v: Props['value']) => void;
};

export default function Filters({ listings, channels, categories, value, onChange }: Props) {
  function set<K extends keyof Props['value']>(k: K, v: Props['value'][K]) {
    onChange({ ...value, [k]: v });
  }
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
      <select className="select" value={value.listing} onChange={(e) => set('listing', e.target.value as any)}>
        <option value="all">All listings</option>
        {listings.map((l) => <option key={l} value={l}>{l}</option>)}
      </select>
      <select className="select" value={value.channel} onChange={(e) => set('channel', e.target.value as any)}>
        <option value="all">All channels</option>
        {channels.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <select className="select" value={value.category} onChange={(e) => set('category', e.target.value as any)}>
        <option value="all">All categories</option>
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <input className="input" type="number" step="0.1" placeholder="Min rating" value={value.minRating}
             onChange={(e) => set('minRating', Number(e.target.value) || 0)} />
      <input className="input" type="date" value={value.start || ''} onChange={(e) => set('start', e.target.value)} />
      <input className="input" type="date" value={value.end || ''} onChange={(e) => set('end', e.target.value)} />
    </div>
  );
}
