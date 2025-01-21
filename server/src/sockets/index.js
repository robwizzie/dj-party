export default function socketHandlers(io) {
	io.on('connection', socket => {
		console.log('User connected:', socket.id);
		socket.on('disconnect', () => {
			console.log('User disconnected:', socket.id);
		});

		partyConnectionSocket(io, socket);
		djDashboardSocket(io, socket);
	});
}

function partyConnectionSocket(io, socket) {
	socket.on('create-party', callback => {
		let partyId;
		for (let attempts = 0; attempts < 1000; attempts++) {
			const newPartyId = Math.random().toString(36).substring(2, 8);
			if (partyIndex[newPartyId]) continue;

			partyId = newPartyId;
			break;
		}

		if (!partyId) {
			callback({ error: 'Party generation timeout' });
			return;
		}

		const party = { partyId, users: [socket.id], host: socket.id };
		partyIndex[partyId] = party;
		callback({ partyId, users: party.users });
	});

	socket.on('join-party', ({ partyId }, callback) => {
		console.log('join-party hit');
		const party = partyIndex[partyId];

		if (!party) {
			callback({ error: `No party found with id: ${partyId}` });
			return;
		}

		// const hostSocket = io.sockets.sockets.get(party.host);
		// if (!hostSocket) {
		// 	callback({ error: `Host not found` });
		// 	return;
		// }

		// hostSocket.emit('join-request', { user: socket.id }, ({ isAccepted, song }) => {
		// 	if (!isAccepted) {
		// 		callback({ error: 'Access denied by host' });
		// 		return;
		// 	}
		//
		// });

		party.users.push(socket.id);
		socket.to(partyId).emit('user-joined', { user: socket.id });
		socket.join(partyId);
		callback({ users: party.users });
	});

	socket.on('disconnect', () => {
		console.log('User disconnected:', socket.id);
		io.emit('user-dosconnected', socket.id);
	});
}

function djDashboardSocket(io, socket) {
	// Handle hype moment activation
	socket.on('party:hype_moment', ({ timestamp }) => {
		const party = findPartyBySocket(socket.id);
		if (!party) return;

		// Broadcast hype moment to all party members
		io.to(party.partyId).emit('party:hype_moment', {
			timestamp,
			activatedBy: socket.id
		});
	});

	// Handle dance group formation
	socket.on('party:dance_groups', ({ groups }) => {
		const party = findPartyBySocket(socket.id);
		if (!party) return;

		// Broadcast dance groups to all party members
		io.to(party.partyId).emit('party:dance_groups', {
			groups,
			timestamp: Date.now()
		});
	});

	// Handle spotlight moments
	socket.on('party:spotlight', ({ userId }) => {
		const party = findPartyBySocket(socket.id);
		if (!party) return;

		// Broadcast spotlight event to all party members
		io.to(party.partyId).emit('party:spotlight', {
			userId,
			timestamp: Date.now()
		});
	});

	// Handle DJ shoutouts
	socket.on('party:shoutout', ({ message }) => {
		const party = findPartyBySocket(socket.id);
		if (!party) return;

		// Broadcast shoutout to all party members
		io.to(party.partyId).emit('party:shoutout', {
			message,
			timestamp: Date.now(),
			djId: socket.id
		});

		// Increment message count for stats
		io.to(party.partyId).emit('party:message', {
			type: 'shoutout',
			timestamp: Date.now()
		});
	});

	// Handle dance battle initialization
	socket.on('party:dance_battle', ({ dancers }) => {
		const party = findPartyBySocket(socket.id);
		if (!party) return;

		// Broadcast dance battle to all party members
		io.to(party.partyId).emit('party:dance_battle', {
			dancers,
			timestamp: Date.now()
		});
	});

	// Handle vibe updates
	socket.on('party:vibe_update', ({ level }) => {
		const party = findPartyBySocket(socket.id);
		if (!party) return;

		// Broadcast vibe level to all party members
		io.to(party.partyId).emit('party:vibe_update', {
			level,
			timestamp: Date.now()
		});
	});
}

// Helper function to find party by socket ID
function findPartyBySocket(socketId) {
	for (const partyId in partyIndex) {
		const party = partyIndex[partyId];
		if (party.users.includes(socketId)) {
			return { ...party, partyId };
		}
	}
	return null;
}

const partyIndex = {};
