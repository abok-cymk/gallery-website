import { memo, useState } from "react";

interface SearchBarProps {
    onSearch: (value: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [inputValue, setInputValue] = useState("");

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onSearch(value);
   }
  return (
    <div className="mb-6">
      <input 
      type="text" 
      value={inputValue}
      onChange={handleInputChange}
      placeholder="Search by title or description..."
      className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="mt-2 text-sm/6 text-gray-600">
        {inputValue ? `Searching for: ${inputValue}` : "Enter a search term to filter images"}
      </p>
    </div>
  );
}

export default memo(SearchBar);
