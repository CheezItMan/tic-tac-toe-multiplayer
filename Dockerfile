FROM gcr.io/distroless/nodejs20

USER node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npn install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist"]
