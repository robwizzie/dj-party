import { Music, User, X } from 'lucide-react';
import { Button } from '../ui/button';
import usePlayerStore from '../../contexts/usePlayerStore';
import { useMemo } from 'react';

export function Queue() {
	const playbackTimeline = usePlayerStore(state => state.playbackTimeline);
	const currentSongIndex = usePlayerStore(state => state.index);
	const currentTrack = usePlayerStore(state => state.currentTrack);
	const removeFromQueue = usePlayerStore(state => state.removeFromQueue);

	const queue = useMemo(() => playbackTimeline.slice(currentSongIndex + 1), [playbackTimeline, currentSongIndex]);

	return (
		<div className="bg-brand-background-light rounded-lg p-4">
			<h2 className="text-xl font-semibold mb-4">Queue</h2>
			<div className="space-y-2">
				{currentTrack && (
					<div className="flex items-center space-x-4 p-3 rounded-md bg-brand-primary/20">
						<img
							src={currentTrack.album.images[0].url}
							alt={currentTrack.album.name}
							className="w-12 h-12 rounded-md"
						/>
						<div className="flex-1 min-w-0">
							<p className="font-medium truncate text-brand-secondary">{currentTrack.name}</p>
							<p className="text-sm text-white/60 truncate">{currentTrack.artists[0].name}</p>
						</div>
						{/* <div className="flex items-center space-x-2 text-sm text-white/60"> */}
						{/* 	<User className="w-4 h-4" /> */}
						{/* 	<span>{currentTrack.user}</span> */}
						{/* </div> */}
					</div>
				)}

				{queue.map((item, i) => (
					<div
						key={item.id}
						className="flex items-center space-x-4 p-3 rounded-md bg-black/20 hover:bg-black/30 transition-colors">
						<img src={item.album.images[0].url} alt={item.album.name} className="w-12 h-12 rounded-md" />
						<div className="flex-1 min-w-0">
							<p className="font-medium truncate">{item.name}</p>
							<p className="text-sm text-white/60 truncate">{item.artists[0].name}</p>
						</div>
						<div className="flex items-center space-x-2">
							{/* <div className="flex items-center space-x-2 text-sm text-white/60"> */}
							{/* 	<User className="w-4 h-4" /> */}
							{/* 	<span>{item.user}</span> */}
							{/* </div> */}
							<Button
								variant="ghost"
								size="sm"
								onClick={() => removeFromQueue(i + currentSongIndex + 1)}
								className="text-white/60 hover:text-white">
								<X className="w-4 h-4" />
							</Button>
						</div>
					</div>
				))}

				{queue.length === 0 && !currentTrack && (
					<p className="text-white/60 text-center py-4">Queue is empty. Add some tracks!</p>
				)}
			</div>
		</div>
	);
}
