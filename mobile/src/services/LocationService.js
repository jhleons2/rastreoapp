import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform, Alert } from 'react-native';
import api from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LocationService {
  watchId = null;
  isTracking = false;
  intervalTime = 10 * 60 * 1000; // 10 minutos por defecto

  /**
   * Solicitar permisos de ubicación
   */
  async requestPermissions() {
    try {
      let permission;
      
      if (Platform.OS === 'android') {
        permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      } else {
        permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
      }

      const result = await request(permission);
      
      if (result === RESULTS.GRANTED) {
        return true;
      } else if (result === RESULTS.DENIED) {
        Alert.alert(
          'Permiso Denegado',
          'Necesitas activar los permisos de ubicación para usar esta app.'
        );
        return false;
      } else if (result === RESULTS.BLOCKED) {
        Alert.alert(
          'Permiso Bloqueado',
          'Por favor, habilita los permisos de ubicación en la configuración de tu dispositivo.'
        );
        return false;
      }
      
      return false;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  /**
   * Obtener ubicación actual
   */
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            speed: position.coords.speed,
            heading: position.coords.heading,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          console.error('Location error:', error);
          reject(error);
        },
        {
          accuracy: {
            android: 'high',
            ios: 'best',
          },
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    });
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

    // Enviar ubicación inicial
    try {
      const location = await this.getCurrentLocation();
      await this.sendLocationToServer(deviceId, location);
    } catch (error) {
      console.error('Error getting initial location:', error);
    }

    // Configurar watchPosition para capturar cambios
    this.watchId = Geolocation.watchPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          speed: position.coords.speed,
          heading: position.coords.heading,
          timestamp: position.timestamp,
        };

        this.sendLocationToServer(deviceId, locationData);
      },
      (error) => {
        console.error('Watch position error:', error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        distanceFilter: 10, // Mínimo 10 metros de movimiento
        interval: this.intervalTime,
        fastestInterval: this.intervalTime,
      }
    );

    console.log('Tracking started with watch ID:', this.watchId);
  }

  /**
   * Detener rastreo
   */
  stopTracking() {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
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

