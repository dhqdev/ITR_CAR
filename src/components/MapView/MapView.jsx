import React from 'react';
import LayerControl from './LayerControl';
import DatePicker from './DatePicker';
import ProAnalysisButton from './ProAnalysisButton';
import './MapView.css';

/**
 * COLUNA 2: Viewport Geoespacial
 * 
 * Componente principal do mapa com:
 * - Mapa interativo (Mapbox)
 * - Controle de camadas (Vector/Satellite)
 * - Date Picker para análise histórica
 * - Overlay de polígonos com divergências
 * - Botão de Análise PRO com IA
 * 
 * NOTA: Para usar o Mapbox real, adicione sua API key em .env:
 * REACT_APP_MAPBOX_TOKEN=seu_token_aqui
 */
function MapView({ property, mapLayer, onLayerChange, selectedDate, onDateChange }) {
  // Por enquanto, renderizamos um placeholder do mapa
  // Na implementação final, usar react-map-gl com Mapbox
  
  const hasdivergence = property.imovel.area_divergente !== null;
  
  return (
    <div className="map-view">
      {/* Controle de Camadas (Floating) */}
      <LayerControl
        currentLayer={mapLayer}
        onLayerChange={onLayerChange}
      />

      {/* Date Picker (Floating) */}
      <DatePicker
        selectedDate={selectedDate}
        onDateChange={onDateChange}
      />

      {/* Container do Mapa */}
      <div className="map-container">
        {/* Placeholder - substituir por react-map-gl */}
        <div className="map-placeholder">
          <div className="map-center-marker">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path 
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="9" r="2.5" strokeWidth="2"/>
            </svg>
            <div className="location-info">
              <strong>{property.imovel.nome}</strong>
              <span>
                {property.imovel.coordenadas_centro.lat.toFixed(4)}, 
                {property.imovel.coordenadas_centro.lng.toFixed(4)}
              </span>
            </div>
          </div>

          {/* Simulação do polígono da propriedade */}
          <div className="property-polygon">
            <svg viewBox="0 0 200 200" className="polygon-svg">
              {/* Polígono principal da propriedade */}
              <polygon
                points="30,30 170,30 170,170 30,170"
                fill="rgba(59, 130, 246, 0.2)"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              
              {/* Área de divergência (hachurado vermelho) */}
              {hasdivergence && (
                <>
                  <defs>
                    <pattern 
                      id="diagonalHatch" 
                      patternUnits="userSpaceOnUse" 
                      width="8" 
                      height="8"
                      patternTransform="rotate(45)"
                    >
                      <line 
                        x1="0" 
                        y1="0" 
                        x2="0" 
                        y2="8" 
                        stroke="#ef4444" 
                        strokeWidth="2"
                      />
                    </pattern>
                  </defs>
                  <rect
                    x="120"
                    y="120"
                    width="50"
                    height="50"
                    fill="url(#diagonalHatch)"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                  <text
                    x="145"
                    y="180"
                    textAnchor="middle"
                    fill="#ef4444"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    Divergência
                  </text>
                </>
              )}
            </svg>
          </div>

          {/* Informação da camada ativa */}
          <div className="map-layer-indicator">
            {mapLayer === 'vector' ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path 
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Mapa Vetorial</span>
              </>
            ) : (
              <>
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
                <span>Imagem de Satélite - {selectedDate}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="map-legend">
        <div className="legend-title">Legenda</div>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ background: 'rgba(59, 130, 246, 0.3)', border: '2px dashed #3b82f6' }}></div>
            <span>Área Declarada</span>
          </div>
          {hasdivergence && (
            <div className="legend-item">
              <div className="legend-color" style={{ background: 'url(#diagonalHatch)', border: '2px solid #ef4444' }}></div>
              <span>Divergência Detectada</span>
            </div>
          )}
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#10b981' }}></div>
            <span>Reserva Legal</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#3b82f6' }}></div>
            <span>APP (Preservação Permanente)</span>
          </div>
        </div>
      </div>

      {/* Botão Análise PRO */}
      <ProAnalysisButton property={property} />
    </div>
  );
}

export default MapView;
