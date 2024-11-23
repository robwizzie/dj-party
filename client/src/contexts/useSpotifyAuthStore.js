import { create } from 'zustand';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

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

const useSpotifyAuthStore = create((set, get) => {
	const params = new URLSearchParams(window.location.search);
	const code = params.get('code');

	if (code) {
		// Clear the URL to prevent reusing the same code
		window.history.replaceState({}, document.title, window.location.pathname);
		handleAuthCode(code);
	} else {
		set({ isLoading: false });
	}

	async function handleAuthCode(code) {
		try {
			console.log('Starting token exchange...');
			const response = await fetch(`${API_URL}/api/token`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ code })
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.details || 'Token exchange failed');
			}

			console.log('Token exchange successful!');

			const api = SpotifyApi.withAccessToken(import.meta.env.VITE_SPOTIFY_CLIENT_ID, data);

			const userProfile = await api.currentUser.profile();

			set({ user: userProfile, accessToken: data.access_token, isLoading: false });

			if (data.refresh_token) {
				localStorage.setItem('spotify_refresh_token', data.refresh_token);
			}
		} catch (error) {
			console.error('Auth error:', error);
			set({ error: error, isLoading: false });
		}
	}

	const login = () => {
		// Redirect to Spotify auth
		window.location.href = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&scope=${encodeURIComponent(SPOTIFY_SCOPES.join(' '))}`;
	};

	const logout = () => {
		set({ accessToken: undefined, user: undefined });
		// Add any other cleanup
	};

	return { accessToken: undefined, user: undefined, isLoading: undefined, error: undefined, login, logout };
});

export default useSpotifyAuthStore;
