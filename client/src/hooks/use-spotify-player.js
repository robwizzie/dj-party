import { useState, useEffect, useRef } from 'react';
import useSpotifyAuthStore from '../contexts/useSpotifyAuthStore';

export function useSpotifyPlayer() {
	const accessToken = useSpotifyAuthStore(state => state.accessToken);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState();
	const [isPaused, setIsPaused] = useState(true);
	const [deviceId, setDeviceId] = useState();
	const [isActive, setIsActive] = useState(false);
	const [isReady, setIsReady] = useState(false);
	const playerRef = useRef();

	useEffect(() => {
		if (!accessToken) return;

		initializePlayer();
	}, [accessToken]);

	async function initializePlayer() {
		try {
			// Check Premium status
			const response = await fetch('https://api.spotify.com/v1/me', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});

			const userData = await response.json();

			if (userData.product !== 'premium') {
				setError('Spotify Premium required');
				setIsLoading(false);
				return;
			}

			if (!window.Spotify) {
				const script = document.createElement('script');
				script.src = 'https://sdk.scdn.co/spotify-player.js';
				script.async = true;
				document.body.appendChild(script);

				script.onload = () => {
					window.onSpotifyWebPlaybackSDKReady = () => {
						setupPlayer();
					};
				};
			} else {
				setupPlayer();
			}
		} catch (error) {
			console.error('Error initializing player:', error);
			setError('Failed to initialize player');
			setIsLoading(false);
		}
	}

	function setupPlayer() {
		const player = new window.Spotify.Player({
			name: 'DJ Party Web Player',
			getOAuthToken: cb => cb(accessToken),
			volume: 0.5
		});
		playerRef.current = player;

		player.addListener('player_state_changed', updatePlaybackState);

		player.addListener('ready', async ({ device_id }) => {
			console.log('Player ready with device ID:', device_id);
			setDeviceId(device_id);
			setIsActive(true);
			setIsLoading(false);
			setIsReady(true);

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
			setIsActive(false);
		});

		player.connect().then(success => {
			if (!success) {
				setError('Failed to connect player');
				setIsLoading(false);
			}
		});
	}

	async function updatePlaybackState() {
		const player = playerRef.current;

		if (!player) return;

		const state = await player.getCurrentState();
		if (state) {
			setIsPaused(state.paused);
		}
	}

	async function togglePlay() {
		const player = playerRef.current;

		if (!player) {
			console.error('Player not ready');
			return;
		}

		try {
			await player.togglePlay();

			// Wait for state to update
			setTimeout(updatePlaybackState, 200);
		} catch (error) {
			console.error('Error toggling playback:', error);
		}
	}

	async function nextTrack() {
		const player = playerRef.current;

		if (!player) {
			console.error('Player not ready');
			return;
		}

		try {
			await player.nextTrack();
			setTimeout(updatePlaybackState, 200);
		} catch (error) {
			console.error('Error skipping track:', error);
		}
	}

	async function startPlayback(deviceId, uris) {
		const player = playerRef.current;

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

			// Add a small delay then check state again to ensure it's updated
			setTimeout(updatePlaybackState, 500);
		} catch (error) {
			console.error('Error starting playback:', error);
		}
	}

	async function setVolume(value) {
		const player = playerRef.current;

		if (!player) {
			console.error('Player not ready');
			return;
		}

		try {
			const volume = Math.max(0, Math.min(1, value));
			await player.setVolume(volume);

			setTimeout(updatePlaybackState, 200);
		} catch (error) {
			console.error('Error setting volume:', error);
		}
	}

	const seek = async position => {
		const player = playerRef.current;

		if (!player) {
			console.error('Player not ready');
			return;
		}

		try {
			await player.seek(position);
			setTimeout(updatePlaybackState, 200);
		} catch (error) {
			console.error('Error seeking:', error);
		}
	};

	return {
		isLoading,
		error,
		isPaused,
		isActive,
		isReady,
		controls: {
			togglePlay,
			nextTrack,
			startPlayback,
			setVolume,
			seek
		}
	};
}

export function useSpotifyPlayerOld() {
	const accessToken = useSpotifyAuthStore(state => state.accessToken);
	const [player, setPlayer] = useState(null);
	const [deviceId, setDeviceId] = useState(null);
	const [playbackState, setPlaybackState] = useState(null);
	const [isActive, setIsActive] = useState(false);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isReady, setIsReady] = useState(false);
	const [isPaused, setIsPaused] = useState(true);
	const [duration, setDuration] = useState(0);
	const playerInstance = useRef(null);
	const isInitialized = useRef(false);

	console.log('hook is paused: ', isPaused);

	useEffect(() => {
		if (!accessToken || isInitialized.current) return;

		const initializePlayer = async () => {
			try {
				// Check Premium status
				const response = await fetch('https://api.spotify.com/v1/me', {
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				});

				const userData = await response.json();

				if (userData.product !== 'premium') {
					setError('Spotify Premium required');
					setIsLoading(false);
					return;
				}

				if (!window.Spotify) {
					const script = document.createElement('script');
					script.src = 'https://sdk.scdn.co/spotify-player.js';
					script.async = true;
					document.body.appendChild(script);

					script.onload = () => {
						window.onSpotifyWebPlaybackSDKReady = () => {
							setupPlayer();
						};
					};
				} else {
					setupPlayer();
				}
			} catch (error) {
				console.error('Error initializing player:', error);
				setError('Failed to initialize player');
				setIsLoading(false);
			}
		};

		const setupPlayer = () => {
			const spotifyPlayer = new window.Spotify.Player({
				name: 'DJ Party Web Player',
				getOAuthToken: cb => cb(accessToken),
				volume: 0.5
			});

			spotifyPlayer.addListener('player_state_changed', state => {
				// console.log(state);
				console.log(state.paused, isPaused);
				if (state.paused !== isPaused) setIsPaused(state.paused);
				if (state.duration !== duration) setDuration(state.duration);
			});

			playerInstance.current = spotifyPlayer;

			spotifyPlayer.addListener('ready', async ({ device_id }) => {
				console.log('Player ready with device ID:', device_id);
				setDeviceId(device_id);
				setIsActive(true);
				setIsLoading(false);
				setIsReady(true);
				isInitialized.current = true;

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

			spotifyPlayer.addListener('not_ready', ({ device_id }) => {
				console.log('Device ID is offline:', device_id);
				setIsActive(false);
			});

			// spotifyPlayer.addListener('player_state_changed', state => {
			// 	console.log('Playback state changed:', state);
			// 	setPlaybackState(state);
			// });

			spotifyPlayer.connect().then(success => {
				if (!success) {
					setError('Failed to connect player');
					setIsLoading(false);
				}
			});
		};

		initializePlayer();

		return () => {
			if (playerInstance.current) {
				playerInstance.current.disconnect();
			}
		};
	}, [accessToken]);

	const togglePlay = async () => {
		if (!playerInstance.current) {
			console.error('Player not ready');
			return;
		}

		try {
			await playerInstance.current.togglePlay();

			// Wait for state to update
			setTimeout(async () => {
				const state = await playerInstance.current.getCurrentState();
				if (state) {
					setPlaybackState(state);
				}
			}, 200);
		} catch (error) {
			console.error('Error toggling playback:', error);
		}
	};

	const nextTrack = async () => {
		if (!playerInstance.current) {
			console.error('Player not ready');
			return;
		}

		try {
			await playerInstance.current.nextTrack();
			setTimeout(async () => {
				const state = await playerInstance.current.getCurrentState();
				if (state) {
					setPlaybackState(state);
				}
			}, 200);
		} catch (error) {
			console.error('Error skipping track:', error);
		}
	};

	const startPlayback = async (deviceId, uris) => {
		if (!playerInstance.current || !deviceId) {
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
			const initialState = await playerInstance.current.getCurrentState();
			if (initialState) {
				setPlaybackState(initialState);
			}

			// Add a small delay then check state again to ensure it's updated
			setTimeout(async () => {
				const updatedState = await playerInstance.current.getCurrentState();
				if (updatedState) {
					setPlaybackState(updatedState);
				}
			}, 500);
		} catch (error) {
			console.error('Error starting playback:', error);
		}
	};

	const setVolume = async value => {
		if (!playerInstance.current) {
			console.error('Player not ready');
			return;
		}

		try {
			const volume = Math.max(0, Math.min(1, value));
			await playerInstance.current.setVolume(volume);
		} catch (error) {
			console.error('Error setting volume:', error);
		}
	};

	const seek = async position => {
		if (!playerInstance.current) {
			console.error('Player not ready');
			return;
		}

		try {
			await playerInstance.current.seek(position);
			const state = await playerInstance.current.getCurrentState();
			if (state) {
				setPlaybackState(state);
			}
		} catch (error) {
			console.error('Error seeking:', error);
		}
	};

	const getCurrentState = async () => {
		if (!playerInstance.current) {
			return null;
		}
		return await playerInstance.current.getCurrentState();
	};

	return {
		player: playerInstance.current,
		isPaused,
		duration,
		deviceId,
		playbackState,
		isActive,
		error,
		controls: {
			togglePlay,
			nextTrack,
			startPlayback,
			setVolume,
			seek,
			getCurrentState
		}
	};
}
