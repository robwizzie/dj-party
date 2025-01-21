import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Timer, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import usePartyStore from '@/contexts/usePartyStore';
import { toast } from 'sonner';

export function SimpleVote({ title, description, type, onVoteSubmit, onPass, onFail, duration = 30 }) {
	const [votes, setVotes] = useState({ yes: [], no: [] });
	const [hasVoted, setHasVoted] = useState(false);
	const [timeLeft, setTimeLeft] = useState(duration);
	const [isActive, setIsActive] = useState(true);
	const [vibeRating, setVibeRating] = useState(50); // Default to 50%

	const { users, settings } = usePartyStore();
	const totalUsers = users.length;
	const requiredVotes = Math.ceil((totalUsers * (settings?.skipThreshold?.value || 50)) / 100);

	useEffect(() => {
		if (!isActive) return;

		const timer = setInterval(() => {
			setTimeLeft(prev => {
				if (prev <= 1) {
					clearInterval(timer);
					if (type !== 'vibe') {
						handleVoteEnd(true);
					}
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [isActive, type]);

	useEffect(() => {
		if (type === 'vibe') return;

		if (votes.yes.length === totalUsers) {
			handleVoteEnd(false);
		} else if (votes.yes.length >= requiredVotes) {
			handleVoteEnd(false);
		} else if (totalUsers - votes.no.length < requiredVotes) {
			handleVoteEnd(false);
		}
	}, [votes, requiredVotes, totalUsers, type]);

	const handleVoteEnd = isTimeout => {
		if (type === 'vibe') return;

		setIsActive(false);
		const yesVotes = votes.yes.length;
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

	const getVibeEmoji = rating => {
		if (rating < 20) return '😴';
		if (rating < 40) return '🙂';
		if (rating < 60) return '😊';
		if (rating < 80) return '🎵';
		return '🔥';
	};

	const handleVote = value => {
		if (hasVoted) return;

		if (type === 'vibe') {
			onVoteSubmit?.(value);
		} else {
			setVotes(prev => ({
				...prev,
				[value === 'yes' ? 'yes' : 'no']: [...prev[value === 'yes' ? 'yes' : 'no'], 'userId']
			}));
			toast.info(value === 'yes' ? '👍 Vote recorded' : '👎 Vote recorded');
		}
		setHasVoted(true);
	};

	const handleVibeSubmit = () => {
		handleVote(vibeRating);
		toast.success(`Vibe rating submitted: ${vibeRating}% ${getVibeEmoji(vibeRating)}`);
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
					{type !== 'vibe' && (
						<span className="flex items-center gap-2 text-white/60">
							<Users className="w-5 h-5" />
							{votes.yes.length}/{requiredVotes}
						</span>
					)}
				</div>
			</div>

			{type !== 'vibe' && (
				<div className="mt-2 relative h-1 bg-white/10 rounded-full overflow-hidden">
					<div
						className="absolute top-0 left-0 h-full bg-brand-primary transition-all duration-500"
						style={{ width: `${votePercentage}%` }}
					/>
				</div>
			)}

			{!hasVoted && (
				<div className="space-y-4">
					{type === 'vibe' ? (
						<div className="space-y-6">
							<div className="space-y-4">
								<div className="flex justify-between text-sm text-white/60">
									<span>Low Energy 😴</span>
									<span>High Energy 🔥</span>
								</div>
								<Slider
									value={[vibeRating]}
									onValueChange={([value]) => setVibeRating(value)}
									min={1}
									max={100}
									step={1}
									className="py-4"
								/>
								<div className="text-center">
									<span className="text-4xl font-bold text-white">{vibeRating}%</span>
									<span className="text-3xl ml-2">{getVibeEmoji(vibeRating)}</span>
								</div>
							</div>
							<div className="flex justify-end">
								<Button onClick={handleVibeSubmit} className="px-6">
									Submit Rating
								</Button>
							</div>
						</div>
					) : (
						<div className="flex gap-2 justify-end">
							<Button variant="ghost" onClick={() => handleVote('no')}>
								No
							</Button>
							<Button onClick={() => handleVote('yes')}>Yes</Button>
						</div>
					)}
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
	type: PropTypes.oneOf(['skip', 'remove', 'vibe', 'zones']).isRequired,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string,
			label: PropTypes.string
		})
	),
	onVoteSubmit: PropTypes.func
};

export default SimpleVote;
