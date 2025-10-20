# Estructura Visual del Grid de Parqueaderos

## 🏗️ Replicación de la Estructura Móvil

### Distribución de Bloques de 18 Celdas

Cada bloque de 18 celdas se organiza de la siguiente manera:

```
┌─────┐  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│  1  │  │  5  │  6  │  7  │  8  │  9  │ 10  │ 11  │
├─────┤  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│  2  │  │ 12  │ 13  │ 14  │ 15  │ 16  │ 17  │ 18  │
├─────┤  └─────┴─────┴─────┴─────┴─────┴─────┴─────┘
│  3  │
├─────┤
│  4  │
└─────┘
```

### Últimas 7 Celdas (Layout Especial)

```
┌─────┬─────┬─────┐     ┌─────┬─────┬─────┬─────┐
│ 81  │ 82  │ 83  │     │ 84  │ 85  │ 86  │ 87  │
└─────┴─────┴─────┘     └─────┴─────┴─────┴─────┘
      (3 celdas)                (4 celdas)
```

## 🎨 Código de Colores

### Estados y sus Colores

| Estado        | Color       | RGB            | Descripción                |
|---------------|-------------|----------------|----------------------------|
| Disponible    | 🟢 Verde    | (0, 132, 61)   | Celda lista para usar      |
| Ocupado       | 🔴 Rojo     | (210, 38, 48)  | Celda en uso               |
| Reservado     | 🟤 Marrón   | (84, 64, 54)   | Celda reservada            |
| Inhabilitado  | ⚪ Gris     | (232, 232, 242)| Celda fuera de servicio    |

## 📐 Dimensiones

### Tamaños de Celdas

#### Desktop (>768px)
- Ancho: 30px
- Alto: 30px
- Gap: 4px

#### Tablet (576-768px)
- Ancho: 25px
- Alto: 25px
- Gap: 4px

#### Mobile (<576px)
- Ancho: 20px
- Alto: 20px
- Gap: 4px

## 🖼️ Ejemplo Visual Completo

### Vista Completa del Parqueadero (87 celdas)

```
BLOQUE 1 (Celdas 1-18)
┌─────┐  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│  1  │  │  5  │  6  │  7  │  8  │  9  │ 10  │ 11  │
├─────┤  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│  2  │  │ 12  │ 13  │ 14  │ 15  │ 16  │ 17  │ 18  │
├─────┤  └─────┴─────┴─────┴─────┴─────┴─────┴─────┘
│  3  │
├─────┤
│  4  │
└─────┘

BLOQUE 2 (Celdas 19-36)
┌─────┐  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ 19  │  │ 23  │ 24  │ 25  │ 26  │ 27  │ 28  │ 29  │
├─────┤  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ 20  │  │ 30  │ 31  │ 32  │ 33  │ 34  │ 35  │ 36  │
├─────┤  └─────┴─────┴─────┴─────┴─────┴─────┴─────┘
│ 21  │
├─────┤
│ 22  │
└─────┘

... (Bloques 3, 4, 5 con la misma estructura)

═══════════════════════════════════════════════════
ÚLTIMAS 7 CELDAS (Layout Especial)
═══════════════════════════════════════════════════

┌─────┬─────┬─────┐     ┌─────┬─────┬─────┬─────┐
│ 81  │ 82  │ 83  │     │ 84  │ 85  │ 86  │ 87  │
└─────┴─────┴─────┘     └─────┴─────┴─────┴─────┘
```

## 🔄 Interacciones

### Eventos Disponibles

1. **Hover:**
   - Scale: 1.1
   - Shadow: elevado
   - Cursor: pointer

2. **Click:**
   - Emite evento `spaceClicked`
   - Puede abrir modal de reserva
   - Puede mostrar detalles

3. **Tooltip:**
   - Muestra: "Celda [número] - [estado]"
   - Aparece al hacer hover

## 📱 Vista Móvil vs Desktop

### Mobile
```
Celdas más pequeñas (20x20px)
Scroll vertical para ver todo
Touch-friendly spacing
```

### Desktop
```
Celdas más grandes (30x30px)
Vista completa sin scroll (si hay espacio)
Mouse interactions mejoradas
```

## 🎯 Comparación con App Móvil

| Característica          | App Móvil | Frontend Web | Estado |
|------------------------|-----------|--------------|--------|
| Grid de 18 celdas      | ✅        | ✅           | ✓      |
| Últimas 7 especiales   | ✅        | ✅           | ✓      |
| Colores consistentes   | ✅        | ✅           | ✓      |
| Responsive design      | ✅        | ✅           | ✓      |
| Actualización auto     | ✅        | ✅           | ✓      |
| Pull to refresh        | ✅        | ⚠️           | Parcial|
| Animaciones            | ✅        | ✅           | ✓      |

## 💡 Leyenda

```
┌─────────────────────────────────────────────┐
│  ◉ Disponible  ◉ Ocupado  ◉ Reservado  ◉ Inhabilitado  │
└─────────────────────────────────────────────┘
```

---

Esta estructura replica exactamente la distribución visual de la aplicación móvil Flutter,
proporcionando una experiencia consistente entre plataformas.



