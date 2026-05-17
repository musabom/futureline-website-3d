import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F1E3D',
          light: '#1B2C63',
          dark: '#0A1428',
        },
        teal: {
          DEFAULT: '#18A999',
          light: '#20C5B3',
          dark: '#148F82',
        },
        // Two-pole accent system (Lab vs Academy)
        lab: {
          DEFAULT: '#18A999',
          light: '#20C5B3',
          dark: '#148F82',
        },
        // Academy pole — wordmark's blue end (lavender → deep navy).
        // Replaces the off-brand amber so Academy and Lab read as the
        // two poles already present in the FutureLine wordmark.
        academy: {
          DEFAULT: '#6B7CC3',
          light: '#b6c4ff',
          dark: '#36467e',
        },
        // Mirrors the reference repo's brand.* namespace so verbatim section
        // components compile. bg/fg/muted use the reference's black canvas;
        // accent/accent2 are mapped to our brand teal (not the reference cyan)
        // so editorial sections inherit FutureLine brand. The DualWalkway 3D
        // scene retains its hardcoded cyan/amber by design.
        brand: {
          bg: '#000000',
          surface: '#0a0a0a',
          fg: '#fafafa',
          muted: '#a1a1aa',
          accent: '#18A999',
          accent2: '#20C5B3',
        },
        gray: {
          soft: '#F4F6F9',
        },
        surface: {
          DEFAULT: '#031231',
          dim: '#031231',
          bright: '#2b3859',
          'container-lowest': '#000d2a',
          'container-low': '#0b1a39',
          container: '#101f3e',
          'container-high': '#1b2949',
          'container-highest': '#263454',
        },
        'on-surface': '#d9e2ff',
        'on-surface-variant': '#bcc9c6',
        outline: '#869490',
        primary: {
          DEFAULT: '#5edac8',
          container: '#18a999',
        },
        secondary: {
          DEFAULT: '#b6c4ff',
          container: '#36467e',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #1B2C63, #18A999)',
        'brand-gradient-hover': 'linear-gradient(135deg, #0F1E3D, #148F82)',
        'lab-glow': 'radial-gradient(ellipse at center, rgba(24, 169, 153, 0.25), transparent 70%)',
        'academy-glow': 'radial-gradient(ellipse at center, rgba(107, 124, 195, 0.28), transparent 70%)',
      },
      animation: {
        spotlight: 'spotlight 2s ease .75s 1 forwards',
        'marquee-left': 'marquee-left 28s linear infinite',
        'marquee-right': 'marquee-right 32s linear infinite',
        'glitch-rgb': 'glitch-rgb 7s steps(1) infinite',
      },
      keyframes: {
        spotlight: {
          '0%': { opacity: '0', transform: 'translate(-72%, -62%) scale(0.5)' },
          '100%': { opacity: '1', transform: 'translate(-50%, -40%) scale(1)' },
        },
        'marquee-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'glitch-rgb': {
          '0%, 92%, 100%': {
            textShadow: '0 0 0 transparent',
          },
          '93%': {
            textShadow: '-2px 0 0 rgba(32, 197, 179, 0.85), 2px 0 0 rgba(245, 166, 35, 0.75)',
          },
          '95%': {
            textShadow: '2px 0 0 rgba(32, 197, 179, 0.85), -2px 0 0 rgba(245, 166, 35, 0.75)',
          },
          '97%': {
            textShadow: '0 0 0 transparent',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
