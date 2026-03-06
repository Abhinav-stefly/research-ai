import { useState, useEffect } from 'react';
import { paperAPI, aiAPI } from '../../api';

const SECTION_META = {
  abstract:     { label: 'Abstract',     icon: '📄', color: 'blue'    },
  introduction: { label: 'Introduction', icon: '🔍', color: 'indigo'  },
  methodology:  { label: 'Methodology',  icon: '⚙️',  color: 'violet'  },
  results:      { label: 'Results',      icon: '📊', color: 'emerald' },
  conclusion:   { label: 'Conclusion',   icon: '🏁', color: 'amber'   },
};

const COLORS = {
  blue:    { ring: 'ring-blue-400',    badge: 'bg-blue-100 text-blue-700',       dot: 'bg-blue-400'    },
  indigo:  { ring: 'ring-indigo-400',  badge: 'bg-indigo-100 text-indigo-700',   dot: 'bg-indigo-400'  },
  violet:  { ring: 'ring-violet-400',  badge: 'bg-violet-100 text-violet-700',   dot: 'bg-violet-400'  },
  emerald: { ring: 'ring-emerald-400', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400' },
  amber:   { ring: 'ring-amber-400',   badge: 'bg-amber-100 text-amber-700',     dot: 'bg-amber-400'   },
};

function SectionCard({ sectionKey, meta, content, highlight, level, onExplain, explaining, explanation }) {
  const [open, setOpen] = useState(false);
  const colors = COLORS[meta.color] || COLORS.blue;
  const hasContent = typeof content === 'string' && content.trim().length > 0;
  const wordCount = hasContent ? content.trim().split(/\s+/).length : 0;
  const isHighlighted = highlight === sectionKey;

  useEffect(() => {
    if (isHighlighted && hasContent) setOpen(true);
  }, [isHighlighted, hasContent]);

  return (
    <div
      id={`section-${sectionKey}`}
      className={`rounded-2xl border bg-white shadow-sm transition-all duration-200 overflow-hidden
        ${isHighlighted ? `ring-2 ${colors.ring} border-transparent` : 'border-gray-100'}
        ${!hasContent ? 'opacity-60' : 'hover:shadow-md'}`}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => hasContent && setOpen(v => !v)}
        className={`w-full flex items-center justify-between gap-3 px-5 py-4 text-left
          ${hasContent ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xl shrink-0">{meta.icon}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900 text-base">{meta.label}</span>
              {hasContent ? (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.badge}`}>
                  {wordCount.toLocaleString()} words
                </span>
              ) : (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                  Not detected
                </span>
              )}
            </div>
            {hasContent && !open && (
              <p className="text-sm text-gray-400 mt-0.5 truncate max-w-lg">
                {content.trim().slice(0, 160)}…
              </p>
            )}
          </div>
        </div>
        {hasContent && (
          <span className={`text-gray-400 shrink-0 transition-transform duration-200 text-sm ${open ? 'rotate-180' : ''}`}>
            ▾
          </span>
        )}
      </button>

      {/* Body */}
      {open && hasContent && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-50">
          <div className="mt-4 bg-gray-50 rounded-xl p-4 max-h-80 overflow-y-auto">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
              {content}
            </p>
          </div>

          {explanation && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-2">
                {level === 'eli5' ? '🧒 Simple Explanation' : '🎓 Detailed Explanation'}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {explanation}
              </p>
            </div>
          )}

          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => onExplain(sectionKey, content)}
              disabled={explaining === sectionKey}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {explaining === sectionKey
                ? '✨ Explaining…'
                : explanation
                  ? '🔁 Re-explain'
                  : `✨ Explain ${level === 'eli5' ? 'Simply' : 'in Detail'}`}
            </button>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(content)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              📋 Copy
            </button>
          </div>
        </div>
      )}

      {!hasContent && (
        <p className="px-5 pb-4 text-sm text-gray-400">
          Could not be automatically detected in this paper.
        </p>
      )}
    </div>
  );
}

export default function SectionsTab({ paperId, level, token, highlight, refreshTrigger }) {
  const [sections, setSections]         = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [explaining, setExplaining]     = useState(null);
  const [explanations, setExplanations] = useState({});
  const [reprocessing, setReprocessing] = useState(false);

  useEffect(() => {
    if (!paperId) {
      setError('No paper ID provided.');
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    const fetchSections = async () => {
      try {
        const res = await paperAPI.getPaper(paperId, token);
        if (!mounted) return;

        // Handle all possible response shapes from the backend
        const paper = res?.data?.paper ?? res?.data ?? {};
        const fetched = paper.sections ?? {};

        setSections(fetched);
      } catch (err) {
        if (!mounted) return;
        const msg = err?.response?.data?.message || err?.message || 'Failed to load sections.';
        setError(msg);
        console.error('[SectionsTab] fetch error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSections();
    return () => { mounted = false; };
  }, [paperId, token, refreshTrigger]); // refreshTrigger is now a counter, not Date.now()

  const handleReprocess = async () => {
    setReprocessing(true);
    try {
      // ✅ correct method name from api.js: paperAPI.reprocess (not reprocessPaper)
      const res = await paperAPI.reprocess(paperId, token);
      const newSections = res?.data?.paper?.sections ?? res?.data?.sections ?? null;
      if (newSections) {
        setSections(newSections);
      } else {
        // Fallback: re-fetch
        const r = await paperAPI.getPaper(paperId, token);
        const paper = r?.data?.paper ?? r?.data ?? {};
        setSections(paper.sections ?? {});
      }
    } catch (err) {
      console.error('[SectionsTab] reprocess error:', err);
    } finally {
      setReprocessing(false);
    }
  };

  const handleExplain = async (sectionName, content) => {
    if (!content?.trim()) return;
    setExplaining(sectionName);
    try {
      const res = await aiAPI.explain(content, level, token);
      const explanation = res?.data?.explanation || 'No explanation returned.';
      setExplanations(prev => ({ ...prev, [sectionName]: explanation }));
    } catch (err) {
      console.error('[SectionsTab] explain error:', err);
      setExplanations(prev => ({
        ...prev,
        [sectionName]: '⚠️ Failed to generate explanation. Please try again.',
      }));
    } finally {
      setExplaining(null);
    }
  };

  // ── Loading skeleton ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-3">
        {Object.keys(SECTION_META).map(key => (
          <div key={key} className="rounded-2xl border border-gray-100 bg-white p-5 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gray-200" />
              <div className="h-4 w-28 rounded bg-gray-200" />
              <div className="h-4 w-16 rounded-full bg-gray-100 ml-1" />
            </div>
            <div className="space-y-2">
              <div className="h-3 rounded bg-gray-100 w-full" />
              <div className="h-3 rounded bg-gray-100 w-5/6" />
              <div className="h-3 rounded bg-gray-100 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
        <p className="text-2xl mb-3">⚠️</p>
        <p className="font-semibold text-red-700 mb-1">Failed to load sections</p>
        <p className="text-sm text-red-400 mb-5">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
        >
          Reload page
        </button>
      </div>
    );
  }

  const safeSections = sections || {};
  const filledCount = Object.keys(SECTION_META)
    .filter(k => safeSections[k]?.trim().length > 0).length;

  return (
    <div className="space-y-4">

      {/* Stats bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="font-semibold text-gray-700">{filledCount}</span>
          <span>of {Object.keys(SECTION_META).length} sections detected</span>
          <div className="flex gap-1 ml-1">
            {Object.entries(SECTION_META).map(([key, meta]) => {
              const colors = COLORS[meta.color];
              const filled = !!(safeSections[key]?.trim());
              return (
                <div key={key} title={meta.label}
                  className={`w-2 h-2 rounded-full ${filled ? colors.dot : 'bg-gray-200'}`}
                />
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={handleReprocess}
          disabled={reprocessing}
          className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium transition-colors disabled:opacity-50"
        >
          {reprocessing ? '⏳ Reprocessing…' : '🔄 Retry Detection'}
        </button>
      </div>

      {/* Section cards */}
      {Object.entries(SECTION_META).map(([sectionKey, meta]) => (
        <SectionCard
          key={sectionKey}
          sectionKey={sectionKey}
          meta={meta}
          content={safeSections[sectionKey] || ''}
          highlight={highlight}
          level={level}
          onExplain={handleExplain}
          explaining={explaining}
          explanation={explanations[sectionKey]}
        />
      ))}

      {/* Global empty state */}
      {filledCount === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
          <p className="text-4xl mb-3">🔬</p>
          <p className="font-semibold text-gray-700 mb-1">No sections detected</p>
          <p className="text-sm text-gray-400 mb-5">
            The paper may use unconventional heading formats. Try reprocessing.
          </p>
          <button
            type="button"
            onClick={handleReprocess}
            disabled={reprocessing}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {reprocessing ? '⏳ Reprocessing…' : '🔄 Retry Section Detection'}
          </button>
        </div>
      )}
    </div>
  );
}