import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

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
			<DialogContent className="min-w-[500px] flex flex-col pointer-events-auto p-0">
				<DialogHeader className="px-6 py-4 border-b border-white/10">
					<DialogTitle className="text-2xl font-bold">Join a Party</DialogTitle>
					<DialogDescription className="text-white/60 mt-2">
						Enter the party ID shared with you to join the music session.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="flex-1">
					<div className="px-6 py-4">
						<Input
							placeholder="Enter party ID"
							value={partyId}
							onChange={e => {
								setPartyId(e.target.value);
								setError('');
							}}
							className="w-full"
						/>

						{error && (
							<div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 mt-3">
								<p className="text-red-500 text-sm flex items-center gap-2">
									<AlertCircle className="h-4 w-4" />
									{error}
								</p>
							</div>
						)}
					</div>

					<DialogFooter className="px-6 py-4 border-t border-white/10">
						<div className="flex justify-end gap-4">
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
					</DialogFooter>
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
