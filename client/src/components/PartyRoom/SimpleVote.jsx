import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Timer, Users } from 'lucide-react';
import { Button } from '../ui/button';
import usePartyStore from '@/contexts/usePartyStore';
import { toast } from 'sonner';

export function SimpleVote({ title, description, onPass, onFail, duration = 30, type }) {
	const [votes, setVotes] = useState({ yes: [], no: [] });
	const [hasVoted, setHasVoted] = useState(false);
	const [timeLeft, setTimeLeft] = useState(duration);
	const [isActive, setIsActive] = useState(true);

	const { users, settings } = usePartyStore();
	const totalUsers = users.length;
	const requiredVotes = Math.ceil((totalUsers * (settings?.skipThreshold?.value || 50)) / 100);

	useEffect(() => {
		if (!isActive) return;

		const timer = setInterval(() => {
			setTimeLeft(prev => {
				if (prev <= 1) {
					clearInterval(timer);
					handleVoteEnd(true); // pass true to indicate timeout
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [isActive]);

	useEffect(() => {
		// If everyone voted yes, pass immediately
		if (votes.yes.length === totalUsers) {
			handleVoteEnd(false);
		}
		// If we reached required votes, pass immediately
		else if (votes.yes.length >= requiredVotes) {
			handleVoteEnd(false);
		}
		// If it's impossible to reach required votes with remaining voters, fail immediately
		else if (totalUsers - votes.no.length < requiredVotes) {
			handleVoteEnd(false);
		}
	}, [votes, requiredVotes, totalUsers]);

	const handleVoteEnd = isTimeout => {
		setIsActive(false);
		const yesVotes = votes.yes.length;

		// Skip conditions:
		// 1. Everyone voted yes
		// 2. Met required votes threshold
		// 3. On timeout: majority voted yes
		const shouldPass =
			yesVotes === totalUsers || yesVotes >= requiredVotes || (isTimeout && type === 'skip' && yesVotes > totalUsers / 2);

		if (shouldPass) {
			toast.success(`Vote passed: ${title}`);
			onPass?.();
		} else {
			toast.info(`Vote failed: ${title}`);
			onFail?.();
		}
	};

	const handleVote = voteType => {
		if (hasVoted) return;

		setVotes(prev => ({
			...prev,
			[voteType]: [...prev[voteType], 'userId'] // Replace with actual user ID
		}));
		setHasVoted(true);

		toast.info(voteType === 'yes' ? '👍 Vote recorded' : '👎 Vote recorded');
	};

	if (!isActive) return null;

	const votePercentage = (votes.yes.length / requiredVotes) * 100;

	return (
		<div className="bg-brand-background-light p-4 rounded-lg space-y-4">
			<div className="flex justify-between items-start">
				<div>
					<h3 className="text-lg font-semibold text-white">{title}</h3>
					<p className="text-sm text-white/60">{description}</p>
				</div>
				<div className="flex items-center gap-4">
					<span className="flex items-center gap-2 text-white/60">
						<Timer className="w-5 h-5" />
						{timeLeft}s
					</span>
					<span className="flex items-center gap-2 text-white/60">
						<Users className="w-5 h-5" />
						{votes.yes.length}/{requiredVotes}
					</span>
				</div>
			</div>

			<div className="mt-2 relative h-1 bg-white/10 rounded-full overflow-hidden">
				<div
					className="absolute top-0 left-0 h-full bg-brand-primary transition-all duration-500"
					style={{ width: `${votePercentage}%` }}
				/>
			</div>

			{!hasVoted && (
				<div className="flex gap-2 justify-end">
					<Button variant="ghost" onClick={() => handleVote('no')}>
						No
					</Button>
					<Button onClick={() => handleVote('yes')}>Yes</Button>
				</div>
			)}

			{hasVoted && <p className="text-center text-white/60">Vote submitted! Waiting for other players...</p>}
		</div>
	);
}

SimpleVote.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	onPass: PropTypes.func,
	onFail: PropTypes.func,
	duration: PropTypes.number,
	type: PropTypes.oneOf(['skip', 'remove']).isRequired
};

export default SimpleVote;
