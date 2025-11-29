/**
 * Utilitário para converter geometrias WKT (Well-Known Text) para GeoJSON
 * Usado para renderizar polígonos das propriedades no mapa
 */

/**
 * Extrai coordenadas de um WKT POLYGON ou MULTIPOLYGON
 * @param {string} wkt - String WKT do banco de dados
 * @returns {Array} - Array de coordenadas [[lng, lat], ...]
 */
export function parseWKT(wkt) {
  if (!wkt) return null;

  try {
    // Remove espaços extras e normaliza
    wkt = wkt.trim();

    // Identifica o tipo de geometria
    if (wkt.startsWith('MULTIPOLYGON')) {
      return parseMultiPolygon(wkt);
    } else if (wkt.startsWith('POLYGON')) {
      return parsePolygon(wkt);
    }

    return null;
  } catch (error) {
    console.error('Erro ao fazer parse de WKT:', error);
    return null;
  }
}

/**
 * Parse de POLYGON WKT
 */
function parsePolygon(wkt) {
  // Remove "POLYGON" e parênteses externos
  const coordStr = wkt
    .replace(/^POLYGON\s*\(\(/i, '')
    .replace(/\)\)$/,'');

  return parseCoordinateString(coordStr);
}

/**
 * Parse de MULTIPOLYGON WKT
 */
function parseMultiPolygon(wkt) {
  // Remove "MULTIPOLYGON" e parênteses externos
  const coordStr = wkt
    .replace(/^MULTIPOLYGON\s*\(\(\(/i, '')
    .replace(/\)\)\)$/, '');

  // Para simplicidade, pega apenas o primeiro polígono do multipolygon
  const firstPolygon = coordStr.split(')),((')[0];
  
  return parseCoordinateString(firstPolygon);
}

/**
 * Parse de string de coordenadas
 */
function parseCoordinateString(coordStr) {
  const coordinates = [];
  const pairs = coordStr.split(',');

  for (const pair of pairs) {
    const [lng, lat] = pair.trim().split(/\s+/).map(parseFloat);
    if (!isNaN(lng) && !isNaN(lat)) {
      coordinates.push([lng, lat]);
    }
  }

  return coordinates;
}

/**
 * Converte WKT para GeoJSON Feature
 * @param {string} wkt - String WKT
 * @returns {Object} - GeoJSON Feature
 */
export function wktToGeoJSON(wkt) {
  const coordinates = parseWKT(wkt);
  
  if (!coordinates || coordinates.length === 0) {
    return null;
  }

  // Certifica que o polígono está fechado
  const firstPoint = coordinates[0];
  const lastPoint = coordinates[coordinates.length - 1];
  
  if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
    coordinates.push([...firstPoint]);
  }

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [coordinates] // GeoJSON Polygon precisa de array de arrays
    },
    properties: {}
  };
}

/**
 * Calcula o centro (centroid) de um polígono
 * @param {Array} coordinates - Array de coordenadas [[lng, lat], ...]
 * @returns {Array} - [lng, lat] do centro
 */
export function getPolygonCenter(coordinates) {
  if (!coordinates || coordinates.length === 0) {
    return [0, 0];
  }

  let sumLng = 0;
  let sumLat = 0;
  let count = 0;

  for (const [lng, lat] of coordinates) {
    sumLng += lng;
    sumLat += lat;
    count++;
  }

  return [sumLng / count, sumLat / count];
}

/**
 * Calcula os limites (bounds) de um polígono
 * @param {Array} coordinates - Array de coordenadas [[lng, lat], ...]
 * @returns {Array} - [[minLng, minLat], [maxLng, maxLat]]
 */
export function getPolygonBounds(coordinates) {
  if (!coordinates || coordinates.length === 0) {
    return [[0, 0], [0, 0]];
  }

  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  for (const [lng, lat] of coordinates) {
    minLng = Math.min(minLng, lng);
    minLat = Math.min(minLat, lat);
    maxLng = Math.max(maxLng, lng);
    maxLat = Math.max(maxLat, lat);
  }

  return [[minLng, minLat], [maxLng, maxLat]];
}

/**
 * Calcula a área aproximada de um polígono (em hectares)
 * Usa fórmula de Shoelace
 * @param {Array} coordinates - Array de coordenadas [[lng, lat], ...]
 * @returns {number} - Área em hectares (aproximada)
 */
export function calculatePolygonArea(coordinates) {
  if (!coordinates || coordinates.length < 3) {
    return 0;
  }

  let area = 0;
  const n = coordinates.length;

  for (let i = 0; i < n - 1; i++) {
    const [x1, y1] = coordinates[i];
    const [x2, y2] = coordinates[i + 1];
    area += (x1 * y2) - (x2 * y1);
  }

  area = Math.abs(area) / 2;

  // Converte de graus² para hectares (aproximação)
  // 1 grau ≈ 111 km no equador
  const hectares = area * 111 * 111 * 100;

  return hectares;
}
