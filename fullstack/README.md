# Dependencies

npm install pg pg-promise
npm i dotenv  
npm install tailwindcss postcss autoprefixer @vitejs/plugin-react-swc --save-dev  
npx tailwindcss init -p  
npx shadcn@latest init  
npm install @tanstack/react-query

# How to run cloud api

1. When you start the front end make sure you run `npm i`
2. Make sure you have docker installed on your computer.

3. CD in to the `\PythonBackEnd>`

4. In the terminal run `docker build -t fastapi-app .`
5. Then after its been built run `docker run -d -p 8000:8000 fastapi-app`

On the front end of the app you will see a new widget called Cloud.
Click on that this will take you to a new page with an image of a cloud click on the cloud and wait until you see the results.

Note: Make your you have nothing else running on port 8000 or there might be som issues with docker.

docker build -t weather-app .
docker inspect --format '{{.State.Pid}}'
docker run -d -p 3000:3000 weather-app
docker run --network app_network --name weather-app -p 3000:3000 weather-app
docker run --network app_network --name fastapi-app -p 8000:8000 fastapi-app -d