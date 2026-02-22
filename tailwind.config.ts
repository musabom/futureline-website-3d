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
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #1B2C63, #18A999)',
        'brand-gradient-hover': 'linear-gradient(135deg, #0F1E3D, #148F82)',
      },
    },
  },
  plugins: [],
};

export default config;
