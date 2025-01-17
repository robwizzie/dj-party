import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import PartySettings from './PartySettings';
import usePartyStore from '@/contexts/usePartyStore';
import { toast } from 'sonner';

export function ChangeSettingsDialog({ open, onOpenChange }) {
	const updateSettings = usePartyStore(state => state.updateSettings);
	const settings = usePartyStore(state => state.settings);
	const isHost = usePartyStore(state => state.isHost);

	if (!isHost) return null;

	const handleSaveSettings = () => {
		console.log('Saving updated settings:', settings);
		toast.success('Party settings updated successfully');
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="min-w-[700px] max-h-[700px] flex flex-col pointer-events-auto p-0">
				<DialogHeader className="px-6 py-4 border-b border-white/10">
					<DialogTitle className="text-2xl font-bold">Party Settings</DialogTitle>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto px-6 py-4">
					<PartySettings />
				</div>

				<DialogFooter className="px-6 py-4 border-t border-white/10 mt-0">
					<div className="flex justify-end gap-4">
						<Button variant="ghost" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button onClick={handleSaveSettings}>Save Changes</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
