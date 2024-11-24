import express from 'express';
import * as spotifyController from '../controllers/spotify/spotifyController.js';

const router = express.Router();

router.post('/auth', spotifyController.auth);

export default router;
