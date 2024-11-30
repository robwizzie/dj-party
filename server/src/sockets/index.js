export default function socketHandlers(io) {
	io.on('connection', socket => {
		console.log('User connected:', socket.id);
		socket.on('disconnect', () => {
			console.log('User disconnected:', socket.id);
		});

		partyConnectionSocket(io, socket);
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

		const hostSocket = io.sockets.sockets.get(party.host);
		if (!hostSocket) {
			callback({ error: `Host not found` });
			return;
		}

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

const partyIndex = {};
