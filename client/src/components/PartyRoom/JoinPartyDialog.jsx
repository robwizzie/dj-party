import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

export function JoinPartyDialog({ open, onOpenChange, onJoin, isLoading }) {
	const [partyId, setPartyId] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async e => {
		e.preventDefault();

		if (!partyId.trim()) {
			setError('Please enter a party ID');
			return;
		}

		try {
			await onJoin(partyId);
		} catch (err) {
			setError(err.message || 'Failed to join party');
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Join a Party</DialogTitle>
					<DialogDescription>Enter the party ID shared with you to join the music session.</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<input
							placeholder="Enter party ID"
							value={partyId}
							onChange={e => {
								setPartyId(e.target.value);
								setError('');
							}}
							className="w-full px-3 py-2 my-3 rounded-md bg-black/20 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-spotify-green focus:ring-offset-2 focus:ring-offset-black"
						/>
						{error && (
							<div className="bg-red-500/10 border border-red-500/20 rounded-md p-2 mt-2">
								<p className="text-red-500 text-sm flex items-center gap-2">
									<AlertCircle className="h-4 w-4" />
									{error}
								</p>
							</div>
						)}
					</div>
					<div className="flex justify-end gap-2">
						<Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? (
								<div className="flex items-center gap-2">
									<Loader2 className="h-4 w-4 animate-spin" />
									Joining...
								</div>
							) : (
								'Join Party'
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

JoinPartyDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onOpenChange: PropTypes.func.isRequired,
	onJoin: PropTypes.func.isRequired,
	isLoading: PropTypes.bool
};
