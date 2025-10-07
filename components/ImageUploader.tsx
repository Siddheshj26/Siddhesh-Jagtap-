
import React, { useState, useCallback, useEffect } from 'react';

interface ImageUploaderProps {
  onFilesChange: (files: File[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesChange }) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const allFiles = [...files, ...newFiles].slice(0, 5); // Limit to 5 files
      setFiles(allFiles);
    }
  }, [files]);
  
  useEffect(() => {
    const newPreviews: string[] = [];
    let processedFiles = 0;
    
    if (files.length === 0) {
        setImagePreviews([]);
        onFilesChange([]);
        return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        processedFiles++;
        if (processedFiles === files.length) {
          setImagePreviews(newPreviews);
          onFilesChange(files);
        }
      };
      reader.readAsDataURL(file);
    });

    // Cleanup function
    return () => {
        newPreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);


  const removeImage = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <div>
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-400 transition-colors">
        <label htmlFor="file-upload" className="cursor-pointer">
          <p className="text-gray-400">Drag & drop files here, or click to select.</p>
          <p className="text-xs text-gray-500">Up to 5 images (PNG, JPG, WEBP)</p>
        </label>
        <input 
          id="file-upload" 
          type="file" 
          multiple 
          accept="image/png, image/jpeg, image/webp" 
          className="hidden"
          onChange={handleFileChange} 
        />
      </div>
      {imagePreviews.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative group">
              <img src={preview} alt={`preview ${index}`} className="w-full h-24 object-cover rounded-md" />
              <button 
                onClick={() => removeImage(index)} 
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
