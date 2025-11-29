import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { wktToGeoJSON, getPolygonBounds } from '../../utils/wktParser';
import './RealMapView.css';

/**
 * Componente auxiliar para ajustar o mapa ao polígono
 */
function FitBounds({ bounds }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds && bounds.length === 2) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  
  return null;
}

/**
 * Componente de Mapa Real com geometrias do banco de dados
 */
function RealMapView({ property }) {
  const [geoJSON, setGeoJSON] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    // Reset estado quando mudar de propriedade
    setGeoJSON(null);
    setBounds(null);
    setError(null);
    setLoading(true);

    if (!property) {
      setLoading(false);
      return;
    }

    // Se a propriedade já tem geometry_wkt, usa ela
    if (property.geometry_wkt) {
      try {
        const geo = wktToGeoJSON(property.geometry_wkt);
        if (geo && geo.geometry && geo.geometry.coordinates && geo.geometry.coordinates[0]) {
          setGeoJSON(geo);
          
          // Calcula bounds
          const coordinates = geo.geometry.coordinates[0];
          const calculatedBounds = getPolygonBounds(coordinates);
          setBounds([[calculatedBounds[0][1], calculatedBounds[0][0]], 
                     [calculatedBounds[1][1], calculatedBounds[1][0]]]);
          setLoading(false);
        } else {
          console.warn('Geometria inválida para propriedade:', property.id);
          setError('Formato de geometria inválido');
          setLoading(false);
        }
      } catch (err) {
        console.error('Erro ao processar geometria:', err);
        setError('Erro ao carregar geometria');
        setLoading(false);
      }
    } else {
      // Tenta buscar da API
      fetch(`http://localhost:5000/api/properties/${property.id}/geometry`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Falha ao buscar geometria');
          }
          return res.json();
        })
        .then(data => {
          if (data.geometry_wkt) {
            const geo = wktToGeoJSON(data.geometry_wkt);
            if (geo && geo.geometry && geo.geometry.coordinates && geo.geometry.coordinates[0]) {
              setGeoJSON(geo);
              const coordinates = geo.geometry.coordinates[0];
              const calculatedBounds = getPolygonBounds(coordinates);
              setBounds([[calculatedBounds[0][1], calculatedBounds[0][0]], 
                         [calculatedBounds[1][1], calculatedBounds[1][0]]]);
            } else {
              setError('Formato de geometria inválido');
            }
          } else {
            setError('Geometria não encontrada');
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Erro ao buscar geometria:', err);
          setError('Geometria não disponível');
          setLoading(false);
        });
    }
  }, [property]);

  // Centro padrão (usa coordenadas da propriedade)
  const defaultCenter = property ? 
    [property.imovel.coordenadas_centro.lat, property.imovel.coordenadas_centro.lng] :
    [-23.5505, -46.6333]; // São Paulo como fallback

  // Estilo do polígono
  const polygonStyle = {
    fillColor: '#3b82f6',
    fillOpacity: 0.2,
    color: '#ef4444',
    weight: 3,
    dashArray: '10, 5'
  };

  if (loading) {
    return (
      <div className="real-map-view">
        <div className="map-loading">
          <div className="spinner"></div>
          <p>Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="real-map-view">
      <MapContainer
        center={defaultCenter}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        {/* Camada Base - OpenStreetMap */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Camada Satélite - ESRI World Imagery */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; Esri'
          maxZoom={19}
        />

        {/* Polígono da Propriedade */}
        {geoJSON && (
          <GeoJSON
            data={geoJSON}
            style={polygonStyle}
            onEachFeature={(feature, layer) => {
              layer.bindPopup(`
                <div style="font-family: 'Segoe UI', sans-serif;">
                  <h3 style="margin: 0 0 8px 0; color: #2E7D32;">${property.imovel.nome}</h3>
                  <p style="margin: 4px 0;"><strong>Proprietário:</strong> ${property.proprietario.nome}</p>
                  <p style="margin: 4px 0;"><strong>Área:</strong> ${property.imovel.area_total_ha.toFixed(2)} ha</p>
                  <p style="margin: 4px 0;"><strong>Status:</strong> ${property.status_auditoria}</p>
                </div>
              `);
            }}
          />
        )}

        {/* Ajusta o mapa aos limites do polígono */}
        {bounds && <FitBounds bounds={bounds} />}
      </MapContainer>

      {/* Info Box */}
      <div className="map-info-box">
        <div className="info-title">ℹ️ Informações do Mapa</div>
        <div className="info-content">
          <strong>Satélite:</strong> ESRI World Imagery<br/>
          <strong>Resolução:</strong> Alta resolução<br/>
          <strong>Base:</strong> OpenStreetMap<br/>
          <strong>Camadas:</strong> Satélite + Polígono
        </div>
      </div>

      {error && (
        <div className="map-error-box">
          <span>⚠️ {error}</span>
        </div>
      )}
    </div>
  );
}

export default RealMapView;
