import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import useSpotifyAuthStore from '../contexts/useSpotifyAuthStore';
import usePartyStore from '../contexts/usePartyStore';

export function Home() {
	const { login, accessToken, user, isLoading, error } = useSpotifyAuthStore();
	const navigate = useNavigate();
	const createParty = usePartyStore(state => state.createParty);
	const joinParty = usePartyStore(state => state.joinParty);

	async function handleCreateParty() {
		const partyId = await createParty();
		navigate(`/party/${partyId}`);
	}

	async function handleJoinParty() {
		const partyId = prompt('Enter party ID:');
		if (!partyId) return alert('Invalid party ID');
		await joinParty(partyId);
		setTimeout(() => navigate(`/party/${partyId}`), 100);
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

								{error && <p className="text-red-500 bg-red-500/10 rounded-lg p-3">{error}</p>}

								<div className="flex gap-2 mx-auto my-3 w-fit">
									<Button
										onClick={handleCreateParty}
										size="lg"
										className="w-full sm:w-auto px-8 py-3"
										disabled={isLoading}
									>
										{isLoading ? (
											<div className="flex items-center space-x-2">
												<div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
												<span>Connecting...</span>
											</div>
										) : (
											'Create New Party'
										)}
									</Button>

									<Button
										onClick={handleJoinParty}
										size="lg"
										className="w-full sm:w-auto px-8 py-3"
										disabled={isLoading}
									>
										{isLoading ? (
											<div className="flex items-center space-x-2">
												<div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
												<span>Connecting...</span>
											</div>
										) : (
											'Join Existing Party'
										)}
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

							{error && <p className="text-red-500 bg-red-500/10 rounded-lg p-3">{error}</p>}

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
		</div>
	);
}
