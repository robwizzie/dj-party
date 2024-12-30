import { useState } from 'react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import useSpotifyAuthStore from '../contexts/useSpotifyAuthStore';
import usePartyStore from '../contexts/usePartyStore';
import { JoinPartyDialog } from '../components/PartyRoom/JoinPartyDialog';
import { CreatePartyDialog } from '../components/PartyRoom/CreatePartyDialog';
import { toast } from 'sonner';

export function Home() {
	const { login, accessToken, user, isLoading, error } = useSpotifyAuthStore();
	const navigate = useNavigate();
	const createParty = usePartyStore(state => state.createParty);
	const joinParty = usePartyStore(state => state.joinParty);

	const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [isJoining, setIsJoining] = useState(false);
	const [isCreating, setIsCreating] = useState(false);

	async function handleCreateParty() {
		setIsCreating(true);
		toast.promise(
			(async () => {
				const partyId = await createParty();
				setIsCreateDialogOpen(false);
				navigate(`/party/${partyId}`);
			})(),
			{
				loading: 'Creating your party...',
				success: 'Party created! Time to play some music 🎵',
				error: 'Failed to create party'
			}
		);
		setIsCreating(false);
	}

	async function handleJoinParty(partyId) {
		setIsJoining(true);
		try {
			await toast.promise(joinParty(partyId), {
				loading: 'Joining party...',
				success: 'Successfully joined the party! 🎉',
				error: 'Failed to join party'
			});
			setTimeout(() => {
				setIsJoinDialogOpen(false);
				navigate(`/party/${partyId}`);
			}, 100);
		} catch (error) {
			toast.error('Unable to join party. Please check the party ID and try again.');
		} finally {
			setIsJoining(false);
		}
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-[calc(100vh-96px)] w-full">
			<div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center space-y-8">
					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">DJ Party</h1>

					{user ? (
						<>
							<div className="flex items-center justify-center space-x-2">
								{user.images?.[0]?.url && (
									<img src={user.images[0].url} alt="Profile" className="w-8 h-8 rounded-full" />
								)}
								<p className="text-white/80">Welcome, {user.display_name}!</p>
							</div>

							<div className="max-w-2xl mx-auto space-y-6">
								<p className="text-lg sm:text-xl text-white/80">
									{accessToken
										? "You're connected! Create a party to start the music."
										: 'Create a party, invite friends, and take turns being the DJ!'}
								</p>

								{error && <p className="text-red-500 bg-red-500/10 rounded-lg p-3">{error.message}</p>}

								<div className="flex gap-2 mx-auto my-3 w-fit">
									<Button
										onClick={() => setIsCreateDialogOpen(true)}
										size="lg"
										className="w-full sm:w-auto px-8 py-3"
										disabled={isLoading}>
										Create New Party
									</Button>

									<Button
										onClick={() => setIsJoinDialogOpen(true)}
										size="lg"
										className="w-full sm:w-auto px-8 py-3"
										disabled={isLoading}>
										Join Existing Party
									</Button>
								</div>
							</div>
						</>
					) : (
						<div className="max-w-2xl mx-auto space-y-6">
							<p className="text-lg sm:text-xl text-white/80">
								{accessToken
									? "You're connected! Create a party to start the music."
									: 'Create a party, invite friends, and take turns being the DJ!'}
							</p>

							{error && <p className="text-red-500 bg-red-500/10 rounded-lg p-3">{error.message}</p>}

							<Button onClick={login} size="lg" className="w-full sm:w-auto px-8 py-3" disabled={isLoading}>
								{isLoading ? (
									<div className="flex items-center space-x-2">
										<div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
										<span>Connecting...</span>
									</div>
								) : (
									'Connect with Spotify'
								)}
							</Button>
						</div>
					)}
				</div>
			</div>

			<CreatePartyDialog
				open={isCreateDialogOpen}
				onOpenChange={setIsCreateDialogOpen}
				onCreateParty={handleCreateParty}
				isLoading={isCreating}
			/>

			<JoinPartyDialog
				open={isJoinDialogOpen}
				onOpenChange={setIsJoinDialogOpen}
				onJoin={handleJoinParty}
				isLoading={isJoining}
			/>
		</div>
	);
}
