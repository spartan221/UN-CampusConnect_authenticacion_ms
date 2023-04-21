# Repository of UN-CampusConnect _authenticacion_ms


Este repositorio contiene el código del microservicio de autenticación.

## Tecnologias

- NodeJS
- MongoDB

## Usar con docker

1. Crear la imagen: `docker build -t un-campusconnect_autenticacion_ms .`
2. Ejecutar el contenedor: `docker run --rm --network host -it un-campusconnect_autenticacion_ms:latest`