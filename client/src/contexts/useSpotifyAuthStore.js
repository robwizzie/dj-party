import { create } from 'zustand';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { getCookie, setCookie } from '../utils/cookies';

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

	const { accessToken: cookieToken, expirationDate } = JSON.parse(getCookie('spotifyAccessToken') || '{}');
	const refreshToken = getCookie('spotifyRefreshToken');
	if (cookieToken) handleExpiration(expirationDate, refreshToken);
	else if (refreshToken) authorize({ refresh_token: refreshToken });

	if (code) {
		window.history.replaceState({}, document.title, window.location.pathname);
		authorize({ code });
	} else {
		set({ isLoading: false });
	}

	async function authorize(body) {
		try {
			console.log(`Starting ${body?.refresh_token ? 'reauth' : 'token'} exchange...`);
			const response = await fetch(`${API_URL}/api/spotify/auth`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.details || 'Token exchange failed');
			}

			console.log(`${body?.refresh_token ? 'Reauth' : 'Token'} exchange successful!`);

			const api = SpotifyApi.withAccessToken(import.meta.env.VITE_SPOTIFY_CLIENT_ID, data);
			const userProfile = await api.currentUser.profile();
			const expirationDate = new Date().getTime() + (data.expires_in - 300) * 1000;

			set({
				user: userProfile,
				accessToken: data.access_token,
				isLoading: false
			});

			setCookie('spotifyAccessToken', JSON.stringify({ accessToken: data.access_token, expirationDate }), expirationDate);
			if (data.refresh_token) setCookie('spotifyRefreshToken', data.refresh_token);
			handleExpiration(expirationDate, data.refresh_token || getCookie('refresh_token'));
		} catch (error) {
			console.error('Auth error:', error);
			set({ error: error, isLoading: false });
		}
	}

	function handleExpiration(expirationDate, refreshToken) {
		const timeToExp = expirationDate - new Date().getTime();
		setTimeout(() => authorize({ refresh_token: refreshToken }), timeToExp);
	}

	const login = () => {
		// Redirect to Spotify auth
		window.location.href = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&scope=${encodeURIComponent(SPOTIFY_SCOPES.join(' '))}`;
	};

	const logout = () => {
		set({ accessToken: undefined, user: undefined });
		// Add any other cleanup
	};

	return {
		accessToken: cookieToken,
		hasRefreshToken: !!refreshToken,
		expirationDate: undefined,
		refreshToken: undefined,
		user: undefined,
		isLoading: undefined,
		error: undefined,
		login,
		logout
	};
});

export default useSpotifyAuthStore;
