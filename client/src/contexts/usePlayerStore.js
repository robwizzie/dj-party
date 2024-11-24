import { create } from 'zustand';
import useSpotifyAuthStore from './useSpotifyAuthStore';

const usePlayerStore = create((set, get) => {
	let accessToken = useSpotifyAuthStore.getState().accessToken;

	let player;

	useSpotifyAuthStore.subscribe(({ accessToken: at }) => {
		if (accessToken === at) return;
		accessToken = at;
		initializePlayer();
	});

	initializePlayer();

	async function initializePlayer() {
		try {
			if (!accessToken) return;

			// Check Premium status
			const response = await fetch('https://api.spotify.com/v1/me', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});

			const userData = await response.json();

			if (userData.product !== 'premium') {
				set({ error: 'Spotify Premium required', loading: false });
				return;
			}

			if (window.Spotify) {
				setupPlayer();
				return;
			}

			const script = document.createElement('script');
			script.src = 'https://sdk.scdn.co/spotify-player.js';
			script.async = true;
			document.body.appendChild(script);

			script.onload = () => {
				window.onSpotifyWebPlaybackSDKReady = () => {
					setupPlayer();
				};
			};
		} catch (error) {
			console.error('Error initializing player:', error);
			set({ error: 'Failed to initialize player', loading: false });
		}
	}

	function setupPlayer() {
		player = new window.Spotify.Player({
			name: 'DJ Party Web Player',
			getOAuthToken: cb => cb(accessToken),
			volume: 0.5
		});

		player.addListener('player_state_changed', updatePlaybackState);

		player.addListener('ready', async ({ device_id }) => {
			console.log('Player ready with device ID:', device_id);
			set({ isActive: true, isLoading: false, isReady: true, deviceId: device_id });

			try {
				await fetch('https://api.spotify.com/v1/me/player', {
					method: 'PUT',
					headers: {
						'Authorization': `Bearer ${accessToken}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						device_ids: [device_id],
						play: false
					})
				});
			} catch (error) {
				console.error('Error transferring playback:', error);
			}
		});

		player.addListener('not_ready', ({ device_id }) => {
			console.log('Device ID is offline:', device_id);
			set({ deviceId: device_id });
		});

		player.connect().then(success => {
			if (success) return;
			set({ error: 'Failed to connect player', isLoading: false });
		});
	}

	async function updatePlaybackState(delay) {
		if (!player) return;

		if (delay) {
			await new Promise(res => setTimeout(res, delay));
		}

		const state = await player.getCurrentState();
		console.log(state);
		if (state) {
			const currentTrack = state.track_window?.current_track;
			set({
				isPaused: state.paused,
				...(get().currentTrack?.id === currentTrack.id ? {} : { currentTrack })
			});
		}
	}

	async function togglePlay() {
		if (!player) {
			console.error('Player not ready');
			return;
		}

		try {
			await player.togglePlay();
			updatePlaybackState(200);
		} catch (error) {
			console.error('Error toggling playback:', error);
		}
	}

	async function nextTrack() {
		if (!player) {
			console.error('Player not ready');
			return;
		}

		try {
			await player.nextTrack();
			updatePlaybackState(200);
		} catch (error) {
			console.error('Error skipping track:', error);
		}
	}

	async function startPlayback(uris) {
		const deviceId = get().deviceId;

		if (!player || !deviceId) {
			console.error('Player not ready or no device ID');
			return;
		}

		try {
			console.log('Starting playback:', { deviceId, uris });

			await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					uris,
					position_ms: 0
				})
			});

			// Get initial state after starting playback
			const initialState = await player.getCurrentState();
			if (initialState) {
				updatePlaybackState();
			}

			updatePlaybackState(500);
		} catch (error) {
			console.error('Error starting playback:', error);
		}
	}

	async function setVolume(value) {
		if (!player) {
			console.error('Player not ready');
			return;
		}

		try {
			const volume = Math.max(0, Math.min(1, value));
			set({ volume });
			await player.setVolume(volume);

			updatePlaybackState(200);
		} catch (error) {
			console.error('Error setting volume:', error);
		}
	}

	async function seek(position) {
		if (!player) {
			console.error('Player not ready');
			return;
		}

		try {
			await player.seek(position);
			if (get().isPaused) togglePlay();
			updatePlaybackState(200);
		} catch (error) {
			console.error('Error seeking:', error);
		}
	}

	async function getPosition() {
		const state = await player.getCurrentState();
		return state?.position;
	}

	return {
		isLoading: false,
		error: undefined,
		isPaused: true,
		isActive: false,
		isReady: false,
		deviceId: undefined,
		currentTrack: undefined,
		volume: 0.5,
		getPosition,
		controls: {
			togglePlay,
			nextTrack,
			startPlayback,
			setVolume,
			seek
		}
	};
});

export default usePlayerStore;
