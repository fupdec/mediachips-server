FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
COPY api ./
COPY app ./
COPY dist ./
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 5555
RUN chown -R node /usr/src/app
USER node
CMD ["node", "app/server.js"]