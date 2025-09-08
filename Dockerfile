FROM oven/bun

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile --production


COPY . .

EXPOSE 3000

CMD ["bun", "run", "dev"]