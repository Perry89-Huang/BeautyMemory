// tailwind.config.js - 確保配置正確

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      // 中文字體配置
      fontFamily: {
        'sans-tc': ['Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', 'sans-serif'],
        'serif-tc': ['Noto Serif TC', 'PingFang TC', 'Microsoft JhengHei', 'serif'],
      },
      // 2025 九紫離火運主題色彩
      colors: {
        'fire': {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e', // 主要離火紅
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        'fortune': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // 財運金
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        'mystic': {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // 神秘紫
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        }
      },
      // 漸變配置
      backgroundImage: {
        'fire-gradient': 'linear-gradient(135deg, #f43f5e 0%, #fb7185 50%, #fda4af 100%)',
        'fortune-gradient': 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
        'mystic-gradient': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        'beauty-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      // 動畫配置
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [
    // 表單樣式插件（可選）
    // require('@tailwindcss/forms'),
    // 行高插件（可選）
    // require('@tailwindcss/line-clamp'),
  ],
}