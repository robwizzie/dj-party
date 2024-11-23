import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipForward, Music2, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../ui/button';
import { useSpotifyPlayer } from '../../hooks/use-spotify-player';
import { useQueue } from '../../contexts/queue-context';
import * as Slider from '@radix-ui/react-slider';

export function Player({ onTrackEnd }) {
  const {
    playbackState,
    isActive,
    error,
    deviceId,
    controls: { togglePlay, nextTrack, startPlayback, setVolume },
  } = useSpotifyPlayer();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const { currentTrack: queuedTrack, playNext } = useQueue();

  // Update isPlaying when playbackState changes
  useEffect(() => {
    setIsPlaying(playbackState ? !playbackState.paused : false);
  }, [playbackState]);

  // Start playing queued track
  useEffect(() => {
    if (deviceId && queuedTrack && !playbackState) {
      console.log('Starting playback of queued track:', queuedTrack);
      startPlayback(deviceId, [queuedTrack.uri]);
    }
  }, [deviceId, queuedTrack, playbackState, startPlayback]);

  // Handle track ending
  useEffect(() => {
    const handleTrackEnd = () => {
      const isTrackEnded = playbackState?.track_window?.current_track &&
        !playbackState.paused &&
        playbackState.position === 0;

      if (isTrackEnded) {
        console.log('Track ended, playing next...');
        playNext();
      }
    };

    const intervalId = setInterval(handleTrackEnd, 1000);
    return () => clearInterval(intervalId);
  }, [playbackState, playNext]);

  const handlePlayPause = async () => {
    console.log('Toggle play/pause, current state:', { isPlaying });
    setIsPlaying(!isPlaying);
    await togglePlay();
  };

  const handleSkipTrack = async () => {
    console.log('Skipping track...');
    await playNext();
  };

  const handleVolumeChange = async (newVolume) => {
    const volumeValue = newVolume[0]; // Slider returns an array
    setVolumeState(volumeValue);
    await setVolume(volumeValue);
  };

  const getDisplayTrack = () => {
    if (playbackState?.track_window?.current_track) {
      return {
        ...playbackState.track_window.current_track,
        albumImage: playbackState.track_window.current_track.album.images[0].url,
        isPlaying: !playbackState.paused
      };
    }
    if (queuedTrack) {
      return {
        ...queuedTrack,
        isPlaying: false
      };
    }
    return null;
  };

  const displayTrack = getDisplayTrack();
  const isCurrentTrackInQueue = displayTrack?.uri === queuedTrack?.uri;

  return (
    <div className="bg-spotify-gray rounded-lg p-6">
      <div className="flex items-center space-x-4">
        {displayTrack ? (
          <img
            src={displayTrack.albumImage || displayTrack.album.images[0].url}
            alt="Album Art"
            className={`w-24 h-24 rounded-md transition-all duration-200 ${
              isCurrentTrackInQueue ? 'ring-2 ring-spotify-green shadow-lg' : ''
            }`}
          />
        ) : (
          <div className="w-24 h-24 bg-black/20 rounded-md flex items-center justify-center">
            <Music2 className="w-8 h-8 text-white/40" />
          </div>
        )}

        <div className="flex-1">
          <h3 className={`text-lg font-semibold transition-colors duration-200 ${
            isCurrentTrackInQueue ? 'text-spotify-green' : 'text-white'
          }`}>
            {displayTrack?.name || 'Search for a song to play'}
          </h3>
          <p className="text-sm text-white/60">
            {displayTrack?.artists?.[0]?.name || 'Add songs to your queue'}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col space-y-4">
        {/* Playback Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handlePlayPause}
            disabled={!displayTrack}
            className="hover:bg-white/10 transition-colors duration-200"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSkipTrack}
            disabled={!displayTrack}
            className="hover:bg-white/10 transition-colors duration-200"
          >
            <SkipForward className="w-6 h-6" />
          </Button>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVolumeChange([0])}
            className="hover:bg-white/10 transition-colors duration-200"
          >
            <VolumeX className="w-4 h-4" />
          </Button>
          
          <div className="flex-1">
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              defaultValue={[0.5]}
              max={1}
              step={0.01}
              value={[volume]}
              onValueChange={handleVolumeChange}
              aria-label="Volume"
            >
              <Slider.Track className="bg-white/20 relative grow rounded-full h-1">
                <Slider.Range className="absolute bg-white rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb
                className="block w-3 h-3 bg-white rounded-full hover:bg-spotify-green focus:outline-none focus:ring-2 focus:ring-spotify-green"
                aria-label="Volume"
              />
            </Slider.Root>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVolumeChange([1])}
            className="hover:bg-white/10 transition-colors duration-200"
          >
            <Volume2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}