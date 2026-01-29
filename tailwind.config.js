/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./projects/**/*.{html,ts}"],
  theme: {
    extend: {
      spacing: {
        xs: '0.25rem',    // 4px
        sm: '0.5rem',     // 8px
        md: '0.75rem',    // 12px
        lg: '1rem',       // 16px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.75rem', // 28px
        '4xl': '2rem',    // 32px
        '5xl': '2.25rem', // 36px
        '6xl': '2.5rem',  // 40px
        '7xl': '2.75rem', // 44px
        '8xl': '3rem',    // 48px
        '9xl': '3.25rem'  // 52px
      },
      borderRadius: {
        xs: '0.125rem',   // 2px
        sm: '0.25rem',    // 4px
        md: '0.5rem',     // 8px
        lg: '0.75rem',    // 12px
        xl: '1rem',       // 16px
        '2xl': '1.25rem', // 20px
        '3xl': '1.5rem',  // 24px
        pill: '9999px',
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],      // 12 / 16
        sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14 / 20
        md: ['1rem', { lineHeight: '1.5rem' }],       // 16 / 24
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
          foreground: '#ffffff',
        },
        danger: {
          DEFAULT: '#dc2626',
          hover: '#b91c1c',
          foreground: '#ffffff',
        },
        neutral: {
          surface: '#ffffff',
          border: '#e5e7eb',
          muted: '#6b7280',
        },
      },
    },
    plugins: [],
  }
}
