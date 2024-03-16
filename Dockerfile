FROM node:20.11.1 As dev

WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./

RUN npm install --silent

COPY . .

RUN npm run build

#--------- Staging -----------
FROM dev as staging

RUN rm -rf ./node_modules

ENV NODE_ENV=staging

RUN npm install --only=prod

CMD ["node","dist/main.js"]