import { io } from 'socket.io-client';

// Create socket instance
export const socket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3001', {
	autoConnect: true,
	reconnection: true,
	reconnectionDelay: 1000,
	reconnectionDelayMax: 5000,
	reconnectionAttempts: 5
});

// Socket event listeners for debugging
if (import.meta.env.DEV) {
	socket.on('connect', () => {
		console.log('Socket connected:', socket.id);
	});

	socket.on('connect_error', error => {
		console.error('Socket connection error:', error);
	});

	socket.on('disconnect', reason => {
		console.log('Socket disconnected:', reason);
	});
}

export const initializeSocketListeners = store => {
	socket.on('song-submitted', store.handleSongSubmitted);
	socket.on('vote-update', store.handleVoteUpdate);
	socket.on('phase-change', store.handlePhaseChange);
	socket.on('time-update', store.handleTimeUpdate);
};

export const removeSocketListeners = store => {
	socket.off('song-submitted', store.handleSongSubmitted);
	socket.off('vote-update', store.handleVoteUpdate);
	socket.off('phase-change', store.handlePhaseChange);
	socket.off('time-update', store.handleTimeUpdate);
};
