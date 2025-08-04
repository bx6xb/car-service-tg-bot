FROM node:20

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY ecosystem.config.js ./
COPY build.ts ./
COPY src ./src

RUN pnpm install
RUN pnpm run build

CMD ["node", "dist/bot.js"]
