import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpotifyAuth } from '../contexts/spotify-auth-context';

export function AuthCallback() {
  const navigate = useNavigate();
  const { loading } = useSpotifyAuth();

  useEffect(() => {
    if (!loading) {
      navigate('/');
    }
  }, [loading, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-spotify-green mb-4" />
      <p className="text-white/80">Connecting to Spotify...</p>
    </div>
  );
}