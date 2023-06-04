# Repository of UN-CampusConnect_authenticacion_ms


Este repositorio contiene el código del microservicio de autenticación.

## Tecnologias

- NodeJS
- MongoDB

## Usar con docker
1. Ejecutar RabbitMQ con el siguiente comando `docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.11-management`
2. Asegurarse de que el componente UN-campusconnect_ldap este corriendo y esté previamente configurado como en el lab
3. Ejecutar `npm run build` en la raiz del proyecto.
4. Crear la imagen: `docker build -t un-campusconnect_autenticacion_ms .`
5. Ejecutar el contenedor: `docker run -p 3000:3000 --name un-campusconnect_autenticacion_ms un-campusconnect_autenticacion_ms`

## Variables ENV
- PORT="3000"
- SERVICE="gmail"
- EMAIL="uncampusconnect@gmail.com"
- PASS="nwgxazmrzxacyqgf"
- ENV="DEV"
- ADMIN_EMAIL="uncampusconnect@gmail.com"
- ADMIN_PASS="uncampusconnect2023"
- RABBIT_MQ_QUEUE="emails"
- LDAP_URL=127.0.0.1 # default
- LDAP_PORT=389

*Note: if ENV is not provided, the server will use
mongodb atlas uri* :smile: 