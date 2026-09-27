import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

// Define the incoming props contract for the file input component
export interface MultipleFileInputProps {
  name: string;
}

export const MultipleFileInput: React.FC<MultipleFileInputProps> = ({ name }) => {
  // Retrieve the parent form control layout from the Provider context safely
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur }, fieldState: { error } }) => (
        <div>
          <input
            type="file"
            multiple
            accept="image/*"
            onBlur={onBlur}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              // Convert the native FileList object into a clean, type-safe array of File objects
              const files = e.target.files ? Array.from(e.target.files) : [];
              onChange(files);
            }}
            className="input-field bg-orange-600 text-white cursor-pointer text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-700 file:text-white hover:file:bg-orange-800"
          />
          {error && (
            <span className="text-red-500 text-sm mt-1 block">
              {error.message}
            </span>
          )}
        </div>
      )}
    />
  );
};

export default MultipleFileInput;