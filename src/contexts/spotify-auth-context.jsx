import React, { createContext, useContext, useState, useEffect } from 'react';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

const SpotifyAuthContext = createContext(null);

// Define the scopes we need
const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-modify-playback-state',
  'user-read-playback-state',
  'user-read-currently-playing',
  'playlist-read-private',
  'playlist-read-collaborative',
  'streaming', // Required for Web Playback SDK
  'app-remote-control'
];

const API_URL = 'http://localhost:3001';

export function SpotifyAuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    
    if (code) {
      // Clear the URL to prevent reusing the same code
      window.history.replaceState({}, document.title, window.location.pathname);
      handleAuthCode(code);
    } else {
      setLoading(false);
    }
  }, []);

  const handleAuthCode = async (code) => {
    try {
      console.log('Starting token exchange...');
      const response = await fetch(`${API_URL}/api/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || 'Token exchange failed');
      }

      console.log('Token exchange successful!');
      setAccessToken(data.access_token);

      const api = SpotifyApi.withAccessToken(
        import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        data
      );

      const userProfile = await api.currentUser.profile();
      setUser(userProfile);
      
      if (data.refresh_token) {
        localStorage.setItem('spotify_refresh_token', data.refresh_token);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    // Redirect to Spotify auth
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${import.meta.env.VITE_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(import.meta.env.VITE_SPOTIFY_REDIRECT_URI)}&scope=${encodeURIComponent(SPOTIFY_SCOPES.join(' '))}`;
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    // Add any other cleanup
  };

  return (
    <SpotifyAuthContext.Provider value={{ accessToken, user, loading, login, logout }}>
      {children}
    </SpotifyAuthContext.Provider>
  );
}

export const useSpotifyAuth = () => {
  const context = useContext(SpotifyAuthContext);
  if (!context) {
    throw new Error('useSpotifyAuth must be used within a SpotifyAuthProvider');
  }
  return context;
};