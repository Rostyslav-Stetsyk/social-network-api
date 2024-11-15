FROM node:20 AS builder
COPY . /app
WORKDIR /app
RUN npm install
CMD [ "npm", "run", "build" ]

FROM node:20 AS runner
COPY --from=builder /app/dist /app/dist
COPY package*.json /app
WORKDIR /app
RUN npm install --omit=dev
EXPOSE 8000
CMD [ "npm", "run", "start:prod" ]

