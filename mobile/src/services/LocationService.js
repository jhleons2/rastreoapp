import * as Location from 'expo-location';
import { Alert } from 'react-native';
import api from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Flag para desarrollo
const IS_DEV = __DEV__ || process.env.NODE_ENV === 'development';

class LocationService {
  watchId = null;
  isTracking = false;
  intervalTime = 10 * 60 * 1000; // 10 minutos por defecto
  timerId = null;

  /**
   * Solicitar permisos de ubicación
   */
  async requestPermissions() {
    try {
      // Solicitar permisos con Expo
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        // También solicitar permisos de fondo (solo en Android)
        await Location.requestBackgroundPermissionsAsync();
        return true;
      } else if (status === 'denied') {
        Alert.alert(
          'Permiso Denegado',
          'Necesitas activar los permisos de ubicación para usar esta app.'
        );
        return false;
      } else {
        Alert.alert(
          'Permiso Bloqueado',
          'Por favor, habilita los permisos de ubicación en la configuración de tu dispositivo.'
        );
        return false;
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  /**
   * Obtener ubicación actual
   */
  async getCurrentLocation() {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        altitude: location.coords.altitude,
        speed: location.coords.speed,
        heading: location.coords.heading,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error('Location error:', error);
      throw error;
    }
  }

  /**
   * Enviar ubicación al servidor
   */
  async sendLocationToServer(deviceId, locationData) {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        console.log('❌ No token found, skipping location send');
        return false;
      }

      // Convertir deviceId a número si es string
      const deviceIdNumber = typeof deviceId === 'string' ? parseInt(deviceId, 10) : deviceId;

      console.log('📤 Enviando ubicación al servidor...', {
        device_id: deviceIdNumber,
        device_id_type: typeof deviceIdNumber,
        latitude: locationData.latitude,
        longitude: locationData.longitude
      });

      const response = await api.post('/locations', {
        device_id: deviceIdNumber,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        accuracy: locationData.accuracy,
        altitude: locationData.altitude,
        speed: locationData.speed,
        heading: locationData.heading,
      });

      console.log('✅ Location sent successfully:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Error sending location:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        fullError: error
      });
      
      // Mostrar error visible al usuario en desarrollo
      if (IS_DEV) {
        Alert.alert(
          'Error enviando ubicación',
          `Status: ${error.response?.status || 'N/A'}\nError: ${error.message}`
        );
      }
      
      return false;
    }
  }

  /**
   * Iniciar rastreo periódico
   */
  async startTracking(deviceId, interval = 10) {
    console.log('🔵 startTracking called with deviceId:', deviceId, 'interval:', interval);
    
    if (this.isTracking) {
      console.log('⚠️ Tracking already started');
      return;
    }

    console.log('📝 Requesting permissions...');
    // Solicitar permisos
    const hasPermission = await this.requestPermissions();
    console.log('📝 Permission result:', hasPermission);
    
    if (!hasPermission) {
      console.log('❌ No permissions, aborting tracking');
      return;
    }

    this.isTracking = true;
    this.intervalTime = interval * 60 * 1000; // Convertir minutos a ms
    console.log(`✅ Starting tracking with interval: ${interval} minutes (${this.intervalTime}ms)`);

    // Enviar ubicación inicial inmediatamente
    try {
      console.log('📍 Getting initial location...');
      const location = await this.getCurrentLocation();
      console.log('📍 Initial location obtained:', location);
      
      console.log('📤 Sending initial location to server...');
      const sent = await this.sendLocationToServer(deviceId, location);
      console.log('Initial location send result:', sent);
    } catch (error) {
      console.error('❌ Error getting/sending initial location:', error);
    }

    // Configurar timer para enviar ubicaciones periódicamente
    console.log('⏰ Setting up interval timer for', this.intervalTime, 'ms');
    this.timerId = setInterval(async () => {
      console.log('⏰ Timer triggered - Getting location...');
      try {
        const location = await this.getCurrentLocation();
        console.log('⏰ Location obtained:', location);
        const sent = await this.sendLocationToServer(deviceId, location);
        console.log('⏰ Location sent (periodic):', sent);
      } catch (error) {
        console.error('❌ Error sending periodic location:', error);
      }
    }, this.intervalTime);

    console.log('✅ Tracking started successfully with timer ID:', this.timerId);
  }

  /**
   * Detener rastreo
   */
  stopTracking() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
      this.isTracking = false;
      console.log('Tracking stopped');
    }
  }

  /**
   * Verificar si está rastreando
   */
  isTrackingActive() {
    return this.isTracking;
  }
}

export default new LocationService();
