export function loadSpotifySDK() {
	return new Promise((resolve, reject) => {
		// If SDK is already loaded, resolve immediately
		if (window.Spotify) {
			resolve(window.Spotify);
			return;
		}

		// Set up the callback before loading the script
		window.onSpotifyWebPlaybackSDKReady = () => {
			resolve(window.Spotify);
		};

		// Create and load the script
		const script = document.createElement('script');
		script.src = 'https://sdk.scdn.co/spotify-player.js';
		script.async = true;

		script.onerror = error => {
			reject(new Error('Failed to load Spotify SDK'));
		};

		document.body.appendChild(script);
	});
}
