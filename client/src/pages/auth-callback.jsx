import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSpotifyAuthStore from '../contexts/useSpotifyAuthStore';

export function AuthCallback() {
	const navigate = useNavigate();
	const isLoading = useSpotifyAuthStore(state => state.isLoading);

	useEffect(() => {
		if (!isLoading) {
			navigate('/');
		}
	}, [isLoading, navigate]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-secondary mb-4" />
			<p className="text-white/80">Connecting to Spotify...</p>
		</div>
	);
}
