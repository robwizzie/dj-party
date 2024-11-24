import { SpotifyApi } from '@spotify/web-api-ts-sdk';

// Make sure these are defined in your .env file
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID || 'YOUR_DEFAULT_CLIENT_ID';
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://localhost:5173/callback';

// Initialize the SDK with just the client ID
export const spotifyApi = SpotifyApi.withClientCredentials(clientId, redirectUri);

export const SCOPES = [
	'user-read-private',
	'user-read-email',
	'user-modify-playback-state',
	'user-read-playback-state',
	'user-read-currently-playing',
	'playlist-read-private',
	'playlist-read-collaborative'
];

// Create the authorization URL
export const loginUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(SCOPES.join(' '))}`;
