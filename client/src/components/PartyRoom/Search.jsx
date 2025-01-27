import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useSpotifyApi } from '../../hooks/useSpotifyApi';
import { debounce } from 'lodash';
import usePlayerStore from '../../contexts/usePlayerStore';
import PropTypes from 'prop-types';

export function Search({ onTrackSelect, customButton, selectedSongs = [] }) {
	const [query, setQuery] = useState('');
	const [isSearching, setIsSearching] = useState(false);
	const [results, setResults] = useState([]);
	const { searchTracks } = useSpotifyApi();
	const addToQueue = usePlayerStore(state => state.addToQueue);

	const handleInputChange = e => setQuery(e.target.value);

	const performSearch = async searchQuery => {
		if (!searchQuery.trim()) {
			setResults([]);
			return;
		}

		setIsSearching(true);
		try {
			const tracks = await searchTracks(searchQuery);
			setResults(tracks || []);
		} finally {
			setIsSearching(false);
		}
	};

	const debouncedSearch = useRef(
		debounce(value => {
			performSearch(value);
		}, 500)
	).current;

	useEffect(() => {
		if (query) {
			debouncedSearch(query);
		} else {
			setResults([]);
			setIsSearching(false);
		}

		return () => {
			debouncedSearch.cancel();
		};
	}, [query, debouncedSearch]);

	return (
		<div className="space-y-4">
			<div className="flex space-x-2">
				<div className="relative flex-1">
					<SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
					<input
						type="text"
						value={query}
						onChange={handleInputChange}
						placeholder="Search for songs..."
						className="w-full bg-black/20 rounded-md py-2 pl-10 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
					/>
				</div>
			</div>

			<div className="space-y-2">
				{isSearching ? (
					<div className="flex justify-center py-4">
						<Loader2 className="w-6 h-6 animate-spin text-brand-secondary" />
					</div>
				) : results.length === 0 && query.trim() ? (
					<p className="text-white/60 text-center py-4">No results found for "{query}"</p>
				) : (
					<div className="space-y-2 max-h-[400px] min-h-[400px] overflow-y-auto custom-scrollbar">
						{results.map(track => (
							<div
								key={track.id}
								className="flex items-center space-x-3 p-2 hover:bg-white/5 rounded-md transition-colors">
								<img src={track.album.images[2].url} alt={track.album.name} className="w-10 h-10 rounded" />
								<div className="flex-1 min-w-0">
									<p className="font-medium truncate">{track.name}</p>
									<p className="text-sm text-white/60 truncate">{track.artists.map(a => a.name).join(', ')}</p>
								</div>
								{customButton ? (
									customButton(
										track,
										selectedSongs.some(song => song.track.id === track.id)
									)
								) : (
									<Button variant="ghost" size="sm" onClick={() => addToQueue(track)}>
										Add to Queue
									</Button>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

Search.propTypes = {
	onTrackSelect: PropTypes.func,
	customButton: PropTypes.func,
	selectedSongs: PropTypes.array
};
