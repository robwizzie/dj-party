import { useState } from 'react';
import { Button } from '../ui/button';
import { Copy } from 'lucide-react';
import { ChangeSettingsDialog } from './ChangeSettingsDialog';
import usePartyStore from '@/contexts/usePartyStore';
import { toast } from 'sonner';

export function PartyHeader({ partyId }) {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const isHost = usePartyStore(state => state.isHost);

	const copyPartyCode = () => {
		navigator.clipboard.writeText(partyId);
		toast.success('Party code copied to clipboard!');
	};

	return (
		<div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-brand-background-light rounded-lg mb-6">
			<div className="flex flex-col mb-4 sm:mb-0">
				<h1 className="text-2xl font-bold">Party Room</h1>
				<div className="flex items-center space-x-2">
					<span className="text-sm text-white/60">Party Code:</span>
					<code className="bg-black/30 px-2 py-1 rounded">{partyId}</code>
					<Button variant="ghost" size="sm" onClick={copyPartyCode}>
						<Copy className="w-4 h-4" />
					</Button>
          </div>
				</div>
				<div className="flex space-x-4">
					{isHost && (
						<Button variant="ghost" onClick={() => setIsSettingsOpen(true)}>
							Change Mode
						</Button>
					)}
					<Button>Invite Friends</Button>
				</div>
			</div>

			<ChangeSettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
		</>
	);
}
