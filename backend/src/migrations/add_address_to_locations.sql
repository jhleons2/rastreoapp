-- Migración: Agregar columna address a tabla locations
-- Ejecutar en PostgreSQL después de actualizar el modelo

ALTER TABLE locations 
ADD COLUMN IF NOT EXISTS address TEXT;

-- Comentario de la columna
COMMENT ON COLUMN locations.address IS 'Dirección obtenida mediante geocodificación inversa';

-- Índice para búsquedas por dirección (opcional)
CREATE INDEX IF NOT EXISTS idx_locations_address ON locations USING gin(to_tsvector('spanish', address));

