# 📋 Guía de Migración: Agregar Columna Address

## ⚠️ IMPORTANTE

Antes de desplegar los cambios, debes ejecutar esta migración en tu base de datos PostgreSQL.

## 🚀 Opción 1: Desde Railway Dashboard (Recomendado)

1. Ve a tu proyecto en Railway
2. Abre el servicio PostgreSQL
3. Haz clic en "Query" o "Connect"
4. Copia y pega este SQL:

```sql
ALTER TABLE locations 
ADD COLUMN IF NOT EXISTS address TEXT;

COMMENT ON COLUMN locations.address IS 'Dirección obtenida mediante geocodificación inversa';
```

5. Ejecuta la consulta
6. ✅ Listo

## 🚀 Opción 2: Desde Terminal (psql)

```bash
# Si tienes DATABASE_URL configurada
psql $DATABASE_URL -f backend/src/migrations/add_address_to_locations.sql

# O directamente
psql $DATABASE_URL -c "ALTER TABLE locations ADD COLUMN IF NOT EXISTS address TEXT;"
```

## 🚀 Opción 3: Usando Sequelize Sync (Desarrollo)

Si estás en desarrollo local, Sequelize puede agregar la columna automáticamente:

```javascript
// En server.js o archivo de inicialización
sequelize.sync({ alter: true });
```

⚠️ **NOTA:** Usar `alter: true` solo en desarrollo, no en producción.

## ✅ Verificar Migración

Después de ejecutar la migración, verifica que la columna existe:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'locations' AND column_name = 'address';
```

Deberías ver:
```
column_name | data_type
------------+----------
address     | text
```

## 📝 Estado

- [x] Script de migración creado
- [x] Modelo actualizado
- [x] Controlador actualizado
- [ ] Migración ejecutada en base de datos ← **HAZ ESTO**
- [ ] Probar geocodificación

---

**Después de ejecutar la migración, reinicia el servidor backend.**

