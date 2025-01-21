import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import PartySettings from './PartySettings';
import usePartyStore from '@/contexts/usePartyStore';
import { Music, Settings, Flame, Users, MessageSquare } from 'lucide-react';

export function CreatePartyDialog({ open, onOpenChange, onCreateParty, isLoading, partyType = 'regular' }) {
	const initSettings = usePartyStore(state => state.initSettings);

	useEffect(() => {
		if (open) {
			initSettings();
		}
	}, [open, initSettings]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="min-w-[700px] max-h-[700px] flex flex-col pointer-events-auto p-0">
				<DialogHeader className="px-6 py-4 border-b border-white/10">
					<DialogTitle className="text-2xl font-bold flex items-center gap-2">
						{partyType === 'dj' ? (
							<>
								<Music className="w-6 h-6" />
								Create DJ Party
							</>
						) : (
							<>
								<Settings className="w-6 h-6" />
								Create Party
							</>
						)}
					</DialogTitle>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
					<PartySettings />

					{partyType === 'dj' && (
						<div className="space-y-4">
							<h3 className="text-xl font-semibold">DJ Dashboard Features</h3>
							<div className="bg-white/5 rounded-lg p-4">
								<ul className="space-y-4 text-white/80">
									<li className="flex items-center gap-3">
										<Music className="w-5 h-5 text-purple-400" />
										<div>
											<h4 className="font-medium">Live Song Voting</h4>
											<p className="text-sm text-white/60">Let your audience vote on the next track</p>
										</div>
									</li>
									<li className="flex items-center gap-3">
										<Flame className="w-5 h-5 text-red-400" />
										<div>
											<h4 className="font-medium">Hype Moments</h4>
											<p className="text-sm text-white/60">
												Trigger special effects and crowd interactions
											</p>
										</div>
									</li>
									<li className="flex items-center gap-3">
										<Users className="w-5 h-5 text-blue-400" />
										<div>
											<h4 className="font-medium">Dance Groups</h4>
											<p className="text-sm text-white/60">
												Automatically form dance crews from party members
											</p>
										</div>
									</li>
									<li className="flex items-center gap-3">
										<MessageSquare className="w-5 h-5 text-green-400" />
										<div>
											<h4 className="font-medium">DJ Shoutouts</h4>
											<p className="text-sm text-white/60">
												Send messages that appear on all party screens
											</p>
										</div>
									</li>
								</ul>
							</div>
						</div>
					)}
				</div>

				<DialogFooter className="px-6 py-4 border-t border-white/10 mt-0">
					<div className="flex justify-end gap-4">
						<Button variant="ghost" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button
							onClick={onCreateParty}
							disabled={isLoading}
							className={
								partyType === 'dj'
									? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
									: ''
							}>
							{isLoading ? (
								<div className="flex items-center space-x-2">
									<div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
									<span>Creating...</span>
								</div>
							) : (
								`Create ${partyType === 'dj' ? 'DJ Party' : 'Party'}`
							)}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
