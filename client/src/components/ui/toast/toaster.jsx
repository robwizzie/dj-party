import { Toaster as Sonner } from 'sonner';

const Toaster = () => {
	return (
		<Sonner
			className="toaster group"
			toastOptions={{
				classNames: {
					toast: 'group toast group-[.toaster]:bg-brand-background-light group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-lg',
					description: 'group-[.toast]:text-white/60',
					actionButton: 'group-[.toast]:bg-brand-primary group-[.toast]:text-white',
					cancelButton: 'group-[.toast]:bg-white/10 group-[.toast]:text-white'
				}
			}}
		/>
	);
};

export { Toaster };
