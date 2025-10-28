import * as Location from 'expo-location';
import { Alert } from 'react-native';
import api from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        console.log('No token found, skipping location send');
        return false;
      }

      const response = await api.post('/locations', {
        device_id: deviceId,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        accuracy: locationData.accuracy,
        altitude: locationData.altitude,
        speed: locationData.speed,
        heading: locationData.heading,
      });

      console.log('Location sent successfully:', response.data);
      return true;
    } catch (error) {
      console.error('Error sending location:', error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Iniciar rastreo periódico
   */
  async startTracking(deviceId, interval = 10) {
    if (this.isTracking) {
      console.log('Tracking already started');
      return;
    }

    // Solicitar permisos
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      return;
    }

    this.isTracking = true;
    this.intervalTime = interval * 60 * 1000; // Convertir minutos a ms
    console.log(`Starting tracking with interval: ${interval} minutes`);

    // Enviar ubicación inicial inmediatamente
    try {
      const location = await this.getCurrentLocation();
      await this.sendLocationToServer(deviceId, location);
      console.log('Initial location sent:', location);
    } catch (error) {
      console.error('Error getting initial location:', error);
    }

    // Configurar timer para enviar ubicaciones periódicamente
    this.timerId = setInterval(async () => {
      try {
        const location = await this.getCurrentLocation();
        await this.sendLocationToServer(deviceId, location);
        console.log('Location sent (periodic):', location);
      } catch (error) {
        console.error('Error sending periodic location:', error);
      }
    }, this.intervalTime);

    console.log('Tracking started');
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
