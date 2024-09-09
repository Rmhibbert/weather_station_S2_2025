# Use the official Node.js image as a base image
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Install `serve` globally to serve static files
RUN npm install -g serve

# Expose the port for serve
EXPOSE 42335

# Command to serve the built application
CMD ["serve", "-s", "build", "-l", "42335"]
