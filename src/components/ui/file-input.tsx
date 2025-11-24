import * as React from "react";

interface FileInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileInput: React.FC<FileInputProps> = ({ onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Upload Image
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="mt-2 w-full p-2 border rounded-md text-sm"
      />
    </div>
  );
};