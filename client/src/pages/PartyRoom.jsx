// src/pages/party-room.jsx
import { RoomHeader } from '../components/PartyRoom/RoomHeader';
import { Queue } from '../components/PartyRoom/Queue';
import { Player } from '../components/PartyRoom/Player';
import { Search } from '../components/PartyRoom/Search';
import { useParams } from 'react-router-dom';
import { useQueue } from '../contexts/queue-context';
import { QueueProvider } from '../contexts/queue-context';
import useSpotifyAuthStore from '../contexts/useSpotifyAuthStore';
import usePlayerStore from '../contexts/usePlayerStore';

function PartyRoomContent() {
	const { roomId } = useParams();
	const user = useSpotifyAuthStore(store => store.user);
	const { deviceId, isActive } = usePlayerStore();
	const { addToQueue, playNext } = useQueue();

	const handleTrackSelect = track => {
		console.log('Selected track:', track);
		addToQueue(track);
	};

	const handleTrackEnd = () => {
		console.log('Track ended, playing next...');
		playNext();
	};

	return (
		<div className="space-y-6">
			<RoomHeader roomId={roomId} host={user?.display_name} />
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					<Player onTrackEnd={handleTrackEnd} />
					<div className="bg-spotify-gray rounded-lg p-4">
						<h2 className="text-xl font-semibold mb-4">Search Songs</h2>
						<Search onTrackSelect={handleTrackSelect} />
					</div>
				</div>
				<div className="lg:col-span-1">
					<Queue />
				</div>
			</div>
		</div>
	);
}

export function PartyRoom() {
	return (
		<QueueProvider>
			<PartyRoomContent />
		</QueueProvider>
	);
}
