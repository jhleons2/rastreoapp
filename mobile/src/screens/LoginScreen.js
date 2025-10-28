import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

export default function LoginScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      navigation.replace('Main');
    }
  };

  const handleLogin = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu número de teléfono');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', {
        phone_number: phoneNumber,
        password: password || undefined,
      });

      // Guardar token y usuario
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

      // Navegar a la pantalla principal
      navigation.replace('Main');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      Alert.alert(
        'Error de inicio de sesión',
        error.response?.data?.error || error.message || 'Error al iniciar sesión'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>📍 RastreoApp</Text>
        <Text style={styles.subtitle}>Iniciar Sesión</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Número de Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="+573001234567"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Contraseña (Opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
            <Text style={styles.registerText}>
              ¿No tienes cuenta? <Text style={styles.registerLink}>Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#2563eb',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    padding: 10,
  },
  registerText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
});

