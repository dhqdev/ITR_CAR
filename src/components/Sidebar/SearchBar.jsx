import React from 'react';
import './SearchBar.css';

/**
 * SearchBar Component - Campo de busca com ícone de lupa
 */
function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <svg 
          className="search-icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8" strokeWidth="2"/>
          <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por CPF, CNPJ ou Nome..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button
            className="search-clear"
            onClick={() => onChange('')}
            aria-label="Limpar busca"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path 
                d="M18 6L6 18M6 6l12 12" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
