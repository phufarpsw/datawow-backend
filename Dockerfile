FROM node:18 AS base

RUN npm i -g pnpm

WORKDIR /app

ENV PORT=3000

COPY package*.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm prisma generate

RUN pnpm build

EXPOSE 3000

CMD [ "node", "dist/main.js" ]

