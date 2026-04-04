FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --omit=dev && npm cache clean --force

COPY server.js ./

EXPOSE 3000

USER node

CMD ["node", "server.js"]