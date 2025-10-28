/**
 * Servicio de geocodificación inversa
 * Convierte coordenadas (lat, lon) a direcciones
 * Usa Nominatim API (OpenStreetMap) - Gratuita
 */

const axios = require('axios');

/**
 * Obtener dirección a partir de coordenadas IR proporciona (coordenadas → dirección).
 * @param {number} latitude - Latitud
 * @param {number} longitude - Longitud
 * @returns {Promise<Object>} Objeto con información de dirección
 */
async function reverseGeocode(latitude, longitude) {
  try {
    const url = 'https://nominatim.openstreetmap.org/reverse';
    
    // Latencia del servicio
    const response = await axios.get(url, {
      params: {
        lat: latitude,
        lon: longitude,
        format: 'json',
        addressdetails: 1,
        zoom: 18
      },
      headers: {
        'User-Agent': 'RastreoApp/1.0' // Requerido por Nominatim
      }
    });

    const data = response.data;
    
    if (data && data.address) {
      return {
        address: data.display_name || '',
        address_components: {
          road: data.address.road || '',
          house_number: data.address.house_number || '',
          suburb: data.address.suburb || data.address.neighbourhood || '',
          city: data.address.city || data.address.town || data.address.village || '',
          state: data.address.state || '',
          country: data.address.country || '',
          postal_code: data.address.postcode || ''
        },
        place_id: data.place_id,
        lat: parseFloat(data.lat),
        lon: parseFloat(data.lon)
      };
    }

    return {
      address: 'Dirección no disponible',
      address_components: {},
      lat: latitude,
      lon: longitude
    };
  } catch (error) {
    console.error('Geocoding error:', error.message);
    return {
      address: 'Error al obtener dirección',
      address_components: {},
      lat: latitude,
      lon: longitude,
      error: error.message
    };
  }
}

/**
 * Geocodificar múltiples ubicaciones
 * @param {Array} locations - Array de ubicaciones con lat y lon
 * @returns {Promise<Array>} Array de ubicaciones con información de dirección
 */
async function reverseGeocodeBatch(locations) {
  const results = await Promise.all(
    locations.map(async (location) => {
      const geocodeData = await reverseGeocode(location.latitude, location.longitude);
      return {
        ...location,
        address: geocodeData.address,
        address_components: geocodeData.address_components,
        formatted_address: formatAddress(geocodeData.address_components)
      };
    })
  );
  
  return results;
}

/**
 * Formatear componentes de dirección en string legible
 * @param {Object} components - Componentes de dirección
 * @returns {string} Dirección formateada
 */
function formatAddress(components) {
  const parts = [];
  
  if (components.house_number && components.road) {
    parts.push(`${components.house_number} ${components.road}`);
  } else if (components.road) {
    parts.push(components.road);
  }
  
  if (components.suburb) {
    parts.push(components.suburb);
  }
  
  if (components.city) {
    parts.push(components.city);
  }
  
  if (components.postal_code) {
    parts.push(components.postal_code);
  }
  
  return parts.join(', ') || 'Dirección no disponible';
}

module.exports = {
  reverseGeocode,
  reverseGeocodeBatch,
  formatAddress
};

