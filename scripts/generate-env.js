const fs = require('fs');
const path = require('path');

// Obtener variables de entorno
const isProduction = process.env.NODE_ENV === 'production';

// URLs por defecto según el entorno
const defaultApiUrl = isProduction ? 'backend-production-48fd.up.railway.app' : 'localhost:3000';
const defaultWsUrl = isProduction ? 'backend-production-48fd.up.railway.app' : 'localhost:3000';

const apiUrl = process.env.API_URL || defaultApiUrl;
const wsUrl = process.env.WS_URL || defaultWsUrl;

console.log('🔧 Variables de entorno detectadas:');
console.log(`   API_URL: ${process.env.API_URL || 'NO DEFINIDA'}`);
console.log(`   WS_URL: ${process.env.WS_URL || 'NO DEFINIDA'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'NO DEFINIDA'}`);

// Construir URLs completas
const fullApiUrl = apiUrl.startsWith('http') ? `${apiUrl}/api` : `https://${apiUrl}/api`;
const fullWsUrl = wsUrl.startsWith('http') ? wsUrl : `https://${wsUrl}`;

// Contenido del archivo environment
const environmentContent = `export const environment = {
  production: ${isProduction},
  apiUrl: '${fullApiUrl}',
  wsUrl: '${fullWsUrl}'
};
`;

// Escribir el archivo
const envPath = path.join(__dirname, '../src/environments/environment.ts');
fs.writeFileSync(envPath, environmentContent);

console.log('✅ Environment generado:');
console.log(`   API URL: ${fullApiUrl}`);
console.log(`   WS URL: ${fullWsUrl}`);
console.log(`   Production: ${isProduction}`);
