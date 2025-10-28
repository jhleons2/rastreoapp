# 🚀 Crear APK de Forma Rápida - Método Expo EAS

**Tiempo estimado: 10-15 minutos**

---

## ⚡ Método Más Rápido: Expo EAS Build

Expo EAS Build permite generar APK sin instalar Android Studio.

---

## 🎯 Pasos para Crear APK

### Paso 1: Instalar EAS CLI

```bash
npm install -g eas-cli
```

### Paso 2: Ir a la carpeta mobile

```bash
cd mobile
```

### Paso 3: Configurar proyecto en Expo

```bash
eas build:configure
```

Este comando crea automáticamente los archivos de configuración necesarios.

### Paso 4: Construir APK

```bash
# Para APK de desarrollo (más rápido, gratis)
eas build -p android --profile preview

# O para producción (APK firmado)
eas build -p android --profile production
```

### Paso 5: Descargar APK

1. EAS construirá la APK en la nube (takes 5-10 minutos)
2. Te dará una URL para descargar el APK
3. Descarga el APK en tu celular
4. Instala el APK

---

## 🔄 Alternativa: Build Local con Expo

Si quieres construir localmente:

### Requisitos mínimos:
- Node.js
- Java JDK 11+
- Android SDK (se descarga automáticamente)

### Build local:

```bash
cd mobile
npx expo export:embed
npx expo prebuild
cd android
./gradlew assembleDebug
```

El APK estará en: `mobile/android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📱 Opción Súper Rápida: Usar Expo Go

**Si solo necesitas hacer la demostración**, usa Expo Go en lugar de generar APK:

```bash
cd mobile
npx expo start
```

Escanea el QR con la app **Expo Go** del Play Store. Es instantáneo y perfecto para demos.

---

## 🎯 Comparación de Métodos

| Método | Tiempo | Dificultad | Para Demo |
|--------|--------|------------|-----------|
| **Expo Go** | 2 min | ⭐ Fácil | ✅ Perfecto |
| **EAS Build** | 15 min | ⭐⭐ Medio | ✅ Ideal |
| **Local Build** | 30+ min | ⭐⭐⭐ Difícil | ✅ Bueno |

---

## 💡 Recomendación

**Para tu presentación del taller:**

1. **Usa Expo Go para la demo** - Es instantáneo y muestra toda la funcionalidad
2. **Menciona que puedes compilar APK** - Muestra que tienes la capacidad

Expo Go es igual que una APK en términos de funcionalidad, solo se ejecuta a través de la app Expo Go.

---

## 🚀 Si Insistes en Tener APK

Usa EAS Build:

```bash
# 1. Instalar EAS
npm install -g eas-cli

# 2. Login en Expo (necesitas cuenta gratuita)
eas login

# 3. Configurar proyecto
cd mobile
eas(config)

# 4. Build APK
eas build -p android --profile preview
```

En 10-15 minutos tendrás una URL para descargar tu APK.

---

## ❓ ¿Por qué Expo Go es Mejor para la Demo?

✅ **Más rápido**: Inmediato vs 15 minutos  
✅ **Más fácil**: Solo escanear QR  
✅ **Más confiable**: No hay que configurar nada  
✅ **Misma funcionalidad**: GPS, ubicación, backend  
✅ **Perfecto para demos**: Se ve más profesional  

---

## 📦 Archivo APK Final

Una vez construido, el APK tendrá:
- Nombre: `app-debug.apk` o similar
- Ubicación: `mobile/android/app/build/outputs/apk/debug/`
- Tamaño: ~30-50 MB
- Compatible: Android 6.0+

---

## ⚠️ Nota Importante

**Para el taller académico:** Un profesor entiende perfectamente que usaste Expo Go en lugar de compilar APK. Lo importante es:
1. ✅ La app funciona
2. ✅ Cumple los requisitos (GPS, envío periódico, vinculación telefónica)
3. ✅ Se integra con el backend
4. ✅ Se ve bien la demo

**No pierdas tiempo compilando APK si no es necesario.**

---

¿Quieres que te ayude con alguna de estas opciones?

