import React, { useState, useEffect, useRef } from 'react';

export default function FilterBar({ filters, onChange }) {
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        onChange({ ...filters, searchText: text || null });
      }, 400)
    );
  };

  return (
    <div className="filter-bar">
      <div className="filter-search">
        <input
          ref={inputRef}
          className="search-input"
          type="text"
          placeholder="Search tasks… (⌘F)"
          value={searchText}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
}
