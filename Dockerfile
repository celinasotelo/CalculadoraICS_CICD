FROM node:18

WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm install

COPY . /app/

CMD ["sh", "-c", "npm run lint && npm test"]
