#!/bin/bash

echo "🚀 Iniciando Parkiu Frontend..."

# Verificar que estamos en el directorio correcto
echo "📁 Directorio actual: $(pwd)"
echo "📁 Contenido del directorio:"
ls -la

# Verificar que node_modules existe
if [ ! -d "node_modules" ]; then
    echo "❌ Error: node_modules no existe, instalando dependencias..."
    npm install
fi

# Verificar que el build existe
if [ ! -d "dist/parkiu-frontend" ]; then
    echo "❌ Error: dist/parkiu-frontend no existe, construyendo aplicación..."
    npm run build:prod
    if [ $? -ne 0 ]; then
        echo "❌ Error: Fallo en el build"
        exit 1
    fi
fi

echo "✅ Aplicación lista"

# Verificar que el directorio de build existe
if [ ! -d "dist/parkiu-frontend" ]; then
    echo "❌ Error: El directorio dist/parkiu-frontend no existe después del build"
    exit 1
fi

echo "📁 Contenido de dist/parkiu-frontend:"
ls -la dist/parkiu-frontend/

# Iniciar servidor
echo "🌐 Iniciando servidor en puerto 3001..."
npx serve -s dist/parkiu-frontend -l 3001