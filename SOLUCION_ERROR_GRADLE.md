# Solución al Error de Gradle

## Problema
Error: `Unable to load class 'org.gradle.api.artifacts.SelfResolvingDependency'`

Esto ocurre porque estabas usando **Gradle 9.0-milestone-1** que es una versión experimental e incompatible.

## Solución Aplicada
✅ Se cambió la versión de Gradle a **8.3** que es estable y compatible con tu proyecto.

## Próximos Pasos (IMPORTANTE)

### 1. Si estás usando Android Studio:
1. Ve a **File → Invalidate Caches / Restart**
2. Selecciona **Invalidate and Restart**
3. Cuando se reinicie, selecciona **Sync Project with Gradle Files**

### 2. Si estás usando línea de comandos:

Primero configura Java (si no lo has hecho):
```powershell
# Establece JAVA_HOME (ajusta la ruta según tu instalación de Java)
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
```

Luego ejecuta:
```powershell
# Navega al proyecto Android
cd mobile\android

# Limpia el caché de Gradle
.\gradlew.bat clean

# Detén los daemons de Gradle
.\gradlew.bat --stop

# Sincroniza el proyecto
.\gradlew.bat --refresh-dependencies
```

### 3. Solución Manual (si lo anterior no funciona):

1. Cierra Android Studio / IDE completamente
2. Elimina manualmente estos directorios:
   - `mobile\android\.gradle`
   - `mobile\android\app\build`
   - `mobile\android\build`
   - `%USERPROFILE%\.gradle\caches` (caché global de Gradle)
3. Elimina todos los procesos Java corriendo (Ctrl+Shift+Esc → Buscar "java" → Terminar)
4. Abre Android Studio nuevamente
5. Vuelve a sincronizar el proyecto

## Cambio Realizado

**Archivo:** `mobile/android/gradle/wrapper/gradle-wrapper.properties`

Antes:
```
distributionUrl=https\://services.gradle.org/distributions/gradle-9.0-milestone-1-bin.zip
```

Después:
```
distributionUrl=https\://services.gradle.org/distributions/gradle-8.3-bin.zip
```

## Versiones Compatibles

- **Gradle:** 8.3 (estable)
- **Android Gradle Plugin:** 7.4.2
- **Java:** JDK 17 (recomendado) o JDK 11

Después de realizar estos pasos, el error debería desaparecer y podrás compilar tu APK sin problemas.

