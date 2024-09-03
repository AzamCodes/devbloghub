import type { Config } from "tailwindcss";

// Define the type for the `theme` function if it's not directly available
type ThemeFunction = (key: string) => string;

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: (theme: ThemeFunction) => ({
        DEFAULT: {
          css: {
            color: theme("colors.foreground"),
            h1: {
              fontSize: "2.25rem", // 36px
              fontWeight: "700",
              lineHeight: "2.5rem",
              marginBottom: "1rem",
            },
            h2: {
              fontSize: "1.875rem", // 30px
              fontWeight: "600",
              lineHeight: "2.25rem",
              marginBottom: "1rem",
            },
            h3: {
              fontSize: "1.5rem", // 24px
              fontWeight: "600",
              lineHeight: "2rem",
              marginBottom: "0.75rem",
            },
            h4: {
              fontSize: "1.25rem", // 20px
              fontWeight: "600",
              lineHeight: "1.75rem",
              marginBottom: "0.5rem",
            },
            p: {
              fontSize: "1rem", // 16px
              lineHeight: "1.75rem",
              marginBottom: "1rem",
            },
            a: {
              color: theme("colors.primary.DEFAULT"),
              textDecoration: "underline",
              fontWeight: "500",
              "&:hover": {
                color: theme("colors.primary.foreground"),
              },
            },
            ul: {
              paddingLeft: "1.5rem",
              marginBottom: "1rem",
            },
            ol: {
              paddingLeft: "1.5rem",
              marginBottom: "1rem",
            },
            li: {
              marginBottom: "0.5rem",
            },
            blockquote: {
              borderLeftWidth: "4px",
              borderLeftColor: theme("colors.primary"),
              paddingLeft: "1rem",
              fontStyle: "italic",
              color: theme("colors.muted.DEFAULT"),
              backgroundColor: theme("colors.background"),
              marginBottom: "1rem",
              position: "relative",
              padding: "1rem",
              borderRadius: theme("borderRadius.md"),
              "&::before": {
                content: '"“"',
                position: "absolute",
                left: "-0.75rem",
                top: "0.5rem",
                fontSize: "3rem",
                color: theme("colors.primary"),
                fontWeight: "bold",
              },
              "@media (prefers-color-scheme: dark)": {
                borderLeftColor: theme("colors.accent.DEFAULT"),
                color: theme("colors.accent.foreground"),
                backgroundColor: theme("colors.background"),
              },
            },
            code: {
              fontFamily: "monospace",
              fontSize: "0.875rem", // 14px
              color: theme("colors.accent.DEFAULT"),
              backgroundColor: theme("colors.background"),
              padding: "0.25rem 0.5rem",
              borderRadius: "0.25rem",
            },
            pre: {
              fontFamily: "monospace",
              fontSize: "0.875rem", // 14px
              color: theme("colors.foreground"),
              backgroundColor: theme("colors.background"),
              padding: "1rem",
              borderRadius: "0.5rem",
              overflowX: "auto",
              marginBottom: "1rem",
            },
            hr: {
              borderColor: theme("colors.border"),
              marginBottom: "1rem",
            },
            img: {
              maxWidth: "100%",
              height: "auto",
              borderRadius: "0.25rem",
              marginBottom: "1rem",
            },
            table: {
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "1rem",
            },
            th: {
              borderBottomWidth: "2px",
              borderBottomColor: theme("colors.border"),
              padding: "0.75rem",
              textAlign: "left",
            },
            td: {
              borderBottomWidth: "1px",
              borderBottomColor: theme("colors.border"),
              padding: "0.75rem",
            },
          },
        },
      }),
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
