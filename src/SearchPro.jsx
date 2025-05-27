import { useState, useEffect } from 'react';
import { dummyData } from './data';

export default function SearchPro() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [cache, setCache] = useState({}); // simple LRU

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim() === '') {
        setResults([]);
        return;
      }

      if (cache[query]) {
        setResults(cache[query]);
      } else {
        const filtered = dummyData.filter(item =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );

        const newCache = { ...cache, [query]: filtered };

        // Keep only last 10 queries (LRU)
        const keys = Object.keys(newCache);
        if (keys.length > 10) delete newCache[keys[0]];

        setCache(newCache);
        setResults(filtered);
      }
    }, 300); // Debounce

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 border rounded mb-4"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <ul className="border rounded">
        {results.map(item => (
          <li key={item.id} className="p-2 border-b last:border-b-0">
            {highlightMatch(item.name, query)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function highlightMatch(text, query) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i}>{part}</mark>
      : <span key={i}>{part}</span>
  );
}
