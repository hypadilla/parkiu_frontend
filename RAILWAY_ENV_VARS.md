# Variables de Entorno para Railway - Frontend

## Variables Requeridas

### 🌐 URLs del Backend
```bash
# URL del backend API (sin https://)
API_URL=backend-production-48fd.up.railway.app

# URL del WebSocket (sin https://)
WS_URL=backend-production-48fd.up.railway.app
```

### 🔧 Configuración de Entorno
```bash
# Entorno de producción
NODE_ENV=production

# Puerto del servidor (opcional, por defecto 3001)
PORT=3001
```

## Variables Opcionales

### 📊 Monitoreo y Logs
```bash
# Nivel de logging (opcional)
LOG_LEVEL=info

# URL de monitoreo (opcional)
MONITORING_URL=https://your-monitoring-service.com
```

## Configuración Completa en Railway

### 1. Variables Principales (Requeridas)
```bash
API_URL=backend-production-48fd.up.railway.app
WS_URL=backend-production-48fd.up.railway.app
NODE_ENV=production
```

### 2. Variables Adicionales (Opcionales)
```bash
PORT=3001
LOG_LEVEL=info
```

## Cómo Configurar en Railway

1. **Ve a tu proyecto en Railway**
2. **Selecciona el servicio de frontend**
3. **Ve a la pestaña "Variables"**
4. **Agrega cada variable una por una:**

   | Variable | Valor |
   |----------|-------|
   | `API_URL` | `backend-production-48fd.up.railway.app` |
   | `WS_URL` | `backend-production-48fd.up.railway.app` |
   | `NODE_ENV` | `production` |
   | `PORT` | `3001` |

## Verificación

Después de configurar las variables, Railway:
1. **Regenerará automáticamente** el `environment.ts` usando `scripts/generate-env.js`
2. **Reconstruirá** la aplicación con las URLs correctas
3. **Desplegará** con la configuración actualizada

## Debug

Si hay problemas, revisa los logs de Railway para ver:
- ✅ URLs generadas correctamente
- ✅ Build exitoso
- ✅ Servidor iniciado en el puerto correcto

## Notas Importantes

- **No incluyas `https://`** en `API_URL` y `WS_URL` - el script las agrega automáticamente
- **`NODE_ENV=production`** es crucial para el build de producción
- **`PORT`** es opcional, Railway puede asignar uno automáticamente
- Las variables se aplican **en el próximo deploy**
