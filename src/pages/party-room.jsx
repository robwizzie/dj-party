import { RoomHeader } from '../components/party-room/room-header';
import { Queue } from '../components/party-room/queue';

export function PartyRoom() {
  return (
    <div className="space-y-6">
      <RoomHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Player will go here later */}
          <div className="bg-spotify-gray rounded-lg p-4 h-[400px] flex items-center justify-center">
            <p className="text-white/60">Player coming soon...</p>
          </div>
        </div>
        <div className="lg:col-span-1">
          <Queue />
        </div>
      </div>
    </div>
  );
}