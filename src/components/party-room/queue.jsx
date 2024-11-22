import { Music, User } from 'lucide-react';

export function Queue() {
  // This will be populated with real data later
  const queueItems = [
    { id: 1, title: "Bohemian Rhapsody", artist: "Queen", user: "John", isPlaying: true },
    { id: 2, title: "Sweet Child O' Mine", artist: "Guns N' Roses", user: "Sarah" },
    { id: 3, title: "Hotel California", artist: "Eagles", user: "Mike" },
  ];

  return (
    <div className="bg-spotify-gray rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Queue</h2>
      <div className="space-y-2">
        {queueItems.map((item) => (
          <div 
            key={item.id}
            className={`flex items-center space-x-4 p-3 rounded-md ${
              item.isPlaying ? 'bg-spotify-green/20' : 'bg-black/20'
            }`}
          >
            <Music className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.title}</p>
              <p className="text-sm text-white/60 truncate">{item.artist}</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-white/60">
              <User className="w-4 h-4" />
              <span>{item.user}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}