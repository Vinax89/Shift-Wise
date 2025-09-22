import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
        display: ['var(--font-nunito)', 'var(--font-inter)'],
        body: ['var(--font-body)', 'sans-serif'],
        headline: ['var(--font-headline)', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        bg: 'hsl(var(--bg))',
        fg: 'hsl(var(--fg))',
        'muted-fg': 'hsl(var(--muted-fg))',
        'card-fg': 'hsl(var(--card-fg))',
        'primary-fg': 'hsl(var(--primary-fg))',
        'secondary-fg': 'hsl(var(--secondary-fg))',
        'accent-fg': 'hsl(var(--accent-fg))',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--primary-fg))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        warning: 'hsl(var(--warning))',
        danger: 'hsl(var(--danger))',
        success: 'hsl(var(--success))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      boxShadow: {
        sm: '0 1px 2px 0 hsl(var(--shadow)/0.06)',
        DEFAULT: '0 1px 3px 0 hsl(var(--shadow)/0.1), 0 1px 2px -1px hsl(var(--shadow)/0.1)',
        md: '0 4px 6px -1px hsl(var(--shadow)/0.1), 0 2px 4px -2px hsl(var(--shadow)/0.1)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      transitionTimingFunction: { 'swift-out': 'cubic-bezier(.2,.8,.2,1)' },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
