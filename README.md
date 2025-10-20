# Parkiu Frontend

Este proyecto es la interfaz de usuario para el sistema de gestión de estacionamientos Parkiu. Está desarrollado con Angular y se conecta al backend de Parkiu para proporcionar una experiencia de usuario completa.

## Requisitos previos

- Node.js (v14.x o superior)
- npm (v6.x o superior)
- Angular CLI (v16.x)

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd parkiu_frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Revisa el archivo `src/environments/environment.ts` y `environment.development.ts` para asegurarte de que la URL del API sea correcta.

## Ejecución

Para iniciar el servidor de desarrollo:

```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200/`.

## Estructura del proyecto

```
src/
├── app/
│   ├── components/       # Componentes de la aplicación
│   │   ├── home/         # Componente de inicio
│   │   └── login/        # Componente de login
│   ├── guards/           # Guardias de ruta
│   ├── interceptors/     # Interceptores HTTP
│   ├── models/           # Modelos de datos
│   └── services/         # Servicios
├── assets/               # Recursos estáticos
└── environments/         # Configuraciones de entorno
```

## Características

- **Autenticación**: Sistema de login con JWT
- **Protección de rutas**: Guardias para rutas protegidas
- **Manejo de tokens**: Interceptor para incluir tokens en solicitudes HTTP
- **Interfaz responsiva**: Diseño adaptable a diferentes dispositivos

## Integración con el backend

Este frontend se integra con el backend de Parkiu a través de una API RESTful. La comunicación se realiza mediante el servicio `AuthService` que maneja la autenticación y el interceptor `AuthInterceptor` que añade los tokens a las solicitudes.

## Desarrollo

Para generar nuevos componentes, servicios, etc., puedes usar Angular CLI:

```bash
ng generate component nombre-componente
ng generate service nombre-servicio
ng generate guard nombre-guardia
```

## Pruebas

Para ejecutar las pruebas unitarias:

```bash
ng test
```

Para ejecutar las pruebas end-to-end:

```bash
ng e2e
```

## Despliegue

Para construir la aplicación para producción:

```bash
ng build --prod
```

Los archivos generados estarán en el directorio `dist/`.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.
