// src/components/ui/button/variants.js
import { cva } from 'class-variance-authority';

export const buttonVariants = cva('inline-flex items-center justify-center rounded-full font-semibold transition-colors', {
	variants: {
		variant: {
			default: 'bg-spotify-green text-white hover:bg-opacity-80',
			secondary: 'bg-white text-black hover:bg-opacity-80',
			ghost: 'hover:bg-white hover:bg-opacity-10'
		},
		size: {
			default: 'h-10 px-4 py-2',
			sm: 'h-9 px-3',
			lg: 'h-11 px-8'
		}
	},
	defaultVariants: {
		variant: 'default',
		size: 'default'
	}
});
