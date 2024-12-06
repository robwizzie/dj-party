// tailwind.config.js
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				spotify: {
					green: '#1DB954',
					black: '#191414',
					white: '#FFFFFF',
					gray: '#282828'
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
