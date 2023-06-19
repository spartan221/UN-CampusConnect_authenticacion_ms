# Use an official Node.js runtime as a parent image
FROM node:19-alpine

# Set the working directory to /app (similar to cd)
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# ENV variables
ENV PORT=3000
ENV SERVICE=gmail
ENV EMAIL=uncampusconnect@gmail.com
ENV PASS=nwgxazmrzxacyqgf
ENV ADMIN_EMAIL=uncampusconnect@gmail.com
ENV ADMIN_PASS=uncampusconnect2023
ENV RABBIT_MQ_URL=172.17.0.1
ENV RABBIT_MQ_QUEUE=emails
ENV LDAP_URL=172.17.0.1
ENV LDAP_PORT=389
ENV DB_URI=mongodb://34.71.18.215:27017/UN-CampusConnect_autenticacion_db?directConnection=true&tls=false

# Copy the rest of the application code to the container
COPY /dist/ ./dist/

# Expose port 3000 for the application
EXPOSE 3000

# Start the application
CMD ["npm", "start"]