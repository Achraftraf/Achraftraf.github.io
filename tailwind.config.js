/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Background colors with opacity
    'bg-red-500/10', 'bg-red-500/20',
    'bg-blue-500/10', 'bg-blue-500/20',
    'bg-purple-500/10', 'bg-purple-500/20',
    'bg-green-500/10', 'bg-green-500/20',
    'bg-zinc-500/10', 'bg-zinc-500/20',
    'bg-orange-500/10', 'bg-orange-500/20',
    
    // Text colors
    'text-red-400', 'text-red-100/80',
    'text-blue-400', 'text-blue-100/80',
    'text-purple-400', 'text-purple-100/80',
    'text-green-400', 'text-green-100/80',
    'text-zinc-400', 'text-zinc-100/80',
    'text-orange-400', 'text-orange-100/80',
    
    // Gradients
    'from-red-950/40', 'via-red-900/30',
    'from-blue-950/40', 'via-blue-900/30',
    'from-purple-950/40', 'via-purple-900/30',
    'from-green-950/40', 'via-green-900/30',
    'from-zinc-950/40', 'via-zinc-900/30',
    'from-orange-950/40', 'via-orange-900/30',
  ],
  theme: {
    container: {
      padding: {
        DEFAULT: '15px',
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '960px',
      xl: '1200px',
    },
    extend: {
      colors: {
        primary: '#131424',
        secondary: '#393A47',
        accent: '#F13024',
      },
      backgroundImage: {
        explosion: 'url("/bg-explosion.png")',  
        circles: 'url("/circles.png")',
        circleStar: 'url("/circle-star.svg")',
        site: 'url("/site-bg.svg")',  
      },
      animation: {
        'spin-slow': 'spin 6s linear infinite',
      },
      fontFamily: {
        poppins: [`var(--font-poppins)`, 'sans-serif'],
        sora: [`var(--font-sora)`, 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};