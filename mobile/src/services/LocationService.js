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
      console.log('🔐 Solicitando permisos de ubicación...');
      
      // Verificar permisos actuales
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      console.log('📝 Estado de permisos actual:', existingStatus);
      
      if (existingStatus === 'granted') {
        console.log('✅ Permisos ya concedidos');
        return true;
      }
      
      // Solicitar permisos con Expo
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('📝 Resultado de solicitud de permisos:', status);
      
      if (status === 'granted') {
        console.log('✅ Permisos de primer plano concedidos');
        
        // También solicitar permisos de fondo (solo en Android)
        try {
          const bgPermission = await Location.requestBackgroundPermissionsAsync();
          console.log('📝 Permisos de fondo:', bgPermission.status);
        } catch (bgError) {
          console.warn('⚠️ No se pudieron solicitar permisos de fondo:', bgError.message);
          // No es crítico, continuar de todas formas
        }
        
        return true;
      } else if (status === 'denied') {
        console.log('❌ Permisos denegados');
        Alert.alert(
          'Permiso Denegado',
          'Necesitas activar los permisos de ubicación para usar esta app.\n\nVe a Configuración > Aplicaciones > RastreoApp > Permisos > Ubicación'
        );
        return false;
      } else {
        console.log('❌ Permisos bloqueados o no disponibles');
        Alert.alert(
          'Permiso Bloqueado',
          'Por favor, habilita los permisos de ubicación en la configuración de tu dispositivo.\n\nConfiguracion > Aplicaciones > RastreoApp > Permisos > Ubicación'
        );
        return false;
      }
    } catch (error) {
      console.error('❌ Error solicitando permisos:', error);
      Alert.alert(
        'Error de Permisos',
        `No se pudieron solicitar los permisos: ${error.message}`
      );
      return false;
    }
  }

  /**
   * Obtener ubicación actual
   */
  async getCurrentLocation() {
    try {
      console.log('📍 Obteniendo ubicación actual...');
      
      // Verificar que los servicios de ubicación estén habilitados
      const isEnabled = await Location.hasServicesEnabledAsync();
      console.log('📍 Servicios de ubicación habilitados:', isEnabled);
      
      if (!isEnabled) {
        Alert.alert(
          'GPS Desactivado',
          'Por favor, activa el GPS en tu dispositivo para continuar.'
        );
        throw new Error('GPS services disabled');
      }
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000, // 15 segundos timeout
        maximumAge: 10000, // Usar caché de máximo 10 segundos
      });

      console.log('✅ Ubicación obtenida:', {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        accuracy: location.coords.accuracy,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        altitude: location.coords.altitude || 0,
        speed: location.coords.speed || 0,
        heading: location.coords.heading || 0,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error('❌ Error obteniendo ubicación:', error.message);
      
      if (error.message.includes('timeout')) {
        Alert.alert(
          'Timeout GPS',
          'No se pudo obtener la ubicación. Asegúrate de estar en un lugar con buena señal GPS.'
        );
      }
      
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
