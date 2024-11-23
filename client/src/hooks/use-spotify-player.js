import { useState, useEffect, useRef } from 'react';
import { useSpotifyAuth } from '../contexts/spotify-auth-context';

export function useSpotifyPlayer() {
    const { accessToken } = useSpotifyAuth();
    const [player, setPlayer] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [playbackState, setPlaybackState] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isReady, setIsReady] = useState(false);
    const playerInstance = useRef(null);
    const isInitialized = useRef(false);

    useEffect(() => {
        if (!accessToken || isInitialized.current) return;

        const initializePlayer = async() => {
            try {
                // Check Premium status
                const response = await fetch('https://api.spotify.com/v1/me', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
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

            playerInstance.current = spotifyPlayer;

            spotifyPlayer.addListener('ready', async({ device_id }) => {
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
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            device_ids: [device_id],
                            play: false,
                        }),
                    });
                } catch (error) {
                    console.error('Error transferring playback:', error);
                }
            });

            spotifyPlayer.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID is offline:', device_id);
                setIsActive(false);
            });

            spotifyPlayer.addListener('player_state_changed', state => {
                console.log('Playback state changed:', state);
                setPlaybackState(state);
            });

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


    const togglePlay = async() => {
        if (!playerInstance.current) {
            console.error('Player not ready');
            return;
        }

        try {
            await playerInstance.current.togglePlay();

            // Wait for state to update
            setTimeout(async() => {
                const state = await playerInstance.current.getCurrentState();
                if (state) {
                    setPlaybackState(state);
                }
            }, 200);
        } catch (error) {
            console.error('Error toggling playback:', error);
        }
    };

    const nextTrack = async() => {
        if (!playerInstance.current) {
            console.error('Player not ready');
            return;
        }

        try {
            await playerInstance.current.nextTrack();
            setTimeout(async() => {
                const state = await playerInstance.current.getCurrentState();
                if (state) {
                    setPlaybackState(state);
                }
            }, 200);
        } catch (error) {
            console.error('Error skipping track:', error);
        }
    };

    const startPlayback = async(deviceId, uris) => {
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
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uris,
                    position_ms: 0
                }),
            });

            // Get initial state after starting playback
            const initialState = await playerInstance.current.getCurrentState();
            if (initialState) {
                setPlaybackState(initialState);
            }

            // Add a small delay then check state again to ensure it's updated
            setTimeout(async() => {
                const updatedState = await playerInstance.current.getCurrentState();
                if (updatedState) {
                    setPlaybackState(updatedState);
                }
            }, 500);
        } catch (error) {
            console.error('Error starting playback:', error);
        }
    };

    return {
        player: playerInstance.current,
        deviceId,
        playbackState,
        isActive,
        error,
        controls: {
            togglePlay,
            nextTrack,
            startPlayback
        }
    };
}