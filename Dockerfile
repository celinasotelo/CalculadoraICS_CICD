FROM node:18

WORKDIR /app

COPY package.json /app/
RUN npm install

COPY src/ /app/src/
COPY tests/ /app/tests/

CMD ["npm", "test"]
