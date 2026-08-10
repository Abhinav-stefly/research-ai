import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [navHidden, setNavHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastScroll = window.scrollY;
    const onScroll = () => {
      const current = window.scrollY;
      setNavHidden(current > lastScroll && current > 50);
      lastScroll = current;
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative text-[var(--text-primary)] font-sans">
      {/* navbar */}
      <nav
        className={`fixed top-0 w-full backdrop-blur-md bg-black/40 border-b border-white/8 z-50 transition-transform duration-300 ${
          navHidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="max-w-[1100px] mx-auto px-6 flex items-center justify-between h-16">
          <a href="#" className="flex items-center space-x-2">
            <span className="text-xl font-bold">ResearchAI</span>
            <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
          </a>
          <div className="hidden md:flex items-center space-x-4">
            <a href="/login" className="btn-secondary">
              Sign In
            </a>
            <a href="/register" className="btn">
              Get Started Free
            </a>
          </div>
          <button
            className="md:hidden text-[var(--text-secondary)]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-black/50 backdrop-blur-md">
            <a href="/login" className="block py-2 px-6 hover:bg-white/10">
              Sign In
            </a>
            <a href="/register" className="block py-2 px-6 hover:bg-white/10">
              Get Started Free
            </a>
          </div>
        )}
      </nav>

      {/* hero */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden" style={{ background: '#050810' }}>
        <div className="absolute inset-0 -z-10">
          <div className="blob" />
        </div>
        <div className="space-y-6 max-w-3xl">
          <div className="inline-block px-3 py-1 border border-white/20 rounded-full text-sm tracking-wide animate-shimmer">
            ✦ AI-Powered Research Assistant
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Understand Any Research Paper{' '}
            <span className="bg-clip-text text-transparent gradient-text">Instantly</span>
          </h1>
          <p className="text-lg text-[var(--text-muted)] max-w-xl mx-auto">
            Upload a PDF. Get summaries, explanations, citations, and insights powered by AI. Built for researchers who value their time.
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-center gap-4">
            <a href="/register" className="btn btn-lg">
              Start Analyzing Papers →
            </a>
            <a href="#features" className="btn-secondary btn-lg">
              See How It Works
            </a>
          </div>
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-[var(--text-secondary)]">
            Trusted by 2,400+ researchers at 180+ institutions
            <div className="flex -space-x-2">
              <div className="w-6 h-6 bg-white rounded-full border-2 border-black" />
              <div className="w-6 h-6 bg-white rounded-full border-2 border-black" />
              <div className="w-6 h-6 bg-white rounded-full border-2 border-black" />
              <div className="w-6 h-6 bg-white rounded-full border-2 border-black" />
              <div className="w-6 h-6 bg-white rounded-full border-2 border-black" />
            </div>
          </div>
        </div>
        <div className="hero-mockup" />
      </section>

      {/* logos/trust bar */}
      <section className="py-12 bg-[#0a0f1e] text-center text-[var(--text-muted)] text-sm">
        <p>Used by researchers from</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4 font-mono">
          <span>University A</span>
          <span>Institute B</span>
          <span>College C</span>
          <span>Lab D</span>
          <span>Center E</span>
        </div>
      </section>

      {/* features grid */}
      <section id="features" className="py-16 bg-[#0a0f1e] px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <div className="text-sm font-mono text-[var(--accent)] uppercase tracking-wide">FEATURES</div>
            <h2 className="text-3xl font-bold mt-2">From PDF to insights in seconds</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="card flex flex-col space-y-4 hover:scale-105 transition-transform"
              >
                <div className="text-3xl">{f.icon}</div>
                <h3 className="font-bold text-lg">{f.title}</h3>
                <p className="text-[var(--text-muted)] text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="py-16 bg-[#0a0f1e] px-6">
        <div className="max-w-[1100px] mx-auto text-center mb-12">
          <div className="text-sm font-mono text-[var(--accent)] uppercase tracking-wide">HOW IT WORKS</div>
          <h2 className="text-3xl font-bold mt-2">Three steps to paper mastery</h2>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between max-w-[1100px] mx-auto space-y-8 md:space-y-0 md:space-x-8">
          {STEPS.map((s, idx) => (
            <div key={s.title} className="flex-1 flex flex-col items-center text-center">
              <div className="text-6xl font-bold text-[var(--accent)] opacity-20">{idx + 1}</div>
              <div className="text-4xl mb-2">{s.icon}</div>
              <h4 className="font-semibold text-lg">{s.title}</h4>
              <p className="text-[var(--text-muted)] text-sm mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* feature spotlights */}
      <section className="py-16 bg-[#0a0f1e] px-6 space-y-16">
        <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row items-center lg:space-x-12">
          <div className="lg:w-1/2">
            <div className="text-sm font-mono text-[var(--accent)] uppercase tracking-wide">SECTION ANALYSIS</div>
            <h3 className="text-2xl font-bold mt-2">Every section, instantly understood</h3>
            <p className="text-[var(--text-muted)] mt-4">
              ResearchAI automatically detects and segments your paper into its core
              components. Expand any section to read the content, get a word count, and
              request an AI explanation — all in one place.
            </p>
          </div>
          <div className="lg:w-1/2">
            <div className="mockup-section" />
          </div>
        </div>
        <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row-reverse items-center lg:space-x-12">
          <div className="lg:w-1/2">
            <div className="text-sm font-mono text-[var(--accent)] uppercase tracking-wide">MULTI-LEVEL EXPLANATIONS</div>
            <h3 className="text-2xl font-bold mt-2">Explanations that match your level</h3>
            <p className="text-[var(--text-muted)] mt-4">
              Whether you're a first-year student or a domain expert, toggle between
              ELI5 mode for simple analogies and Graduate mode for rigorous technical
              breakdowns.
            </p>
          </div>
          <div className="lg:w-1/2">
            <div className="mockup-toggle" />
          </div>
        </div>
      </section>

      {/* stats bar */}
      <section className="py-12 bg-[#0a0f1e]">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between text-center">
          {STATS.map((s) => (
            <div key={s.label} className="mb-6 md:mb-0">
              <div className="text-3xl font-bold text-white">{s.value}</div>
              <div className="text-[var(--text-muted)] text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* testimonials */}
      <section className="py-16 bg-[#0a0f1e] px-6">
        <div className="max-w-[1100px] mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold">Researchers love ResearchAI</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="card flex flex-col space-y-4">
              <p>“{t.quote}”</p>
              <div className="flex items-center space-x-3 mt-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-bold">{t.initials}</div>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-[var(--text-muted)] text-sm">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* cta banner */}
      <section className="py-16 bg-[#0a0f1e] relative text-center">
        <div className="absolute inset-0 -z-10 radial-blur" />
        <h2 className="text-4xl font-bold">Ready to read smarter?</h2>
        <p className="text-[var(--text-muted)] mt-2">Join thousands of researchers saving hours every week.</p>
        <a href="/register" className="btn btn-lg mt-6">
          Get Started Free →
        </a>
        <p className="text-xs text-[var(--text-muted)] mt-2">No credit card required</p>
      </section>

      {/* footer */}
      <footer className="bg-[#0a0f1e] py-12 text-[var(--text-muted)] text-sm">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold text-white mb-3">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">How it works</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Docs</a></li>
              <li><a href="#" className="hover:text-white">API</a></li>
              <li><a href="#" className="hover:text-white">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Privacy</a></li>
              <li><a href="#" className="hover:text-white">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center">
          © {new Date().getFullYear()} ResearchAI • Built with ❤️ for researchers
        </div>
      </footer>

      <style>{`
        .gradient-text {
          background-image: linear-gradient(135deg, #3b82f6, #8b5cf6);
        }
        .blob {
          position: absolute;
          width: 120%;
          height: 120%;
          top: -10%;
          left: -10%;
          background: radial-gradient(ellipse at center, rgba(59,130,246,0.3), transparent 70%);
          animation: pulse 8s infinite;
        }
        .hero-mockup {
          position: absolute;
          bottom: -20px;
          width: 80%;
          height: 50%;
          background: rgba(17,24,39,0.9);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          backdrop-filter: blur(12px);
          animation: float 4s ease-in-out infinite;
        }
        .mockup-section,
        .mockup-toggle {
          width: 100%;
          height: 300px;
          background: rgba(17,24,39,0.8);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
        }
        .radial-blur {
          background: radial-gradient(circle, rgba(59,130,246,0.2), transparent 60%);
          filter: blur(60px);
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

const FEATURES = [
  {
    icon: '📄',
    title: 'Smart Section Detection',
    desc: 'Automatically identifies Abstract, Introduction, Methodology, Results, and Conclusion',
  },
  {
    icon: '✨',
    title: 'AI Summarization',
    desc: 'Get concise or detailed summaries of every section on demand',
  },
  {
    icon: '🧒',
    title: 'ELI5 & Expert Explanations',
    desc: 'Switch between simple explanations for beginners and deep-dives for experts',
  },
  {
    icon: '∑',
    title: 'Math & LaTeX Parser',
    desc: 'Understands and explains every equation and formula in plain English',
  },
  {
    icon: '🔗',
    title: 'Citation Graph',
    desc: 'Visualizes all references and inline citations as an interactive knowledge graph',
  },
  {
    icon: '🔍',
    title: 'Similar Paper Finder',
    desc: 'Uses semantic embeddings to surface related papers from your library',
  },
];

const STEPS = [
  {
    icon: '⬆️',
    title: 'Upload',
    desc: 'Drag and drop your PDF. We parse it instantly.',
  },
  {
    icon: '⚙️',
    title: 'Analyze',
    desc: 'AI segments sections, generates summaries, and extracts citations.',
  },
  {
    icon: '📘',
    title: 'Understand',
    desc: 'Ask for explanations, explore the citation graph, find related work.',
  },
];

const STATS = [
  { value: '10,000+', label: 'Papers Analyzed' },
  { value: '6', label: 'AI-Powered Features' },
  { value: '2', label: 'Explanation Modes' },
  { value: '< 30s', label: 'Average Analysis Time' },
];

const TESTIMONIALS = [
  {
    quote: 'ResearchAI saved me hours every week – the summaries are incredibly accurate and help me skim huge papers.',
    name: 'Dr. Maya Singh',
    role: 'Postdoc, Quantum Computing Lab',
    initials: 'MS',
  },
  {
    quote: 'I love the ELI5 mode; it makes dense methodology sections understandable for my undergrads.',
    name: 'Prof. Alan Chen',
    role: 'Assistant Professor, Biology',
    initials: 'AC',
  },
  {
    quote: 'The citation graph feature changed how I trace references – a game changer for literature reviews.',
    name: 'Samira’,
    role: 'PhD Candidate, Neuroscience',
    initials: 'S',
  },
];
