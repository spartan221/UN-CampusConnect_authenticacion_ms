# Repository of UN-CampusConnect _authenticacion_ms


Este repositorio contiene el código del microservicio de autenticación.

## Tecnologias

- NodeJS
- MongoDB

## Usar con docker
1. Ejecutar `npm run build` en la raiz del proyecto.
2. Crear la imagen: `docker build -t un-campusconnect_autenticacion_ms .`
3. Ejecutar el contenedor: `docker run -p 3000:3000 --name un-campusconnect_autenticacion_ms un-campusconnect_autenticacion_ms`

## Variables ENV
- PORT="3000"
- SERVICE="gmail"
- EMAIL="uncampusconnect@gmail.com"
- PASS="nwgxazmrzxacyqgf"
- ENV="DEV"
- ADMIN_EMAIL="uncampusconnect@gmail.com"
- ADMIN_PASS="uncampusconnect2023"