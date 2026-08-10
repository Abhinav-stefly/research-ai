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
    <div style={{ background: '#050810', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 50,
        backdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.5)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        transform: navHidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.3s ease'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#f1f5f9' }}>
            <span style={{ fontSize: 20, fontWeight: 700 }}>ResearchAI</span>
            <span style={{ width: 8, height: 8, background: '#3b82f6', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          </a>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }} className="desktop-nav">
            <a href="/login" style={ghostBtnStyle}>Sign In</a>
            <a href="/register" style={primaryBtnStyle}>Get Started Free</a>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 22, cursor: 'pointer', display: 'none' }}
            className="mobile-menu-btn"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
        {menuOpen && (
          <div style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', padding: '12px 0' }}>
            <a href="/login" style={{ display: 'block', padding: '10px 24px', color: '#94a3b8', textDecoration: 'none' }}>Sign In</a>
            <a href="/register" style={{ display: 'block', padding: '10px 24px', color: '#f1f5f9', textDecoration: 'none' }}>Get Started Free</a>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        padding: '120px 24px 80px', position: 'relative', overflow: 'hidden',
        background: '#050810'
      }}>
        {/* Animated blob */}
        <div style={{
          position: 'absolute', width: '800px', height: '800px',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.25) 0%, rgba(139,92,246,0.1) 40%, transparent 70%)',
          borderRadius: '50%', animation: 'blobPulse 8s ease-in-out infinite', zIndex: 0, pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-block', padding: '6px 16px', marginBottom: 28,
            border: '1px solid rgba(59,130,246,0.4)', borderRadius: 999,
            fontSize: 13, color: '#93c5fd', letterSpacing: '0.05em',
            background: 'rgba(59,130,246,0.08)'
          }}>
            ✦ AI-Powered Research Assistant
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, margin: '0 0 24px', letterSpacing: '-1.5px' }}>
            Understand Any Research Paper{' '}
            <span style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Instantly
            </span>
          </h1>

          {/* Subheadline */}
          <p style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 40px' }}>
            Upload a PDF. Get summaries, explanations, citations, and insights powered by AI. Built for researchers who value their time.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            <a href="/register" style={{ ...primaryBtnStyle, fontSize: 16, padding: '14px 28px' }}>
              Start Analyzing Papers →
            </a>
            <a href="#features" style={{ ...ghostBtnStyle, fontSize: 16, padding: '14px 28px' }}>
              See How It Works
            </a>
          </div>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#64748b', fontSize: 14 }}>
            <div style={{ display: 'flex' }}>
              {['#6366f1','#8b5cf6','#3b82f6','#06b6d4','#10b981'].map((c, i) => (
                <div key={i} style={{
                  width: 30, height: 30, borderRadius: '50%', background: c,
                  border: '2px solid #050810', marginLeft: i === 0 ? 0 : -8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#fff'
                }}>
                  {['R','A','K','S','M'][i]}
                </div>
              ))}
            </div>
            <span>Trusted by 2,400+ researchers at 180+ institutions</span>
          </div>
        </div>

        {/* Floating mockup card */}
        <div style={{
          marginTop: 64, width: '100%', maxWidth: 720, position: 'relative', zIndex: 1,
          background: 'rgba(17,24,39,0.9)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: '24px 28px', animation: 'float 4s ease-in-out infinite',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.1)'
        }}>
          <div style={{ fontSize: 12, color: '#475569', marginBottom: 16, fontFamily: 'monospace', letterSpacing: '0.1em' }}>
            ANALYZING: transformer_attention_2024.pdf
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Abstract', color: '#3b82f6', done: true },
              { label: 'Introduction', color: '#6366f1', done: true },
              { label: 'Methodology', color: '#8b5cf6', done: true },
              { label: 'Results', color: '#10b981', done: false },
              { label: 'Conclusion', color: '#f59e0b', done: false },
            ].map((s, i) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12, animation: `fadeIn 0.4s ease ${i * 0.15}s both` }}>
                <div style={{ width: 3, height: 28, background: s.color, borderRadius: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: s.done ? '#f1f5f9' : '#475569', flex: 1 }}>{s.label}</span>
                {s.done
                  ? <span style={{ fontSize: 11, color: s.color, fontFamily: 'monospace', fontWeight: 700 }}>✓ DETECTED</span>
                  : <span style={{ fontSize: 11, color: '#334155', fontFamily: 'monospace' }}>scanning...</span>
                }
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section style={{ padding: '32px 24px', background: '#0a0f1e', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#475569', letterSpacing: '0.1em', fontFamily: 'monospace', marginBottom: 16 }}>USED BY RESEARCHERS FROM</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 32px' }}>
          {['MIT', 'Stanford', 'Oxford', 'ETH Zürich', 'Caltech', 'Cambridge'].map(name => (
            <span key={name} style={{ fontSize: 14, color: '#334155', fontFamily: 'monospace', fontWeight: 600 }}>{name}</span>
          ))}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" style={{ padding: '96px 24px', background: '#0a0f1e' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#3b82f6', letterSpacing: '0.15em', marginBottom: 12 }}>FEATURES</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, letterSpacing: '-0.5px', margin: 0 }}>From PDF to insights in seconds</h2>
            <p style={{ color: '#64748b', marginTop: 12, fontSize: 16 }}>Everything you need to understand research — in one place.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: 28, transition: 'all 0.2s ease', cursor: 'default'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(59,130,246,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#f1f5f9' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: '96px 24px', background: '#080d1a' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#3b82f6', letterSpacing: '0.15em', marginBottom: 12 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, letterSpacing: '-0.5px', margin: 0 }}>Three steps to paper mastery</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 48, position: 'relative' }}>
            {STEPS.map((s, i) => (
              <div key={s.title} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ fontSize: 72, fontWeight: 800, color: 'rgba(59,130,246,0.12)', lineHeight: 1, marginBottom: 8, fontFamily: 'monospace' }}>
                  0{i + 1}
                </div>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{s.icon}</div>
                <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#f1f5f9' }}>{s.title}</h4>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                {i < STEPS.length - 1 && (
                  <div style={{
                    position: 'absolute', top: 40, right: '-24px',
                    color: '#1e3a5f', fontSize: 20, display: 'none'
                  }} className="step-arrow">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Spotlights ── */}
      <section style={{ padding: '96px 24px', background: '#0a0f1e' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 96 }}>

          {/* Spotlight 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#3b82f6', letterSpacing: '0.15em', marginBottom: 12 }}>SECTION ANALYSIS</div>
              <h3 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 16 }}>Every section, instantly understood</h3>
              <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: 15 }}>
                ResearchAI automatically detects and segments your paper into its core components. Expand any section to read the content, get a word count, and request an AI explanation — all in one place.
              </p>
            </div>
            <div style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24 }}>
              {[
                { name: 'Abstract', words: '312 words', color: '#3b82f6' },
                { name: 'Introduction', words: '1,204 words', color: '#6366f1' },
                { name: 'Methodology', words: '2,891 words', color: '#8b5cf6' },
                { name: 'Results', words: '1,543 words', color: '#10b981' },
              ].map(sec => (
                <div key={sec.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: 3, height: 32, background: sec.color, borderRadius: 2, flexShrink: 0 }} />
                  <span style={{ fontWeight: 600, fontSize: 14, flex: 1, color: '#e2e8f0' }}>{sec.name}</span>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: sec.color, background: `${sec.color}15`, padding: '3px 8px', borderRadius: 4 }}>{sec.words}</span>
                  <span style={{ color: '#334155', fontSize: 16 }}>▾</span>
                </div>
              ))}
            </div>
          </div>

          {/* Spotlight 2 — reversed */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center' }}>
            <div style={{ order: 2 }}>
              <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#8b5cf6', letterSpacing: '0.15em', marginBottom: 12 }}>MULTI-LEVEL EXPLANATIONS</div>
              <h3 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 16 }}>Explanations that match your level</h3>
              <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: 15 }}>
                Whether you're a first-year student or a domain expert, toggle between ELI5 mode for simple analogies and Graduate mode for rigorous technical breakdowns.
              </p>
            </div>
            <div style={{ order: 1, background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24 }}>
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 4, marginBottom: 20 }}>
                <div style={{ flex: 1, textAlign: 'center', padding: '8px 0', background: '#3b82f6', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>🧒 Simple (ELI5)</div>
                <div style={{ flex: 1, textAlign: 'center', padding: '8px 0', fontSize: 13, color: '#475569' }}>🎓 Graduate</div>
              </div>
              <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 8, padding: 16 }}>
                <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
                  "Think of an autoencoder like a game of telephone — it squishes all the information into a tiny secret code, then tries to rebuild the original message from that code. If something weird happens in the data, it can't rebuild it well, so we know something unusual occurred!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section style={{ padding: '64px 24px', background: 'linear-gradient(180deg, #080d1a, #0a0f1e)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, textAlign: 'center' }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-1px', background: 'linear-gradient(135deg, #f1f5f9, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#475569', marginTop: 6, fontFamily: 'monospace', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: '96px 24px', background: '#0a0f1e' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, letterSpacing: '-0.5px', margin: 0 }}>Researchers love ResearchAI</h2>
            <p style={{ color: '#64748b', marginTop: 12 }}>Don't take our word for it.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: 28, display: 'flex', flexDirection: 'column', gap: 20
              }}>
                <div style={{ color: '#3b82f6', fontSize: 24, lineHeight: 1 }}>"</div>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, margin: 0, flex: 1 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: `linear-gradient(135deg, ${['#3b82f6','#8b5cf6','#10b981'][i]}, ${['#6366f1','#ec4899','#06b6d4'][i]})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, color: '#fff'
                  }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#475569' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ padding: '96px 24px', background: '#080d1a', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(59,130,246,0.2), transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>Ready to read smarter?</h2>
          <p style={{ color: '#64748b', fontSize: 18, marginBottom: 40 }}>Join thousands of researchers saving hours every week.</p>
          <a href="/register" style={{ ...primaryBtnStyle, fontSize: 17, padding: '16px 36px', display: 'inline-block' }}>
            Get Started Free →
          </a>
          <p style={{ fontSize: 12, color: '#334155', marginTop: 16 }}>No credit card required</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#050810', padding: '64px 24px 32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 40, marginBottom: 48 }}>
            {FOOTER_LINKS.map(col => (
              <div key={col.heading}>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 16, letterSpacing: '0.05em' }}>{col.heading}</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map(l => (
                    <li key={l}><a href="#" style={{ fontSize: 13, color: '#475569', textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#f1f5f9'}
                      onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                    >{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, textAlign: 'center', fontSize: 13, color: '#334155' }}>
            © {new Date().getFullYear()} ResearchAI &nbsp;•&nbsp; Built with ❤️ for researchers
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes blobPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const primaryBtnStyle = {
  background: '#3b82f6', color: '#fff', border: 'none',
  borderRadius: 8, padding: '11px 22px', fontSize: 14, fontWeight: 600,
  cursor: 'pointer', textDecoration: 'none', display: 'inline-block',
  transition: 'all 0.2s ease',
};

const ghostBtnStyle = {
  background: 'transparent', color: '#94a3b8',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 8, padding: '11px 22px', fontSize: 14, fontWeight: 500,
  cursor: 'pointer', textDecoration: 'none', display: 'inline-block',
  transition: 'all 0.2s ease',
};

// ── Data ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: '📄', title: 'Smart Section Detection', desc: 'Automatically identifies Abstract, Introduction, Methodology, Results, and Conclusion from any paper format.' },
  { icon: '✨', title: 'AI Summarization', desc: 'Get concise or detailed summaries of every section on demand — short for scanning, detailed for deep reading.' },
  { icon: '🧒', title: 'ELI5 & Expert Explanations', desc: 'Switch between simple explanations for beginners and rigorous deep-dives for domain experts.' },
  { icon: '∑', title: 'Math & LaTeX Parser', desc: 'Understands and explains every equation and formula in plain English. No more cryptic symbols.' },
  { icon: '🔗', title: 'Citation Graph', desc: 'Visualizes all references and inline citations as an interactive knowledge graph you can explore.' },
  { icon: '🔍', title: 'Similar Paper Finder', desc: 'Uses semantic embeddings to surface the most related papers already in your library.' },
];

const STEPS = [
  { icon: '⬆️', title: 'Upload', desc: 'Drag and drop your PDF. We parse and extract every section, figure reference, and equation instantly.' },
  { icon: '⚙️', title: 'Analyze', desc: 'AI segments sections, generates summaries, detects math, and extracts all citations automatically.' },
  { icon: '📘', title: 'Understand', desc: 'Request explanations at any level, explore the citation graph, and find related work in seconds.' },
];

const STATS = [
  { value: '10,000+', label: 'Papers Analyzed' },
  { value: '6', label: 'AI-Powered Features' },
  { value: '2', label: 'Explanation Modes' },
  { value: '< 30s', label: 'Average Analysis Time' },
];

const TESTIMONIALS = [
  {
    quote: "ResearchAI cut my literature review time in half. The section summaries are remarkably accurate — I can evaluate a paper's methodology in under two minutes.",
    name: 'Dr. Maya Singh', role: 'Postdoc, Quantum Computing Lab', initials: 'MS',
  },
  {
    quote: "The ELI5 mode is genuinely impressive. I use it to make dense methodology sections understandable for my undergrads — it saves me hours of re-explaining.",
    name: 'Prof. Alan Chen', role: 'Assistant Professor, Biology', initials: 'AC',
  },
  {
    quote: "The citation graph changed how I trace references across papers. What used to take a full day of manual work now takes ten minutes.",
    name: 'Samira Okafor', role: 'PhD Candidate, Computational Neuroscience', initials: 'SO',
  },
];

const FOOTER_LINKS = [
  { heading: 'Product', links: ['Features', 'How it works', 'Pricing', 'Changelog'] },
  { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
  { heading: 'Resources', links: ['Documentation', 'API Reference', 'Support', 'Status'] },
  { heading: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
];