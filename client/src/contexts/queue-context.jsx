import React, { createContext, useContext, useState } from 'react';
import { useSpotifyPlayer } from '../hooks/use-spotify-player';
import useSpotifyAuthStore from './useSpotifyAuthStore';

const QueueContext = createContext(null);

export function QueueProvider({ children }) {
	const user = useSpotifyAuthStore(state => state.user);
	const [queue, setQueue] = useState([]);
	const [currentTrack, setCurrentTrack] = useState(null);
	const {
		deviceId,
		isActive,
		controls: { startPlayback }
	} = useSpotifyPlayer();

	const addToQueue = track => {
		const queueItem = {
			id: track.id,
			title: track.name,
			artist: track.artists[0].name,
			user: user.display_name,
			uri: track.uri,
			albumImage: track.album.images[0].url,
			album: track.album,
			artists: track.artists,
			isPlaying: false,
			name: track.name
		};

		if (!currentTrack) {
			setCurrentTrack(queueItem);
			if (deviceId && isActive) {
				startPlayback(deviceId, [queueItem.uri]);
			}
		} else {
			setQueue(prevQueue => [...prevQueue, queueItem]);
		}
	};

	const removeFromQueue = trackId => {
		setQueue(prevQueue => prevQueue.filter(item => item.id !== trackId));
	};

	const playNext = async () => {
		if (queue.length === 0) {
			setCurrentTrack(null);
			return null;
		}

		const nextTrack = queue[0];
		setCurrentTrack(nextTrack);
		setQueue(prevQueue => prevQueue.slice(1));

		if (deviceId && isActive) {
			await startPlayback(deviceId, [nextTrack.uri]);
		}

		return nextTrack;
	};

	return (
		<QueueContext.Provider
			value={{
				queue,
				currentTrack,
				addToQueue,
				removeFromQueue,
				playNext,
				setCurrentTrack
			}}
		>
			{children}
		</QueueContext.Provider>
	);
}

export const useQueue = () => {
	const context = useContext(QueueContext);
	if (!context) {
		throw new Error('useQueue must be used within a QueueProvider');
	}
	return context;
};

