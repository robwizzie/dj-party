import { PartyHeader } from '../components/PartyRoom/PartyHeader';
import { Queue } from '../components/PartyRoom/Queue';
import { Player } from '../components/PartyRoom/Player';
import { Voting } from '../components/PartyRoom/Voting';
import DJDashboard from '../components/PartyRoom/DJDashboard';
import { useParams } from 'react-router-dom';
import useSpotifyAuthStore from '../contexts/useSpotifyAuthStore';
import { useEffect } from 'react';
import usePartyStore from '../contexts/usePartyStore';

function PartyRoomContent() {
	const { partyId: urlPartyId } = useParams();
	const user = useSpotifyAuthStore(store => store.user);
	const partyId = usePartyStore(state => state.partyId);
	const joinParty = usePartyStore(state => state.joinParty);
	const status = usePartyStore(state => state.status);
	const settings = usePartyStore(state => state.settings);
	const isHost = usePartyStore(state => state.isHost);

	useEffect(() => {
		if (partyId === urlPartyId || status === 'joining') return;
		joinParty(urlPartyId);
	}, [urlPartyId]);

	return partyId ? (
		<div className="space-y-6">
			<PartyHeader partyId={partyId} host={user?.display_name} />

			{/* Show DJ Dashboard if it's a DJ party and user is host */}
			{settings?.isDJParty && isHost && (
				<div className="mb-6">
					<DJDashboard />
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					<Player />
					<div className="bg-brand-background-light rounded-lg p-4">
						<Voting />
					</div>
				</div>
				<div className="lg:col-span-1">
					<Queue />
				</div>
			</div>
		</div>
	) : (
		<div>
			{/** TODO add better loading state*/}
			{status}
		</div>
	);
}

export function PartyRoom() {
	return <PartyRoomContent />;
}
