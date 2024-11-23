import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Play, Pause, SkipForward, Music2, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../ui/button';
import { useSpotifyPlayer } from '../../hooks/use-spotify-player';
import { useQueue } from '../../contexts/queue-context';
import * as Slider from '@radix-ui/react-slider';
import usePlayerStore from '../../contexts/usePlayerStore';

const formatTime = ms => {
	const seconds = Math.floor((ms / 1000) % 60);
	const minutes = Math.floor(ms / 1000 / 60);
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export function Player({ onTrackEnd }) {
	// const {
	// 	playbackState,
	// 	isPaused,
	// 	duration,
	// 	isActive,
	// 	error,
	// 	deviceId,
	// 	controls: { togglePlay, nextTrack, startPlayback, setVolume, seek, getCurrentState }
	// } = useSpotifyPlayer();

	const { isPaused } = usePlayerStore(state => state);

	// const [isPlaying, setIsPlaying] = useState(false);
	// const [volume, setVolumeState] = useState(0.5);
	// const [progress, setProgress] = useState(0);
	// const [isDragging, setIsDragging] = useState(false);
	//
	// const { currentTrack: queuedTrack, playNext } = useQueue();
	// const progressInterval = useRef(null);
	// const lastKnownPosition = useRef(0);
	//
	// // Update isPlaying when playbackState changes
	// useEffect(() => {
	// 	if (playbackState) {
	// 		setIsPlaying(!playbackState.paused);
	// 		if (!isDragging) {
	// 			setProgress(playbackState.position);
	// 			lastKnownPosition.current = playbackState.position;
	// 		}
	// 	}
	// }, [playbackState, isDragging]);
	//
	// // Handle progress updates
	// useEffect(() => {
	// 	const updateProgressBar = () => {
	// 		if (isPlaying && !isDragging) {
	// 			setProgress(prev => {
	// 				const newProgress = prev + 1000;
	// 				return newProgress >= duration ? prev : newProgress;
	// 			});
	// 		}
	// 	};
	//
	// 	// Clear any existing interval
	// 	if (progressInterval.current) {
	// 		clearInterval(progressInterval.current);
	// 	}
	//
	// 	// Start new interval if playing
	// 	if (isPlaying && !isDragging) {
	// 		progressInterval.current = setInterval(updateProgressBar, 1000);
	// 	}
	//
	// 	// Cleanup
	// 	return () => {
	// 		if (progressInterval.current) {
	// 			clearInterval(progressInterval.current);
	// 		}
	// 	};
	// }, [isPlaying, isDragging, duration]);
	//
	// // Start playing queued track
	// useEffect(() => {
	// 	if (deviceId && queuedTrack && !playbackState) {
	// 		startPlayback(deviceId, [queuedTrack.uri]);
	// 	}
	// }, [deviceId, queuedTrack, playbackState, startPlayback]);
	//
	// // Handle track ending
	// useEffect(() => {
	// 	const handleTrackEnd = () => {
	// 		if (playbackState?.position === 0 && lastKnownPosition.current > 0) {
	// 			playNext();
	// 			lastKnownPosition.current = 0;
	// 		} else if (playbackState?.position) {
	// 			lastKnownPosition.current = playbackState.position;
	// 		}
	// 	};
	//
	// 	const intervalId = setInterval(handleTrackEnd, 1000);
	// 	return () => clearInterval(intervalId);
	// }, [playbackState, playNext]);
	//
	// const handlePlayPause = async () => {
	// 	setIsPlaying(!isPlaying);
	// 	await togglePlay();
	// };
	//
	// const handleSkipTrack = async () => {
	// 	await playNext();
	// };
	//
	// const handleVolumeChange = async newVolume => {
	// 	const volumeValue = newVolume[0];
	// 	setVolumeState(volumeValue);
	// 	await setVolume(volumeValue);
	// };
	//
	// const handleSeek = async value => {
	// 	const position = value[0];
	// 	setProgress(position);
	//
	// 	if (!isDragging && seek) {
	// 		try {
	// 			await seek(position);
	// 			const state = await getCurrentState();
	// 			if (state) {
	// 				lastKnownPosition.current = state.position;
	// 			}
	// 		} catch (error) {
	// 			console.error('Seek error:', error);
	// 		}
	// 	}
	// };
	//
	// const getDisplayTrack = () => {
	// 	if (playbackState?.track_window?.current_track) {
	// 		return {
	// 			...playbackState.track_window.current_track,
	// 			albumImage: playbackState.track_window.current_track.album.images[0].url,
	// 			isPlaying: !playbackState.paused
	// 		};
	// 	}
	// 	if (queuedTrack) {
	// 		return {
	// 			...queuedTrack,
	// 			isPlaying: false
	// 		};
	// 	}
	// 	return null;
	// };
	//
	// const displayTrack = getDisplayTrack();
	// const isCurrentTrackInQueue = displayTrack?.uri === queuedTrack?.uri;

	return (
		<div className="bg-spotify-gray rounded-lg p-6">
			{isPaused}
			{/* Album Art and Track Info */}
			{/* <SongInfo /> */}

			{/* Progress Bar and Controls */}
			<div className="mt-6 space-y-4">
				{/* Progress Bar */}
				{/* <ProgressBar /> */}

				{/* Playback Controls */}
				{/* <PlaybackControls /> */}
			</div>
		</div>
	);
}

function SongInfo() {
	return (
		<div className="flex items-center space-x-4 album-art">
			{displayTrack ? (
				<img
					src={displayTrack.albumImage || displayTrack.album.images[0].url}
					alt="Album Art"
					className={`w-24 h-24 rounded-md transition-all duration-200 ${
						isCurrentTrackInQueue ? 'ring-2 ring-spotify-green shadow-lg' : ''
					}`}
				/>
			) : (
				<div className="w-24 h-24 bg-black/20 rounded-md flex items-center justify-center">
					<Music2 className="w-8 h-8 text-white/40" />
				</div>
			)}

			<div className="flex-1">
				<h3
					className={`text-lg font-semibold transition-colors duration-200 ${
						isCurrentTrackInQueue ? 'text-spotify-green' : 'text-white'
					}`}
				>
					{displayTrack?.name || 'Search for a song to play'}
				</h3>
				<p className="text-sm text-white/60">{displayTrack?.artists?.[0]?.name || 'Add songs to your queue'}</p>
			</div>
		</div>
	);
}

function ProgressBar() {
	return (
		<div className="space-y-2">
			<Slider.Root
				className="relative flex items-center select-none touch-none w-full h-5"
				value={[progress]}
				max={duration || 100}
				step={1000}
				onValueChange={handleSeek}
				onMouseDown={() => setIsDragging(true)}
				onMouseUp={() => setIsDragging(false)}
				onTouchStart={() => setIsDragging(true)}
				onTouchEnd={() => setIsDragging(false)}
				aria-label="Playback Progress"
			>
				<Slider.Track className="bg-white/20 relative grow rounded-full h-1">
					<Slider.Range className="absolute bg-spotify-green rounded-full h-full" />
				</Slider.Track>
				<Slider.Thumb
					className="block w-3 h-3 bg-white rounded-full hover:bg-spotify-green focus:outline-none focus:ring-2 focus:ring-spotify-green opacity-0 hover:opacity-100 transition-opacity"
					aria-label="Playback Position"
				/>
			</Slider.Root>
			<div className="flex justify-between text-xs text-white/60">
				<span>{formatTime(progress)}</span>
				<span>{formatTime(duration)}</span>
			</div>
		</div>
	);
}

function PlaybackControls() {
	return (
		<div className="flex flex-col space-y-4">
			<div className="flex items-center justify-center space-x-4">
				<Button
					variant="ghost"
					size="sm"
					onClick={handlePlayPause}
					disabled={isPaused}
					className="hover:bg-white/10 transition-colors duration-200"
				>
					{isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={handleSkipTrack}
					disabled={!displayTrack}
					className="hover:bg-white/10 transition-colors duration-200"
				>
					<SkipForward className="w-6 h-6" />
				</Button>
			</div>

			{/* Volume Control */}
			<div className="flex items-center space-x-4">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => handleVolumeChange([0])}
					className="hover:bg-white/10 transition-colors duration-200"
				>
					<VolumeX className="w-4 h-4" />
				</Button>

				<div className="flex-1">
					<Slider.Root
						className="relative flex items-center select-none touch-none w-full h-5"
						defaultValue={[0.5]}
						max={1}
						step={0.01}
						value={[volume]}
						onValueChange={handleVolumeChange}
						aria-label="Volume"
					>
						<Slider.Track className="bg-white/20 relative grow rounded-full h-1">
							<Slider.Range className="absolute bg-white rounded-full h-full" />
						</Slider.Track>
						<Slider.Thumb
							className="block w-3 h-3 bg-white rounded-full hover:bg-spotify-green focus:outline-none focus:ring-2 focus:ring-spotify-green"
							aria-label="Volume"
						/>
					</Slider.Root>
				</div>

				<Button
					variant="ghost"
					size="sm"
					onClick={() => handleVolumeChange([1])}
					className="hover:bg-white/10 transition-colors duration-200"
				>
					<Volume2 className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
}

