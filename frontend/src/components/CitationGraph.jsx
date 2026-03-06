import { useState, useEffect, useRef } from 'react';
import { paperAPI } from '../api';

export default function CitationGraph({ paperId, token }) {
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const fetchGraph = async () => {
      try {
        const res = await paperAPI.getCitations(paperId, token);
        if (!mounted) return;
        setGraph(res.data.graph);
      } catch (err) {
        console.warn('Failed to fetch citation graph', err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchGraph();
    return () => { mounted = false; };
  }, [paperId, token]);

  useEffect(() => {
    if (!graph || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    if (!graph.nodes || graph.nodes.length === 0) {
      ctx.fillStyle = '#666';
      ctx.font = '14px sans-serif';
      ctx.fillText('No citation data available', 20, 30);
      return;
    }

    // Simple force-directed layout
    const nodes = graph.nodes.map((n, i) => ({
      ...n,
      x: (i % 3) * (width / 3) + 50,
      y: Math.floor(i / 3) * (height / 2) + 50,
      vx: 0,
      vy: 0
    }));

    const edges = graph.edges || [];

    // Draw edges
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

    // Draw nodes
    nodes.forEach(node => {
      const radius = 20;
      ctx.fillStyle = node.id.startsWith('paper') ? '#3b82f6' : '#10b981';
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label = node.id.startsWith('paper') ? 'Paper' : node.label.slice(0, 10) + '...';
      ctx.fillText(label, node.x, node.y);
    });
  }, [graph]);

  if (loading) {
    return <div className="card text-center text-gray-500">Loading citation graph...</div>;
  }

  if (!graph || !graph.nodes || graph.nodes.length === 0) {
    return <div className="card text-center text-gray-500">No citation graph available</div>;
  }

  return (
    <div className="card">
      <h3 className="font-bold text-lg mb-4">Citation Graph</h3>
      <div className="bg-gray-50 rounded border">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full"
        />
      </div>
      <p className="text-sm text-gray-600 mt-2">
        <span className="inline-block w-4 h-4 bg-blue-500 rounded mr-2"></span>
        Paper
        <span className="inline-block w-4 h-4 bg-green-500 rounded mr-2 ml-4"></span>
        References
      </p>
    </div>
  );
}
