import React from 'react';
import './LayerControl.css';

/**
 * LayerControl Component - Botão flutuante para alternar camadas
 * Vector Map vs Satellite View
 */
function LayerControl({ currentLayer, onLayerChange }) {
  return (
    <div className="layer-control">
      <button
        className={`layer-btn ${currentLayer === 'vector' ? 'active' : ''}`}
        onClick={() => onLayerChange('vector')}
        title="Mapa Vetorial"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path 
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Vector</span>
      </button>

      <div className="layer-divider"></div>

      <button
        className={`layer-btn ${currentLayer === 'satellite' ? 'active' : ''}`}
        onClick={() => onLayerChange('satellite')}
        title="Imagem de Satélite"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path 
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path 
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
            strokeWidth="2"
          />
        </svg>
        <span>Satellite</span>
      </button>
    </div>
  );
}

export default LayerControl;
