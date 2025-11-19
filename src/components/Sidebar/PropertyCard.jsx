import React from 'react';
import { statusConfig } from '../../data/mockData';
import './PropertyCard.css';

/**
 * PropertyCard Component - Card individual de propriedade
 */
function PropertyCard({ property, isSelected, onClick }) {
  const status = statusConfig[property.status_auditoria];
  
  return (
    <div 
      className={`property-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick()}
    >
      {/* Barra lateral de cor do status */}
      <div 
        className="property-card-indicator"
        style={{ backgroundColor: status.color }}
      />

      {/* Conteúdo do card */}
      <div className="property-card-content">
        {/* Header com título e badge */}
        <div className="property-card-header">
          <h3 className="property-name">{property.imovel.nome}</h3>
          <span 
            className="property-badge"
            style={{ 
              backgroundColor: status.bgColor,
              color: status.color
            }}
          >
            {status.label}
          </span>
        </div>

        {/* Informações do proprietário */}
        <div className="property-owner">
          <span className="owner-name">{property.proprietario.nome}</span>
          <span className="owner-doc">
            {property.proprietario.tipo_pessoa} · {property.proprietario.documento}
          </span>
        </div>

        {/* Métricas rápidas */}
        <div className="property-metrics">
          <div className="metric">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{property.imovel.area_total_ha} ha</span>
          </div>

          {property.itr_dados.potencial_incremento_arrecadacao > 0 && (
            <div className="metric highlight">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path 
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>
                +R$ {(property.itr_dados.potencial_incremento_arrecadacao / 1000).toFixed(0)}k
              </span>
            </div>
          )}

          {property.car_dados.passivo_ambiental && (
            <div className="metric warning">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Passivo</span>
            </div>
          )}
        </div>
      </div>

      {/* Ícone de seleção */}
      {isSelected && (
        <div className="property-card-selected-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
      )}
    </div>
  );
}

export default PropertyCard;
