import express from 'express';
import routes from './routes/index.js';
import cors from 'cors';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', routes);

app.use((req, res, next) => {
	res.status(404).send('Not Found');
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

export default app;
