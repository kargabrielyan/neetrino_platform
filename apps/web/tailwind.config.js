/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Liquid Glass Design Tokens
        bg: {
          DEFAULT: 'var(--bg)',
          soft: 'var(--bg-soft)'
        },
        ink: { 
          DEFAULT: 'var(--ink)', 
          weak: 'var(--ink-weak)' 
        },
        a1: 'var(--a1)', 
        a2: 'var(--a2)', 
        a3: 'var(--a3)', 
        a4: 'var(--a4)',
        
        // Glass effects
        glass: {
          fill: 'var(--glass-fill)',
          border: 'var(--glass-border)',
          shadow: 'var(--glass-shadow)',
          highlight: 'var(--glass-highlight)'
        },
        
        // Legacy shadcn/ui colors for compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      boxShadow: {
        'glass': '0 8px 32px var(--glass-shadow)',
        'glass-strong': '0 12px 40px var(--glass-shadow)',
        'glass-subtle': '0 4px 16px var(--glass-shadow)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(90deg, var(--a1), var(--a2) 38%, var(--a3) 72%, var(--a4))',
        'glass-gradient': 'linear-gradient(135deg, var(--glass-fill) 0%, rgba(255,255,255,0.05) 100%)',
      },
      borderRadius: { 
        '2xl': '1rem', 
        '3xl': '1.25rem',
        '4xl': '1.5rem',
        'full': '9999px'
      },
      animation: {
        "fade-up": "fadeUp 280ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        "fade-in": "fadeIn 280ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        "float": "float 3s ease-in-out infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "fadeUp": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        "fadeIn": {
          from: { opacity: "0" },
          to: { opacity: "1" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      transitionDuration: {
        '280': '280ms',
        '350': '350ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}