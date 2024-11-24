import { Button } from '../ui/button';
import { Copy } from 'lucide-react';

export function RoomHeader({ roomId = 'TEST123' }) {
	const copyRoomCode = () => {
		navigator.clipboard.writeText(roomId);
	};

	return (
		<div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-spotify-gray rounded-lg mb-6">
			<div className="flex flex-col mb-4 sm:mb-0">
				<h1 className="text-2xl font-bold">Party Room</h1>
				<div className="flex items-center space-x-2">
					<span className="text-sm text-white/60">Room Code:</span>
					<code className="bg-black/30 px-2 py-1 rounded">{roomId}</code>
					<Button variant="ghost" size="sm" onClick={copyRoomCode}>
						<Copy className="w-4 h-4" />
					</Button>
				</div>
			</div>
			<div className="flex space-x-4">
				<Button variant="ghost">Change Mode</Button>
				<Button>Invite Friends</Button>
			</div>
		</div>
	);
}
