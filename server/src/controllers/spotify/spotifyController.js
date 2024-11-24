const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

export async function auth(req, res) {
	try {
		const { code } = req.body;

		console.log('Attempting to exchange code for token...');
		console.log('Using redirect URI:', REDIRECT_URI);

		const query = new URLSearchParams({
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: REDIRECT_URI,
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET
		});

		const response = await fetch(`${TOKEN_URL}?${query.toString()}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});

		if (!response.ok) {
			throw response.status;
		}

		const data = await response.json();

		console.log('Token exchange successful!');
		res.json(data);
	} catch (error) {
		console.error('Token exchange error:', error);
		res.status(500).json({
			error: 'Error getting exchange exchange token: ' + error.toString()
		});
	}
}
