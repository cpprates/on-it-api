FROM node:10

# Create app directory
WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm install

# Bundle app source
RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "prod" ]