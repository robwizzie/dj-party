import { io } from 'socket.io-client';
import { create } from 'zustand';
import { generatePromise } from '../utils/generatePromise';

const usePartyStore = create((set, get) => {
	const socket = io('http://localhost:3001');

	function createParty() {
		const { promise, resolve } = generatePromise();

		set({ status: 'creating' });
		socket.emit('create-party', ({ error, partyId, users }) => {
			if (error) {
				console.error(error);
				set({ status: 'error', error });
				return;
			}

			set({ status: 'joined', host: true, partyId, users });
			resolve(partyId);

			console.log('Joined party: ', partyId);
			socket.on('join-request', async ({ user }, callback) => {
				console.log(`User ${user} would like to join your party.`);
				if (confirm(`User ${user} would like to join your party.`)) {
					callback({ isAccepted: true });
				} else callback({ isAccepted: false });
			});
		});

		return promise;
	}

	async function joinParty(partyId) {
		const { promise, resolve } = generatePromise();

		if (get().partyId) await leaveParty();

		set({ status: 'joining' });
		console.log('Requesting to join party: ', partyId);
		socket.emit('join-party', { partyId }, ({ error, users }) => {
			if (error) {
				console.error(error);
				set({ status: 'error', error });
				return;
			}

			set({ partyId, status: 'joined', users });
			resolve();

			socket.on('user-joined', ({ user, users }) => {
				console.log(`User ${user} has joined the party.`);
				set({ users });
			});
		});

		return promise;
	}

	async function leaveParty() {}

	return {
		status: undefined,
		error: undefined,
		partyId: undefined,
		host: false,
		users: [],
		leaveParty,
		createParty,
		joinParty
	};
});

export default usePartyStore;
