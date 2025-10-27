/**
 * Servicio de Geocodificación Inversa
 * Convierte coordenadas (lat, lng) → dirección legible
 */

const axios = require('axios');

class GeocodingService {
  /**
   * Convierte coordenadas a dirección usando Google Maps API
   * @param {number} latitude - Latitud
   * @param {number} longitude - Longitud
   * @returns {Promise<string|null>} - Dirección formateada o null
   */
  async reverseGeocode(latitude, longitude) {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          latlng: `${latitude},${longitude}`,
          key: process.env.GOOGLE_MAPS_API_KEY,
          language: 'es' // Español por defecto
        },
        timeout: 5000
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      }
      
      // Si falla, intentar con resultados menos específicos
      if (response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      }
      
      return null;
    } catch (error) {
      console.error('Google Geocoding error:', error.message);
      return null;
    }
  }

  /**
   * Usa Mapbox como alternativa a Google Maps
   * @param {number} latitude - Latitud
   * @param {number} longitude - Longitud
   * @returns {Promise<string|null>} - Dirección formateada o null
   */
  async reverseGeocodeMapbox(latitude, longitude) {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json`,
        {
          params: {
            access_token: process.env.MAPBOX_API_KEY,
            language: 'es'
          },
          timeout: 5000
        }
      );

      if (response.data.features && response.data.features.length > 0) {
        return response.data.features[0].place_name;
      }
      
      return null;
    } catch (error) {
      console.error('Mapbox Geocoding error:', error.message);
      return null;
    }
  }

  /**
   * Intenta geocodificación con múltiples servicios (fallback)
   * @param {number} latitude - Latitud
   * @param {number} longitude - Longitud
   * @returns {Promise<string|null>} - Dirección formateada o null
   */
  async reverseGeocodeWithFallback(latitude, longitude) {
    // Intentar con Google Maps primero
    let address = await this.reverseGeocode(latitude, longitude);
    
    // Si falla, intentar con Mapbox
    if (!address && process.env.MAPBOX_API_KEY) {
      address = await this.reverseGeocodeMapbox(latitude, longitude);
    }
    
    // Si ambas fallan, usar aproximación básica
    if (!address) {
      address = `Cerca de ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
    
    return address;
  }

  /**
   * Geocodificación en batch (múltiples coordenadas)
   * @param {Array} coordinates - Array de {latitude, longitude}
   * @returns {Promise<Array>} - Array de direcciones
   */
  async reverseGeocodeBatch(coordinates) {
    const results = await Promise.all(
      coordinates.map(({ latitude, longitude }) => 
        this.reverseGeocodeWithFallback(latitude, longitude)
          .then(address => ({ latitude, longitude, address }))
          .catch(() => ({ latitude, longitude, address: null }))
      )
    );
    
    return results;
  }
}

module.exports = new GeocodingService();

