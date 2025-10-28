@echo off
REM Script Windows para despliegue rápido
echo ====================================
echo  COMPILAR APK - METODO RAPIDO
echo ====================================
echo.

echo INSTRUCCIONES RAPIDAS:
echo.
echo 1. USA EXPO PARA LA DEMO (MÁS RÁPIDO):
echo    npx expo start
echo    Escanea QR con Expo Go
echo.
echo 2. SI NECESITAS APK (15 MIN):
echo    npm install -g eas-cli
echo    eas login
echo    eas build -p android --profile preview
echo.
echo 3. O COMPILA LOCALMENTE (30 MIN):
echo    Necesitas Android Studio instalado
echo    cd android
echo    gradlew.bat assembleDebug
echo.
echo ====================================
echo  RECOMENDACIÓN: USA EXPO GO
echo  Es perfecto para la presentacion
echo ====================================
pause

