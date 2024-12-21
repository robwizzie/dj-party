import { io } from 'socket.io-client';
import { create } from 'zustand';
import { generatePromise } from '../utils/generatePromise';

const DEFAULT_SETTINGS = {
	password: {
		enabled: false,
		value: '',
		mode: 'open' // 'open' | 'password' | 'approval'
	},
	skipThreshold: {
		mode: 'percentage', // 'users' | 'percentage'
		value: 50 // number of users or percentage
	},
	replayLimit: 3,
	anonymousVoting: false,
	allowKicking: true,
	songLimit: 0, // 0 means unlimited
	playbackMode: 'host' // 'host' | 'individual'
};

const usePartyStore = create((set, get) => {
	const socket = io('http://localhost:3001');

	function updateSettings(newSettings) {
		const currentSettings = get().settings || DEFAULT_SETTINGS;
		set({
			settings: {
				...currentSettings,
				...newSettings
			}
		});
	}

	function initSettings() {
		set({ settings: DEFAULT_SETTINGS, isHost: true });
	}

	function createParty() {
		const { promise, resolve, reject } = generatePromise();

		const currentSettings = get().settings;
		console.log('Current settings before party creation:', currentSettings);

		set({ status: 'creating', settings: currentSettings || DEFAULT_SETTINGS });
		socket.emit('create-party', ({ error, partyId, users }) => {
			if (error) {
				console.error(error);
				set({ status: 'error', error });
				reject(new Error(error));
				return;
			}

			set({
				status: 'joined',
				isHost: true,
				partyId,
				users,
				settings: currentSettings || DEFAULT_SETTINGS
			});
			console.log('Party successfully created with settings:', get().settings);
			resolve(partyId);

			console.log('Joined party: ', partyId);
			socket.on('join-request', async ({ user }, callback) => {
				const { settings } = get();
				if (settings.password.mode !== 'approval') {
					callback({ isAccepted: true });
					return;
				}

				if (confirm(`User ${user} would like to join your party.`)) {
					callback({ isAccepted: true });
				} else callback({ isAccepted: false });
			});
		});

		return promise;
	}

	async function joinParty(partyId, password = '') {
		const { promise, resolve, reject } = generatePromise();

		if (get().partyId) await leaveParty();

		set({ status: 'joining' });
		console.log('Requesting to join party: ', partyId);
		socket.emit('join-party', { partyId, password }, ({ error, users, settings }) => {
			if (error) {
				console.error(error);
				set({ status: 'error', error });
				reject(new Error(error));
				return;
			}

			set({ partyId, status: 'joined', users, settings });
			resolve();

			socket.on('user-joined', ({ user, users }) => {
				console.log(`User ${user} has joined the party.`);
				set({ users });
			});

			socket.on('settings-updated', ({ settings }) => {
				set({ settings });
			});
		});

		return promise;
	}

	async function leaveParty() {
		const { partyId } = get();
		if (!partyId) return;

		socket.emit('leave-party', { partyId });
		set({
			status: 'idle',
			error: undefined,
			partyId: undefined,
			isHost: false,
			users: [],
			settings: undefined
		});
	}

	return {
		status: undefined,
		error: undefined,
		partyId: undefined,
		isHost: false,
		users: [],
		settings: undefined,
		leaveParty,
		createParty,
		joinParty,
		updateSettings,
		initSettings
	};
});

export default usePartyStore;
