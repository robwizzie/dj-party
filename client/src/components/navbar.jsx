import React from 'react';
import { Button } from './ui/button/index.js';
import { Music2, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useSpotifyAuthStore from '../contexts/useSpotifyAuthStore.js';
import usePartyStore from '../contexts/usePartyStore.js';

export function Navbar() {
	const navigate = useNavigate();
	const { user, logout, accessToken, isLoading } = useSpotifyAuthStore();
	const createParty = usePartyStore(state => state.createParty);

	const handleCreateParty = async () => {
		try {
			const partyId = await createParty();
			navigate(`/party/${partyId}`);
		} catch (error) {
			console.error('Failed to create party:', error);
			// Optionally show an error toast/notification here
		}
	};

	return (
		<nav className="border-b border-white/10 bg-spotify-black w-full">
			<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
				<Link to="/" className="flex items-center space-x-2">
					<Music2 className="w-8 h-8 text-spotify-green" />
					<span className="text-xl font-bold text-white">DJ Party</span>
				</Link>

				<div className="flex items-center space-x-4">
					{accessToken ? (
						<>
							{user && (
								<div className="flex items-center space-x-2 text-white/80">
									{user.images?.[0]?.url && (
										<img src={user.images[0].url} alt="Profile" className="w-8 h-8 rounded-full" />
									)}
									<span className="hidden sm:inline">{user.display_name}</span>
								</div>
							)}
							<Button variant="ghost" onClick={logout} size="sm">
								<LogOut className="w-4 h-4 mr-2" />
								<span className="hidden sm:inline">Logout</span>
							</Button>
							<Button onClick={handleCreateParty} disabled={isLoading}>
								{isLoading ? (
									<div className="flex items-center space-x-2">
										<div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
										<span>Connecting...</span>
									</div>
								) : (
									'Create New Party'
								)}
							</Button>
						</>
					) : (
						<Button onClick={() => navigate('/')}>Connect Spotify</Button>
					)}
				</div>
			</div>
		</nav>
	);
}
