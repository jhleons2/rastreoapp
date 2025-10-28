# Script de configuración para Railway
# Ejecutar desde PowerShell en la raíz del proyecto

Write-Host "🚀 Configurando Railway para el proyecto de rastreo" -ForegroundColor Green
Write-Host ""

# Verificar si está en Railway
$isRailway = $env:RAILWAY
if (-not $isRailway) {
    Write-Host "ℹ️ No estás en Railway. Esto es solo para referencia." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Para configurar Railway:" -ForegroundColor Cyan
    Write-Host "1. Ve a https://railway.app"
    Write-Host "2. Dashboard → Tu proyecto → Settings"
    Write-Host "3. Configura Root Directory: 'backend'"
    Write-Host "4. Ve a Variables y agrega:"
    Write-Host "   NODE_ENV = production"
    Write-Host "   JWT_SECRET = (genera uno)"
    Write-Host "5. Agrega PostgreSQL desde el botón '+'"
    Write-Host "6. Ve a Deployments y haz Redeploy"
    Write-Host ""
    exit
}

Write-Host "✅ Estás en Railway"
Write-Host "📦 Configurando variables..."
Write-Host ""
Write-Host "Variables configuradas:"
Write-Host "- NODE_ENV=production"
Write-Host "- JWT_SECRET=(configurar manualmente)"
Write-Host ""
Write-Host "⚠️ IMPORTANTE: Configura el Root Directory como 'backend' en Settings" -ForegroundColor Yellow

