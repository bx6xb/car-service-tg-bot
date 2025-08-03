FROM node:20

RUN npm install -g pm2
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY ecosystem.config.js ./
COPY build.ts ./
COPY src ./src

RUN pnpm install
RUN pnpm run build

CMD ["pm2-runtime", "ecosystem.config.js"]
