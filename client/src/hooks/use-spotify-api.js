import { useState } from 'react';
import useSpotifyAuthStore from '../contexts/useSpotifyAuthStore';

export function useSpotifyApi() {
	const accessToken = useSpotifyAuthStore(state => state.accessToken);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const playTrack = async (uri, deviceId) => {
		if (!uri || !deviceId) return;

		try {
			await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					uris: [uri]
				})
			});
		} catch (error) {
			console.error('Error playing track:', error);
		}
	};

	const searchTracks = async query => {
		if (!query.trim() || !accessToken) return [];

		setLoading(true);
		setError(null);

		try {
			console.log('Searching for:', query);

			const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Search error:', errorData);
				throw new Error(errorData.error ? errorData.error.message : 'Failed to search tracks');
			}

			const data = await response.json();
			console.log('Search results:', data);
			return data.tracks.items;
		} catch (err) {
			console.error('Search error:', err);
			setError(err.message);
			return [];
		} finally {
			setLoading(false);
		}
	};

	return {
		searchTracks,
		playTrack,
		loading,
		error
	};
}

