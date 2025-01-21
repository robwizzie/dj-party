import React, { useState, useEffect } from 'react';
import {
	Music,
	ThumbsUp,
	Users,
	MessageSquare,
	Sparkles,
	Flame,
	Heart,
	Trophy,
	Timer,
	Camera,
	Clock,
	Lightbulb,
	Music2,
	Zap,
	Waves
} from 'lucide-react';
import usePartyStore from '../../contexts/usePartyStore';
import useVotingStore from '../../contexts/useVotingStore';
import { useSpotifyPlayer } from '../../hooks/use-spotify-player';
import { socket } from '../../lib/socket';
import { SimpleVote } from './SimpleVote';
import { Button } from '../ui/button';
import { useDJDashboard } from '../../hooks/use-dj-dashboard';
import { toast } from 'sonner';

const DJDashboard = () => {
	const { settings, users, updateSettings } = usePartyStore();
	const { phase, selectedSongs, submitSong } = useVotingStore();
	const { isReady, controls, isPaused } = useSpotifyPlayer();
	const [currentVote, setCurrentVote] = useState(null);
	const { stats: partyStats, setStats: setPartyStats } = useDJDashboard();

	useEffect(() => {
		socket.on('party:vibe_update', handleVibeUpdate);
		socket.on('party:message', handleNewMessage);

		return () => {
			socket.off('party:vibe_update');
			socket.off('party:message');
		};
	}, []);

	const handleVibeUpdate = ({ level }) => {
		setPartyStats(prev => ({
			...prev,
			vibeLevel: level
		}));
	};

	const handleNewMessage = () => {
		setPartyStats(prev => ({
			...prev,
			messageCount: prev.messageCount + 1
		}));
	};

	const djActions = [
		{
			icon: <Music className="w-8 h-8" />,
			label: 'Song Vote',
			color: 'bg-purple-600 hover:bg-purple-700',
			action: () => {
				setCurrentVote({
					title: 'Next Song Vote',
					description: 'Vote for the next song in the queue',
					type: 'skip',
					duration: 30,
					onPass: () => {
						if (controls.nextTrack) controls.nextTrack();
						toast.success('Song vote passed - skipping to next track');
					},
					onFail: () => {
						toast.info('Song vote failed - keeping current track');
					}
				});
			}
		},
		{
			icon: <Flame className="w-8 h-8" />,
			label: 'Hype Moment',
			color: 'bg-red-600 hover:bg-red-700',
			action: () => {
				socket.emit('party:hype_moment', {
					timestamp: Date.now()
				});
				toast.success('🔥 Hype moment activated!');
			}
		},
		{
			icon: <Heart className="w-8 h-8" />,
			label: 'Vibe Check',
			color: 'bg-pink-600 hover:bg-pink-700',
			action: () => {
				socket.emit('party:vibe_request', {
					timestamp: Date.now()
				});

				setCurrentVote({
					title: 'Rate the Vibe',
					description: "What's the current energy level?",
					type: 'vibe', // Changed from 'skip' to 'vibe'
					duration: 30,
					options: [
						{ id: '20', label: '20% - Low Energy 😴' },
						{ id: '40', label: '40% - Building Up 🙂' },
						{ id: '60', label: '60% - Good Vibes 🎵' },
						{ id: '80', label: '80% - High Energy 💃' },
						{ id: '100', label: '100% - Peak Hype 🔥' }
					],
					onVoteSubmit: selectedRating => {
						const rating = parseInt(selectedRating, 10);
						socket.emit('party:vibe_submit', { rating });
						setPartyStats(prev => ({
							...prev,
							vibeLevel: rating
						}));
						toast.success(`Vibe rating submitted: ${rating}%`);
					}
				});

				toast.success('Vibe check started! Rate the current energy! 🎉');
			}
		},
		{
			icon: <Users className="w-8 h-8" />,
			label: 'Dance Groups',
			color: 'bg-blue-600 hover:bg-blue-700',
			action: () => {
				const groups = [];
				const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
				for (let i = 0; i < shuffledUsers.length; i += 4) {
					groups.push(shuffledUsers.slice(i, i + 4));
				}
				socket.emit('party:dance_groups', { groups });
				toast.success('Dance groups formed! Check your notifications 💃');
			}
		},
		{
			icon: <Sparkles className="w-8 h-8" />,
			label: 'Spotlight',
			color: 'bg-yellow-600 hover:bg-yellow-700',
			action: () => {
				const luckyUser = users[Math.floor(Math.random() * users.length)];
				socket.emit('party:spotlight', { userId: luckyUser.id });
				toast.success(`🎯 Spotlight on ${luckyUser.name}!`);
			}
		},
		{
			icon: <MessageSquare className="w-8 h-8" />,
			label: 'Shoutout',
			color: 'bg-green-600 hover:bg-green-700',
			action: () => {
				// This would typically open a modal or input for the DJ's message
				const message = prompt('Enter your shoutout message:');
				if (message) {
					socket.emit('party:shoutout', { message });
					toast.success('Shoutout sent! 📢');
				}
			}
		},
		{
			icon: <Trophy className="w-8 h-8" />,
			label: 'Dance Battle',
			color: 'bg-orange-600 hover:bg-orange-700',
			action: () => {
				const dancers = users.slice(0, 2);
				socket.emit('party:dance_battle', { dancers });
				setCurrentVote({
					title: 'Dance Battle',
					description: `${dancers[0].name} vs ${dancers[1].name} - Who won?`,
					type: 'skip',
					duration: 30,
					onPass: () => {
						toast.success(`${dancers[0].name} wins the dance battle! 🏆`);
					},
					onFail: () => {
						toast.success(`${dancers[1].name} wins the dance battle! 🏆`);
					}
				});
			}
		},
		// Party Wave
		{
			icon: <Waves className="w-8 h-8" />,
			label: 'Wave',
			color: 'bg-cyan-600 hover:bg-cyan-700',
			action: () => {
				const sections = ['Left', 'Center', 'Right'];
				let currentSection = 0;

				socket.emit('party:wave_start', {
					section: sections[currentSection]
				});

				const waveInterval = setInterval(() => {
					currentSection = (currentSection + 1) % sections.length;
					socket.emit('party:wave_update', {
						section: sections[currentSection]
					});

					if (currentSection === sections.length - 1) {
						clearInterval(waveInterval);
					}
				}, 1000);

				toast.success('🌊 Wave activated! Follow the movement!');
			}
		},

		// Drop Countdown
		{
			icon: <Timer className="w-8 h-8" />,
			label: 'Countdown',
			color: 'bg-amber-600 hover:bg-amber-700',
			action: () => {
				socket.emit('party:countdown', {
					duration: 5,
					message: 'DROP COMING! GET READY!'
				});
				toast.success('⚡ Countdown started!');
			}
		},

		// Dance Moves
		{
			icon: <Music2 className="w-8 h-8" />,
			label: 'Dance Move',
			color: 'bg-rose-600 hover:bg-rose-700',
			action: () => {
				const moves = [
					{ name: 'The Robot', emoji: '🤖' },
					{ name: 'The Wave', emoji: '👋' },
					{ name: 'The Spin', emoji: '💫' },
					{ name: 'The Shuffle', emoji: '🔄' },
					{ name: 'Jump Together', emoji: '⬆️' }
				];
				const move = moves[Math.floor(Math.random() * moves.length)];
				socket.emit('party:dance_move', { move });
				toast.success(`${move.emoji} New move: ${move.name}!`);
			}
		},

		// Light Show
		{
			icon: <Lightbulb className="w-8 h-8" />,
			label: 'Lights',
			color: 'bg-yellow-500 hover:bg-yellow-600',
			action: () => {
				socket.emit('party:light_show', {
					pattern: 'wave',
					duration: 10
				});
				toast.success('💡 Light show time! Use your phone flashlight!');
			}
		},

		// Slow Motion
		{
			icon: <Clock className="w-8 h-8" />,
			label: 'Slow Mo',
			color: 'bg-indigo-600 hover:bg-indigo-700',
			action: () => {
				socket.emit('party:slow_motion', {
					duration: 5
				});
				toast.success('⏳ Everyone move in slow motion!');
			}
		},
		// Photo Moment
		{
			icon: <Camera className="w-8 h-8" />,
			label: 'Photo',
			color: 'bg-emerald-600 hover:bg-emerald-700',
			action: () => {
				socket.emit('party:photo_countdown', {
					duration: 3
				});

				setCurrentVote({
					title: 'Get Ready for Photo!',
					description: 'Strike your best pose!',
					type: 'photo',
					duration: 3,
					onVoteSubmit: () => {
						socket.emit('party:photo_snap', {
							timestamp: Date.now()
						});
						toast.success('📸 Photo captured!');
					}
				});

				toast.success('📸 Get ready to pose!');
			}
		},
		// Energy Zones
		{
			icon: <Zap className="w-8 h-8" />,
			label: 'Zones',
			color: 'bg-fuchsia-600 hover:bg-fuchsia-700',
			action: () => {
				const zones = ['Left Side', 'Center', 'Right Side'];

				socket.emit('party:zones_start', { zones });

				setCurrentVote({
					title: 'Energy Zone Battle',
					description: 'Which section has the most energy?',
					type: 'zones',
					duration: 15,
					options: zones.map(zone => ({
						id: zone.toLowerCase(),
						label: `${zone} 🔥`
					})),
					onVoteSubmit: zoneId => {
						socket.emit('party:zone_winner', { winner: zoneId });
						toast.success(`${zones.find(z => z.toLowerCase() === zoneId)} wins! 🏆`);
					}
				});

				toast.success('⚡ Zone battle initiated!');
			}
		}
	];

	return (
		<div className="bg-gray-900 p-6 rounded-lg space-y-6">
			{/* Stats Header */}
			<div className="grid grid-cols-3 gap-4">
				<div className="bg-gray-800 p-4 rounded-lg text-center">
					<div className="text-2xl font-bold text-white">{users.length}</div>
					<div className="text-gray-400">Party Size</div>
				</div>
				<div className="bg-gray-800 p-4 rounded-lg text-center">
					<div className="text-2xl font-bold text-white">{partyStats.vibeLevel}%</div>
					<div className="text-gray-400">Vibe Level</div>
				</div>
				<div className="bg-gray-800 p-4 rounded-lg text-center">
					<div className="text-2xl font-bold text-white">{partyStats.messageCount}</div>
					<div className="text-gray-400">Messages</div>
				</div>
			</div>

			{/* DJ Actions */}
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{djActions.map((action, index) => (
					<button
						key={index}
						onClick={action.action}
						className={`${action.color} p-4 rounded-lg flex flex-col items-center justify-center transition-transform duration-200 hover:scale-105`}>
						{action.icon}
						<span className="mt-2 font-bold text-white">{action.label}</span>
					</button>
				))}
			</div>

			{/* Current Vote */}
			{currentVote && (
				<SimpleVote
					{...currentVote}
					onPass={
						currentVote.type === 'skip'
							? () => {
									currentVote.onPass?.();
									setCurrentVote(null);
								}
							: undefined
					}
					onFail={
						currentVote.type === 'skip'
							? () => {
									currentVote.onFail?.();
									setCurrentVote(null);
								}
							: undefined
					}
					onVoteSubmit={
						currentVote.onVoteSubmit
							? value => {
									currentVote.onVoteSubmit(value);
									setCurrentVote(null);
								}
							: undefined
					}
				/>
			)}
		</div>
	);
};

export default DJDashboard;
