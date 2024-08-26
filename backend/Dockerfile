# Use an official base image
FROM ubuntu:latest

# Install Git (and any other required tools)
RUN apt-get update && apt-get install -y git

# Set up a working directory
WORKDIR /app

# Clone the repository
RUN git clone https://github.com/OtagoPolytechnic/Cloudy-with-a-Chance-of-LoRa.git .

# Optionally, you can run any setup or build commands here
# RUN make build

# Command to run when the container starts
CMD ["bash"]
