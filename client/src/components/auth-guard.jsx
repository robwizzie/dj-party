import { Navigate, useLocation } from 'react-router-dom';
import { useSpotifyAuth } from '../contexts/spotify-auth-context';

export function AuthGuard({ children }) {
  const { accessToken, loading } = useSpotifyAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-spotify-green" />
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}