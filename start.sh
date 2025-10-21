#!/bin/bash

echo "🚀 Iniciando Parkiu Frontend..."

# Verificar que el build fue exitoso
if [ ! -d "dist/parkiu-frontend" ]; then
    echo "❌ Error: No se encontró el directorio dist/parkiu-frontend"
    echo "🔨 Construyendo aplicación como fallback..."
    npm run build:prod
fi

echo "✅ Aplicación lista"

# Iniciar servidor
echo "🌐 Iniciando servidor..."
npx serve -s dist/parkiu-frontend -l 3001