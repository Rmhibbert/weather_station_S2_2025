# Use an official base image
FROM ubuntu:latest

# Install Git (and any other required tools)
RUN apt-get update && apt-get install -y git

# Clone the repository
RUN git clone https://github.com/OtagoPolytechnic/Cloudy-with-a-Chance-of-LoRa.git .|| echo "Repository already cloned"

# Install NPM dependencies 
RUN npm i || echo "Failed to install NPM dependencies"

# Command to run when the container starts
CMD ["npm", "start"]


# Set environment variables
#ENV DEBIAN_FRONTEND=noninteractive

# Set the working directory
#WORKDIR /app

# Expose port
#EXPOSE 3000
