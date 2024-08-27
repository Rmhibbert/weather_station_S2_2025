# Use an official base image
FROM ubuntu:latest

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive

# Install required tools
RUN apt-get install -y \
    git \
    npm 

# Set the working directory
WORKDIR /app

# Clone the repository if it does not already exist
RUN git clone https://github.com/OtagoPolytechnic/Cloudy-with-a-Chance-of-LoRa.git . || echo "Repository already cloned"

# Install NPM dependencies
RUN npm install || echo "Failed to install NPM dependencies"

# Expose port (if your application runs on a specific port)
EXPOSE 3000

# Command to run when the container starts
CMD ["bash"]
