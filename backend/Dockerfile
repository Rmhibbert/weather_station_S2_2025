# Use an official base image
FROM ubuntu:latest

# Install Git (and any other required tools)
RUN apt-get update && apt-get install -y git

# Clone the repository
RUN git clone https://github.com/OtagoPolytechnic/Cloudy-with-a-Chance-of-LoRa.git .|| echo "Repository already cloned"

# Install NPM dependencies 
RUN source ~/.bashrc
RUN nvm install 20.13.1
RUN npm run start