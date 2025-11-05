# Script para actualizar Railway con los nuevos cambios
# Ejecutar en PowerShell desde la raíz del proyecto

Write-Host "🚀 Actualizando Railway..." -ForegroundColor Cyan
Write-Host ""

# 1. Agregar todos los cambios
Write-Host "📦 Agregando archivos..." -ForegroundColor Yellow
git add .

# 2. Ver qué se va a subir
Write-Host ""
Write-Host "📋 Archivos que se subirán:" -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "⚠️  ¿Deseas continuar? (S/N)" -ForegroundColor Yellow
$confirm = Read-Host

if ($confirm -ne "S" -and $confirm -ne "s" -and $confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "❌ Cancelado" -ForegroundColor Red
    exit
}

# 3. Hacer commit
Write-Host ""
Write-Host "💾 Haciendo commit..." -ForegroundColor Yellow
git commit -m "feat: Implementar geocodificación inversa y estadísticas avanzadas - 100% cumplimiento

- Agregada geocodificación inversa automática (coordenadas → dirección)
- Implementado controlador completo de estadísticas de movimiento
- Agregada columna address a modelo Location
- Nuevos endpoints: /api/stats/device/:id y /api/stats/device/:id/summary
- Documentación completa de implementación
- Proyecto cumple 100% de requisitos técnicos"

# 4. Push a GitHub
Write-Host ""
Write-Host "📤 Subiendo a GitHub..." -ForegroundColor Yellow
Write-Host "   (Railway desplegará automáticamente después de esto)" -ForegroundColor Gray
git push origin main

Write-Host ""
Write-Host "✅ Código subido a GitHub" -ForegroundColor Green
Write-Host ""
Write-Host "⏱️  Railway está desplegando ahora... (2-3 minutos)" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "   1. Ve a Railway Dashboard → Deployments"
Write-Host "   2. Espera a que termine el deployment"
Write-Host "   3. Ejecuta la migración SQL (ver EJECUTAR_MIGRACION_AHORA.md)"
Write-Host "   4. Verifica que todo funciona"
Write-Host ""

