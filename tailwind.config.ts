import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
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
        sans: ["Nunito", "sans-serif"],
        display: ["Playfair Display", "serif"],
        serif: ["Playfair Display", "serif"],
        heading: ["Fraunces", "serif"],
        body: ["Quicksand", "sans-serif"],
      },
      colors: {
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
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
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
        semilla: {
          green: "hsl(var(--semilla-green))",
          "green-light": "hsl(var(--semilla-green-light))",
          earth: "hsl(var(--semilla-earth))",
          "earth-light": "hsl(var(--semilla-earth-light))",
          gold: "hsl(var(--semilla-gold))",
          cream: "hsl(var(--semilla-cream))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        dash: {
          bg: "var(--dashboard-bg)",
          forest: "var(--forest-deep)",
          "leaf-bright": "var(--leaf-bright)",
          "leaf-fresh": "var(--leaf-fresh)",
          terracotta: "var(--terracotta-vivid)",
          "terracotta-warm": "var(--terracotta-warm)",
          clay: "var(--clay-soft)",
          soil: "var(--soil-warm)",
          text: "var(--text-warm)",
          "leaf-muted": "var(--leaf-muted)",
        },
        garden: {
          margarita: {
            DEFAULT: "var(--garden-margarita-primary)",
            secondary: "var(--garden-margarita-secondary)",
            light: "var(--garden-margarita-light)",
            dark: "var(--garden-margarita-dark)",
            particle: "var(--garden-margarita-particle)",
          },
          lirio: {
            DEFAULT: "var(--garden-lirio-primary)",
            secondary: "var(--garden-lirio-secondary)",
            light: "var(--garden-lirio-light)",
            dark: "var(--garden-lirio-dark)",
            particle: "var(--garden-lirio-particle)",
          },
          helecho: {
            DEFAULT: "var(--garden-helecho-primary)",
            secondary: "var(--garden-helecho-secondary)",
            light: "var(--garden-helecho-light)",
            dark: "var(--garden-helecho-dark)",
            particle: "var(--garden-helecho-particle)",
          },
          girasol: {
            DEFAULT: "var(--garden-girasol-primary)",
            secondary: "var(--garden-girasol-secondary)",
            light: "var(--garden-girasol-light)",
            dark: "var(--garden-girasol-dark)",
            particle: "var(--garden-girasol-particle)",
          },
          soil: {
            rich: "var(--garden-soil-rich)",
            warm: "var(--garden-soil-warm)",
            dry: "var(--garden-soil-dry)",
            edge: "var(--garden-soil-edge)",
          },
          plot: {
            surface: "var(--garden-plot-surface)",
            border: "var(--garden-plot-border)",
          },
          health: {
            full: "var(--garden-health-full)",
            mid: "var(--garden-health-mid)",
            low: "var(--garden-health-low)",
            dying: "var(--garden-health-dying)",
          },
          coin: {
            DEFAULT: "var(--garden-coin-gold)",
            shine: "var(--garden-coin-shine)",
            shadow: "var(--garden-coin-shadow)",
          },
        },
      },
      borderRadius: {
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
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "garden-sway": {
          "0%, 100%": { transform: "rotate(-1.2deg) scaleY(1)" },
          "50%": { transform: "rotate(1.2deg) scaleY(1.015)" },
        },
        "garden-grow-pop": {
          "0%": { transform: "scale(0.75) translateY(12px)", opacity: "0.6" },
          "55%": { transform: "scale(1.15) translateY(-4px)", opacity: "1" },
          "100%": { transform: "scale(1) translateY(0)", opacity: "1" },
        },
        "garden-water-pulse": {
          "0%": { transform: "scale(1)", filter: "brightness(1) saturate(1)" },
          "20%": { transform: "scale(1.05)", filter: "brightness(1.12) saturate(1.25)" },
          "45%": { transform: "scale(0.98)", filter: "brightness(1.08) saturate(1.2)" },
          "70%": { transform: "scale(1.02)", filter: "brightness(1.04) saturate(1.1)" },
          "100%": { transform: "scale(1)", filter: "brightness(1) saturate(1)" },
        },
        "garden-mastered-glow": {
          "0%, 100%": { filter: "drop-shadow(0 0 4px rgba(255,193,7,0.35))" },
          "50%": { filter: "drop-shadow(0 0 14px rgba(255,193,7,0.65))" },
        },
        "garden-particle-drift": {
          "0%": { transform: "translateY(0) scale(0.8)", opacity: "0" },
          "30%": { transform: "translateY(-20px) scale(1)", opacity: "0.8" },
          "100%": { transform: "translateY(-80px) scale(0.6)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 3s ease-in-out infinite",
        "garden-sway": "garden-sway 4.5s ease-in-out infinite",
        "garden-grow-pop": "garden-grow-pop 1.2s cubic-bezier(0.34,1.56,0.64,1) both",
        "garden-water-pulse": "garden-water-pulse 0.9s ease-out",
        "garden-mastered-glow": "garden-mastered-glow 2.8s ease-in-out infinite",
        "garden-particle-drift": "garden-particle-drift 2.4s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
