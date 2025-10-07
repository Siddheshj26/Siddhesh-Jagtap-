
import React from 'react';

interface TextInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const TextInput: React.FC<TextInputProps> = (props) => {
  return (
    <textarea
      className="w-full flex-grow bg-gray-700 text-gray-200 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none"
      rows={4}
      {...props}
    />
  );
};
