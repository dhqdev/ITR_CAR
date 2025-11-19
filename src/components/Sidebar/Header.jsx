import React from 'react';
import './Header.css';

/**
 * Header Component - Logo e Dropdown de Município
 */
function Header({ municipios, selectedMunicipio, onMunicipioChange }) {
  return (
    <div className="sidebar-header">
      {/* Logo do Projeto */}
      <div className="header-logo">
        <div className="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M12 2L2 7L12 12L22 7L12 2Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinejoin="round"
            />
            <path 
              d="M2 17L12 22L22 17" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M2 12L12 17L22 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="logo-text">
          <h1>ITR/CAR</h1>
          <span>Auditoria Inteligente</span>
        </div>
      </div>

      {/* Dropdown de Município */}
      <div className="header-selector">
        <label htmlFor="municipio-select">Município</label>
        <select
          id="municipio-select"
          value={selectedMunicipio}
          onChange={(e) => onMunicipioChange(e.target.value)}
          className="municipio-dropdown"
        >
          {municipios.map((mun) => (
            <option key={mun.id} value={mun.nome}>
              {mun.nome}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Header;
