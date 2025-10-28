import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocationService from '../services/LocationService';
import api from '../config/api';

export default function TrackingScreen({ navigation }) {
  const [deviceId, setDeviceId] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    initializeDevice();
    // Verificar estado de tracking al cargar
    const checkTracking = async () => {
      const tracking = await AsyncStorage.getItem('isTracking');
      const savedDeviceId = await AsyncStorage.getItem('deviceId');
      if (tracking === 'true' && savedDeviceId) {
        setIsTracking(true);
        setDeviceId(savedDeviceId);
        // Restart tracking si estaba activo
        LocationService.startTracking(savedDeviceId, 10);
      }
    };
    checkTracking();
  }, []);

  useEffect(() => {
    if (isTracking) {
      getCurrentLocation();
      const interval = setInterval(() => {
        getCurrentLocation();
      }, 30000); // Actualizar cada 30 segundos
      return () => clearInterval(interval);
    }
  }, [isTracking]);

  const initializeDevice = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Login');
        return;
      }

      // Verificar si ya tenemos un deviceId guardado
      const savedDeviceId = await AsyncStorage.getItem('deviceId');
      if (savedDeviceId) {
        setDeviceId(savedDeviceId);
        setLoading(false);
        return;
      }

      // Crear un nuevo dispositivo
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      const deviceName = `${Platform.OS} Device`;
      
      const response = await api.post('/devices', {
        device_name: deviceName,
        device_type: Platform.OS === 'android' ? 'mobile' : 'mobile',
      });

      const newDeviceId = response.data.id;
      setDeviceId(newDeviceId);
      await AsyncStorage.setItem('deviceId', String(newDeviceId));
      
      setLoading(false);
    } catch (error) {
      console.error('Error initializing device:', error);
      Alert.alert('Error', 'No se pudo crear el dispositivo');
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await LocationService.getCurrentLocation();
      setCurrentLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleStartTracking = async () => {
    if (!deviceId) {
      Alert.alert('Error', 'No hay dispositivo registrado');
      return;
    }

    try {
      await LocationService.startTracking(deviceId, 10); // 10 minutos
      setIsTracking(true);
      await AsyncStorage.setItem('isTracking', 'true');
      
      Alert.alert(
        'Rastreo Iniciado',
        'Tu ubicación se enviará automáticamente cada 10 minutos',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error starting tracking:', error);
      Alert.alert('Error', 'No se pudo iniciar el rastreo. Verifica los permisos de ubicación.');
    }
  };

  const handleStopTracking = async () => {
    Alert.alert(
      'Detener Rastreo',
      '¿Estás seguro de que quieres detener el rastreo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Detener',
          style: 'destructive',
          onPress: async () => {
            LocationService.stopTracking();
            setIsTracking(false);
            await AsyncStorage.setItem('isTracking', 'false');
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            if (isTracking) {
              LocationService.stopTracking();
            }
            await AsyncStorage.clear();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e40af" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📍 RastreoApp</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Estado del Rastreo</Text>
          
          <View style={[styles.statusIndicator, isTracking ? styles.statusActive : styles.statusInactive]}>
            <View style={[styles.statusDot, isTracking ? styles.statusDotActive : styles.statusDotInactive]} />
            <Text style={styles.statusText}>
              {isTracking ? 'RASTREO ACTIVO' : 'RASTREO DETENIDO'}
            </Text>
          </View>

          {currentLocation && (
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Tu Ubicación:</Text>
              <Text style={styles.locationText}>
                {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
              </Text>
              {currentLocation.accuracy && (
                <Text style={styles.accuracyText}>
                  Precisión: {currentLocation.accuracy.toFixed(0)}m
                </Text>
              )}
            </View>
          )}

          <TouchableOpacity
            style={[styles.trackButton, isTracking ? styles.stopButton : styles.startButton]}
            onPress={isTracking ? handleStopTracking : handleStartTracking}
          >
            <Text style={styles.buttonText}>
              {isTracking ? '⏹️ DETENER RASTREO' : '▶️ INICIAR RASTREO'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.infoText}>
            {isTracking 
              ? 'Tu ubicación se envía automáticamente cada 10 minutos' 
              : 'Inicia el rastreo para comenzar a enviar tu ubicación'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información</Text>
          <Text style={styles.infoText}>
            • Tu ubicación solo se comparte con dispositivos autorizados
          </Text>
          <Text style={styles.infoText}>
            • El rastreo funciona en segundo plano
          </Text>
          <Text style={styles.infoText}>
            • Puedes detener el rastreo en cualquier momento
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 20,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  statusActive: {
    backgroundColor: '#dcfce7',
  },
  statusInactive: {
    backgroundColor: '#fee2e2',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusDotActive: {
    backgroundColor: '#16a34a',
  },
  statusDotInactive: {
    backgroundColor: '#dc2626',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  locationInfo: {
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  accuracyText: {
    fontSize: 12,
    color: '#16a34a',
    marginTop: 5,
  },
  trackButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  startButton: {
    backgroundColor: '#16a34a',
  },
  stopButton: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});

