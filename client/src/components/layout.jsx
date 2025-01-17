import { Outlet } from 'react-router-dom';
import { Navbar } from './navbar';
import { Toaster } from './ui/toast/toaster';

export function Layout() {
	return (
		<div className="min-h-screen w-full bg-brand-background">
			<Navbar />
			<main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Outlet />
			</main>
			<Toaster />
		</div>
	);
}
