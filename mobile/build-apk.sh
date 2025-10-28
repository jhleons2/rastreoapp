#!/bin/bash

# Script para compilar APK rápidamente
# Requiere: Java JDK, Android SDK

echo "🚀 Compilando APK para Android..."

# Verificar que estamos en la carpeta correcta
if [ ! -d "android" ]; then
    echo "❌ Error: No se encontró la carpeta android"
    echo "Ejecuta este script desde la carpeta mobile/"
    exit 1
fi

cd android

# Compilar debug APK
echo "📦 Compilando APK..."
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    echo "✅ APK compilado exitosamente!"
    echo "📱 Ubicación: android/app/build/outputs/apk/debug/app-debug.apk"
else
    echo "❌ Error al compilar APK"
    exit 1
fi

