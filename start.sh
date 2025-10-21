#!/bin/bash

echo "🚀 Iniciando Parkiu Frontend..."

# Construir la aplicación
echo "🔨 Construyendo aplicación..."
npm run build:prod

# Verificar que el build fue exitoso
if [ ! -d "dist/parkiu-frontend" ]; then
    echo "❌ Error: No se pudo construir la aplicación"
    exit 1
fi

echo "✅ Aplicación construida correctamente"

# Iniciar servidor
echo "🌐 Iniciando servidor..."
npx serve -s dist/parkiu-frontend -l 3001
