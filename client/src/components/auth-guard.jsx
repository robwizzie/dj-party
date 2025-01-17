import { Navigate, useLocation } from 'react-router-dom';
import useSpotifyAuthStore from '../contexts/useSpotifyAuthStore';

export function AuthGuard({ children }) {
	const { accessToken, hasRefreshToken, isLoading } = useSpotifyAuthStore();
	const location = useLocation();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-secondary" />
			</div>
		);
	}

	if (!accessToken && !hasRefreshToken) {
		return <Navigate to="/" state={{ from: location }} replace />;
	}

	return children;
}
