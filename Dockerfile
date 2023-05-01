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
ENV RABBIT_MQ_URL=host.docker.internal

# Copy the rest of the application code to the container
COPY /dist/ ./dist/

# Expose port 3000 for the application
EXPOSE 3000

# Start the application
CMD ["npm", "start"]