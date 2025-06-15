
import type { Config } from "tailwindcss";

export default {
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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Educational specific colors
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				focus: {
					DEFAULT: 'hsl(var(--focus))',
					foreground: 'hsl(var(--focus-foreground))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				// Educational specific radius
				'educational': '1rem',
				'educational-sm': '0.75rem',
				'educational-lg': '1.5rem',
				'pill': '9999px'
			},
			spacing: {
				// Educational 8px spacing system
				'educational-xs': 'var(--spacing-xs)',
				'educational-sm': 'var(--spacing-sm)', 
				'educational-md': 'var(--spacing-md)',
				'educational-lg': 'var(--spacing-lg)',
				'educational-xl': 'var(--spacing-xl)',
				'educational-2xl': 'var(--spacing-2xl)',
				'educational-3xl': 'var(--spacing-3xl)',
				'educational-4xl': 'var(--spacing-4xl)',
				'educational-5xl': 'var(--spacing-5xl)',
			},
			fontFamily: {
				'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				'display': ['Playfair Display', 'serif'],
				'mono': ['JetBrains Mono', 'monospace'],
			},
			fontSize: {
				// Educational typography scale
				'educational-caption': ['0.75rem', { lineHeight: '1.25rem' }],
				'educational-small': ['0.875rem', { lineHeight: '1.25rem' }],
				'educational-body': ['1rem', { lineHeight: '1.5rem' }],
				'educational-h4': ['1.125rem', { lineHeight: '1.5rem' }],
				'educational-h3': ['1.25rem', { lineHeight: '1.75rem' }],
				'educational-h2': ['1.5rem', { lineHeight: '2rem' }],
				'educational-h1': ['2rem', { lineHeight: '2.5rem' }],
				'educational-display': ['2.5rem', { lineHeight: '3rem' }],
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				// Educational specific animations
				'educational-fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'educational-scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'educational-pulse': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.5'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'educational-fade-in': 'educational-fade-in 300ms ease-out',
				'educational-scale-in': 'educational-scale-in 200ms ease-out',
				'educational-pulse': 'educational-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			},
			boxShadow: {
				'educational-sm': '0 1px 3px 0 rgba(140, 107, 244, 0.1), 0 1px 2px -1px rgba(140, 107, 244, 0.1)',
				'educational': '0 4px 6px -1px rgba(140, 107, 244, 0.1), 0 2px 4px -2px rgba(140, 107, 244, 0.1)',
				'educational-lg': '0 10px 15px -3px rgba(140, 107, 244, 0.1), 0 4px 6px -4px rgba(140, 107, 244, 0.1)',
				'educational-xl': '0 20px 25px -5px rgba(140, 107, 244, 0.1), 0 8px 10px -6px rgba(140, 107, 244, 0.1)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
