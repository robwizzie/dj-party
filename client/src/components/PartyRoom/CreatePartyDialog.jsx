import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import PartySettings from './PartySettings';
import usePartyStore from '@/contexts/usePartyStore';

export function CreatePartyDialog({ open, onOpenChange, onCreateParty, isLoading }) {
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
					<DialogTitle className="text-2xl font-bold">Create New Party</DialogTitle>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto px-6 py-4">
					<PartySettings />
				</div>

				<DialogFooter className="px-6 py-4 border-t border-white/10 mt-0">
					<div className="flex justify-end gap-4">
						<Button variant="ghost" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button onClick={onCreateParty} disabled={isLoading}>
							{isLoading ? (
								<div className="flex items-center space-x-2">
									<div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
									<span>Creating...</span>
								</div>
							) : (
								'Create Party'
							)}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
