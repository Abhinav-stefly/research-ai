import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getToken } from '../utils';
import { aiAPI, paperAPI } from '../api';
import SummaryTab from '../components/tabs/SummaryTab';
import SectionsTab from '../components/tabs/SectionsTab';
import ExplainTab from '../components/tabs/ExplainTab';
import MathTab from '../components/tabs/MathTab';
import SimilarTab from '../components/tabs/SimilarTab';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function PaperDetail() {
  const { id } = useParams();
  const token = getToken();
  const [activeTab, setActiveTab] = useState('summary');
  const [loading, setLoading] = useState(true);
  const [explainLevel, setExplainLevel] = useState('eli5');
  const [summaries, setSummaries] = useState(null);
  const [highlightSection, setHighlightSection] = useState(null);
  const [reprocessing, setReprocessing] = useState(false);
  // A counter incremented manually to trigger a re-fetch in child tabs
  const [refreshCount, setRefreshCount] = useState(0);

  const tabs = [
    { id: 'summary',  label: 'Summary'       },
    { id: 'sections', label: 'Sections'       },
    { id: 'explain',  label: 'Explain'        },
    { id: 'math',     label: 'Math'           },
    { id: 'similar',  label: 'Similar Papers' },
  ];

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const fetchSummaries = async () => {
      try {
        const res = await aiAPI.summarize(id, 'short', token);
        if (!mounted) return;
        setSummaries(res.data.summaries);
      } catch (err) {
        console.warn('Failed to fetch summaries', err.message);
        if (mounted) setSummaries({});
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSummaries();
    return () => { mounted = false; };
  }, [id, token]);

  const handleReprocess = async () => {
    setReprocessing(true);
    try {
      const res = await paperAPI.reprocess(id, token);
      setSummaries(res.data.paper.summaries);
      // Increment counter so SectionsTab re-fetches once
      setRefreshCount(c => c + 1);
      alert('Paper reprocessed successfully! Sections and summaries have been updated.');
    } catch (err) {
      console.warn('Failed to reprocess paper', err.message);
      alert('Failed to reprocess paper. Please try again.');
    } finally {
      setReprocessing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container">

        {/* Header */}
        <div className="mb-6 relative">
          <h1 className="page-title">Paper Detail</h1>
          <p className="text-[var(--text-muted)]">ID: {id}</p>
          <button
            onClick={handleReprocess}
            disabled={reprocessing}
            className="btn-secondary absolute right-0 top-0 mt-1"
          >
            {reprocessing ? 'Reprocessing...' : 'Reprocess Paper'}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="tabs-bar mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? 'tab tab-active' : 'tab'}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Explanation level toggle — shown for sections & explain tabs */}
        {(activeTab === 'explain' || activeTab === 'sections') && (
          <div className="card mb-6">
            <label className="text-sm code-label mr-4">Explanation Level:</label>
            <select
              value={explainLevel}
              onChange={(e) => setExplainLevel(e.target.value)}
              className="input max-w-xs"
            >
              <option value="eli5">ELI5 (Simple)</option>
              <option value="graduate">Graduate (Advanced)</option>
            </select>
          </div>
        )}

        {/* Tab Content */}
        <div>
          {loading && <div className="card"><LoadingSkeleton lines={6} /></div>}

          {!loading && (
            <>
              {activeTab === 'summary' && (
                <SummaryTab
                  paperId={id}
                  token={token}
                  summaries={summaries}
                  onHighlight={setHighlightSection}
                />
              )}

              {activeTab === 'sections' && (
                <SectionsTab
                  paperId={id}
                  level={explainLevel}
                  token={token}
                  highlight={highlightSection}
                  refreshTrigger={refreshCount}   // ✅ only changes when reprocess runs
                />
              )}

              {activeTab === 'explain' && (
                <ExplainTab paperId={id} level={explainLevel} token={token} />
              )}

              {activeTab === 'math' && (
                <MathTab paperId={id} level={explainLevel} token={token} />
              )}

              {activeTab === 'similar' && (
                <SimilarTab paperId={id} token={token} />
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}