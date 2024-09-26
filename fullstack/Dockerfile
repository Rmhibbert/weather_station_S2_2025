# frontend/Dockerfile
# Use an official Node.js runtime as a parent image
FROM node:20.13.1

# Set the working directory in the container
WORKDIR /Cloudy-with-a-Chance-of-LoRa/fullstack

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install required packages
RUN npm install pg pg-promise dotenv

# Copy the rest of the application code
COPY . .

# Build the fullstack application
RUN npm run build

EXPOSE 80
EXPOSE 443

CMD ["npm", "run", "start"]