import { useEffect, useState } from 'react';
import { Play, Pause, SkipForward, Music2, Volume2, VolumeX, SkipBack } from 'lucide-react';
import { Button } from '../ui/button';
import * as Slider from '@radix-ui/react-slider';
import usePlayerStore from '../../contexts/usePlayerStore';

const formatTime = ms => {
	const seconds = Math.floor((ms / 1000) % 60);
	const minutes = Math.floor(ms / 1000 / 60);
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export function Player() {
	const { isPaused } = usePlayerStore(state => state);

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

	return (
		<div className="bg-spotify-gray rounded-lg p-6">
			{isPaused}
			{/* Album Art and Track Info */}
			<SongInfo />

			{/* Progress Bar and Controls */}
			<div className="mt-6 space-y-4">
				{/* Progress Bar */}
				<ProgressBar />

				{/* Playback Controls */}
				<PlaybackControls />
			</div>
		</div>
	);
}

function SongInfo() {
	const currentTrack = usePlayerStore(state => state.currentTrack);

	// What is the use case where the current track isn't the display track?
	const isCurrentTrackInQueue = true;

	return (
		<div className="flex items-center space-x-4 album-art">
			{currentTrack ? (
				<img
					src={currentTrack.albumImage || currentTrack.album.images[0].url}
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
					{currentTrack?.name || 'Search for a song to play'}
				</h3>
				<p className="text-sm text-white/60">{currentTrack?.artists?.[0]?.name || 'Add songs to your queue'}</p>
			</div>
		</div>
	);
}

function ProgressBar() {
	const currentTrack = usePlayerStore(state => state.currentTrack);
	const isPaused = usePlayerStore(state => state.isPaused);
	const getPosition = usePlayerStore(state => state.getPosition);
	const { seek } = usePlayerStore(state => state.controls);

	const [isDragging, setIsDragging] = useState(false);

	const [progress, setProgress] = useState(0);

	useEffect(() => {
		if (isPaused || isDragging) return;
		const interval = setInterval(() => {
			getPosition().then(setProgress);
		}, 1000);

		return () => clearInterval(interval);
	}, [isPaused, currentTrack?.id, isDragging]);

	useEffect(() => {
		getPosition().then(setProgress);
	}, [currentTrack?.id]);

	async function handleSeek(value) {
		setIsDragging(true);
		const position = value[0];
		setProgress(position);
	}

	async function onDragEnd() {
		setIsDragging(false);
		seek(progress);
	}

	return (
		<div className="space-y-2">
			<Slider.Root
				className="relative flex items-center select-none touch-none w-full h-5"
				value={[progress]}
				max={currentTrack?.duration_ms ?? 100}
				step={1000}
				onValueChange={handleSeek}
				onValueCommit={onDragEnd}
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
				<span>{formatTime(currentTrack?.duration_ms ?? 0)}</span>
			</div>
		</div>
	);
}

function PlaybackControls() {
	const isPaused = usePlayerStore(state => state.isPaused);
	const currentTrack = usePlayerStore(state => state.currentTrack);
	const volume = usePlayerStore(state => state.volume);
	const { togglePlay, next: nextTrack, back: backTrack, setVolume } = usePlayerStore(state => state.controls);

	return (
		<div className="flex flex-col space-y-4">
			<div className="flex items-center justify-center space-x-4">
				<Button
					variant="ghost"
					size="sm"
					onClick={backTrack}
					disabled={!currentTrack}
					className="hover:bg-white/10 transition-colors duration-200"
				>
					<SkipBack className="w-6 h-6" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={togglePlay}
					disabled={!currentTrack}
					className="hover:bg-white/10 transition-colors duration-200"
				>
					{!isPaused ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={nextTrack}
					disabled={!currentTrack}
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
					onClick={() => setVolume(0)}
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
						onValueChange={([newVolume]) => setVolume(newVolume)}
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
					onClick={() => setVolume(1)}
					className="hover:bg-white/10 transition-colors duration-200"
				>
					<Volume2 className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
}
