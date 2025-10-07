
import React from 'react';

interface VideoPlayerProps {
  videoUrl: string | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
}

const LoadingIndicator: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-400 mx-auto mb-4"></div>
      <p className="text-lg font-semibold text-indigo-300">{message}</p>
      <p className="text-sm text-gray-400 mt-2">AI video generation can take several minutes. Please be patient.</p>
    </div>
);

const Placeholder: React.FC = () => (
    <div className="text-center text-gray-500">
         <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-24 w-24 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <h3 className="mt-4 text-xl font-semibold">Your Generated Video Will Appear Here</h3>
        <p className="mt-2">Upload images and provide a prompt to begin.</p>
    </div>
);

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, isLoading, loadingMessage, error }) => {
  return (
    <div className="w-full h-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center p-4">
      {isLoading && <LoadingIndicator message={loadingMessage} />}
      {!isLoading && error && (
         <div className="text-center text-red-400 bg-red-900/50 p-6 rounded-lg">
           <h3 className="font-bold text-lg">Generation Failed</h3>
           <p className="text-sm">{error}</p>
         </div>
      )}
      {!isLoading && !error && videoUrl && (
        <div className="w-full">
            <video src={videoUrl} controls autoPlay loop className="w-full rounded-md shadow-2xl" />
            <a 
              href={videoUrl} 
              download="ai_generated_video.mp4" 
              className="mt-4 inline-block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Download Video
            </a>
        </div>
      )}
      {!isLoading && !error && !videoUrl && <Placeholder />}
    </div>
  );
};
