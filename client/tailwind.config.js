// tailwind.config.js
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				brand: {
					// Primary colors
					primary: {
						DEFAULT: '#7C3AED', // Vibrant purple
						light: '#9F67FF',
						dark: '#5B21B6'
					},
					// Secondary colors
					secondary: {
						DEFAULT: '#06B6D4', // Cyan
						light: '#22D3EE',
						dark: '#0891B2'
					},
					// Accent colors
					accent: {
						DEFAULT: '#EC4899', // Pink
						light: '#F472B6',
						dark: '#DB2777'
					},
					// Background colors
					background: {
						DEFAULT: '#1E1B2E', // Dark purple background
						light: '#2D2A3E',
						dark: '#121016'
					},
					// Neutral colors
					neutral: {
						50: '#F8FAFC',
						100: '#F1F5F9',
						200: '#E2E8F0',
						300: '#CBD5E1',
						400: '#94A3B8',
						500: '#64748B',
						600: '#475569',
						700: '#334155',
						800: '#1E293B',
						900: '#0F172A'
					}
				}
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0', transform: 'translateY(-10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				scaleIn: {
					'0%': { transform: 'scale(0.9)' },
					'100%': { transform: 'scale(1)' }
				}
			},
			animation: {
				fadeIn: 'fadeIn 0.5s ease-out',
				scaleIn: 'scaleIn 0.5s ease-out'
			}
		}
	},
	plugins: [animate]
};
