#!/bin/bash

echo "🚀 Iniciando Parkiu Frontend..."

# Generar environment
echo "📝 Generando environment..."
node scripts/generate-env.js

# Verificar que el environment se generó correctamente
if [ ! -f "src/environments/environment.ts" ]; then
    echo "❌ Error: No se pudo generar environment.ts"
    exit 1
fi

echo "✅ Environment generado correctamente"

# Construir la aplicación
echo "🔨 Construyendo aplicación..."
npm run build

# Verificar que el build fue exitoso
if [ ! -d "dist/parkiu-frontend" ]; then
    echo "❌ Error: No se pudo construir la aplicación"
    exit 1
fi

echo "✅ Aplicación construida correctamente"

# Iniciar servidor
echo "🌐 Iniciando servidor..."
npx serve -s dist/parkiu-frontend -l 3001
