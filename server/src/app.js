import express from 'express';
import routes from './routes/index.js';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST']
	}
});

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
	console.log(`Route called: ${req.method} ${req.originalUrl}`);
	next();
});

app.use('/api', routes);

app.use((req, res, next) => {
	res.status(404).send('Not Found');
});

io.on('connection', socket => {
	console.log('User connected:', socket.id);

	socket.on('join-party', partyId => {
		socket.join(partyId);
		socket.to(partyId).emit('user-connected', socket.id);
	});

	socket.on('send-message', ({ partyId, message }) => {
		console.log(partyId, message);
		socket.to(partyId).emit('receive-message', { id: socket.id, message });
	});

	socket.on('disconnect', () => {
		console.log('User disconnected:', socket.id);
		io.emit('user-dosconnected', socket.id);
	});
});

server.listen(PORT, () => {
	console.log(`Server running on port: ${PORT}`);
});

export default app;
