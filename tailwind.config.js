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
    },
    plugins: [],
  }
}
