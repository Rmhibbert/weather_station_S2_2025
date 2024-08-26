# Use an official base image
FROM ubuntu:latest

# Install Git (and any other required tools)
RUN apt-get update && apt-get install -y git

# Clone the repository
RUN git clone https://github.com/OtagoPolytechnic/Cloudy-with-a-Chance-of-LoRa.git .

# Install NPM dependencies 
RUN npm i 


# Command to run when the container starts
CMD ["bash"]
