
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
  
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateVideoFromImage(
    prompt: string, 
    base64Image: string,
    mimeType: string
): Promise<string> {
    try {
        console.log("Starting video generation...");
        let operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            image: {
                imageBytes: base64Image,
                mimeType: mimeType,
            },
            config: {
                numberOfVideos: 1
            }
        });

        console.log("Polling for video generation status...");
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
            operation = await ai.operations.getVideosOperation({ operation: operation });
            console.log("Current operation status:", operation.name, "Done:", operation.done);
        }

        if (operation.error) {
            throw new Error(`Video generation failed with code ${operation.error.code}: ${operation.error.message}`);
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

        if (!downloadLink) {
            throw new Error("Video URI not found in API response.");
        }

        console.log("Fetching generated video from:", downloadLink);
        // The download link needs the API key appended to be valid.
        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        
        if (!videoResponse.ok) {
            throw new Error(`Failed to fetch video file: ${videoResponse.statusText}`);
        }
        
        const videoBlob = await videoResponse.blob();
        console.log("Video fetched successfully. Creating object URL.");
        
        return URL.createObjectURL(videoBlob);

    } catch (error) {
        console.error("Error in generateVideoFromImage:", error);
        throw error;
    }
}
