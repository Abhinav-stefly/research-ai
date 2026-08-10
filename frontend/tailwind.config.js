export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0f1e',
        surface: '#111827',
        border: 'rgba(255,255,255,0.08)',
        accent: '#3b82f6',
        accentHover: '#60a5fa',
        textPrimary: '#f1f5f9',
        textSecondary: '#94a3b8',
        textMuted: '#475569'
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace']
      },
      borderRadius: {
        card: '12px',
        input: '8px'
      },
      transitionDuration: {
        200: '200ms'
      }
    }
  },
  plugins: []
}
