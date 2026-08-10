import { useState, useEffect, useRef } from 'react';
import { paperAPI } from '../api';
import { getToken } from '../utils';

export default function CitationGraph({ paperId, token }) {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!paperId) {
      setGraph({ nodes: [], edges: [] });
      setLoading(false);
      return;
    }

    let mounted = true;
    const fetchGraph = async () => {
      try {
        const authToken = token || getToken();
        const res = await paperAPI.getCitations(paperId, authToken);
        if (!mounted) return;

        const graphData = res?.data?.graph || { nodes: [], edges: [] };
        setGraph({
          nodes: Array.isArray(graphData.nodes) ? graphData.nodes : [],
          edges: Array.isArray(graphData.edges) ? graphData.edges : []
        });
      } catch (err) {
        console.warn('Failed to fetch citation graph', err.message);
        if (mounted) setGraph({ nodes: [], edges: [] });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchGraph();
    return () => { mounted = false; };
  }, [paperId, token]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    if (!graph.nodes || graph.nodes.length === 0) {
      ctx.fillStyle = '#666';
      ctx.font = '14px sans-serif';
      ctx.fillText('No citation data available', 20, 30);
      return;
    }

    const nodes = graph.nodes.map((n, i) => ({
      ...n,
      x: (i % 3) * (width / 3) + 50,
      y: Math.floor(i / 3) * (height / 2) + 50,
      vx: 0,
      vy: 0
    }));

    const edges = graph.edges || [];

    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
      }
    });

    nodes.forEach(node => {
      const radius = 20;
      ctx.fillStyle = node.id?.startsWith('paper') ? '#3b82f6' : '#10b981';
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label = node.id?.startsWith('paper') ? 'Paper' : (node.label || 'Ref').slice(0, 10) + '...';
      ctx.fillText(label, node.x, node.y);
    });
  }, [graph]);

  if (loading) {
    return <div className="card text-center text-[var(--text-muted)]">Loading citation graph...</div>;
  }

  if (!graph || !graph.nodes || graph.nodes.length === 0) {
    return <div className="card text-center text-[var(--text-muted)]">No citation graph available</div>;
  }

  return (
    <div className="card">
      <h3 className="section-header mb-4">Citation Graph</h3>
      <div className="bg-[#0d1117] rounded border border-[var(--border)]">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full"
        />
      </div>
      <p className="text-sm text-[var(--text-secondary)] mt-2">
        <span className="inline-block w-4 h-4 bg-[var(--accent)] rounded mr-2"></span>
        Paper
        <span className="inline-block w-4 h-4 bg-green-500 rounded mr-2 ml-4"></span>
        References
      </p>
    </div>
  );
}
