# base image
FROM node:20-alpine

#CREATE APP DIRECTORY

WORKDIR /app

#copy package.json and package-lock.json
COPY package*.json ./
#indstall dependencies
RUN npm install
#copy source code
COPY . .
#expose port and start application
EXPOSE 3000
#run the applicationgit 
CMD ["npm", "start"]
