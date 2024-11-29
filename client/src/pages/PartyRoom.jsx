// src/pages/party-room.jsx
import { PartyHeader } from '../components/PartyRoom/PartyHeader';
import { Queue } from '../components/PartyRoom/Queue';
import { Player } from '../components/PartyRoom/Player';
import { Search } from '../components/PartyRoom/Search';
import { useParams } from 'react-router-dom';
import useSpotifyAuthStore from '../contexts/useSpotifyAuthStore';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

function PartyRoomContent() {
	const { partyId } = useParams();
	const user = useSpotifyAuthStore(store => store.user);

	useEffect(() => {
		socket.emit('join-party', partyId);

		socket.on('receive-message', data => {
			console.log(data);
		});

		window.sendMessage = function (message) {
			socket.emit('send-message', { partyId, message });
		};

		return () => socket.off('receive-message');
	}, [partyId]);

	return (
		<div className="space-y-6">
			<RoomHeader partyId={partyId} host={user?.display_name} />
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					<Player />
					<div className="bg-spotify-gray rounded-lg p-4">
						<h2 className="text-xl font-semibold mb-4">Search Songs</h2>
						<Search />
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
	return <PartyRoomContent />;
}
