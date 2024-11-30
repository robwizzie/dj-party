import express from 'express';
import routes from './routes/index.js';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import socketHandlers from './sockets/index.js';

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*'
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

socketHandlers(io);

server.listen(PORT, () => {
	console.log(`Server running on port: ${PORT}`);
});

export default app;
