const fs = require('fs');
const path = require('path');

// Obtener variables de entorno
const apiUrl = process.env.API_URL || 'http://localhost:3000';
const wsUrl = process.env.WS_URL || 'http://localhost:3000';
const isProduction = process.env.NODE_ENV === 'production';

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
