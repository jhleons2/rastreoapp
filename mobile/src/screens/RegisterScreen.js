import React, { useState } from 'react';
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

export default function RegisterScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu número de teléfono');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/auth/register', {
        phone_number: phoneNumber,
        email: email || undefined,
        password: password || undefined,
      });

      // Guardar token y usuario
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

      Alert.alert('Éxito', 'Cuenta creada exitosamente', [
        {
          text: 'OK',
          onPress: () => navigation.replace('Main'),
        },
      ]);
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      Alert.alert(
        'Error de registro',
        error.response?.data?.error || error.message || 'Error al crear la cuenta'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Regístrate para comenzar</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Número de Teléfono *</Text>
          <TextInput
            style={styles.input}
            placeholder="+573001234567"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Email (Opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="usuario@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
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
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Crear Cuenta</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.loginButton}>
            <Text style={styles.loginText}>
              ¿Ya tienes cuenta? <Text style={styles.loginLink}>Inicia sesión</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#2563eb',
  },
  subtitle: {
    fontSize: 16,
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
  loginButton: {
    padding: 10,
  },
  loginText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
});

