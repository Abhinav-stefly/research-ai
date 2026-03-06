import { useState, useEffect } from 'react';
import { paperAPI } from '../api';

export default function CitationPreview({ paperId, raw }) {
  const [visible, setVisible] = useState(false);
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    if (!visible) return;
    let mounted = true;
    (async () => {
      try {
        const res = await paperAPI.getCitations(paperId, localStorage.getItem('token'));
        const refs = res.data.extracted.references || [];
        // try to find a matching reference by looking for numbers in raw like [1]
        const m = raw.match(/\[(\d+)\]/);
        if (m) {
          const idx = parseInt(m[1], 10);
          const found = refs.find(r => r.index === idx);
          if (mounted) setEntry(found || null);
        } else {
          // match by text content
          const found = refs.find(r => r.raw && raw && r.raw.toLowerCase().includes(raw.replace(/[()\[\]]/g,'').toLowerCase()));
          if (mounted) setEntry(found || null);
        }
      } catch (err) {
        console.warn('Citation preview fetch failed', err.message);
      }
    })();
    return () => { mounted = false; };
  }, [visible, paperId, raw]);

  return (
    <span className="relative">
      <span
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="text-blue-600 underline cursor-help"
      >
        {raw}
      </span>
      {visible && (
        <div className="absolute z-50 mt-8 left-0 w-80 card text-left">
          {entry ? (
            <div>
              <div className="text-sm text-gray-600 mb-2">Reference #{entry.index}</div>
              <div className="text-sm text-gray-800">{entry.raw}</div>
            </div>
          ) : (
            <div className="text-sm text-gray-600">No preview available</div>
          )}
        </div>
      )}
    </span>
  );
}
