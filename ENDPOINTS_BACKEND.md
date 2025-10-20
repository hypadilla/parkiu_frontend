# 📡 Endpoints del Backend - Documentación Completa

## ✅ Estado Actual

**El backend YA TIENE todos los endpoints necesarios implementados y funcionando.**

Los endpoints están disponibles en:
- **Local:** `http://localhost:3000/api`
- **Producción:** `https://parkiubackend-production.up.railway.app/api`

---

## 🔐 Autenticación

La mayoría de endpoints requieren autenticación JWT:

```
Authorization: Bearer <token>
```

Algunos endpoints también requieren permisos específicos:
- `CAN_CREATE_RESERVATION` - Para crear/modificar reservas
- `CAN_VIEW_USERS` - Para ver usuarios
- etc.

---

## 📋 Endpoints Disponibles

### 1. 🚗 Parking Cells (Celdas de Estacionamiento)

#### GET `/api/parking-cells`
Obtiene todas las celdas de estacionamiento.

**Auth:** No requerida

**Response:**
```json
[
  {
    "id": "firestore-doc-id",
    "idStatic": 1,
    "state": "disponible",
    "createdDate": "2025-10-12T10:00:00Z",
    "createdBy": "system",
    "lastModifiedDate": "2025-10-12T10:00:00Z",
    "lastModifiedBy": "system",
    "reservationDetails": null
  }
]
```

**Estados posibles:**
- `disponible` - Celda disponible para reservar
- `ocupado` - Celda ocupada
- `reservado` - Celda reservada
- `inhabilitado` - Celda fuera de servicio

---

#### PUT `/api/parking-cells/:id/status`
Actualiza el estado de una celda específica (incluye crear/cancelar reservas).

**Auth:** Requerida (Bearer token)
**Permisos:** `CAN_CREATE_RESERVATION`

**Params:**
- `id` - idStatic de la celda (número de celda, ej: "1", "25", "87")

**Request Body para RESERVAR:**
```json
{
  "state": "reservado",
  "reservationDetails": {
    "reservedBy": "userId123",
    "startTime": "2025-10-12T10:00:00.000Z",
    "endTime": "2025-10-12T12:00:00.000Z",
    "reason": "Reunión importante"
  }
}
```

**Request Body para CANCELAR reserva:**
```json
{
  "state": "disponible",
  "reservationDetails": null
}
```

**Request Body para marcar como OCUPADO:**
```json
{
  "state": "ocupado"
}
```

**Response:**
```json
{
  "message": "Estado actualizado"
}
```

---

#### POST `/api/parking-cells/bulk-status`
Actualización masiva de estados de múltiples celdas.

**Auth:** No especificada (revisar implementación)

**Request Body:**
```json
{
  "data": {
    "sectores": [
      {
        "cardinal_point": "Norte",
        "celdas": {
          "1": "ocupado",
          "2": "disponible",
          "3": "ocupado"
        }
      }
    ]
  }
}
```

**Response:**
```json
{
  "message": "Bulk status updated successfully."
}
```

---

### 2. 📊 Dashboard

#### GET `/api/dashboard`
Obtiene el estado completo del parqueadero más las recomendaciones.

**Auth:** No requerida

**Response:**
```json
{
  "Parqueaderos": [
    {
      "parquederoid": "1",
      "Estado": "disponible"
    },
    {
      "parquederoid": "2",
      "Estado": "ocupado"
    }
  ],
  "Recomendaciones": [
    {
      "day": "lunes",
      "recommendedHours": ["08:00", "09:00", "10:00"]
    }
  ]
}
```

---

### 3. 💡 Recomendaciones

#### GET `/api/recommendations`
Obtiene las recomendaciones de mejores horarios por día.

**Auth:** No requerida

**Response:**
```json
{
  "recommendations": [
    {
      "day": "lunes",
      "recommendedHours": ["08:00", "09:00", "10:00", "14:00", "15:00"]
    },
    {
      "day": "martes",
      "recommendedHours": ["07:00", "08:00", "09:00"]
    }
  ]
}
```

---

### 4. 🔐 Autenticación

#### POST `/api/auth/login`
Inicia sesión y obtiene un token JWT.

**Request Body:**
```json
{
  "username": "usuario",
  "password": "contraseña"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "username": "usuario",
    "email": "usuario@example.com",
    "name": "Nombre",
    "lastName": "Apellido",
    "role": "admin",
    "permissions": ["CAN_CREATE_RESERVATION", "CAN_VIEW_USERS"]
  }
}
```

---

#### POST `/api/auth/logout`
Cierra sesión e invalida el token.

**Auth:** Requerida (Bearer token)

**Response:**
```json
{
  "message": "Logout exitoso"
}
```

---

#### POST `/api/auth/verify-token`
Verifica si un token es válido.

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "valid": true,
  "user": { /* datos del usuario */ }
}
```

---

### 5. 👥 Usuarios

#### GET `/api/users`
Obtiene todos los usuarios.

**Auth:** Requerida (Bearer token)
**Permisos:** `CAN_VIEW_USERS`

**Response:**
```json
[
  {
    "id": "user123",
    "username": "usuario1",
    "email": "usuario1@example.com",
    "name": "Nombre",
    "lastName": "Apellido",
    "role": "user",
    "permissions": []
  }
]
```

---

#### POST `/api/auth/register`
Crea un nuevo usuario.

**Auth:** Requerida (Bearer token)
**Permisos:** `CAN_CREATE_USERS`

**Request Body:**
```json
{
  "username": "nuevo_usuario",
  "email": "nuevo@example.com",
  "password": "contraseña_segura",
  "name": "Nombre",
  "lastName": "Apellido",
  "role": "user"
}
```

---

## 🔄 Integración con el Frontend

### Servicio ya Configurado

El servicio `parking-cell.service.ts` ya está configurado para usar estos endpoints:

```typescript
// Obtener todas las celdas
getAllParkingCells(): Observable<ParkingCell[]>

// Reservar una celda
reserveParkingCell(
  idStatic: string,      // Número de celda
  reservedBy: string,    // ID del usuario
  startTime: Date,       // Fecha/hora de inicio
  endTime: Date | undefined, // Fecha/hora de fin (opcional)
  reason: string         // Motivo de la reserva
): Observable<any>

// Cancelar una reserva
cancelReservation(idStatic: string): Observable<any>
```

### Uso en Componentes

```typescript
// En ReservationsComponent

// Reservar celda
this.parkingCellService.reserveParkingCell(
  '25',                    // Celda número 25
  currentUser.id,          // Usuario actual
  new Date('2025-10-12T10:00'),
  new Date('2025-10-12T12:00'),
  'Reunión de trabajo'
).subscribe({
  next: (res) => console.log('Reserva exitosa'),
  error: (err) => console.error('Error:', err)
});

// Cancelar reserva
this.parkingCellService.cancelReservation('25').subscribe({
  next: (res) => console.log('Cancelación exitosa'),
  error: (err) => console.error('Error:', err)
});
```

---

## 🧪 Pruebas con cURL

### Obtener todas las celdas
```bash
curl http://localhost:3000/api/parking-cells
```

### Reservar una celda (requiere token)
```bash
curl -X PUT http://localhost:3000/api/parking-cells/1/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "state": "reservado",
    "reservationDetails": {
      "reservedBy": "userId123",
      "startTime": "2025-10-12T10:00:00.000Z",
      "endTime": "2025-10-12T12:00:00.000Z",
      "reason": "Prueba de reserva"
    }
  }'
```

### Cancelar reserva
```bash
curl -X PUT http://localhost:3000/api/parking-cells/1/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "state": "disponible",
    "reservationDetails": null
  }'
```

---

## ⚠️ Notas Importantes

1. **idStatic vs id:**
   - `id` = ID del documento en Firestore (generado automáticamente)
   - `idStatic` = Número de celda (1-87)
   - El endpoint usa `idStatic` como parámetro de ruta

2. **Permisos:**
   - Verifica que tu usuario tenga el permiso `CAN_CREATE_RESERVATION`
   - Puedes verificar permisos en el token JWT decodificado

3. **Formato de Fechas:**
   - Usa formato ISO 8601: `2025-10-12T10:00:00.000Z`
   - JavaScript: `new Date().toISOString()`

4. **Estados:**
   - Solo `reservado` requiere `reservationDetails`
   - Otros estados deben tener `reservationDetails: null`

---

## 🎯 Swagger Documentation

El backend tiene documentación Swagger disponible en:

```
http://localhost:3000/api-docs
```

O en producción:
```
https://parkiubackend-production.up.railway.app/api-docs
```

---

## ✅ Resumen

**Todos los endpoints necesarios para el módulo de reservas están implementados y funcionando:**

- ✅ Obtener celdas
- ✅ Reservar celda
- ✅ Cancelar reserva  
- ✅ Actualizar estado
- ✅ Dashboard completo
- ✅ Autenticación JWT

El frontend ya está **completamente conectado** a estos endpoints reales del backend. ¡No hay código TODO ni simulaciones!



