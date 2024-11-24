import { Music, User, X } from 'lucide-react';
import { useQueue } from '../../contexts/queue-context';
import { Button } from '../ui/button';

export function Queue() {
	const { queue, currentTrack, removeFromQueue } = useQueue();

	return (
		<div className="bg-spotify-gray rounded-lg p-4">
			<h2 className="text-xl font-semibold mb-4">Queue</h2>
			<div className="space-y-2">
				{currentTrack && (
					<div className="flex items-center space-x-4 p-3 rounded-md bg-spotify-green/20">
						<img src={currentTrack.albumImage} alt={currentTrack.title} className="w-12 h-12 rounded-md" />
						<div className="flex-1 min-w-0">
							<p className="font-medium truncate text-spotify-green">{currentTrack.title}</p>
							<p className="text-sm text-white/60 truncate">{currentTrack.artist}</p>
						</div>
						<div className="flex items-center space-x-2 text-sm text-white/60">
							<User className="w-4 h-4" />
							<span>{currentTrack.user}</span>
						</div>
					</div>
				)}

				{queue.map(item => (
					<div
						key={item.id}
						className="flex items-center space-x-4 p-3 rounded-md bg-black/20 hover:bg-black/30 transition-colors"
					>
						<img src={item.albumImage} alt={item.title} className="w-12 h-12 rounded-md" />
						<div className="flex-1 min-w-0">
							<p className="font-medium truncate">{item.title}</p>
							<p className="text-sm text-white/60 truncate">{item.artist}</p>
						</div>
						<div className="flex items-center space-x-2">
							<div className="flex items-center space-x-2 text-sm text-white/60">
								<User className="w-4 h-4" />
								<span>{item.user}</span>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => removeFromQueue(item.id)}
								className="text-white/60 hover:text-white"
							>
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
