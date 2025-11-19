import React from 'react';
import Header from './Header';
import SearchBar from './SearchBar';
import PropertyList from './PropertyList';
import './Sidebar.css';

/**
 * COLUNA 1: Sidebar de Navegação e Auditoria
 * 
 * Componente principal que contém:
 * - Header com logo e dropdown de município
 * - Campo de busca
 * - Lista scrollável de propriedades
 */
function Sidebar({
  municipios,
  selectedMunicipio,
  onMunicipioChange,
  properties,
  selectedProperty,
  onPropertySelect,
  searchQuery,
  onSearchChange
}) {
  return (
    <div className="sidebar">
      {/* Header fixo no topo */}
      <Header
        municipios={municipios}
        selectedMunicipio={selectedMunicipio}
        onMunicipioChange={onMunicipioChange}
      />

      {/* Campo de busca fixo */}
      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
      />

      {/* Lista scrollável de propriedades */}
      <PropertyList
        properties={properties}
        selectedProperty={selectedProperty}
        onPropertySelect={onPropertySelect}
      />
    </div>
  );
}

export default Sidebar;
