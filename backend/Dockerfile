FROM node:10

WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install --production

# Bundle app source
COPY dist/ ./dist

COPY server.crt server.key ./

ENV TYPEORM_HOST = db

EXPOSE 8080

CMD [ "npm", "start" ]