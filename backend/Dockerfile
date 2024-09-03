# backend/Dockerfile
# Use an official Node.js runtime as a parent image
FROM node:20.13.1

# Working directory in the container
WORKDIR /Cloudy-with-a-Chance-of-LoRa/backend

# Copy the package.json and package-lock.json files
COPY backend/package*.json ./

# Install NVM and Node.js
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash && \
    export NVM_DIR="$HOME/.nvm" && \
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
    nvm install 20.13.1 && \
    nvm use 20.13.1 && \
    nvm alias default 20.13.1

# Copy the rest of the application code
COPY backend/ .

EXPOSE 3000

# Run the application
CMD ["npm", "run", "start"]
