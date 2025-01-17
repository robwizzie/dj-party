import React, { useState, useEffect } from 'react';
import { Timer, Music2, Users, Trophy } from 'lucide-react';
import { Search } from './Search';
import usePlayerStore from '../../contexts/usePlayerStore';
import { Button } from '../ui/button';
import PropTypes from 'prop-types';

export function Voting() {
	const [phase, setPhase] = useState('selection');
	const [selectedSongs, setSelectedSongs] = useState([]);
	const [hasVoted, setHasVoted] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState(10);
	const [winner, setWinner] = useState(null);
	const addToQueue = usePlayerStore(state => state.addToQueue);

	useEffect(() => {
		if (phase !== 'voting' || timeRemaining <= 0) return;

		const timer = setInterval(() => {
			setTimeRemaining(prev => prev - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [phase, timeRemaining]);

	useEffect(() => {
		if (timeRemaining <= 0 && phase === 'voting') {
			const winningTrack = selectedSongs.reduce((prev, curr) => (curr.votes > prev.votes ? curr : prev), selectedSongs[0]);

			setWinner(winningTrack);
			setPhase('results');
			addToQueue(winningTrack.track);

			// Reset after showing results
			setTimeout(() => {
				setPhase('selection');
				setSelectedSongs([]);
				setHasVoted(false);
				setTimeRemaining(10);
				setWinner(null);
			}, 5000);
		}
	}, [timeRemaining, phase, selectedSongs, addToQueue]);

	const handleAddToQueue = track => {
		if (selectedSongs.length >= 3) return;

		setSelectedSongs(prev => [
			...prev,
			{
				track,
				votes: 0,
				userId: 'current-user'
			}
		]);

		if (selectedSongs.length === 2) {
			setPhase('voting');
			setTimeRemaining(10);
		}
	};

	const handleVote = trackId => {
		if (phase !== 'voting' || hasVoted) return;

		setSelectedSongs(prev => prev.map(song => (song.track.id === trackId ? { ...song, votes: song.votes + 1 } : song)));
		setHasVoted(true);
	};

	const getTotalVotes = () => selectedSongs.reduce((sum, song) => sum + song.votes, 0);
	const getVotePercentage = votes => {
		const total = getTotalVotes();
		return total > 0 ? (votes / total) * 100 : 0;
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-bold text-white flex items-center gap-2">
					<Music2 className="w-6 h-6" />
					{phase === 'selection'
						? `Choose Songs (${selectedSongs.length}/3)`
						: phase === 'results'
							? 'Winner!'
							: 'Vote for Next Song'}
				</h2>
				<div className="flex items-center gap-4">
					{phase === 'voting' && (
						<span className="flex items-center gap-2 text-white/60">
							<Timer className="w-5 h-5" />
							{timeRemaining}s
						</span>
					)}
					<span className="flex items-center gap-2 text-white/60">
						<Users className="w-5 h-5" />
						{selectedSongs.length} Songs
					</span>
				</div>
			</div>

			{phase === 'selection' && selectedSongs.length < 3 && (
				<Search
					customButton={track => (
						<Button variant="ghost" size="sm" onClick={() => handleAddToQueue(track)}>
							Cast Vote
						</Button>
					)}
				/>
			)}

			{selectedSongs.length > 0 && (
				<div className="space-y-2 mt-4">
					{phase === 'results' && winner && (
						<div className="bg-brand-primary/10 p-6 rounded-lg mb-6 animate-fadeIn">
							<div className="flex items-center justify-center gap-4 mb-4">
								<Trophy className="w-8 h-8 text-brand-secondary animate-bounce" />
								<h3 className="text-2xl font-bold text-white">Winning Song!</h3>
							</div>
							<div className="flex items-center gap-4 bg-black/20 p-4 rounded-lg">
								<img
									src={winner.track.album.images[1].url}
									alt={winner.track.album.name}
									className="w-20 h-20 rounded animate-scaleIn"
								/>
								<div>
									<h4 className="text-xl font-bold text-white">{winner.track.name}</h4>
									<p className="text-brand-secondary">{winner.track.artists.map(a => a.name).join(', ')}</p>
									<p className="text-white/60 mt-2">Added to queue</p>
								</div>
							</div>
						</div>
					)}

					<div className="space-y-2">
						{selectedSongs.map(submission => {
							const votePercentage = getVotePercentage(submission.votes);
							const isWinner = phase === 'results' && winner?.track.id === submission.track.id;

							return (
								<div
									key={submission.track.id}
									onClick={() => handleVote(submission.track.id)}
									className={`
                    relative p-4 rounded-lg border transition-all duration-200
                    ${
						phase === 'voting' && !hasVoted
							? 'cursor-pointer border-white/10 hover:border-brand-secondary hover:bg-white/5'
							: 'border-white/10'
					}
                    ${isWinner ? 'bg-brand-primary/20 border-brand-secondary' : ''}
                  `}>
									<div className="flex items-center gap-4">
										<img
											src={submission.track.album.images[2].url}
											alt={submission.track.album.name}
											className={`w-12 h-12 rounded ${isWinner ? 'animate-pulse' : ''}`}
										/>
										<div className="flex-1">
											<h3 className="font-medium text-white">{submission.track.name}</h3>
											<p className="text-sm text-white/60">
												{submission.track.artists.map(a => a.name).join(', ')}
											</p>
											{submission.votes > 0 && (
												<div className="mt-2 relative h-1 bg-white/10 rounded-full overflow-hidden">
													<div
														className="absolute top-0 left-0 h-full bg-brand-primary transition-all duration-500"
														style={{ width: `${votePercentage}%` }}
													/>
												</div>
											)}
										</div>
										{submission.votes > 0 && (
											<div className="text-2xl font-bold text-brand-secondary flex items-center gap-2">
												{submission.votes}
												<span className="text-sm text-white/60">({votePercentage.toFixed(0)}%)</span>
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{phase === 'voting' && (
				<p className="text-center text-white/60">
					{hasVoted
						? 'Vote submitted! Waiting for other players...'
						: `Select a song to vote (${timeRemaining}s remaining)`}
				</p>
			)}
		</div>
	);
}

Voting.propTypes = {
	customButton: PropTypes.func
};
