import React, { useState, useEffect, useRef } from 'react';
import { YouTubeIcon } from '../icons';

const YouTubeLiveManager: React.FC = () => {
    const [videoId, setVideoId] = useState('');
    const [currentVideoId, setCurrentVideoId] = useState('');
    const playerRef = useRef<any>(null);

    useEffect(() => {
        // This function will be called by the YouTube IFrame Player API
        (window as any).onYouTubeIframeAPIReady = () => {
            console.log("YouTube API is ready.");
        };
        return () => {
            if(playerRef.current) {
                playerRef.current.destroy();
            }
        }
    }, []);

    useEffect(() => {
        if (currentVideoId && (window as any).YT) {
            if (playerRef.current) {
                playerRef.current.loadVideoById(currentVideoId);
            } else {
                playerRef.current = new (window as any).YT.Player('youtube-player', {
                    height: '100%',
                    width: '100%',
                    videoId: currentVideoId,
                    playerVars: {
                        'playsinline': 1
                    },
                });
            }
        }
    }, [currentVideoId]);
    
    const handleLoadVideo = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic URL parsing to extract video ID
        try {
            const url = new URL(videoId);
            const id = url.searchParams.get('v');
            if (id) {
                setCurrentVideoId(id);
            } else {
                 setCurrentVideoId(videoId); // Assume it's an ID
            }
        } catch (_) {
            // If URL parsing fails, assume the input is the video ID itself
            setCurrentVideoId(videoId);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="p-6 border-b dark:border-gray-700">
                     <div className="flex items-center mb-4">
                        <YouTubeIcon className="w-8 h-8 mr-3"/>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Aula ao Vivo no YouTube</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Cole o link ou o ID do vídeo do YouTube para iniciar a transmissão da aula ao vivo.
                    </p>
                    <form onSubmit={handleLoadVideo} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={videoId}
                            onChange={(e) => setVideoId(e.target.value)}
                            placeholder="Link ou ID do vídeo do YouTube"
                            className="flex-grow p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        />
                        <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                            Carregar Vídeo
                        </button>
                    </form>
                </div>
                <div className="p-6">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        {currentVideoId ? (
                             <div id="youtube-player" className="w-full h-full"></div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <p>O player de vídeo aparecerá aqui.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YouTubeLiveManager;
