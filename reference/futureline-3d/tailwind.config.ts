import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        brand: {
          bg: '#000000',
          surface: '#0a0a0a',
          fg: '#fafafa',
          muted: '#a1a1aa',
          accent: '#7dd3fc', // sky-300 — matches hero shader
          accent2: '#bae6fd', // sky-200 — particles
        },
      },
      maxWidth: {
        '8xl': '88rem',
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
