import React, { useState } from 'react';

interface SidebarProps {
  // Props da Sidebar, se houver
}

const Sidebar: React.FC<SidebarProps> = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-gray-800 text-white h-screen w-1/5 p-4">
      <h1 className="text-2xl font-bold mb-4">Sidebar</h1>
      
      <button className="w-full bg-gray-600 text-white py-2 rounded mb-2">Button 1</button>
      
      <button className="w-full bg-gray-600 text-white py-2 rounded mb-2">Button 2</button>

      <div className="relative">
        <button
          onClick={handleDropdownToggle}
          className="w-full bg-gray-600 text-white py-2 rounded mb-2 flex justify-between items-center"
        >
          Dropdown
          <span className="ml-2">
            {isDropdownOpen ? <span>&#9660;</span> : <span>&#9654;</span>}
          </span>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 bg-gray-600 text-white py-2 rounded mt-1">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-700">Option 1</button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-700">Option 2</button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-700">Option 3</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
