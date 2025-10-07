
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { VideoPlayer } from './components/VideoPlayer';
import { Button } from './components/Button';
import { TextInput } from './components/TextInput';
import { generateVideoFromImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

const loadingMessages = [
  "Warming up the AI artists...",
  "Conceptualizing your video...",
  "Gathering stardust and pixels...",
  "Rendering the first few frames...",
  "Animating the scene...",
  "Applying cinematic magic...",
  "This can take a few minutes, hang tight!",
  "Finalizing the video render...",
  "Almost there, polishing the details..."
];

export default function App() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>(loadingMessages[0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      let messageIndex = 0;
      interval = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[messageIndex]);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);
  
  const handleFilesChange = useCallback((files: File[]) => {
    setSelectedFiles(files);
    setGeneratedVideoUrl(null); 
    setError(null);
  }, []);

  const handleGenerateVideo = async () => {
    if (selectedFiles.length === 0 || !prompt) {
      setError("Please upload at least one image and provide a prompt.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedVideoUrl(null);
    setLoadingMessage(loadingMessages[0]);

    try {
      // VEO API uses the first image as a starting point for the animation
      const firstImageFile = selectedFiles[0];
      const base64Image = await fileToBase64(firstImageFile);
      const mimeType = firstImageFile.type;

      const videoUrl = await generateVideoFromImage(prompt, base64Image, mimeType);
      setGeneratedVideoUrl(videoUrl);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during video generation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 flex flex-col space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-indigo-400">1. Upload Your Images</h2>
            <ImageUploader onFilesChange={handleFilesChange} />
            <p className="text-xs text-gray-400 mt-2">
              Note: The AI will use the first image as the primary reference to start the animation.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex-grow flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-indigo-400">2. Describe the Animation</h2>
            <TextInput
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'A cinematic drone shot flying through the mountains at sunset'"
            />
            <div className="mt-auto pt-4">
              <Button 
                onClick={handleGenerateVideo} 
                disabled={isLoading || selectedFiles.length === 0 || !prompt}
              >
                {isLoading ? 'Generating...' : 'Generate Video'}
              </Button>
            </div>
          </div>
        </div>
        <div className="lg:w-2/3 bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-center">
            <VideoPlayer 
              videoUrl={generatedVideoUrl}
              isLoading={isLoading}
              loadingMessage={loadingMessage}
              error={error}
            />
        </div>
      </main>
    </div>
  );
}
