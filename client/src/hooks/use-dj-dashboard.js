// hooks/use-dj-dashboard.js
import { useEffect, useState } from 'react';
import { socket } from '../lib/socket';
import { toast } from 'sonner';

export function useDJDashboard() {
	const [stats, setStats] = useState({
		vibeLevel: 85,
		messageCount: 0
	});

	useEffect(() => {
		// Listen for hype moment activations
		socket.on('party:hype_moment', ({ timestamp, activatedBy }) => {
			toast.success('🔥 HYPE MOMENT ACTIVATED!', {
				description: 'The energy is through the roof!'
			});
		});

		// Listen for dance group formations
		socket.on('party:dance_groups', ({ groups }) => {
			const userGroup = groups.find(group => group.some(user => user.id === socket.id));

			if (userGroup) {
				const teammates = userGroup
					.filter(user => user.id !== socket.id)
					.map(user => user.name)
					.join(', ');

				toast.success('💃 Dance Group Formed!', {
					description: `You're dancing with: ${teammates}`
				});
			}
		});

		// Listen for spotlight moments
		socket.on('party:spotlight', ({ userId }) => {
			toast.success('🎯 Spotlight Active!', {
				description: userId === socket.id ? "You're in the spotlight! Show your moves!" : 'Watch the spotlight!'
			});
		});

		// Listen for DJ shoutouts
		socket.on('party:shoutout', ({ message, timestamp }) => {
			toast.success('📢 DJ Shoutout!', {
				description: message
			});

			setStats(prev => ({
				...prev,
				messageCount: prev.messageCount + 1
			}));
		});

		// Listen for dance battles
		socket.on('party:dance_battle', ({ dancers }) => {
			const isParticipant = dancers.some(dancer => dancer.id === socket.id);

			if (isParticipant) {
				toast.success('🏆 Dance Battle Time!', {
					description: "You've been chosen for a dance battle!"
				});
			} else {
				const participants = dancers.map(d => d.name).join(' vs ');
				toast.success('🏆 Dance Battle!', {
					description: `Watch: ${participants}`
				});
			}
		});

		// Listen for vibe updates
		socket.on('party:vibe_update', ({ level }) => {
			setStats(prev => ({
				...prev,
				vibeLevel: level
			}));
		});

		// Cleanup listeners on unmount
		return () => {
			socket.off('party:hype_moment');
			socket.off('party:dance_groups');
			socket.off('party:spotlight');
			socket.off('party:shoutout');
			socket.off('party:dance_battle');
			socket.off('party:vibe_update');
		};
	}, []);

	return {
		stats,
		setStats
	};
}
