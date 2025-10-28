import { useState } from 'react'
import { MapPin } from 'lucide-react'

export default function Locations() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ubicaciones</h1>
        <p className="text-gray-600 mt-2">Visualiza el historial de ubicaciones</p>
      </div>

      <div className="card">
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Mapa de Ubicaciones</h3>
          <p className="text-gray-600">El mapa se mostrará aquí próximamente</p>
          <p className="text-sm text-gray-500 mt-2">
            Integración con Leaflet.js para visualización en tiempo real
          </p>
        </div>
      </div>
    </div>
  )
}

