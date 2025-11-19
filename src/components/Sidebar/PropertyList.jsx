import React from 'react';
import PropertyCard from './PropertyCard';
import './PropertyList.css';

/**
 * PropertyList Component - Lista scrollável de propriedades
 */
function PropertyList({ properties, selectedProperty, onPropertySelect }) {
  if (properties.length === 0) {
    return (
      <div className="property-list-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
          <path d="M12 8v4M12 16h.01" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p>Nenhuma propriedade encontrada</p>
        <span>Tente ajustar os filtros ou termo de busca</span>
      </div>
    );
  }

  return (
    <div className="property-list scroll-container">
      <div className="property-list-header">
        <span className="list-count">{properties.length} propriedades</span>
        <span className="list-hint">Clique para visualizar</span>
      </div>
      
      <div className="property-list-content">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isSelected={selectedProperty?.id === property.id}
            onClick={() => onPropertySelect(property)}
          />
        ))}
      </div>
    </div>
  );
}

export default PropertyList;
