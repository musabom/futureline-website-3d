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
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #1B2C63, #18A999)',
        'brand-gradient-hover': 'linear-gradient(135deg, #0F1E3D, #148F82)',
      },
      animation: {
        spotlight: 'spotlight 2s ease .75s 1 forwards',
      },
      keyframes: {
        spotlight: {
          '0%': { opacity: '0', transform: 'translate(-72%, -62%) scale(0.5)' },
          '100%': { opacity: '1', transform: 'translate(-50%, -40%) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
