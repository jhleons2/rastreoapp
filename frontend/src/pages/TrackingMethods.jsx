import { useState, useEffect } from 'react'
import { Smartphone, MessageCircle, Navigation, Share2, QrCode, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'https://rastreoapp-production.up.railway.app'

export default function TrackingMethods() {
  const [devices, setDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [generatingLink, setGeneratingLink] = useState(false)

  useEffect(() => {
    fetchDevices()
  }, [])

  useEffect(() => {
    if (selectedDevice) {
      fetchCurrentLocation()
    }
  }, [selectedDevice])

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/devices`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Dispositivos obtenidos del backend:', data)
        setDevices(data)
        if (data.length > 0 && !selectedDevice) {
          setSelectedDevice(data[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching devices:', error)
    }
  }

  const fetchCurrentLocation = async () => {
    if (!selectedDevice) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/locations/device/${selectedDevice}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          setCurrentLocation(data[0])
        } else {
          setCurrentLocation(null)
        }
      }
    } catch (error) {
      console.error('Error fetching location:', error)
      setCurrentLocation(null)
    }
  }

  const shareViaWhatsApp = async () => {
    if (!selectedDevice) {
      toast.error('Selecciona un dispositivo')
      return
    }

    setGeneratingLink(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/share/generate-share-link`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ device_id: selectedDevice })
      })

      const data = await response.json()

      if (response.ok) {
        // Obtener info del dispositivo seleccionado
        const device = devices.find(d => d.id === selectedDevice)
        console.log('=== DISPOSITIVO SELECCIONADO ===')
        console.log('Selected Device ID:', selectedDevice)
        console.log('Device Data:', device)
        console.log('All Devices:', devices)
        console.log('================================')
        
        const deviceName = device?.device_name || 'Dispositivo'
        const userPhoneNumber = device?.phone_number || ''
        
        // Extraer número telefónico del nombre del dispositivo si existe
        const devicePhoneMatch = deviceName.match(/(\+?\d{10,12})/);
        const devicePhone = devicePhoneMatch ? devicePhoneMatch[1] : null;
        
        // Usar primero el número del dispositivo, luego el del usuario
        const phoneNumber = devicePhone || userPhoneNumber;
        
        console.log('Número del dispositivo (device_name):', deviceName)
        console.log('Número extraído del device_name:', devicePhone)
        console.log('Número del usuario:', userPhoneNumber)
        console.log('Número final que se usará:', phoneNumber)
        
        // Si no hay número de teléfono, pedirlo al usuario
        if (!phoneNumber) {
          const customNumber = prompt('Este dispositivo no tiene número de teléfono asociado.\n\nIngresa el número al que enviar el link:\nEjemplo: 3143568097')
          if (!customNumber) {
            toast.error('Se necesita un número de teléfono')
            return
          }
          
          const whatsappNumber = customNumber.replace(/[^0-9]/g, '')
          console.log('Usando número personalizado:', whatsappNumber)
          
          const message = `📍 Solicitud de Ubicación - Rastreo App\n\n` +
            `Hola, necesito conocer tu ubicación actual para el dispositivo: ${deviceName}\n\n` +
            `Por favor, haz clic en el siguiente link para compartirla:\n${data.shareLink}\n\n` +
            `Este link expira en 1 hora.\n\n` +
            `Rastreo App`;
          
          const whatsappUrl = `https://wa.me/57${whatsappNumber}?text=${encodeURIComponent(message)}`
          console.log('WhatsApp URL:', whatsappUrl)
          window.open(whatsappUrl, '_blank')
          toast.success(`Abriendo WhatsApp para 57${whatsappNumber}...`)
          return
        }
        
        const message = `📍 Solicitud de Ubicación - Rastreo App\n\n` +
          `Hola, necesito conocer tu ubicación actual para el dispositivo: ${deviceName}\n\n` +
          `Por favor, haz clic en el siguiente link para compartirla:\n${data.shareLink}\n\n` +
          `Este link expira en 1 hora.\n\n` +
          `Rastreo App`;
        
        // Formar número de teléfono para WhatsApp
        const whatsappNumber = phoneNumber.replace(/[^0-9]/g, '')
        const whatsappUrl = `https://wa.me/57${whatsappNumber}?text=${encodeURIComponent(message)}`
        
        console.log('Enviando a número de WhatsApp:', whatsappNumber)
        console.log('URL:', whatsappUrl)
        
        toast.success(`Enviando link a +57${whatsappNumber}...`)
        window.open(whatsappUrl, '_blank')
      } else {
        toast.error(data.error || 'Error al generar link')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al generar link')
    } finally {
      setGeneratingLink(false)
    }
  }

  const copyLocationToClipboard = () => {
    if (!currentLocation) {
      toast.error('No hay ubicación disponible para copiar')
      return
    }

    const lat = Number(currentLocation.latitude).toFixed(6)
    const lon = Number(currentLocation.longitude).toFixed(6)
    const text = `${lat}, ${lon}`
    
    navigator.clipboard.writeText(text)
    toast.success('Coordenadas copiadas al portapapeles')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Métodos de Rastreo</h1>
        <p className="text-gray-600 mt-2">Gestiona ubicaciones por múltiples métodos</p>
      </div>

      {/* Selector de Dispositivo */}
      <div className="card mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Selecciona un dispositivo
        </label>
        <select
          value={selectedDevice || ''}
          onChange={(e) => setSelectedDevice(Number(e.target.value))}
          className="input-field"
        >
          {devices.map(device => {
            const devicePhone = device?.phone_number || 'Sin número'
            return (
              <option key={device.id} value={device.id}>
                {device.device_name} - {device.device_type} ({devicePhone})
              </option>
            )
          })}
        </select>
        
        {/* Mostrar número de teléfono del dispositivo seleccionado */}
        {selectedDevice && devices.find(d => d.id === selectedDevice)?.phone_number && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              📱 Número de contacto: <strong>{devices.find(d => d.id === selectedDevice)?.phone_number}</strong>
            </p>
          </div>
        )}
        
        {selectedDevice && !devices.find(d => d.id === selectedDevice)?.phone_number && (
          <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-700">
              ⚠️ Este dispositivo no tiene número de teléfono asociado. Se te pedirá ingresarlo.
            </p>
          </div>
        )}
        
        <button
          onClick={fetchCurrentLocation}
          className="btn-secondary mt-4 w-full"
        >
          <Navigation className="w-4 h-4 inline mr-2" />
          Actualizar Ubicación
        </button>
      </div>

      {/* Método 1: GPS Directo */}
      <div className="card mb-6 border-2 border-blue-500">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Smartphone className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              1️⃣ GPS Directo (Automático)
            </h3>
            <p className="text-gray-600 mb-4">
              Rastreo automático mediante app móvil instalada en el dispositivo.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Envío automático cada 10 minutos</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Funciona en segundo plano</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Ubicaciones exactas con GPS</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">📱 App Móvil</h4>
              <p className="text-sm text-gray-600 mb-3">
                Instala la app en tu dispositivo móvil para rastreo automático:
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                  Android
                </span>
                <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                  iOS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Método 2: Telegram */}
      <div className="card mb-6 border-2 border-cyan-500">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-cyan-100 rounded-lg">
            <MessageCircle className="w-8 h-8 text-cyan-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              2️⃣ Telegram (Bot)
            </h3>
            <p className="text-gray-600 mb-4">
              Solicita ubicaciones mediante bot de Telegram.
            </p>

            <div className="mt-4 p-4 bg-cyan-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">💬 Cómo Usar</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Busca el bot en Telegram</li>
                <li>Envía: <code className="bg-cyan-200 px-2 py-1 rounded">/start</code></li>
                <li>Vincular: <code className="bg-cyan-200 px-2 py-1 rounded">/link +573001234567</code></li>
                <li>Solicitar ubicación: <code className="bg-cyan-200 px-2 py-1 rounded">/location</code></li>
                <li>Envía tu ubicación usando el botón de Telegram</li>
              </ol>
            </div>

            <div className="mt-3 flex gap-2">
              <span className="px-3 py-1 bg-cyan-600 text-white rounded text-sm">
                Bot Activo
              </span>
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">
                Rastreo Manual
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Método 3: WhatsApp */}
      <div className="card mb-6 border-2 border-green-500">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <Share2 className="w-8 h-8 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              3️⃣ WhatsApp
            </h3>
            <p className="text-gray-600 mb-4">
              Comparte ubicaciones mediante WhatsApp.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Bot de WhatsApp */}
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Bot de WhatsApp
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Conecta con el bot usando QR:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                  <li>Escanear QR en consola backend</li>
                  <li>Enviar: <code className="bg-green-200 px-2 py-1 rounded">iniciar</code></li>
                  <li>Enviar: <code className="bg-green-200 px-2 py-1 rounded">vincular +57XXX</code></li>
                  <li>Enviar: <code className="bg-green-200 px-2 py-1 rounded">ubicacion</code></li>
                </ol>
              </div>

              {/* Compartir por Link */}
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Compartir Ubicación
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Comparte la ubicación actual por WhatsApp:
                </p>
                <button
                  onClick={shareViaWhatsApp}
                  className="w-full btn-primary bg-green-600 hover:bg-green-700"
                >
                  <Share2 className="w-4 h-4 inline mr-2" />
                  Compartir por WhatsApp
                </button>
              </div>
            </div>

            {currentLocation && (
              <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                <p className="font-semibold text-gray-900">📍 Ubicación Actual:</p>
                <p className="text-gray-600">
                  Lat: {Number(currentLocation.latitude).toFixed(6)}, 
                  Lng: {Number(currentLocation.longitude).toFixed(6)}
                </p>
                <button
                  onClick={copyLocationToClipboard}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  Copiar coordenadas
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="card bg-gradient-to-r from-purple-50 to-blue-50">
        <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Resumen de Métodos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
            <p className="text-sm font-semibold">GPS Directo</p>
            <p className="text-xs text-gray-600">Automático</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-600 mb-2">2</div>
            <p className="text-sm font-semibold">Telegram</p>
            <p className="text-xs text-gray-600">Bot Manual</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">3</div>
            <p className="text-sm font-semibold">WhatsApp</p>
            <p className="text-xs text-gray-600">Bot + Compartir</p>
          </div>
        </div>
      </div>
    </div>
  )
}

