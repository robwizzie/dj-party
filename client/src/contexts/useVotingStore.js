import { create } from 'zustand';
import { socket } from '../lib/socket';
import usePlayerStore from './usePlayerStore';

const useVotingStore = create((set, get) => ({
	// State
	phase: 'selection', // 'selection' | 'voting' | 'results'
	timeRemaining: 60,
	selectedSongs: [], // [{track, userId, votes}]
	hasUserSubmitted: false,

	// Actions
	submitSong: track => {
		const submission = {
			track,
			userId: socket.id,
			votes: 0
		};

		socket.emit('song-submitted', submission);
		set({ hasUserSubmitted: true });
	},

	submitVote: trackId => {
		if (get().phase !== 'voting') return;

		socket.emit('vote-submitted', { trackId });
		set(state => ({
			selectedSongs: state.selectedSongs.map(song =>
				song.track.id === trackId ? { ...song, votes: song.votes + 1 } : song
			)
		}));
	},

	// Socket event handlers
	handleSongSubmitted: submission => {
		set(state => ({
			selectedSongs: [...state.selectedSongs, submission]
		}));
	},

	handleVoteUpdate: ({ trackId, votes }) => {
		set(state => ({
			selectedSongs: state.selectedSongs.map(song => (song.track.id === trackId ? { ...song, votes } : song))
		}));
	},

	handleVotingEnded: winner => {
		if (!winner) return;

		// Add winning song to player queue
		const playerStore = usePlayerStore.getState();
		playerStore.addToQueue(winner.track);

		// Reset voting state after delay
		setTimeout(() => {
			set({
				phase: 'selection',
				timeRemaining: 60,
				selectedSongs: [],
				hasUserSubmitted: false
			});
		}, 5000);
	},

	handlePhaseChange: phase => {
		set({ phase });
	},

	handleTimeUpdate: timeRemaining => {
		set({ timeRemaining });
	},

	reset: () => {
		set({
			phase: 'selection',
			timeRemaining: 60,
			selectedSongs: [],
			hasUserSubmitted: false
		});
	}
}));

export default useVotingStore;
