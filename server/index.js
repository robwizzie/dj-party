require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const process = require('process');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/token', async(req, res) => {
    try {
        const { code } = req.body;

        console.log('Attempting to exchange code for token...');
        console.log('Using redirect URI:', process.env.SPOTIFY_REDIRECT_URI);

        const tokenUrl = 'https://accounts.spotify.com/api/token';
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        });

        const response = await axios.post(tokenUrl, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        console.log('Token exchange successful!');
        res.json(response.data);
    } catch (error) {
        // Fixed the optional chaining syntax
        console.error('Token exchange error:',
            error.response && error.response.data ? error.response.data : error.message
        );
        res.status(500).json({
            error: error.response && error.response.data ? error.response.data.error : 'Failed to exchange token',
            details: error.response && error.response.data ? error.response.data.error_description : error.message
        });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Environment check:');
    console.log('- Client ID exists:', !!process.env.SPOTIFY_CLIENT_ID);
    console.log('- Client Secret exists:', !!process.env.SPOTIFY_CLIENT_SECRET);
    console.log('- Redirect URI:', process.env.SPOTIFY_REDIRECT_URI);
});