FROM node:latest

WORKDIR /app
COPY . /app

RUN npm install && \
    scripts/sync-storage && \
    npm run build

EXPOSE 4002

CMD ["npm", "start"]
